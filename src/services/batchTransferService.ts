import { convertFiatToToken } from "@/utils/convertFiatToToken"
import { initiateTransaction, approveTransaction, parseTransactionReceipt } from "@/services/initiateTransaction"
import { completeTransaction } from "@/services/completeTransaction"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PublicClientType = any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WalletClientType = any

export interface BatchRecipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
}

export interface BatchTransferResult {
    id: string
    status: 'pending' | 'success' | 'failed'
    txHash?: string
    error?: string
}

export class BatchTransferService {
    private publicClient: PublicClientType
    private walletClient: WalletClientType
    private selectedToken: { name: string; address: string; logo?: string }
    private tokenPrice: number

    constructor(publicClient: PublicClientType, walletClient: WalletClientType, selectedToken: { name: string; address: string; logo?: string }, tokenPrice: number) {
        this.publicClient = publicClient
        this.walletClient = walletClient
        this.selectedToken = selectedToken
        this.tokenPrice = tokenPrice
    }

    async approveBatchTransfer(totalTokenAmount: number): Promise<boolean> {
        try {
            const approvalResult = await approveTransaction(
                totalTokenAmount,
                this.selectedToken.address,
                this.publicClient,
                this.walletClient
            )

            return Boolean(approvalResult?.receipt?.status === 'success')
        } catch (error) {
            console.error('Batch approval error:', error)
            return false
        }
    }

    async processSingleTransfer(recipient: BatchRecipient): Promise<BatchTransferResult> {
        try {
            const amountValue = parseFloat(recipient.amount)
            const tokenAmount = await convertFiatToToken(amountValue, this.selectedToken.name, this.tokenPrice)

            // Step 1: Initiate blockchain transaction
            const txHash = await initiateTransaction(
                tokenAmount,
                this.selectedToken.address,
                recipient.accountNumber,
                amountValue,
                recipient.accountName,
                recipient.bankName,
                this.publicClient,
                this.walletClient
            )

            // Step 2: Store initial transaction in backend
            const transactionData = {
                txId: txHash,
                userAddress: this.walletClient.account?.address || '',
                token: this.selectedToken.address,
                amountSpent: "0.00",
                transactionFee: "0.001", // Default fee
                transactionTimestamp: Math.floor(Date.now() / 1000),
                fiatBankAccountNumber: recipient.accountNumber,
                fiatBank: recipient.bankName,
                recipientName: recipient.accountName,
                fiatAmount: amountValue.toFixed(2),
                isCompleted: false,
                isRefunded: false,
            }

            const initialResponse = await fetch(
                "https://backend-cf8a.onrender.com/transaction/transactions/",
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(transactionData),
                }
            )

            if (!initialResponse.ok) {
                throw new Error(`Backend POST failed: ${initialResponse.status}`)
            }

            const initialResponseData = await initialResponse.json()
            const backendId = initialResponseData.id

            // Step 3: Wait for transaction confirmation
            const receipt = await this.publicClient.waitForTransactionReceipt({ hash: txHash! })

            if (receipt.status === "success") {
                const parsedReceipt = await parseTransactionReceipt(receipt)

                if (parsedReceipt) {
                    // Step 4: Initiate fiat transfer
                    const transferResponse = await fetch('/api/initiate-transfer', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            bankCode: recipient.bankCode,
                            accountNumber: recipient.accountNumber,
                            accountName: recipient.accountName,
                            amount: amountValue,
                        }),
                    })

                    const transferResult = await transferResponse.json()

                    if (transferResult.success) {
                        // Step 5: Complete the transaction
                        await completeTransaction(
                            parsedReceipt.txId,
                            Number(parsedReceipt.amount),
                            this.publicClient,
                            this.walletClient
                        )

                        // Step 6: Update backend with completion
                        const updateData = {
                            txId: txHash,
                            userAddress: this.walletClient.account?.address || '',
                            token: this.selectedToken.address,
                            amountSpent: parsedReceipt.amount.toString(),
                            transactionFee: "0.001",
                            transactionTimestamp: transactionData.transactionTimestamp,
                            fiatBankAccountNumber: recipient.accountNumber,
                            fiatBank: recipient.bankName,
                            recipientName: recipient.accountName,
                            fiatAmount: amountValue.toFixed(2),
                            isCompleted: true,
                            isRefunded: false,
                        }

                        await fetch(
                            `https://backend-cf8a.onrender.com/transaction/transactions/${backendId}/`,
                            {
                                method: "PUT",
                                headers: {
                                    Accept: "application/json",
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(updateData),
                            }
                        )

                        return {
                            id: recipient.id,
                            status: 'success' as const,
                            txHash: txHash
                        }
                    } else {
                        throw new Error(transferResult.message || "Transfer failed")
                    }
                } else {
                    throw new Error("Failed to parse transaction receipt")
                }
            } else {
                throw new Error("Transaction failed")
            }
        } catch (error) {
            console.error(`Transfer failed for recipient ${recipient.id}:`, error)
            return {
                id: recipient.id,
                status: 'failed' as const,
                error: error instanceof Error ? error.message : 'Unknown error'
            }
        }
    }

    async processBatchTransfer(
        recipients: BatchRecipient[],
        onProgress: (result: BatchTransferResult) => void
    ): Promise<BatchTransferResult[]> {
        const results: BatchTransferResult[] = []

        // Calculate total token amount needed
        const totalFiatAmount = recipients.reduce((sum, r) => sum + parseFloat(r.amount), 0)
        const totalTokenAmount = await convertFiatToToken(totalFiatAmount, this.selectedToken.name, this.tokenPrice)

        // First approve the total amount
        const approved = await this.approveBatchTransfer(totalTokenAmount)
        if (!approved) {
            throw new Error("Failed to approve tokens for batch transfer")
        }

        // Process each transfer sequentially for better error handling
        for (const recipient of recipients) {
            const result = await this.processSingleTransfer(recipient)
            results.push(result)
            onProgress(result)
        }

        return results
    }
}

export default BatchTransferService

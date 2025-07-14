export interface AccountVerificationResult {
    success: boolean
    data?: {
        account_name: string
        account_number: string
        bank_id: string
    }
    message?: string
}

export async function verifyBankAccount(
    accountNumber: string,
    bankCode: string
): Promise<AccountVerificationResult> {
    try {
        const response = await fetch('/api/verify-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                account_number: accountNumber,
                bank_code: bankCode,
            }),
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result = await response.json()
        return result
    } catch (error) {
        console.error('Account verification error:', error)
        return {
            success: false,
            message: 'Failed to verify account. Please check your network connection and try again.'
        }
    }
}

export function formatAccountName(name: string): string {
    return name
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
}

export function validateAccountNumber(accountNumber: string): boolean {
    // Basic validation for Nigerian bank account numbers (usually 10 digits)
    const cleaned = accountNumber.replace(/\D/g, '')
    return cleaned.length === 10 && /^\d{10}$/.test(cleaned)
}

export function validateAmount(amount: string, minAmount: number = 100): boolean {
    const numericAmount = parseFloat(amount)
    return !isNaN(numericAmount) && numericAmount >= minAmount && numericAmount > 0
}

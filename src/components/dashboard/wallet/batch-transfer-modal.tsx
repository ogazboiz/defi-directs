"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Upload, UserPlus, Trash2, Download, CheckCircle, Users, Bookmark, ChevronDown } from "lucide-react"
import { verifyBankAccount, validateAccountNumber, validateAmount } from "@/utils/accountVerification"
import { CSVVerificationModal } from "./csv-verification-modal"
import { BeneficiaryGroupsModal } from "./beneficiary-groups-modal"
import { beneficiaryGroupService, BeneficiaryRecipient } from "@/services/beneficiaryGroupService"
import { useWallet } from "@/context/WalletContext"
import { fetchTokenPrice } from "@/utils/fetchTokenprice"
import { formatBalance } from "@/utils/formatBalance"
import { getTokensForChain, Token } from "@/utils/tokens"
import { useChainId } from "wagmi"
import toast, { Toaster } from 'react-hot-toast'
import * as XLSX from 'xlsx'

interface CSVRecipient {
    csvName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
    verifiedName?: string
    isVerified: boolean
    isVerifying: boolean
}

interface Recipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount: string
    isVerified?: boolean
    isVerifying?: boolean
}

interface Bank {
    id: number
    name: string
    code: string
    longcode: string
    gateway: string
    pay_with_bank: boolean
    active: boolean
    country: string
    currency: string
    type: string
    is_deleted: boolean
    createdAt: string
    updatedAt: string
}

interface BatchTransferModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onProceedToSummary: (recipients: Recipient[], selectedToken: Token) => void
}

export function BatchTransferModal({ open, onOpenChange, onProceedToSummary }: BatchTransferModalProps) {
    const chainId = useChainId();
    const tokens = getTokensForChain(chainId || 4202); // Default to Lisk Sepolia

    const [selectedToken, setSelectedToken] = useState(tokens[0]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [fileUploadMode, setFileUploadMode] = useState<'manual' | 'upload' | 'groups'>('manual')
    const [recipients, setRecipients] = useState<Recipient[]>([
        { id: '1', accountName: '', accountNumber: '', bankCode: '', bankName: '', amount: '', isVerified: false, isVerifying: false }
    ])
    const [dragActive, setDragActive] = useState(false)
    const [banks, setBanks] = useState<Bank[]>([])
    const [showCSVVerification, setShowCSVVerification] = useState(false)
    const [showBeneficiaryGroups, setShowBeneficiaryGroups] = useState(false)
    const [csvDataForVerification, setCSVDataForVerification] = useState<CSVRecipient[]>([])
    const [createGroup, setCreateGroup] = useState(false)
    const [groupName, setGroupName] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dropdownRef = useRef<HTMLDivElement>(null)

    const { usdcBalance, usdtBalance } = useWallet();
    const [usdcPrice, setUsdcPrice] = useState<number>(0);
    const [usdtPrice, setUsdtPrice] = useState<number>(0);

    const fetchPrices = async () => {
        try {
            const usdc = await fetchTokenPrice("usd-coin");
            const usdt = await fetchTokenPrice("tether");

            if (usdc) setUsdcPrice(usdc);
            if (usdt) setUsdtPrice(usdt);
        } catch (error) {
            console.error("Failed to fetch token prices. Retaining previous prices.", error);
        }
    };

    const usdcBalanceFormatted = formatBalance(usdcBalance);
    const usdtBalanceFormatted = formatBalance(usdtBalance);

    const usdcNgnBalance = (parseFloat(usdcBalanceFormatted) * usdcPrice).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    const usdtNgnBalance = (parseFloat(usdtBalanceFormatted) * usdtPrice).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // Use actual token balance for display
    const selectedTokenBalance = selectedToken.name === "USDC" ? usdcBalanceFormatted : usdtBalanceFormatted;
    const selectedTokenNgnBalance = selectedToken.name === "USDC" ? usdcNgnBalance : usdtNgnBalance;

    // Fetch banks when modal opens
    useEffect(() => {
        const fetchBanks = async () => {
            try {
                const response = await fetch("/api/banks")
                const result = await response.json()

                if (result.success) {
                    const uniqueBanks = result.data.reduce((acc: Bank[], current: Bank) => {
                        const x = acc.find(item => item.code === current.code)
                        if (!x) {
                            return acc.concat([current])
                        } else {
                            console.warn(`Duplicate bank code found: ${current.code} - ${current.name}`)
                            return acc
                        }
                    }, [])
                    setBanks(uniqueBanks)
                }
            } catch (error) {
                console.error('Failed to fetch banks:', error)
                // Use fallback banks if API fails
                setBanks([
                    { id: 1, code: "058", name: "Guaranty Trust Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 2, code: "011", name: "First Bank of Nigeria", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 3, code: "221", name: "Stanbic IBTC Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 4, code: "057", name: "Zenith Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 5, code: "070", name: "Fidelity Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 6, code: "044", name: "Access Bank", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 7, code: "033", name: "United Bank for Africa", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" },
                    { id: 8, code: "032", name: "Union Bank of Nigeria", longcode: "", gateway: "", pay_with_bank: true, active: true, country: "NG", currency: "NGN", type: "nuban", is_deleted: false, createdAt: "", updatedAt: "" }
                ])
            }
        }

        if (open) {
            fetchBanks()
            fetchPrices()
        }
    }, [open])

    // Reset selected token when chain changes
    useEffect(() => {
        const newTokens = getTokensForChain(chainId || 4202);
        setSelectedToken(newTokens[0]);
    }, [chainId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [dropdownOpen]);

    const addRecipient = () => {
        const newId = (recipients.length + 1).toString()
        setRecipients([...recipients, {
            id: newId,
            accountName: '',
            accountNumber: '',
            bankCode: '',
            bankName: '',
            amount: '',
            isVerified: false,
            isVerifying: false
        }])
    }

    const removeRecipient = (id: string) => {
        if (recipients.length > 1) {
            setRecipients(recipients.filter(r => r.id !== id))
        }
    }

    const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
        setRecipients(recipients.map(r => {
            if (r.id === id) {
                const updated = { ...r, [field]: value }
                if (field === 'bankCode') {
                    const bank = banks.find(b => b.code === value)
                    updated.bankName = bank?.name || ''
                    updated.isVerified = false // Reset verification when bank changes
                }
                if (field === 'accountNumber') {
                    updated.isVerified = false // Reset verification when account number changes
                }
                return updated
            }
            return r
        }))
    }

    const verifyAccount = async (id: string) => {
        const recipient = recipients.find(r => r.id === id)
        if (!recipient || !recipient.accountNumber || !recipient.bankCode) {
            toast.error('Please enter account number and select bank first')
            return
        }

        if (!validateAccountNumber(recipient.accountNumber)) {
            toast.error('Please enter a valid 10-digit account number')
            return
        }

        // Check if already verified
        if (recipient.isVerified) {
            toast.success('Account is already verified')
            return
        }

        // Set verifying state
        setRecipients(recipients.map(r =>
            r.id === id ? { ...r, isVerifying: true, isVerified: false } : r
        ))

        try {
            const result = await verifyBankAccount(recipient.accountNumber, recipient.bankCode)

            if (result.success && result.data) {
                setRecipients(recipients.map(r =>
                    r.id === id
                        ? {
                            ...r,
                            accountName: result.data!.account_name,
                            isVerified: true,
                            isVerifying: false
                        }
                        : r
                ))
                toast.success(`Account verified: ${result.data.account_name}`)
            } else {
                setRecipients(recipients.map(r =>
                    r.id === id ? { ...r, isVerifying: false, isVerified: false } : r
                ))
                toast.error(result.message || 'Could not verify account details. Please check account number and bank.')
            }
        } catch (error) {
            console.error('Account verification error:', error)
            setRecipients(recipients.map(r =>
                r.id === id ? { ...r, isVerifying: false, isVerified: false } : r
            ))
            toast.error('Account verification failed. Please try again.')
        }
    }

    const handleFileUpload = (file: File) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const data = e.target?.result
                let workbook: XLSX.WorkBook

                if (file.type.includes('csv')) {
                    workbook = XLSX.read(data, { type: 'string' })
                } else {
                    workbook = XLSX.read(data, { type: 'binary' })
                }

                const worksheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][]

                if (jsonData.length < 2) {
                    toast.error('File must contain header and at least one data row')
                    return
                }

                // Parse CSV data for verification
                const csvData: CSVRecipient[] = []
                for (let i = 1; i < jsonData.length; i++) {
                    const row = jsonData[i]
                    if (row.length >= 4 && row[0] && row[1] && row[2] && row[3]) {
                        const bankCode = row[2]
                        const bank = banks.find(b => b.code === bankCode)

                        csvData.push({
                            csvName: row[0],
                            accountNumber: row[1],
                            bankCode: bankCode,
                            bankName: bank?.name || 'Unknown Bank',
                            amount: row[3],
                            isVerified: false,
                            isVerifying: false
                        })
                    }
                }

                if (csvData.length === 0) {
                    toast.error('No valid recipient data found in file')
                    return
                }

                setCSVDataForVerification(csvData)
                setShowCSVVerification(true)
                toast.success(`Loaded ${csvData.length} recipients for verification`)
            } catch (error) {
                console.error('File parsing error:', error)
                toast.error('Error parsing file. Please check format and try again.')
            }
        }

        if (file.type.includes('csv')) {
            reader.readAsText(file)
        } else {
            reader.readAsBinaryString(file)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0) {
            const file = files[0]
            if (file.type.includes('csv') || file.type.includes('spreadsheet') || file.name.endsWith('.xlsx')) {
                handleFileUpload(file)
            } else {
                toast.error('Please upload a CSV or Excel file')
            }
        }
    }

    const downloadTemplate = () => {
        const template = [
            ['Account Name', 'Account Number', 'Bank Code', 'Amount'],
            ['John Doe', '1234567890', '058', '10000'],
            ['Jane Smith', '0987654321', '011', '15000']
        ]

        const ws = XLSX.utils.aoa_to_sheet(template)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Recipients')
        XLSX.writeFile(wb, 'batch_transfer_template.xlsx')
    }

    const validateRecipients = () => {
        const validRecipients = recipients.filter(r => {
            const hasBasicInfo = r.accountName.trim() && r.accountNumber.trim() && r.bankCode
            const hasValidAmount = validateAmount(r.amount)
            const hasValidAccount = validateAccountNumber(r.accountNumber)

            if (!hasBasicInfo) {
                toast.error(`Recipient ${r.id}: Please fill in all required fields`)
                return false
            }

            if (!hasValidAccount) {
                toast.error(`Recipient ${r.id}: Invalid account number`)
                return false
            }

            if (!hasValidAmount) {
                toast.error(`Recipient ${r.id}: Invalid amount (minimum ₦100)`)
                return false
            }

            return true
        })

        if (validRecipients.length === 0) {
            toast.error('Please add at least one valid recipient')
            return false
        }

        return validRecipients
    }

    const handleProceed = () => {
        const validRecipients = validateRecipients()
        if (validRecipients) {
            if (createGroup && groupName.trim()) {
                // Save as beneficiary group
                const groupRecipients = validRecipients.map(r => ({
                    id: r.id,
                    accountName: r.accountName,
                    accountNumber: r.accountNumber,
                    bankCode: r.bankCode,
                    bankName: r.bankName,
                    isVerified: r.isVerified || false
                }))

                beneficiaryGroupService.saveGroup(groupName.trim(), groupRecipients)
                toast.success(`Beneficiary group "${groupName}" saved successfully!`)
            }

            onProceedToSummary(validRecipients, selectedToken)
        }
    }

    const handleCSVVerificationConfirm = (verifiedRecipients: Recipient[], groupName?: string) => {
        setRecipients(verifiedRecipients)
        setShowCSVVerification(false)

        if (groupName) {
            toast.success(`Beneficiary group "${groupName}" created successfully!`)
        }

        toast.success(`${verifiedRecipients.length} recipients loaded successfully`)
    }

    const handleBeneficiaryGroupSelect = (groupRecipients: BeneficiaryRecipient[]) => {
        const formattedRecipients = groupRecipients.map(r => ({
            id: r.id,
            accountName: r.accountName,
            accountNumber: r.accountNumber,
            bankCode: r.bankCode,
            bankName: r.bankName,
            amount: r.amount || '',
            isVerified: r.isVerified
        }))
        setRecipients(formattedRecipients)
        setShowBeneficiaryGroups(false)
        setFileUploadMode('manual') // Switch to manual mode for editing
        toast.success(`Loaded ${formattedRecipients.length} recipients from beneficiary group`)
    }

    const totalAmount = recipients.reduce((sum, r) => sum + (parseFloat(r.amount) || 0), 0)

    return (
        <>
            <Toaster position="top-center" />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-4xl w-[95vw] border border-[#7b40e3]/20 bg-[#1C1C27] p-0 text-white rounded-[20px] max-h-[90vh] overflow-y-auto">
                    <div className="p-6">                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="text-white hover:opacity-80 transition-opacity"
                                >
                                    <ArrowLeft className="h-6 w-6" />
                                </button>
                                <h2 className="text-2xl font-bold text-[#7b40e3]">Batch Transfer</h2>
                            </div>
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 sm:gap-3 bg-[#2F2F3A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm border border-[#7b40e3]/20 hover:border-[#7b40e3]/40 rounded-lg"
                                >
                                    <img
                                        src={selectedToken.logo}
                                        alt={`${selectedToken.name} logo`}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                    <span className="font-medium text-white">{selectedToken.name}</span>
                                    <ChevronDown className="h-4 w-4 text-[#7b40e3]" />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute z-20 right-0 mt-2 w-40 bg-[#2F2F3A] border border-[#7b40e3]/20 rounded-lg">
                                        {tokens.map((token) => (
                                            <button
                                                key={token.name}
                                                onClick={() => {
                                                    setSelectedToken(token);
                                                    setDropdownOpen(false);
                                                }}
                                                className="flex w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hover:bg-[#7b40e3]/10 first:rounded-t-lg last:rounded-b-lg"
                                            >
                                                <img
                                                    src={token.logo}
                                                    alt={token.name}
                                                    width={16}
                                                    height={16}
                                                    className="sm:w-5 sm:h-5 rounded-full flex-shrink-0"
                                                />
                                                <span className="font-medium">{token.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Token Balance Display */}
                        <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Available Balance:</span>
                                <div className="text-right">
                                    <div className="text-white font-medium">₦{selectedTokenNgnBalance}</div>
                                    <div className="text-gray-400 text-sm">{selectedTokenBalance} {selectedToken.name}</div>
                                </div>
                            </div>
                        </div>
                        {/* Input Mode Selection */}
                        <div className="mb-6">
                            <label className="text-sm font-medium text-purple-400 mb-3 block">Input Method</label>
                            <div className="flex gap-3 flex-wrap">
                                <button
                                    onClick={() => setFileUploadMode('manual')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${fileUploadMode === 'manual'
                                        ? 'bg-[#7b40e3] text-white'
                                        : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                        }`}
                                >
                                    Manual Entry
                                </button>
                                <button
                                    onClick={() => setFileUploadMode('upload')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${fileUploadMode === 'upload'
                                        ? 'bg-[#7b40e3] text-white'
                                        : 'bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]'
                                        }`}
                                >
                                    File Upload
                                </button>
                                <button
                                    onClick={() => setShowBeneficiaryGroups(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-[#2F2F3A] text-gray-300 hover:bg-[#3B3B4F]"
                                >
                                    <Users className="h-4 w-4" />
                                    Beneficiary Groups
                                </button>
                            </div>
                        </div>

                        {/* File Upload Section */}
                        {fileUploadMode === 'upload' && (
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-sm font-medium text-purple-400">Upload Recipients File</label>
                                    <button
                                        onClick={downloadTemplate}
                                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        <Download className="h-4 w-4" />
                                        Download Template
                                    </button>
                                </div>

                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                                        ? 'border-[#7b40e3] bg-[#7b40e3]/10'
                                        : 'border-gray-600 hover:border-[#7b40e3]/50'
                                        }`}
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-300 mb-2">Drag and drop your CSV or Excel file here</p>
                                    <p className="text-gray-500 text-sm mb-4">or</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-[#7b40e3] hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Choose File
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) handleFileUpload(file)
                                        }}
                                        className="hidden"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Supported formats: CSV, Excel (.xlsx, .xls). Required columns: Account Name, Account Number, Bank Code, Amount
                                </p>
                            </div>
                        )}

                        {/* Recipients List */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-sm font-medium text-purple-400">
                                    Recipients ({recipients.length})
                                </label>
                                {fileUploadMode === 'manual' && (
                                    <button
                                        onClick={addRecipient}
                                        className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                                    >
                                        <UserPlus className="h-4 w-4" />
                                        Add Recipient
                                    </button>
                                )}
                            </div>

                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {recipients.map((recipient, index) => (
                                    <div key={recipient.id} className="bg-[#2F2F3A] rounded-lg p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <span className="text-sm text-gray-400">Recipient {index + 1}</span>
                                            <div className="flex items-center gap-2">
                                                {recipient.isVerified && (
                                                    <div className="flex items-center gap-1 text-green-400 text-xs">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>Verified</span>
                                                    </div>
                                                )}
                                                {recipients.length > 1 && (
                                                    <button
                                                        onClick={() => removeRecipient(recipient.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <div>
                                                <select
                                                    value={recipient.bankCode}
                                                    onChange={(e) => updateRecipient(recipient.id, 'bankCode', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                >
                                                    <option value="">Select Bank</option>
                                                    {banks.map((bank) => (
                                                        <option key={`${bank.id}-${bank.code}`} value={bank.code}>
                                                            {bank.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Account Number"
                                                    value={recipient.accountNumber}
                                                    onChange={(e) => updateRecipient(recipient.id, 'accountNumber', e.target.value)}
                                                    className={`w-full bg-[#14141B] px-3 py-2 pr-16 text-white placeholder-gray-500 border rounded-lg focus:outline-none focus:border-purple-500 text-sm ${recipient.isVerified ? 'border-green-500' :
                                                            recipient.isVerifying ? 'border-yellow-500' :
                                                                'border-gray-600'
                                                        }`}
                                                />
                                                <button
                                                    onClick={() => verifyAccount(recipient.id)}
                                                    disabled={!recipient.accountNumber || !recipient.bankCode || recipient.isVerifying}
                                                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-2 py-1 text-xs rounded transition-colors ${recipient.isVerified
                                                            ? 'text-green-400 cursor-default'
                                                            : recipient.isVerifying
                                                                ? 'text-yellow-400 cursor-wait'
                                                                : !recipient.accountNumber || !recipient.bankCode
                                                                    ? 'text-gray-500 cursor-not-allowed'
                                                                    : 'text-purple-400 hover:text-purple-300 hover:bg-purple-400/10 cursor-pointer'
                                                        }`}
                                                >
                                                    {recipient.isVerifying ? (
                                                        <div className="flex items-center gap-1">
                                                            <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
                                                            <span>...</span>
                                                        </div>
                                                    ) : recipient.isVerified ? (
                                                        <div className="flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>✓</span>
                                                        </div>
                                                    ) : (
                                                        'Verify'
                                                    )}
                                                </button>
                                            </div>
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Account Name"
                                                    value={recipient.accountName}
                                                    onChange={(e) => updateRecipient(recipient.id, 'accountName', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                    disabled={recipient.isVerified}
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    placeholder="Amount (NGN)"
                                                    value={recipient.amount}
                                                    onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                                                    className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                                    min="100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>                        {/* Save as Beneficiary Group (for manual entry) */}
                        {fileUploadMode === 'manual' && recipients.length > 1 && (
                            <div className="bg-[#2F2F3A] rounded-lg p-4 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <input
                                        type="checkbox"
                                        id="createGroup"
                                        checked={createGroup}
                                        onChange={(e) => setCreateGroup(e.target.checked)}
                                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                                    />
                                    <label htmlFor="createGroup" className="text-sm font-medium text-white flex items-center gap-2">
                                        <Bookmark className="h-4 w-4" />
                                        Save as Beneficiary Group
                                    </label>
                                </div>

                                {createGroup && (
                                    <input
                                        type="text"
                                        placeholder="Enter group name (e.g., Monthly Payroll, Team A)"
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        className="w-full bg-[#14141B] px-3 py-2 text-white placeholder-gray-500 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                    />
                                )}
                            </div>
                        )}

                        {/* Summary */}
                        <div className="bg-[#14141B] rounded-lg p-4 mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Recipients:</span>
                                <span className="text-white font-medium">{recipients.length}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-gray-400">Total Amount:</span>
                                <span className="text-purple-400 font-bold text-lg">₦{totalAmount.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => onOpenChange(false)}
                                className="flex-1 bg-[#2F2F3A] py-3 text-white hover:bg-[#3B3B4F] border border-gray-600/20 font-medium text-sm rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProceed}
                                className="flex-1 bg-[#7b40e3] py-3 text-white hover:bg-purple-700 font-medium text-sm rounded-lg transition-colors"
                            >
                                Get Quote
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* CSV Verification Modal */}
            <CSVVerificationModal
                open={showCSVVerification}
                onOpenChange={setShowCSVVerification}
                csvData={csvDataForVerification}
                onConfirm={handleCSVVerificationConfirm}
                onBack={() => setShowCSVVerification(false)}
            />

            {/* Beneficiary Groups Modal */}
            <BeneficiaryGroupsModal
                open={showBeneficiaryGroups}
                onOpenChange={setShowBeneficiaryGroups}
                onSelectGroup={handleBeneficiaryGroupSelect}
                onBack={() => setShowBeneficiaryGroups(false)}
            />
        </>
    )
}

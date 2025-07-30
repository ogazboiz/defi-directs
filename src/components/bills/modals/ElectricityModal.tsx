"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaBolt, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaSearch, FaBuilding } from 'react-icons/fa'

interface ElectricityModalProps {
    isOpen: boolean
    onClose: () => void
}

interface ElectricityProvider {
    id: string
    name: string
    logo: React.ReactNode
    color: string
    state: string
}

interface MeterInfo {
    customerName: string
    address: string
    meterType: string
    tariffClass: string
}

const electricityProviders: ElectricityProvider[] = [
    {
        id: 'ekedc',
        name: 'Eko Electricity (EKEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Lagos'
    },
    {
        id: 'ikedc',
        name: 'Ikeja Electric (IKEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Lagos'
    },
    {
        id: 'aedc',
        name: 'Abuja Electricity (AEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Abuja'
    },
    {
        id: 'phedc',
        name: 'Port Harcourt Electric (PHEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Rivers'
    },
    {
        id: 'kaedc',
        name: 'Kaduna Electric (KAEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Kaduna'
    },
    {
        id: 'jedc',
        name: 'Jos Electric (JEDC)',
        logo: <FaBuilding />,
        color: 'border-purple-500 bg-purple-500/10',
        state: 'Plateau'
    }
]

const ElectricityModal: React.FC<ElectricityModalProps> = ({ isOpen, onClose }) => {
    const [selectedProvider, setSelectedProvider] = useState<string>('')
    const [meterNumber, setMeterNumber] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [meterInfo, setMeterInfo] = useState<MeterInfo | null>(null)
    const [isVerifying, setIsVerifying] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const predefinedAmounts = [10, 20, 50, 100, 200, 500]

    const handleVerifyMeter = async () => {
        if (!selectedProvider || !meterNumber) return

        setIsVerifying(true)

        // Simulate API call for meter verification
        setTimeout(() => {
            setIsVerifying(false)
            // Mock meter info
            setMeterInfo({
                customerName: 'John Doe',
                address: '123 Main Street, Lagos',
                meterType: 'Prepaid',
                tariffClass: 'R2 - Residential'
            })
        }, 2000)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProvider || !meterNumber || !amount || !meterInfo) return

        setIsProcessing(true)

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false)
            setIsSuccess(true)

            // Auto close after success
            setTimeout(() => {
                onClose()
                setIsSuccess(false)
                // Reset form
                setSelectedProvider('')
                setMeterNumber('')
                setAmount('')
                setMeterInfo(null)
            }, 2000)
        }, 3000)
    }

    if (!isOpen) return null

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-[#151021] rounded-2xl p-6 w-full max-w-lg border border-purple-900/20 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <FaBolt className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Electricity Bills</h2>
                            <p className="text-gray-400 text-sm">Pay your electricity bills instantly</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
                    >
                        <FaTimes />
                    </button>
                </div>

                {isSuccess ? (
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center py-8"
                    >
                        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="text-purple-400 text-2xl" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Payment Successful!</h3>
                        <p className="text-gray-400">
                            ${amount} has been credited to meter {meterNumber}
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            You should receive a confirmation token shortly
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Provider Selection */}
                        <div>
                            <label className="block text-white font-medium mb-3">Select Electricity Provider</label>
                            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                                {electricityProviders.map((provider) => (
                                    <button
                                        key={provider.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProvider(provider.id)
                                            setMeterInfo(null) // Reset meter info when provider changes
                                        }}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${selectedProvider === provider.id
                                            ? provider.color
                                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-purple-400">{provider.logo}</span>
                                                <div>
                                                    <span className="text-white font-medium block">{provider.name}</span>
                                                    <span className="text-gray-400 text-sm">{provider.state} State</span>
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Meter Number */}
                        <div>
                            <label className="block text-white font-medium mb-3">Meter Number</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={meterNumber}
                                    onChange={(e) => {
                                        setMeterNumber(e.target.value)
                                        setMeterInfo(null) // Reset meter info when meter number changes
                                    }}
                                    placeholder="Enter meter number"
                                    className="flex-1 bg-[#1A0E2C] border border-purple-900/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                    required
                                />
                                <motion.button
                                    type="button"
                                    onClick={handleVerifyMeter}
                                    disabled={!selectedProvider || !meterNumber || isVerifying}
                                    whileHover={!isVerifying ? { scale: 1.05 } : {}}
                                    whileTap={!isVerifying ? { scale: 0.95 } : {}}
                                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-xl flex items-center gap-2 transition-colors"
                                >
                                    {isVerifying ? (
                                        <FaSpinner className="animate-spin" />
                                    ) : (
                                        <FaSearch />
                                    )}
                                    {isVerifying ? 'Verifying...' : 'Verify'}
                                </motion.button>
                            </div>
                        </div>

                        {/* Meter Information */}
                        {meterInfo && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4"
                            >
                                <h3 className="text-purple-400 font-medium mb-2 flex items-center gap-2">
                                    <FaCheckCircle />
                                    Meter Verified Successfully
                                </h3>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Customer Name:</span>
                                        <span className="text-white">{meterInfo.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Address:</span>
                                        <span className="text-white text-right">{meterInfo.address}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Meter Type:</span>
                                        <span className="text-white">{meterInfo.meterType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tariff Class:</span>
                                        <span className="text-white">{meterInfo.tariffClass}</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Amount Selection */}
                        {meterInfo && (
                            <div>
                                <label className="block text-white font-medium mb-3">Select Amount (USD)</label>
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {predefinedAmounts.map((preAmount) => (
                                        <button
                                            key={preAmount}
                                            type="button"
                                            onClick={() => setAmount(preAmount.toString())}
                                            className={`p-3 rounded-xl border-2 transition-all duration-200 ${amount === preAmount.toString()
                                                ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                                                : 'border-gray-700 bg-gray-800/30 text-white hover:border-gray-600'
                                                }`}
                                        >
                                            ${preAmount}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter custom amount"
                                    className="w-full bg-[#1A0E2C] border border-purple-900/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                    min="1"
                                    max="1000"
                                    required
                                />
                            </div>
                        )}

                        {/* Summary */}
                        {meterInfo && amount && selectedProvider && (
                            <div className="bg-[#1A0E2C]/50 rounded-xl p-4 border border-purple-900/20">
                                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-purple-400" />
                                    Payment Summary
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Provider:</span>
                                        <span className="text-white">{electricityProviders.find(p => p.id === selectedProvider)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Customer:</span>
                                        <span className="text-white">{meterInfo.customerName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Meter Number:</span>
                                        <span className="text-white">{meterNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Meter Type:</span>
                                        <span className="text-white">{meterInfo.meterType}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold pt-2 border-t border-purple-900/20">
                                        <span className="text-purple-400">Total Amount:</span>
                                        <span className="text-purple-400">${amount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!selectedProvider || !meterNumber || !amount || !meterInfo || isProcessing}
                            whileHover={!isProcessing ? { scale: 1.02 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                            className="w-full bg-purple-600 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                        >
                            {isProcessing ? (
                                <>
                                    <FaSpinner className="animate-spin" />
                                    Processing Payment...
                                </>
                            ) : (
                                <>
                                    <FaBolt />
                                    Pay Electricity Bill
                                </>
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

export default ElectricityModal

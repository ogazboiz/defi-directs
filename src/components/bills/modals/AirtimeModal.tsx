"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaPhone, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaSimCard } from 'react-icons/fa'

interface AirtimeModalProps {
    isOpen: boolean
    onClose: () => void
}

interface NetworkProvider {
    id: string
    name: string
    logo: React.ReactNode
    color: string
}

const networkProviders: NetworkProvider[] = [
    {
        id: 'mtn',
        name: 'MTN',
        logo: <FaSimCard />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: 'airtel',
        name: 'Airtel',
        logo: <FaSimCard />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: 'glo',
        name: 'Glo',
        logo: <FaSimCard />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: '9mobile',
        name: '9mobile',
        logo: <FaSimCard />,
        color: 'border-purple-500 bg-purple-500/10'
    }
]

const airtimeAmounts = [5, 10, 20, 50, 100, 200]

const AirtimeModal: React.FC<AirtimeModalProps> = ({ isOpen, onClose }) => {
    const [selectedNetwork, setSelectedNetwork] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const [customAmount, setCustomAmount] = useState<string>('')
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedNetwork || !phoneNumber || (!selectedAmount && !customAmount)) return

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
                setSelectedNetwork('')
                setPhoneNumber('')
                setSelectedAmount(null)
                setCustomAmount('')
            }, 2000)
        }, 3000)
    }

    const getSelectedAmountValue = () => {
        return selectedAmount || parseFloat(customAmount) || 0
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
                className="bg-[#151021] rounded-2xl p-6 w-full max-w-md border border-purple-900/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <FaPhone className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Airtime Recharge</h2>
                            <p className="text-gray-400 text-sm">Top up your phone instantly</p>
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
                            ${getSelectedAmountValue()} airtime has been sent to {phoneNumber}
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Network Selection */}
                        <div>
                            <label className="block text-white font-medium mb-3">Select Network</label>
                            <div className="grid grid-cols-2 gap-3">
                                {networkProviders.map((provider) => (
                                    <button
                                        key={provider.id}
                                        type="button"
                                        onClick={() => setSelectedNetwork(provider.id)}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${selectedNetwork === provider.id
                                            ? provider.color
                                            : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-purple-400">{provider.logo}</span>
                                            <span className="text-white font-medium">{provider.name}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-white font-medium mb-3">Phone Number</label>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full bg-[#1A0E2C] border border-purple-900/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* Amount Selection */}
                        <div>
                            <label className="block text-white font-medium mb-3">Select Amount (USD)</label>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                                {airtimeAmounts.map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() => {
                                            setSelectedAmount(amount)
                                            setCustomAmount('')
                                        }}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${selectedAmount === amount
                                            ? 'border-purple-500 bg-purple-500/20 text-purple-400'
                                            : 'border-gray-700 bg-gray-800/30 text-white hover:border-gray-600'
                                            }`}
                                    >
                                        ${amount}
                                    </button>
                                ))}
                            </div>

                            <input
                                type="number"
                                value={customAmount}
                                onChange={(e) => {
                                    setCustomAmount(e.target.value)
                                    setSelectedAmount(null)
                                }}
                                placeholder="Enter custom amount"
                                className="w-full bg-[#1A0E2C] border border-purple-900/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                min="1"
                                max="1000"
                            />
                        </div>

                        {/* Summary */}
                        {(selectedAmount || customAmount) && selectedNetwork && phoneNumber && (
                            <div className="bg-[#1A0E2C]/50 rounded-xl p-4 border border-purple-900/20">
                                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-purple-400" />
                                    Transaction Summary
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Network:</span>
                                        <span className="text-white">{networkProviders.find(p => p.id === selectedNetwork)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Phone:</span>
                                        <span className="text-white">{phoneNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount:</span>
                                        <span className="text-white">${getSelectedAmountValue()}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold pt-2 border-t border-purple-900/20">
                                        <span className="text-purple-400">Total:</span>
                                        <span className="text-purple-400">${getSelectedAmountValue()}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!selectedNetwork || !phoneNumber || (!selectedAmount && !customAmount) || isProcessing}
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
                                    <FaPhone />
                                    Recharge Now
                                </>
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

export default AirtimeModal

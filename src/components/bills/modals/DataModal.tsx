"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaWifi, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaClock, FaSimCard } from 'react-icons/fa'

interface DataModalProps {
    isOpen: boolean
    onClose: () => void
}

interface NetworkProvider {
    id: string
    name: string
    logo: React.ReactNode
    color: string
}

interface DataPlan {
    id: string
    name: string
    data: string
    validity: string
    price: number
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

const dataPlans: Record<string, DataPlan[]> = {
    mtn: [
        { id: '1', name: 'Daily Plan', data: '100MB', validity: '1 Day', price: 2 },
        { id: '2', name: 'Weekly Plan', data: '1GB', validity: '7 Days', price: 5 },
        { id: '3', name: 'Monthly Plan', data: '5GB', validity: '30 Days', price: 15 },
        { id: '4', name: 'Premium Plan', data: '15GB', validity: '30 Days', price: 25 },
        { id: '5', name: 'Ultra Plan', data: '50GB', validity: '30 Days', price: 50 }
    ],
    airtel: [
        { id: '1', name: 'Starter', data: '200MB', validity: '1 Day', price: 2 },
        { id: '2', name: 'Basic', data: '1.5GB', validity: '7 Days', price: 6 },
        { id: '3', name: 'Standard', data: '6GB', validity: '30 Days', price: 16 },
        { id: '4', name: 'Premium', data: '20GB', validity: '30 Days', price: 30 },
        { id: '5', name: 'Ultimate', data: '75GB', validity: '30 Days', price: 60 }
    ],
    glo: [
        { id: '1', name: 'Micro', data: '150MB', validity: '1 Day', price: 1.5 },
        { id: '2', name: 'Mini', data: '1.2GB', validity: '7 Days', price: 5.5 },
        { id: '3', name: 'Regular', data: '4.5GB', validity: '30 Days', price: 14 },
        { id: '4', name: 'Max', data: '18GB', validity: '30 Days', price: 28 },
        { id: '5', name: 'Super', data: '60GB', validity: '30 Days', price: 55 }
    ],
    '9mobile': [
        { id: '1', name: 'Daily', data: '120MB', validity: '1 Day', price: 1.8 },
        { id: '2', name: 'Weekly', data: '900MB', validity: '7 Days', price: 4.5 },
        { id: '3', name: 'Monthly', data: '4GB', validity: '30 Days', price: 13 },
        { id: '4', name: 'Mega', data: '12GB', validity: '30 Days', price: 24 },
        { id: '5', name: 'Giga', data: '40GB', validity: '30 Days', price: 45 }
    ]
}

const DataModal: React.FC<DataModalProps> = ({ isOpen, onClose }) => {
    const [selectedNetwork, setSelectedNetwork] = useState<string>('')
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [selectedPlan, setSelectedPlan] = useState<DataPlan | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedNetwork || !phoneNumber || !selectedPlan) return

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
                setSelectedPlan(null)
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
                            <FaWifi className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Data Bundles</h2>
                            <p className="text-gray-400 text-sm">Purchase mobile data plans</p>
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
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaCheckCircle className="text-green-400 text-2xl" />
                        </div>
                        <h3 className="text-white font-semibold text-lg mb-2">Purchase Successful!</h3>
                        <p className="text-gray-400">
                            {selectedPlan?.data} data bundle has been sent to {phoneNumber}
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
                                        onClick={() => {
                                            setSelectedNetwork(provider.id)
                                            setSelectedPlan(null) // Reset plan when network changes
                                        }}
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

                        {/* Data Plans */}
                        {selectedNetwork && (
                            <div>
                                <label className="block text-white font-medium mb-3">Choose Data Plan</label>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {dataPlans[selectedNetwork]?.map((plan) => (
                                        <button
                                            key={plan.id}
                                            type="button"
                                            onClick={() => setSelectedPlan(plan)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedPlan?.id === plan.id
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-white font-medium">{plan.name}</div>
                                                    <div className="text-purple-400 text-sm flex items-center gap-1">
                                                        <FaWifi className="text-xs" />
                                                        {plan.data}
                                                    </div>
                                                    <div className="text-gray-400 text-xs flex items-center gap-1">
                                                        <FaClock className="text-xs" />
                                                        Valid for {plan.validity}
                                                    </div>
                                                </div>
                                                <div className="text-white font-bold">${plan.price}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {selectedPlan && selectedNetwork && phoneNumber && (
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
                                        <span className="text-gray-400">Plan:</span>
                                        <span className="text-white">{selectedPlan.name} - {selectedPlan.data}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Validity:</span>
                                        <span className="text-white">{selectedPlan.validity}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold pt-2 border-t border-purple-900/20">
                                        <span className="text-purple-400">Total:</span>
                                        <span className="text-purple-400">${selectedPlan.price}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!selectedNetwork || !phoneNumber || !selectedPlan || isProcessing}
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
                                    <FaWifi />
                                    Purchase Data Bundle
                                </>
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

export default DataModal

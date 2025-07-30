"useimport { FaTimes, FaTv, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaClock, FaStar, FaPlay } from 'react-icons/fa'client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaTimes, FaTv, FaMoneyBillWave, FaSpinner, FaCheckCircle, FaCrown, FaStar, FaPlay } from 'react-icons/fa'

interface TvModalProps {
    isOpen: boolean
    onClose: () => void
}

interface TvProvider {
    id: string
    name: string
    logo: React.ReactNode
    color: string
}

interface TvPackage {
    id: string
    name: string
    description: string
    channels: string
    price: number
    duration: string
    popular?: boolean
    premium?: boolean
}

const tvProviders: TvProvider[] = [
    {
        id: 'dstv',
        name: 'DStv',
        logo: <FaTv />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: 'gotv',
        name: 'GOtv',
        logo: <FaTv />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: 'startimes',
        name: 'StarTimes',
        logo: <FaStar />,
        color: 'border-purple-500 bg-purple-500/10'
    },
    {
        id: 'netflix',
        name: 'Netflix',
        logo: <FaPlay />,
        color: 'border-purple-500 bg-purple-500/10'
    }
]

const tvPackages: Record<string, TvPackage[]> = {
    dstv: [
        { id: '1', name: 'DStv Access', description: 'Basic entertainment package', channels: '95+ channels', price: 15, duration: '1 Month' },
        { id: '2', name: 'DStv Family', description: 'Perfect for families', channels: '120+ channels', price: 25, duration: '1 Month', popular: true },
        { id: '3', name: 'DStv Compact', description: 'Sports and entertainment', channels: '175+ channels', price: 45, duration: '1 Month' },
        { id: '4', name: 'DStv Premium', description: 'Ultimate entertainment experience', channels: '220+ channels', price: 75, duration: '1 Month', premium: true }
    ],
    gotv: [
        { id: '1', name: 'GOtv Lite', description: 'Entry-level package', channels: '45+ channels', price: 8, duration: '1 Month' },
        { id: '2', name: 'GOtv Value', description: 'Great value for money', channels: '65+ channels', price: 12, duration: '1 Month', popular: true },
        { id: '3', name: 'GOtv Plus', description: 'Enhanced viewing experience', channels: '85+ channels', price: 18, duration: '1 Month' },
        { id: '4', name: 'GOtv Max', description: 'Premium sports and movies', channels: '105+ channels', price: 28, duration: '1 Month', premium: true }
    ],
    startimes: [
        { id: '1', name: 'Nova', description: 'Basic entertainment', channels: '35+ channels', price: 6, duration: '1 Month' },
        { id: '2', name: 'Basic', description: 'Family entertainment', channels: '50+ channels', price: 10, duration: '1 Month', popular: true },
        { id: '3', name: 'Smart', description: 'Sports and movies', channels: '75+ channels', price: 16, duration: '1 Month' },
        { id: '4', name: 'Super', description: 'Premium content', channels: '100+ channels', price: 24, duration: '1 Month', premium: true }
    ],
    netflix: [
        { id: '1', name: 'Mobile', description: 'Watch on phone/tablet', channels: 'Mobile streaming', price: 5, duration: '1 Month' },
        { id: '2', name: 'Basic', description: 'Watch on one screen in HD', channels: 'HD streaming', price: 10, duration: '1 Month' },
        { id: '3', name: 'Standard', description: 'Watch on 2 screens in HD', channels: 'HD streaming', price: 15, duration: '1 Month', popular: true },
        { id: '4', name: 'Premium', description: 'Watch on 4 screens in Ultra HD', channels: '4K Ultra HD', price: 20, duration: '1 Month', premium: true }
    ]
}

const TvSubscriptionModal: React.FC<TvModalProps> = ({ isOpen, onClose }) => {
    const [selectedProvider, setSelectedProvider] = useState<string>('')
    const [customerNumber, setCustomerNumber] = useState<string>('')
    const [selectedPackage, setSelectedPackage] = useState<TvPackage | null>(null)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)
    const [isSuccess, setIsSuccess] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedProvider || !customerNumber || !selectedPackage) return

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
                setCustomerNumber('')
                setSelectedPackage(null)
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
                            <FaTv className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">TV Subscription</h2>
                            <p className="text-gray-400 text-sm">Renew your cable TV subscription</p>
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
                        <h3 className="text-white font-semibold text-lg mb-2">Subscription Renewed!</h3>
                        <p className="text-gray-400">
                            {selectedPackage?.name} subscription has been activated for {customerNumber}
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Provider Selection */}
                        <div>
                            <label className="block text-white font-medium mb-3">Select TV Provider</label>
                            <div className="grid grid-cols-2 gap-3">
                                {tvProviders.map((provider) => (
                                    <button
                                        key={provider.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedProvider(provider.id)
                                            setSelectedPackage(null) // Reset package when provider changes
                                        }}
                                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${selectedProvider === provider.id
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

                        {/* Customer Number */}
                        <div>
                            <label className="block text-white font-medium mb-3">
                                {selectedProvider === 'netflix' ? 'Email Address' : 'Smart Card/Customer Number'}
                            </label>
                            <input
                                type={selectedProvider === 'netflix' ? 'email' : 'text'}
                                value={customerNumber}
                                onChange={(e) => setCustomerNumber(e.target.value)}
                                placeholder={selectedProvider === 'netflix' ? 'Enter email address' : 'Enter customer number'}
                                className="w-full bg-[#1A0E2C] border border-purple-900/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors"
                                required
                            />
                        </div>

                        {/* TV Packages */}
                        {selectedProvider && (
                            <div>
                                <label className="block text-white font-medium mb-3">Choose Package</label>
                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {tvPackages[selectedProvider]?.map((tvPackage) => (
                                        <button
                                            key={tvPackage.id}
                                            type="button"
                                            onClick={() => setSelectedPackage(tvPackage)}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${selectedPackage?.id === tvPackage.id
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                                                }`}
                                        >
                                            {/* Package badges */}
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                {tvPackage.popular && (
                                                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <FaStar className="text-xs" />
                                                        Popular
                                                    </span>
                                                )}
                                                {tvPackage.premium && (
                                                    <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                        <FaCrown className="text-xs" />
                                                        Premium
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-start justify-between pr-16">
                                                <div className="flex-1">
                                                    <div className="text-white font-medium">{tvPackage.name}</div>
                                                    <div className="text-gray-400 text-sm mb-1">{tvPackage.description}</div>
                                                    <div className="text-purple-400 text-sm">{tvPackage.channels}</div>
                                                    <div className="text-gray-400 text-xs mt-1">Valid for {tvPackage.duration}</div>
                                                </div>
                                                <div className="text-white font-bold text-lg">${tvPackage.price}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        {selectedPackage && selectedProvider && customerNumber && (
                            <div className="bg-[#1A0E2C]/50 rounded-xl p-4 border border-purple-900/20">
                                <h3 className="text-white font-medium mb-2 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-purple-400" />
                                    Subscription Summary
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Provider:</span>
                                        <span className="text-white">{tvProviders.find(p => p.id === selectedProvider)?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            {selectedProvider === 'netflix' ? 'Account:' : 'Customer Number:'}
                                        </span>
                                        <span className="text-white">{customerNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Package:</span>
                                        <span className="text-white">{selectedPackage.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Duration:</span>
                                        <span className="text-white">{selectedPackage.duration}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold pt-2 border-t border-purple-900/20">
                                        <span className="text-purple-400">Total:</span>
                                        <span className="text-purple-400">${selectedPackage.price}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={!selectedProvider || !customerNumber || !selectedPackage || isProcessing}
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
                                    <FaTv />
                                    Renew Subscription
                                </>
                            )}
                        </motion.button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    )
}

export default TvSubscriptionModal

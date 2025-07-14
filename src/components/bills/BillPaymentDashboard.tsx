"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FaPhone,
    FaWifi,
    FaTv,
    FaBolt,
    FaCreditCard,
    FaArrowRight
} from 'react-icons/fa'
import AirtimeModal from './modals/AirtimeModal'
import DataModal from './modals/DataModal'
import TvSubscriptionModal from './modals/TvSubscriptionModal'
import ElectricityModal from './modals/ElectricityModal'

interface BillService {
    id: string
    name: string
    description: string
    icon: React.ReactNode
    color: string
}

const billServices: BillService[] = [
    {
        id: 'airtime',
        name: 'Airtime Recharge',
        description: 'Top up your mobile phone credit instantly',
        icon: <FaPhone />,
        color: 'text-purple-400'
    },
    {
        id: 'data',
        name: 'Data Bundles',
        description: 'Purchase internet data for your mobile device',
        icon: <FaWifi />,
        color: 'text-purple-400'
    },
    {
        id: 'tv',
        name: 'TV Subscription',
        description: 'Renew your cable TV and streaming services',
        icon: <FaTv />,
        color: 'text-purple-400'
    },
    {
        id: 'electricity',
        name: 'Electricity Bills',
        description: 'Pay your electricity bills conveniently',
        icon: <FaBolt />,
        color: 'text-purple-400'
    }
]



const BillPaymentDashboard = () => {
    const [selectedService, setSelectedService] = useState<string | null>(null)

    const openModal = (serviceId: string) => {
        setSelectedService(serviceId)
    }

    const closeModal = () => {
        setSelectedService(null)
    }

    return (
        <div className="min-h-screen bg-[#0A0014] p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    {/* <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        Bill Payments
                    </h1> */}
                    <p className="text-gray-400 text-lg">
                        Pay your bills quickly and securely with cryptocurrency
                    </p>
                </div>

                {/* Bill Services Grid */}
                <div className="bg-[#151021] rounded-2xl p-8 shadow-lg border border-purple-900/20">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <FaCreditCard className="text-purple-400 text-2xl" />
                        Select Service
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {billServices.map((service) => (
                            <motion.div
                                key={service.id}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative overflow-hidden rounded-2xl bg-[#1A0E2C] border border-purple-900/20 cursor-pointer group h-64"
                                onClick={() => openModal(service.id)}
                            >
                                <div className="p-10 h-full flex flex-col justify-between">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`text-6xl ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                                            {service.icon}
                                        </div>
                                        <motion.div
                                            className="text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"
                                            whileHover={{ x: 5 }}
                                        >
                                            <FaArrowRight />
                                        </motion.div>
                                    </div>

                                    <div>
                                        <h3 className="text-white font-bold text-2xl mb-4">
                                            {service.name}
                                        </h3>
                                        <p className="text-gray-400 text-lg leading-relaxed">
                                            {service.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedService === 'airtime' && (
                    <AirtimeModal isOpen={true} onClose={closeModal} />
                )}
                {selectedService === 'data' && (
                    <DataModal isOpen={true} onClose={closeModal} />
                )}
                {selectedService === 'tv' && (
                    <TvSubscriptionModal isOpen={true} onClose={closeModal} />
                )}
                {selectedService === 'electricity' && (
                    <ElectricityModal isOpen={true} onClose={closeModal} />
                )}
            </AnimatePresence>
        </div>
    )
}

export default BillPaymentDashboard

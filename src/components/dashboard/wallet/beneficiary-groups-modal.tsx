"use client"

import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { ArrowLeft, Users, Search, Trash2, Calendar } from "lucide-react"
import { beneficiaryGroupService, BeneficiaryGroup, BeneficiaryRecipient } from "@/services/beneficiaryGroupService"
import toast from 'react-hot-toast'

interface BeneficiaryGroupsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelectGroup: (recipients: BeneficiaryRecipient[]) => void
    onBack: () => void
}

export function BeneficiaryGroupsModal({
    open,
    onOpenChange,
    onSelectGroup,
    onBack
}: BeneficiaryGroupsModalProps) {
    const [groups, setGroups] = useState<BeneficiaryGroup[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [filteredGroups, setFilteredGroups] = useState<BeneficiaryGroup[]>([])

    useEffect(() => {
        if (open) {
            loadGroups()
        }
    }, [open])

    useEffect(() => {
        if (searchQuery.trim()) {
            setFilteredGroups(beneficiaryGroupService.searchGroups(searchQuery))
        } else {
            setFilteredGroups(groups)
        }
    }, [searchQuery, groups])

    const loadGroups = () => {
        const allGroups = beneficiaryGroupService.getAllGroups()
        setGroups(allGroups)
        setFilteredGroups(allGroups)
    }

    const handleSelectGroup = (group: BeneficiaryGroup) => {
        const recipients = group.recipients.map((r, index) => ({
            id: (index + 1).toString(),
            accountName: r.accountName,
            accountNumber: r.accountNumber,
            bankCode: r.bankCode,
            bankName: r.bankName,
            amount: r.amount || '',
            isVerified: r.isVerified
        }))

        beneficiaryGroupService.markGroupAsUsed(group.id)
        onSelectGroup(recipients)
    }

    const handleDeleteGroup = (groupId: string, groupName: string) => {
        if (window.confirm(`Are you sure you want to delete the group "${groupName}"?`)) {
            const success = beneficiaryGroupService.deleteGroup(groupId)
            if (success) {
                toast.success('Group deleted successfully')
                loadGroups()
            } else {
                toast.error('Failed to delete group')
            }
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    const recentGroups = beneficiaryGroupService.getRecentGroups(3)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl w-[95vw] border border-[#7b40e3]/20 bg-[#1C1C27] p-0 text-white rounded-[20px] max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                        <button
                            onClick={onBack}
                            className="text-white hover:opacity-80 transition-opacity"
                        >
                            <ArrowLeft className="h-6 w-6" />
                        </button>
                        <h2 className="text-2xl font-bold text-[#7b40e3]">Beneficiary Groups</h2>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search groups by name or recipient..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#2F2F3A] pl-10 pr-4 py-3 text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Recent Groups */}
                    {!searchQuery && recentGroups.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-medium text-white mb-3">Recently Used</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {recentGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        onClick={() => handleSelectGroup(group)}
                                        className="bg-[#2F2F3A] hover:bg-[#3B3B4F] rounded-lg p-4 cursor-pointer transition-colors border border-purple-500/20"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-medium text-white truncate">{group.name}</h4>
                                            <Users className="h-4 w-4 text-purple-400" />
                                        </div>
                                        <p className="text-sm text-gray-400">{group.totalRecipients} recipients</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Last used: {group.lastUsed ? formatDate(group.lastUsed) : 'Never'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All Groups */}
                    <div className="mb-6">
                        <h3 className="text-lg font-medium text-white mb-3">
                            {searchQuery ? 'Search Results' : 'All Groups'} ({filteredGroups.length})
                        </h3>

                        {filteredGroups.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                {searchQuery ? 'No groups match your search' : 'No beneficiary groups found'}
                                <p className="text-sm mt-2">
                                    {!searchQuery && 'Create your first group by uploading a CSV or manually adding recipients'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {filteredGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className="bg-[#2F2F3A] rounded-lg p-4 hover:bg-[#3B3B4F] transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className="font-medium text-white truncate">{group.name}</h4>
                                                    <span className="text-xs bg-purple-600 px-2 py-1 rounded-full">
                                                        {group.totalRecipients} recipients
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        Created: {formatDate(group.createdAt)}
                                                    </div>
                                                    {group.lastUsed && (
                                                        <div>
                                                            Last used: {formatDate(group.lastUsed)}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Preview recipients */}
                                                <div className="mt-2">
                                                    <p className="text-xs text-gray-500 mb-1">Recipients:</p>
                                                    <div className="text-xs text-gray-400">
                                                        {group.recipients.slice(0, 3).map(r => r.accountName).join(', ')}
                                                        {group.recipients.length > 3 && ` and ${group.recipients.length - 3} more...`}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleSelectGroup(group)}
                                                    className="bg-[#7b40e3] hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Use Group
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteGroup(group.id, group.name)
                                                    }}
                                                    className="text-red-400 hover:text-red-300 p-2 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="flex-1 bg-[#2F2F3A] py-3 text-white hover:bg-[#3B3B4F] border border-gray-600/20 font-medium text-sm rounded-lg transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={onBack}
                            className="flex-1 bg-[#7b40e3] py-3 text-white hover:bg-purple-700 font-medium text-sm rounded-lg transition-colors"
                        >
                            Create New Group
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

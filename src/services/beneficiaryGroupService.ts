export interface BeneficiaryRecipient {
    id: string
    accountName: string
    accountNumber: string
    bankCode: string
    bankName: string
    amount?: string
    isVerified: boolean
}

export interface BeneficiaryGroup {
    id: string
    name: string
    recipients: BeneficiaryRecipient[]
    createdAt: string
    lastUsed?: string
    totalRecipients: number
}

class BeneficiaryGroupService {
    private storageKey = 'defi_direct_beneficiary_groups'

    getAllGroups(): BeneficiaryGroup[] {
        try {
            const stored = localStorage.getItem(this.storageKey)
            return stored ? JSON.parse(stored) : []
        } catch (error) {
            console.error('Error loading beneficiary groups:', error)
            return []
        }
    }

    getGroupById(id: string): BeneficiaryGroup | null {
        const groups = this.getAllGroups()
        return groups.find(group => group.id === id) || null
    }

    saveGroup(name: string, recipients: BeneficiaryRecipient[]): BeneficiaryGroup {
        const groups = this.getAllGroups()

        const newGroup: BeneficiaryGroup = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            recipients: recipients.map(r => ({ ...r, amount: '' })), // Remove amounts for reusability
            createdAt: new Date().toISOString(),
            totalRecipients: recipients.length
        }

        groups.push(newGroup)
        this.saveGroups(groups)

        return newGroup
    }

    updateGroup(id: string, updates: Partial<BeneficiaryGroup>): boolean {
        const groups = this.getAllGroups()
        const index = groups.findIndex(group => group.id === id)

        if (index === -1) return false

        groups[index] = { ...groups[index], ...updates }
        this.saveGroups(groups)

        return true
    }

    deleteGroup(id: string): boolean {
        const groups = this.getAllGroups()
        const filteredGroups = groups.filter(group => group.id !== id)

        if (filteredGroups.length === groups.length) return false

        this.saveGroups(filteredGroups)
        return true
    }

    markGroupAsUsed(id: string): void {
        this.updateGroup(id, { lastUsed: new Date().toISOString() })
    }

    getRecentGroups(limit: number = 5): BeneficiaryGroup[] {
        const groups = this.getAllGroups()
        return groups
            .filter(group => group.lastUsed)
            .sort((a, b) => new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime())
            .slice(0, limit)
    }

    searchGroups(query: string): BeneficiaryGroup[] {
        const groups = this.getAllGroups()
        const lowercaseQuery = query.toLowerCase()

        return groups.filter(group =>
            group.name.toLowerCase().includes(lowercaseQuery) ||
            group.recipients.some(recipient =>
                recipient.accountName.toLowerCase().includes(lowercaseQuery) ||
                recipient.bankName.toLowerCase().includes(lowercaseQuery)
            )
        )
    }

    exportGroup(id: string): string | null {
        const group = this.getGroupById(id)
        if (!group) return null

        return JSON.stringify(group, null, 2)
    }

    importGroup(jsonData: string): BeneficiaryGroup | null {
        try {
            const group = JSON.parse(jsonData) as BeneficiaryGroup

            // Validate structure
            if (!group.name || !Array.isArray(group.recipients)) {
                throw new Error('Invalid group structure')
            }

            // Generate new ID and save
            const newGroup = {
                ...group,
                id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                lastUsed: undefined
            }

            const groups = this.getAllGroups()
            groups.push(newGroup)
            this.saveGroups(groups)

            return newGroup
        } catch (error) {
            console.error('Error importing group:', error)
            return null
        }
    }

    private saveGroups(groups: BeneficiaryGroup[]): void {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(groups))
        } catch (error) {
            console.error('Error saving beneficiary groups:', error)
        }
    }

    // Utility methods
    getTotalRecipients(): number {
        const groups = this.getAllGroups()
        return groups.reduce((total, group) => total + group.totalRecipients, 0)
    }

    getGroupsCount(): number {
        return this.getAllGroups().length
    }

    clearAllGroups(): void {
        localStorage.removeItem(this.storageKey)
    }
}

export const beneficiaryGroupService = new BeneficiaryGroupService()
export default beneficiaryGroupService

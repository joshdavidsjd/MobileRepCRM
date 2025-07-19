import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Building, Globe, Phone, MapPin, Users, DollarSign, Filter, CreditCard as Edit, Trash2, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useData, Account } from '@/contexts/DataContext';
import { router } from 'expo-router';
import AccountForm from '@/components/forms/AccountForm';

const AccountCard = ({ account, onPress, onEdit, onDelete }: any) => {
  const [showMenu, setShowMenu] = useState(false);
  const { getAccountContacts, getAccountOpportunities } = useData();
  
  const contacts = getAccountContacts(account.id);
  const opportunities = getAccountOpportunities(account.id);
  const totalValue = opportunities.reduce((sum, opp) => sum + parseInt(opp.value.replace('k', '')), 0);

  return (
    <TouchableOpacity style={styles.accountCard} onPress={() => onPress(account)}>
      <View style={styles.accountHeader}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountName}>{account.name}</Text>
          <Text style={styles.accountIndustry}>{account.industry}</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.accountDetails}>
        {account.website && (
          <View style={styles.accountMeta}>
            <Globe size={14} color="#6b7280" />
            <Text style={styles.metaText}>{account.website.replace('https://', '')}</Text>
          </View>
        )}
        <View style={styles.accountMeta}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.metaText}>{account.city}, {account.state}</Text>
        </View>
        {account.employees && (
          <View style={styles.accountMeta}>
            <Users size={14} color="#6b7280" />
            <Text style={styles.metaText}>{account.employees} employees</Text>
          </View>
        )}
      </View>

      <View style={styles.accountStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{contacts.length}</Text>
          <Text style={styles.statLabel}>Contacts</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{opportunities.length}</Text>
          <Text style={styles.statLabel}>Opportunities</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>${totalValue}k</Text>
          <Text style={styles.statLabel}>Pipeline</Text>
        </View>
      </View>

      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuModal}>
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onEdit(account);
              }}
            >
              <Edit size={20} color="#2563eb" />
              <Text style={styles.menuItemText}>Edit Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                onDelete(account);
              }}
            >
              <Trash2 size={20} color="#dc2626" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default function Accounts() {
  const { accounts, deleteAccount } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | undefined>();

  const filteredAccounts = accounts.filter(account => 
    account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAccountPress = (account: Account) => {
    router.push(`/account-details/${account.id}`);
  };

  const handleEditAccount = (account: Account) => {
    setEditingAccount(account);
    setShowForm(true);
  };

  const handleDeleteAccount = (account: Account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${account.name}? This will also delete all related contacts and activities.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteAccount(account.id);
            Alert.alert('Success', 'Account deleted successfully');
          }
        }
      ]
    );
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAccount(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accounts ({filteredAccounts.length})</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowForm(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search accounts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.accountsList} showsVerticalScrollIndicator={false}>
        {filteredAccounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Building size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No accounts found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery 
                ? 'Try adjusting your search terms'
                : 'Add your first account to get started'
              }
            </Text>
            {!searchQuery && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add Account</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredAccounts.map((account) => (
            <AccountCard 
              key={account.id} 
              account={account} 
              onPress={handleAccountPress}
              onEdit={handleEditAccount}
              onDelete={handleDeleteAccount}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AccountForm
          account={editingAccount}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  filterButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  accountsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  accountIndustry: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  menuButton: {
    padding: 4,
  },
  accountDetails: {
    gap: 8,
    marginBottom: 16,
  },
  accountMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  accountStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModal: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderRadius: 8,
  },
  menuItemDanger: {
    backgroundColor: '#fef2f2',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  menuItemTextDanger: {
    color: '#dc2626',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
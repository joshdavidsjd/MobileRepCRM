import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, User, Mail, Phone, Building, Star, Filter, CreditCard as Edit, Trash2, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useData, Contact } from '@/contexts/DataContext';
import { router } from 'expo-router';
import ContactForm from '@/components/forms/ContactForm';

const ContactCard = ({ contact, onPress, onEdit, onDelete }: any) => {
  const [showMenu, setShowMenu] = useState(false);
  const { getAccount } = useData();
  
  const account = getAccount(contact.accountId);

  return (
    <TouchableOpacity style={styles.contactCard} onPress={() => onPress(contact)}>
      <View style={styles.contactHeader}>
        <View style={styles.contactInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.contactName}>{contact.name}</Text>
            {contact.isPrimary && (
              <View style={styles.primaryBadge}>
                <Star size={12} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.primaryText}>Primary</Text>
              </View>
            )}
          </View>
          <Text style={styles.contactTitle}>{contact.title}</Text>
          <Text style={styles.contactCompany}>{account?.name}</Text>
        </View>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => setShowMenu(true)}
        >
          <MoreVertical size={20} color="#64748b" />
        </TouchableOpacity>
      </View>

      <View style={styles.contactDetails}>
        <View style={styles.contactMeta}>
          <Mail size={14} color="#6b7280" />
          <Text style={styles.metaText}>{contact.email}</Text>
        </View>
        {contact.phone && (
          <View style={styles.contactMeta}>
            <Phone size={14} color="#6b7280" />
            <Text style={styles.metaText}>{contact.phone}</Text>
          </View>
        )}
        {contact.department && (
          <View style={styles.contactMeta}>
            <Building size={14} color="#6b7280" />
            <Text style={styles.metaText}>{contact.department}</Text>
          </View>
        )}
      </View>

      <View style={styles.contactActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Phone size={16} color="#2563eb" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Mail size={16} color="#2563eb" />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
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
                onEdit(contact);
              }}
            >
              <Edit size={20} color="#2563eb" />
              <Text style={styles.menuItemText}>Edit Contact</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                onDelete(contact);
              }}
            >
              <Trash2 size={20} color="#dc2626" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete Contact</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

export default function Contacts() {
  const { contacts, deleteContact, accounts } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | undefined>();

  const accountOptions = ['All', ...accounts.map(account => account.name)];

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedAccount === 'All') return matchesSearch;
    
    const account = accounts.find(acc => acc.id === contact.accountId);
    return matchesSearch && account?.name === selectedAccount;
  });

  const handleContactPress = (contact: Contact) => {
    router.push(`/contact-details/${contact.id}`);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleDeleteContact = (contact: Contact) => {
    Alert.alert(
      'Delete Contact',
      `Are you sure you want to delete ${contact.name}? This will also delete all related activities.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteContact(contact.id);
            Alert.alert('Success', 'Contact deleted successfully');
          }
        }
      ]
    );
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingContact(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Contacts ({filteredContacts.length})</Text>
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
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {accountOptions.map((account) => (
            <TouchableOpacity
              key={account}
              style={[
                styles.filterChip,
                selectedAccount === account && styles.filterChipActive
              ]}
              onPress={() => setSelectedAccount(account)}
            >
              <Text style={[
                styles.filterChipText,
                selectedAccount === account && styles.filterChipTextActive
              ]}>
                {account}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.contactsList} showsVerticalScrollIndicator={false}>
        {filteredContacts.length === 0 ? (
          <View style={styles.emptyState}>
            <User size={48} color="#9ca3af" />
            <Text style={styles.emptyStateTitle}>No contacts found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedAccount !== 'All'
                ? 'Try adjusting your search or filters'
                : 'Add your first contact to get started'
              }
            </Text>
            {!searchQuery && selectedAccount === 'All' && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredContacts.map((contact) => (
            <ContactCard 
              key={contact.id} 
              contact={contact} 
              onPress={handleContactPress}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ContactForm
          contact={editingContact}
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
    marginBottom: 16,
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  contactsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contactCard: {
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
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  contactName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  primaryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  primaryText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#d97706',
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  contactCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  menuButton: {
    padding: 4,
  },
  contactDetails: {
    gap: 8,
    marginBottom: 16,
  },
  contactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
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
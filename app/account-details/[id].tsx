import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Building, Globe, Phone, MapPin, Users, DollarSign, CreditCard as Edit, Trash2, Plus, Mail } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import AccountForm from '@/components/forms/AccountForm';
import ActivityTimeline from '@/components/ActivityTimeline';

const InfoCard = ({ title, children }: any) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoCardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ icon: Icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.infoRowLeft}>
      <Icon size={16} color="#6b7280" />
      <Text style={styles.infoRowLabel}>{label}</Text>
    </View>
    <Text style={styles.infoRowValue}>{value}</Text>
  </View>
);

const ContactItem = ({ contact, onPress }: any) => (
  <TouchableOpacity style={styles.contactItem} onPress={onPress}>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{contact.name}</Text>
      <Text style={styles.contactTitle}>{contact.title}</Text>
      <Text style={styles.contactEmail}>{contact.email}</Text>
    </View>
    {contact.isPrimary && (
      <View style={styles.primaryBadge}>
        <Text style={styles.primaryText}>Primary</Text>
      </View>
    )}
  </TouchableOpacity>
);

const OpportunityItem = ({ opportunity, onPress }: any) => (
  <TouchableOpacity style={styles.opportunityItem} onPress={onPress}>
    <View style={styles.opportunityInfo}>
      <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
      <Text style={styles.opportunityStage}>{opportunity.stage}</Text>
    </View>
    <View style={styles.opportunityValue}>
      <Text style={styles.opportunityAmount}>${opportunity.value}</Text>
      <Text style={styles.opportunityProbability}>{opportunity.winProbability}%</Text>
    </View>
  </TouchableOpacity>
);

export default function AccountDetails() {
  const { id } = useLocalSearchParams();
  const { getAccount, deleteAccount, getAccountContacts, getAccountOpportunities } = useData();
  const [showEditForm, setShowEditForm] = useState(false);

  const account = getAccount(id as string);
  const contacts = getAccountContacts(id as string);
  const opportunities = getAccountOpportunities(id as string);

  if (!account) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Account not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
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
            router.back();
          }
        }
      ]
    );
  };

  const totalOpportunityValue = opportunities.reduce((sum, opp) => sum + parseInt(opp.value.replace('k', '')), 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowEditForm(true)}>
            <Edit size={20} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleDelete}>
            <Trash2 size={20} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Header */}
        <View style={styles.accountHeader}>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{account.name}</Text>
            <Text style={styles.accountIndustry}>{account.industry}</Text>
            {account.website && (
              <Text style={styles.accountWebsite}>{account.website.replace('https://', '')}</Text>
            )}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <Users size={20} color="#2563eb" />
            <Text style={styles.metricValue}>{contacts.length}</Text>
            <Text style={styles.metricLabel}>Contacts</Text>
          </View>
          <View style={styles.metricCard}>
            <DollarSign size={20} color="#16a34a" />
            <Text style={styles.metricValue}>{opportunities.length}</Text>
            <Text style={styles.metricLabel}>Opportunities</Text>
          </View>
          <View style={styles.metricCard}>
            <DollarSign size={20} color="#ea580c" />
            <Text style={styles.metricValue}>${totalOpportunityValue}k</Text>
            <Text style={styles.metricLabel}>Pipeline Value</Text>
          </View>
        </View>

        {/* Company Information */}
        <InfoCard title="Company Information">
          <InfoRow icon={Building} label="Industry" value={account.industry} />
          {account.phone && <InfoRow icon={Phone} label="Phone" value={account.phone} />}
          {account.website && <InfoRow icon={Globe} label="Website" value={account.website.replace('https://', '')} />}
          {account.employees && <InfoRow icon={Users} label="Employees" value={account.employees.toLocaleString()} />}
          {account.revenue && <InfoRow icon={DollarSign} label="Revenue" value={account.revenue} />}
        </InfoCard>

        {/* Address */}
        {(account.address || account.city) && (
          <InfoCard title="Address">
            {account.address && <InfoRow icon={MapPin} label="Address" value={account.address} />}
            {account.city && (
              <InfoRow 
                icon={MapPin} 
                label="Location" 
                value={`${account.city}${account.state ? `, ${account.state}` : ''}${account.country ? `, ${account.country}` : ''}`} 
              />
            )}
          </InfoCard>
        )}

        {/* Description */}
        {account.description && (
          <InfoCard title="Description">
            <Text style={styles.descriptionText}>{account.description}</Text>
          </InfoCard>
        )}

        {/* Contacts */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Contacts ({contacts.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/contact-form')}
          >
            <Plus size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {contacts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No contacts yet</Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                onPress={() => router.push(`/contact-details/${contact.id}`)}
              />
            ))
          )}
        </View>

        {/* Opportunities */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Opportunities ({opportunities.length})</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/opportunity-form')}
          >
            <Plus size={20} color="#2563eb" />
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {opportunities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No opportunities yet</Text>
            </View>
          ) : (
            opportunities.map((opportunity) => (
              <OpportunityItem
                key={opportunity.id}
                opportunity={opportunity}
                onPress={() => router.push(`/opportunity-details/${opportunity.id}`)}
              />
            ))
          )}
        </View>

        {/* Activity Timeline */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activity Timeline</Text>
        </View>
        <View style={styles.listContainer}>
          <ActivityTimeline entityId={id as string} entityType="account" />
        </View>
      </ScrollView>

      <Modal
        visible={showEditForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <AccountForm
          account={account}
          onClose={() => setShowEditForm(false)}
          onSave={() => setShowEditForm(false)}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  accountHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  accountInfo: {
    alignItems: 'center',
  },
  accountName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  accountIndustry: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 4,
  },
  accountWebsite: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563eb',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  infoCard: {
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
  infoCardTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoRowLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  infoRowValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
    textAlign: 'right',
  },
  descriptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  contactTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 2,
  },
  contactEmail: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  primaryBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  primaryText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#d97706',
  },
  opportunityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  opportunityStage: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  opportunityValue: {
    alignItems: 'flex-end',
  },
  opportunityAmount: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
    marginBottom: 2,
  },
  opportunityProbability: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
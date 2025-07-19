import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Building, Users, Plus, Search, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import { useData } from '@/contexts/DataContext';

const QuickStatsCard = ({ title, value, subtitle, icon: Icon, color, onPress }: any) => (
  <TouchableOpacity style={styles.statsCard} onPress={onPress}>
    <View style={[styles.statsIcon, { backgroundColor: color + '20' }]}>
      <Icon size={24} color={color} />
    </View>
    <View style={styles.statsContent}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={styles.statsSubtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

const RecentItem = ({ type, name, company, onPress }: any) => (
  <TouchableOpacity style={styles.recentItem} onPress={onPress}>
    <View style={[styles.recentIcon, { backgroundColor: type === 'account' ? '#eff6ff' : '#f0fdf4' }]}>
      {type === 'account' ? (
        <Building size={16} color="#2563eb" />
      ) : (
        <Users size={16} color="#16a34a" />
      )}
    </View>
    <View style={styles.recentContent}>
      <Text style={styles.recentName}>{name}</Text>
      <Text style={styles.recentCompany}>{company}</Text>
    </View>
  </TouchableOpacity>
);

export default function CRM() {
  const { accounts, contacts, getAccountContacts } = useData();
  const [activeTab, setActiveTab] = useState<'accounts' | 'contacts'>('accounts');

  // Calculate stats
  const totalAccounts = accounts.length;
  const totalContacts = contacts.length;
  const primaryContacts = contacts.filter(contact => contact.isPrimary).length;

  // Get recent items
  const recentAccounts = accounts.slice(0, 3);
  const recentContacts = contacts.slice(0, 3);

  const handleAccountPress = (accountId: string) => {
    router.push(`/account-details/${accountId}`);
  };

  const handleContactPress = (contactId: string) => {
    router.push(`/contact-details/${contactId}`);
  };

  const navigateToAccounts = () => {
    router.push('/accounts');
  };

  const navigateToContacts = () => {
    router.push('/contacts');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CRM</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.searchButton}>
            <Search size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <QuickStatsCard
            title="Accounts"
            value={totalAccounts}
            subtitle="Active companies"
            icon={Building}
            color="#2563eb"
            onPress={navigateToAccounts}
          />
          <QuickStatsCard
            title="Contacts"
            value={totalContacts}
            subtitle={`${primaryContacts} primary`}
            icon={Users}
            color="#16a34a"
            onPress={navigateToContacts}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/account-form')}
            >
              <View style={styles.actionIcon}>
                <Building size={20} color="#2563eb" />
              </View>
              <Text style={styles.actionTitle}>Add Account</Text>
              <Text style={styles.actionSubtitle}>Create new company</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/contact-form')}
            >
              <View style={styles.actionIcon}>
                <Users size={20} color="#16a34a" />
              </View>
              <Text style={styles.actionTitle}>Add Contact</Text>
              <Text style={styles.actionSubtitle}>Create new contact</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'accounts' && styles.tabActive]}
            onPress={() => setActiveTab('accounts')}
          >
            <Text style={[styles.tabText, activeTab === 'accounts' && styles.tabTextActive]}>
              Recent Accounts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'contacts' && styles.tabActive]}
            onPress={() => setActiveTab('contacts')}
          >
            <Text style={[styles.tabText, activeTab === 'contacts' && styles.tabTextActive]}>
              Recent Contacts
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Items */}
        <View style={styles.recentSection}>
          {activeTab === 'accounts' ? (
            <>
              {recentAccounts.map((account) => (
                <RecentItem
                  key={account.id}
                  type="account"
                  name={account.name}
                  company={`${account.industry} • ${getAccountContacts(account.id).length} contacts`}
                  onPress={() => handleAccountPress(account.id)}
                />
              ))}
              <TouchableOpacity style={styles.viewAllButton} onPress={navigateToAccounts}>
                <Text style={styles.viewAllText}>View All Accounts</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {recentContacts.map((contact) => {
                const account = accounts.find(acc => acc.id === contact.accountId);
                return (
                  <RecentItem
                    key={contact.id}
                    type="contact"
                    name={contact.name}
                    company={`${contact.title} • ${account?.name}`}
                    onPress={() => handleContactPress(contact.id)}
                  />
                );
              })}
              <TouchableOpacity style={styles.viewAllButton} onPress={navigateToContacts}>
                <Text style={styles.viewAllText}>View All Contacts</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
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
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  searchButton: {
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
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsIcon: {
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statsContent: {
    flex: 1,
  },
  statsValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  statsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  statsSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  recentSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  recentItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentIcon: {
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recentContent: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  recentCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  viewAllButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  viewAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
});
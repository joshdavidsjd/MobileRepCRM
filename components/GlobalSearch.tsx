import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Search, X, Users, Target, Building, User } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';

interface GlobalSearchProps {
  visible: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ visible, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({
    leads: [],
    opportunities: [],
    accounts: [],
    contacts: []
  });
  const { globalSearch } = useData();

  useEffect(() => {
    if (query.length > 1) {
      const searchResults = globalSearch(query);
      setResults(searchResults);
    } else {
      setResults({ leads: [], opportunities: [], accounts: [], contacts: [] });
    }
  }, [query]);

  const handleResultPress = (type: string, id: string) => {
    onClose();
    setQuery('');
    
    switch (type) {
      case 'lead':
        router.push(`/lead-details/${id}`);
        break;
      case 'opportunity':
        router.push(`/opportunity-details/${id}`);
        break;
      case 'account':
        router.push(`/account-details/${id}`);
        break;
      case 'contact':
        router.push(`/contact-details/${id}`);
        break;
    }
  };

  const ResultItem = ({ item, type, icon: Icon, onPress }: any) => (
    <TouchableOpacity style={styles.resultItem} onPress={onPress}>
      <View style={styles.resultIcon}>
        <Icon size={16} color="#2563eb" />
      </View>
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle}>
          {type === 'lead' || type === 'contact' ? item.name : 
           type === 'opportunity' ? item.title : item.name}
        </Text>
        <Text style={styles.resultSubtitle}>
          {type === 'lead' ? `${item.company} • ${item.status}` :
           type === 'opportunity' ? `${item.company} • ${item.stage}` :
           type === 'account' ? `${item.industry}` :
           `${item.title} • ${item.company}`}
        </Text>
      </View>
      <Text style={styles.resultType}>{type}</Text>
    </TouchableOpacity>
  );

  const totalResults = results.leads.length + results.opportunities.length + 
                      results.accounts.length + results.contacts.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#6b7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search across all records..."
              value={query}
              onChangeText={setQuery}
              autoFocus
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
          {query.length > 1 && totalResults === 0 && (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No results found for "{query}"</Text>
            </View>
          )}

          {results.leads.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Leads ({results.leads.length})</Text>
              {results.leads.map((lead: any) => (
                <ResultItem
                  key={lead.id}
                  item={lead}
                  type="lead"
                  icon={Users}
                  onPress={() => handleResultPress('lead', lead.id)}
                />
              ))}
            </View>
          )}

          {results.opportunities.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Opportunities ({results.opportunities.length})</Text>
              {results.opportunities.map((opportunity: any) => (
                <ResultItem
                  key={opportunity.id}
                  item={opportunity}
                  type="opportunity"
                  icon={Target}
                  onPress={() => handleResultPress('opportunity', opportunity.id)}
                />
              ))}
            </View>
          )}

          {results.accounts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accounts ({results.accounts.length})</Text>
              {results.accounts.map((account: any) => (
                <ResultItem
                  key={account.id}
                  item={account}
                  type="account"
                  icon={Building}
                  onPress={() => handleResultPress('account', account.id)}
                />
              ))}
            </View>
          )}

          {results.contacts.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contacts ({results.contacts.length})</Text>
              {results.contacts.map((contact: any) => (
                <ResultItem
                  key={contact.id}
                  item={contact}
                  type="contact"
                  icon={User}
                  onPress={() => handleResultPress('contact', contact.id)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
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
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginLeft: 12,
  },
  closeButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  results: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
    marginTop: 8,
  },
  resultItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  resultIcon: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  resultSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  resultType: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    textTransform: 'capitalize',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});
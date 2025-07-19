import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Star, Phone, Mail, Building, MapPin, Filter, CreditCard as Edit, Trash2, MoveVertical as MoreVertical, ArrowUpDown } from 'lucide-react-native';
import { useData, Lead } from '@/contexts/DataContext';
import { router } from 'expo-router';
import LeadForm from '@/components/forms/LeadForm';
import AdvancedFilters from '@/components/AdvancedFilters';

const LeadCard = ({ lead, onPress, onEdit, onDelete, onConvert }: any) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <TouchableOpacity style={styles.leadCard} onPress={() => onPress(lead)}>
      <View style={styles.leadHeader}>
        <View style={styles.leadInfo}>
          <Text style={styles.leadName}>{lead.name}</Text>
          <Text style={styles.leadCompany}>{lead.company}</Text>
        </View>
        <View style={styles.leadActions}>
          <View style={styles.leadScore}>
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.scoreText}>{lead.score.toFixed(1)}</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
          >
            <MoreVertical size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.leadDetails}>
        <View style={styles.leadMeta}>
          <Building size={14} color="#6b7280" />
          <Text style={styles.metaText}>{lead.industry}</Text>
        </View>
        <View style={styles.leadMeta}>
          <MapPin size={14} color="#6b7280" />
          <Text style={styles.metaText}>{lead.location}</Text>
        </View>
      </View>

      <View style={styles.aiInsight}>
        <Text style={styles.aiInsightLabel}>AI Insight:</Text>
        <Text style={styles.aiInsightText}>{lead.aiInsight}</Text>
      </View>

      <View style={styles.leadFooter}>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Call', lead.phone)}>
          <Phone size={16} color="#2563eb" />
          <Text style={styles.actionText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => console.log('Email', lead.email)}>
          <Mail size={16} color="#2563eb" />
          <Text style={styles.actionText}>Email</Text>
        </TouchableOpacity>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) }]}>
          <Text style={[styles.statusText, { color: getStatusTextColor(lead.status) }]}>
            {lead.status}
          </Text>
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
                onEdit(lead);
              }}
            >
              <Edit size={20} color="#2563eb" />
              <Text style={styles.menuItemText}>Edit Lead</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onConvert(lead);
              }}
            >
              <Star size={20} color="#16a34a" />
              <Text style={styles.menuItemText}>Convert to Opportunity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                onDelete(lead);
              }}
            >
              <Trash2 size={20} color="#dc2626" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete Lead</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Hot': return '#fee2e2';
    case 'Warm': return '#fef3c7';
    case 'Cold': return '#e0f2fe';
    default: return '#f3f4f6';
  }
};

const getStatusTextColor = (status: string) => {
  switch (status) {
    case 'Hot': return '#dc2626';
    case 'Warm': return '#d97706';
    case 'Cold': return '#0284c7';
    default: return '#6b7280';
  }
};

export default function Leads() {
  const { leads, deleteLead, convertLeadToOpportunity } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    valueRange: { min: '', max: '' },
    status: [],
    stage: [],
    industry: [],
    sortBy: 'createdAt',
    sortOrder: 'desc' as 'asc' | 'desc'
  });

  const filters = ['All', 'Hot', 'Warm', 'Cold'];

  const applyFilters = (leads: Lead[]) => {
    let filtered = [...leads];

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (selectedFilter !== 'All') {
      filtered = filtered.filter(lead => lead.status === selectedFilter);
    }

    // Apply advanced filters
    if (filters.status.length > 0) {
      filtered = filtered.filter(lead => filters.status.includes(lead.status));
    }

    if (filters.industry.length > 0) {
      filtered = filtered.filter(lead => filters.industry.includes(lead.industry));
    }

    if (filters.dateRange.start && filters.dateRange.end) {
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      filtered = filtered.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        return leadDate >= startDate && leadDate <= endDate;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'score':
          aValue = a.score;
          bValue = b.score;
          break;
        case 'company':
          aValue = a.company.toLowerCase();
          bValue = b.company.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  };

  const filteredLeads = applyFilters(leads);

  const handleApplyFilters = (newFilters: any) => {
    setFilters(newFilters);
  };

  const oldFilteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'All' || lead.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleLeadPress = (lead: Lead) => {
    router.push(`/lead-details/${lead.id}`);
  };

  const handleEditLead = (lead: Lead) => {
    setEditingLead(lead);
    setShowForm(true);
  };

  const handleDeleteLead = (lead: Lead) => {
    Alert.alert(
      'Delete Lead',
      `Are you sure you want to delete ${lead.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteLead(lead.id);
            Alert.alert('Success', 'Lead deleted successfully');
          }
        }
      ]
    );
  };

  const handleConvertLead = (lead: Lead) => {
    Alert.alert(
      'Convert to Opportunity',
      `Convert ${lead.name} from ${lead.company} to an opportunity?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Convert', 
          onPress: () => {
            convertLeadToOpportunity(lead.id, {
              title: `${lead.company} Opportunity`,
              value: '50k', // Default value
              stage: 'Discovery',
              closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              winProbability: 50,
              urgent: false
            });
            Alert.alert('Success', 'Lead converted to opportunity successfully!');
          }
        }
      ]
    );
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingLead(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Leads ({filteredLeads.length})</Text>
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
            placeholder="Search leads..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowAdvancedFilters(true)}
        >
          <Filter size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                selectedFilter === filter && styles.filterChipActive
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter && styles.filterChipTextActive
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.leadsList} showsVerticalScrollIndicator={false}>
        {filteredLeads.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No leads found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery || selectedFilter !== 'All' 
                ? 'Try adjusting your search or filters'
                : 'Add your first lead to get started'
              }
            </Text>
            {!searchQuery && selectedFilter === 'All' && (
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add Lead</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredLeads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onPress={handleLeadPress}
              onEdit={handleEditLead}
              onDelete={handleDeleteLead}
              onConvert={handleConvertLead}
            />
          ))
        )}
      </ScrollView>

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <LeadForm
          lead={editingLead}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
        />
      </Modal>

      <AdvancedFilters
        visible={showAdvancedFilters}
        onClose={() => setShowAdvancedFilters(false)}
        onApply={handleApplyFilters}
        type="leads"
        currentFilters={filters}
      />
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
  leadsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  leadCard: {
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
  leadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leadInfo: {
    flex: 1,
  },
  leadName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  leadCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  leadActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  leadScore: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#d97706',
  },
  menuButton: {
    padding: 4,
  },
  leadDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  leadMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  aiInsight: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  aiInsightLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#0284c7',
    marginBottom: 4,
  },
  aiInsightText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
    lineHeight: 18,
  },
  leadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
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
  statusBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
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
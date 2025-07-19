import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { X, Filter, Calendar, DollarSign, Tag, TrendingUp } from 'lucide-react-native';

interface FilterOptions {
  dateRange: { start: string; end: string };
  valueRange: { min: string; max: string };
  status: string[];
  stage: string[];
  industry: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface AdvancedFiltersProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  type: 'leads' | 'opportunities' | 'accounts' | 'contacts';
  currentFilters: FilterOptions;
}

export default function AdvancedFilters({ 
  visible, 
  onClose, 
  onApply, 
  type, 
  currentFilters 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<FilterOptions>(currentFilters);

  const statusOptions = {
    leads: ['Hot', 'Warm', 'Cold'],
    opportunities: ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'],
    accounts: [],
    contacts: []
  };

  const sortOptions = {
    leads: [
      { value: 'name', label: 'Name' },
      { value: 'score', label: 'Score' },
      { value: 'createdAt', label: 'Date Created' },
      { value: 'company', label: 'Company' }
    ],
    opportunities: [
      { value: 'title', label: 'Title' },
      { value: 'value', label: 'Value' },
      { value: 'closeDate', label: 'Close Date' },
      { value: 'winProbability', label: 'Win Probability' },
      { value: 'createdAt', label: 'Date Created' }
    ],
    accounts: [
      { value: 'name', label: 'Name' },
      { value: 'industry', label: 'Industry' },
      { value: 'employees', label: 'Employee Count' },
      { value: 'createdAt', label: 'Date Created' }
    ],
    contacts: [
      { value: 'name', label: 'Name' },
      { value: 'title', label: 'Title' },
      { value: 'createdAt', label: 'Date Created' }
    ]
  };

  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
    'Education', 'Real Estate', 'Consulting', 'Media', 'Other'
  ];

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterOptions = {
      dateRange: { start: '', end: '' },
      valueRange: { min: '', max: '' },
      status: [],
      stage: [],
      industry: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
  };

  const toggleArrayFilter = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Advanced Filters</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Date Range */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Calendar size={20} color="#2563eb" />
              <Text style={styles.sectionTitle}>Date Range</Text>
            </View>
            <View style={styles.dateInputs}>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>From</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  value={filters.dateRange.start}
                  onChangeText={(value) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, start: value }
                  }))}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.inputLabel}>To</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/DD/YYYY"
                  value={filters.dateRange.end}
                  onChangeText={(value) => setFilters(prev => ({
                    ...prev,
                    dateRange: { ...prev.dateRange, end: value }
                  }))}
                />
              </View>
            </View>
          </View>

          {/* Value Range (for opportunities) */}
          {type === 'opportunities' && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <DollarSign size={20} color="#16a34a" />
                <Text style={styles.sectionTitle}>Value Range</Text>
              </View>
              <View style={styles.dateInputs}>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Min Value</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    value={filters.valueRange.min}
                    keyboardType="numeric"
                    onChangeText={(value) => setFilters(prev => ({
                      ...prev,
                      valueRange: { ...prev.valueRange, min: value }
                    }))}
                  />
                </View>
                <View style={styles.dateInput}>
                  <Text style={styles.inputLabel}>Max Value</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1000000"
                    value={filters.valueRange.max}
                    keyboardType="numeric"
                    onChangeText={(value) => setFilters(prev => ({
                      ...prev,
                      valueRange: { ...prev.valueRange, max: value }
                    }))}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Status/Stage */}
          {statusOptions[type].length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Tag size={20} color="#ea580c" />
                <Text style={styles.sectionTitle}>
                  {type === 'opportunities' ? 'Stage' : 'Status'}
                </Text>
              </View>
              <View style={styles.chipContainer}>
                {statusOptions[type].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.chip,
                      filters.status.includes(option) && styles.chipActive
                    ]}
                    onPress={() => toggleArrayFilter('status', option)}
                  >
                    <Text style={[
                      styles.chipText,
                      filters.status.includes(option) && styles.chipTextActive
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Industry */}
          {(type === 'leads' || type === 'accounts') && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Tag size={20} color="#7c3aed" />
                <Text style={styles.sectionTitle}>Industry</Text>
              </View>
              <View style={styles.chipContainer}>
                {industryOptions.map((industry) => (
                  <TouchableOpacity
                    key={industry}
                    style={[
                      styles.chip,
                      filters.industry.includes(industry) && styles.chipActive
                    ]}
                    onPress={() => toggleArrayFilter('industry', industry)}
                  >
                    <Text style={[
                      styles.chipText,
                      filters.industry.includes(industry) && styles.chipTextActive
                    ]}>
                      {industry}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Sort Options */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#0284c7" />
              <Text style={styles.sectionTitle}>Sort By</Text>
            </View>
            <View style={styles.chipContainer}>
              {sortOptions[type].map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chip,
                    filters.sortBy === option.value && styles.chipActive
                  ]}
                  onPress={() => setFilters(prev => ({ ...prev, sortBy: option.value }))}
                >
                  <Text style={[
                    styles.chipText,
                    filters.sortBy === option.value && styles.chipTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.sortOrder}>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  filters.sortOrder === 'asc' && styles.sortButtonActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'asc' }))}
              >
                <Text style={[
                  styles.sortButtonText,
                  filters.sortOrder === 'asc' && styles.sortButtonTextActive
                ]}>
                  Ascending
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.sortButton,
                  filters.sortOrder === 'desc' && styles.sortButtonActive
                ]}
                onPress={() => setFilters(prev => ({ ...prev, sortOrder: 'desc' }))}
              >
                <Text style={[
                  styles.sortButtonText,
                  filters.sortOrder === 'desc' && styles.sortButtonTextActive
                ]}>
                  Descending
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  dateInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  chipTextActive: {
    color: '#ffffff',
  },
  sortOrder: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  sortButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sortButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  sortButtonTextActive: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  resetButton: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
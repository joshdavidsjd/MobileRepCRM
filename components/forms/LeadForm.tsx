import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, User, Mail, Phone, Building, MapPin, Tag, FileText } from 'lucide-react-native';
import { useData, Lead } from '@/contexts/DataContext';

interface LeadFormProps {
  lead?: Lead;
  onClose: () => void;
  onSave?: (lead: Lead) => void;
}

export default function LeadForm({ lead, onClose, onSave }: LeadFormProps) {
  const { addLead, updateLead } = useData();
  const isEditing = !!lead;

  const [formData, setFormData] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    industry: lead?.industry || '',
    location: lead?.location || '',
    status: lead?.status || 'Cold' as const,
    source: lead?.source || '',
    notes: lead?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const leadData = {
      ...formData,
      score: Math.random() * 10, // Generate random score for demo
      aiInsight: generateAIInsight(formData.status, formData.industry)
    };

    if (isEditing && lead) {
      updateLead(lead.id, leadData);
      onSave?.(lead);
    } else {
      addLead(leadData);
    }

    Alert.alert(
      'Success',
      `Lead ${isEditing ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const generateAIInsight = (status: string, industry: string) => {
    const insights = {
      Hot: [
        'High engagement detected. Ready for immediate follow-up.',
        'Strong buying signals. Recommend scheduling demo.',
        'Decision maker identified. Move to proposal stage.'
      ],
      Warm: [
        'Moderate interest shown. Continue nurturing relationship.',
        'Budget discussions initiated. Focus on value proposition.',
        'Technical evaluation in progress. Provide detailed specs.'
      ],
      Cold: [
        'Early stage contact. Focus on relationship building.',
        'Need assessment required. Schedule discovery call.',
        'Long sales cycle expected. Maintain regular touchpoints.'
      ]
    };

    const statusInsights = insights[status as keyof typeof insights];
    return statusInsights[Math.floor(Math.random() * statusInsights.length)];
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <Text style={styles.title}>
          {isEditing ? 'Edit Lead' : 'Add New Lead'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Full name *"
                placeholderTextColor="#94a3b8"
                value={formData.name}
                onChangeText={(value) => updateFormData('name', value)}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

            <View style={styles.inputWrapper}>
              <Mail size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="Email address *"
                placeholderTextColor="#94a3b8"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <View style={styles.inputWrapper}>
              <Phone size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Phone number"
                placeholderTextColor="#94a3b8"
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Company Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Building size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.company && styles.inputError]}
                placeholder="Company name *"
                placeholderTextColor="#94a3b8"
                value={formData.company}
                onChangeText={(value) => updateFormData('company', value)}
              />
            </View>
            {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

            <View style={styles.inputWrapper}>
              <Tag size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Industry"
                placeholderTextColor="#94a3b8"
                value={formData.industry}
                onChangeText={(value) => updateFormData('industry', value)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MapPin size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Location"
                placeholderTextColor="#94a3b8"
                value={formData.location}
                onChangeText={(value) => updateFormData('location', value)}
              />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Status</Text>
          
          <View style={styles.statusButtons}>
            {(['Hot', 'Warm', 'Cold'] as const).map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.statusButton,
                  formData.status === status && styles.statusButtonActive,
                  { backgroundColor: getStatusColor(status, formData.status === status) }
                ]}
                onPress={() => updateFormData('status', status)}
              >
                <Text style={[
                  styles.statusButtonText,
                  formData.status === status && styles.statusButtonTextActive,
                  { color: getStatusTextColor(status, formData.status === status) }
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Tag size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Lead source"
                placeholderTextColor="#94a3b8"
                value={formData.source}
                onChangeText={(value) => updateFormData('source', value)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <FileText size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes"
                placeholderTextColor="#94a3b8"
                value={formData.notes}
                onChangeText={(value) => updateFormData('notes', value)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            style={styles.saveButtonGradient}
          >
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Lead' : 'Create Lead'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const getStatusColor = (status: string, isActive: boolean) => {
  if (isActive) {
    switch (status) {
      case 'Hot': return '#dc2626';
      case 'Warm': return '#d97706';
      case 'Cold': return '#0284c7';
      default: return '#6b7280';
    }
  }
  return '#f3f4f6';
};

const getStatusTextColor = (status: string, isActive: boolean) => {
  if (isActive) return '#ffffff';
  
  switch (status) {
    case 'Hot': return '#dc2626';
    case 'Warm': return '#d97706';
    case 'Cold': return '#0284c7';
    default: return '#6b7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  closeButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    gap: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1e293b',
    paddingVertical: 16,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    marginTop: 4,
    marginLeft: 16,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusButtonActive: {
    borderColor: 'transparent',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  statusButtonTextActive: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  saveButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  saveButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
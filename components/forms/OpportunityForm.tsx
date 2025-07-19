import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Target, Building, User, DollarSign, Calendar, FileText, TrendingUp } from 'lucide-react-native';
import { useData, Opportunity } from '@/contexts/DataContext';

interface OpportunityFormProps {
  opportunity?: Opportunity;
  onClose: () => void;
  onSave?: (opportunity: Opportunity) => void;
}

export default function OpportunityForm({ opportunity, onClose, onSave }: OpportunityFormProps) {
  const { addOpportunity, updateOpportunity } = useData();
  const isEditing = !!opportunity;

  const [formData, setFormData] = useState({
    title: opportunity?.title || '',
    company: opportunity?.company || '',
    contactName: opportunity?.contactName || '',
    value: opportunity?.value || '',
    stage: opportunity?.stage || 'Discovery' as const,
    closeDate: opportunity?.closeDate || '',
    winProbability: opportunity?.winProbability?.toString() || '50',
    urgent: opportunity?.urgent || false,
    description: opportunity?.description || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const stages = ['Discovery', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] as const;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
    }

    if (!formData.closeDate.trim()) {
      newErrors.closeDate = 'Close date is required';
    }

    const probability = parseInt(formData.winProbability);
    if (isNaN(probability) || probability < 0 || probability > 100) {
      newErrors.winProbability = 'Win probability must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const opportunityData = {
      ...formData,
      winProbability: parseInt(formData.winProbability),
      aiAnalysis: generateAIAnalysis(formData.stage, parseInt(formData.winProbability))
    };

    if (isEditing && opportunity) {
      updateOpportunity(opportunity.id, opportunityData);
      onSave?.(opportunity);
    } else {
      addOpportunity(opportunityData);
    }

    Alert.alert(
      'Success',
      `Opportunity ${isEditing ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const generateAIAnalysis = (stage: string, winProbability: number) => {
    const analyses = {
      Discovery: [
        'Early stage opportunity. Focus on pain point identification.',
        'Relationship building phase. Identify key stakeholders.',
        'Needs assessment required. Schedule discovery calls.'
      ],
      Qualification: [
        'Budget and timeline qualification needed.',
        'Decision-making process clarification required.',
        'Technical requirements gathering in progress.'
      ],
      Proposal: [
        'Proposal stage reached. Strong buying signals detected.',
        'Competitive evaluation likely. Differentiate value proposition.',
        'Decision timeline accelerating. Maintain momentum.'
      ],
      Negotiation: [
        'Final negotiation phase. Price sensitivity expected.',
        'Contract terms discussion. Legal review in progress.',
        'Close to decision. Address final objections.'
      ]
    };

    const stageAnalyses = analyses[stage as keyof typeof analyses] || ['Standard opportunity progression.'];
    let analysis = stageAnalyses[Math.floor(Math.random() * stageAnalyses.length)];

    if (winProbability > 80) {
      analysis += ' High probability of success.';
    } else if (winProbability < 30) {
      analysis += ' Requires significant effort to advance.';
    }

    return analysis;
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStageColor = (stage: string, isActive: boolean) => {
    if (isActive) {
      switch (stage) {
        case 'Discovery': return '#2563eb';
        case 'Qualification': return '#0284c7';
        case 'Proposal': return '#d97706';
        case 'Negotiation': return '#dc2626';
        case 'Closed Won': return '#16a34a';
        case 'Closed Lost': return '#6b7280';
        default: return '#6b7280';
      }
    }
    return '#f3f4f6';
  };

  const getStageTextColor = (stage: string, isActive: boolean) => {
    if (isActive) return '#ffffff';
    
    switch (stage) {
      case 'Discovery': return '#2563eb';
      case 'Qualification': return '#0284c7';
      case 'Proposal': return '#d97706';
      case 'Negotiation': return '#dc2626';
      case 'Closed Won': return '#16a34a';
      case 'Closed Lost': return '#6b7280';
      default: return '#6b7280';
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
          {isEditing ? 'Edit Opportunity' : 'Add New Opportunity'}
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Opportunity Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Target size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Opportunity title *"
                placeholderTextColor="#94a3b8"
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

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
              <User size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.contactName && styles.inputError]}
                placeholder="Contact name *"
                placeholderTextColor="#94a3b8"
                value={formData.contactName}
                onChangeText={(value) => updateFormData('contactName', value)}
              />
            </View>
            {errors.contactName && <Text style={styles.errorText}>{errors.contactName}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <DollarSign size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.value && styles.inputError]}
                placeholder="Deal value (e.g., 250k) *"
                placeholderTextColor="#94a3b8"
                value={formData.value}
                onChangeText={(value) => updateFormData('value', value)}
              />
            </View>
            {errors.value && <Text style={styles.errorText}>{errors.value}</Text>}

            <View style={styles.inputWrapper}>
              <TrendingUp size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.winProbability && styles.inputError]}
                placeholder="Win probability (0-100) *"
                placeholderTextColor="#94a3b8"
                value={formData.winProbability}
                onChangeText={(value) => updateFormData('winProbability', value)}
                keyboardType="numeric"
              />
            </View>
            {errors.winProbability && <Text style={styles.errorText}>{errors.winProbability}</Text>}

            <View style={styles.inputWrapper}>
              <Calendar size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.closeDate && styles.inputError]}
                placeholder="Expected close date *"
                placeholderTextColor="#94a3b8"
                value={formData.closeDate}
                onChangeText={(value) => updateFormData('closeDate', value)}
              />
            </View>
            {errors.closeDate && <Text style={styles.errorText}>{errors.closeDate}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stage</Text>
          
          <View style={styles.stageButtons}>
            {stages.map((stage) => (
              <TouchableOpacity
                key={stage}
                style={[
                  styles.stageButton,
                  formData.stage === stage && styles.stageButtonActive,
                  { backgroundColor: getStageColor(stage, formData.stage === stage) }
                ]}
                onPress={() => updateFormData('stage', stage)}
              >
                <Text style={[
                  styles.stageButtonText,
                  formData.stage === stage && styles.stageButtonTextActive,
                  { color: getStageTextColor(stage, formData.stage === stage) }
                ]}>
                  {stage}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Priority</Text>
          
          <TouchableOpacity
            style={[styles.urgentToggle, formData.urgent && styles.urgentToggleActive]}
            onPress={() => updateFormData('urgent', !formData.urgent)}
          >
            <Text style={[
              styles.urgentToggleText,
              formData.urgent && styles.urgentToggleTextActive
            ]}>
              {formData.urgent ? '🔥 High Priority' : 'Normal Priority'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          
          <View style={styles.inputWrapper}>
            <FileText size={20} color="#64748b" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Opportunity description"
              placeholderTextColor="#94a3b8"
              value={formData.description}
              onChangeText={(value) => updateFormData('description', value)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
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
              {isEditing ? 'Update Opportunity' : 'Create Opportunity'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

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
  stageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  stageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    minWidth: '30%',
  },
  stageButtonActive: {
    borderColor: 'transparent',
  },
  stageButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  stageButtonTextActive: {
    color: '#ffffff',
  },
  urgentToggle: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  urgentToggleActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#dc2626',
  },
  urgentToggleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  urgentToggleTextActive: {
    color: '#dc2626',
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
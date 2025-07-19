import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Activity, User, Building, Calendar, FileText, Phone, Mail, Video, Users } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import { router } from 'expo-router';

const activityTypes = [
  { id: 'call', label: 'Call', icon: Phone, color: '#2563eb' },
  { id: 'email', label: 'Email', icon: Mail, color: '#16a34a' },
  { id: 'meeting', label: 'Meeting', icon: Users, color: '#ea580c' },
  { id: 'demo', label: 'Demo', icon: Video, color: '#7c3aed' },
  { id: 'proposal', label: 'Proposal', icon: FileText, color: '#dc2626' },
  { id: 'follow-up', label: 'Follow-up', icon: Activity, color: '#0284c7' },
];

export default function ActivityFormScreen() {
  const { addActivity, leads, opportunities } = useData();
  
  const [formData, setFormData] = useState({
    type: 'call' as const,
    title: '',
    description: '',
    contactName: '',
    company: '',
    status: 'completed' as const,
    duration: '',
    outcome: 'successful' as const,
    notes: '',
    scheduledDate: '',
    leadId: '',
    opportunityId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = 'Contact name is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const activityData = {
      ...formData,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      outcome: formData.outcome,
      notes: formData.notes,
      scheduledDate: formData.scheduledDate ? new Date(formData.scheduledDate) : undefined,
      completedDate: formData.status === 'completed' ? new Date() : undefined,
    };

    addActivity(activityData);

    Alert.alert(
      'Success',
      'Activity logged successfully!',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectedType = activityTypes.find(type => type.id === formData.type);

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#f8fafc', '#e2e8f0']}
          style={styles.gradient}
        />

        <View style={styles.header}>
          <Text style={styles.title}>Log Activity</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color="#64748b" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Type</Text>
            
            <View style={styles.typeButtons}>
              {activityTypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeButton,
                    formData.type === type.id && styles.typeButtonActive,
                    { backgroundColor: formData.type === type.id ? type.color : '#f3f4f6' }
                  ]}
                  onPress={() => updateFormData('type', type.id)}
                >
                  <type.icon 
                    size={20} 
                    color={formData.type === type.id ? '#ffffff' : type.color} 
                  />
                  <Text style={[
                    styles.typeButtonText,
                    { color: formData.type === type.id ? '#ffffff' : type.color }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Details</Text>
            
            <View style={styles.inputGroup}>
              <View style={styles.inputWrapper}>
                {selectedType && <selectedType.icon size={20} color="#64748b" style={styles.inputIcon} />}
                <TextInput
                  style={[styles.input, errors.title && styles.inputError]}
                  placeholder="Activity title *"
                  placeholderTextColor="#94a3b8"
                  value={formData.title}
                  onChangeText={(value) => updateFormData('title', value)}
                />
              </View>
              {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

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

              <View style={styles.inputWrapper}>
                <Building size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, errors.company && styles.inputError]}
                  placeholder="Company *"
                  placeholderTextColor="#94a3b8"
                  value={formData.company}
                  onChangeText={(value) => updateFormData('company', value)}
                />
              </View>
              {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

              <View style={styles.inputWrapper}>
                <FileText size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.textArea, errors.description && styles.inputError]}
                  placeholder="Activity description *"
                  placeholderTextColor="#94a3b8"
                  value={formData.description}
                  onChangeText={(value) => updateFormData('description', value)}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

              <View style={styles.inputWrapper}>
                <Clock size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Duration (minutes)"
                  placeholderTextColor="#94a3b8"
                  value={formData.duration}
                  onChangeText={(value) => updateFormData('duration', value)}
                  keyboardType="numeric"
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
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            
            <View style={styles.statusButtons}>
              {(['completed', 'pending', 'scheduled'] as const).map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.status === status && styles.statusButtonActive
                  ]}
                  onPress={() => updateFormData('status', status)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === status && styles.statusButtonTextActive
                  ]}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {formData.status === 'completed' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Outcome</Text>
              
              <View style={styles.statusButtons}>
                {(['successful', 'unsuccessful', 'follow-up-needed', 'no-answer'] as const).map((outcome) => (
                  <TouchableOpacity
                    key={outcome}
                    style={[
                      styles.statusButton,
                      formData.outcome === outcome && styles.statusButtonActive
                    ]}
                    onPress={() => updateFormData('outcome', outcome)}
                  >
                    <Text style={[
                      styles.statusButtonText,
                      formData.outcome === outcome && styles.statusButtonTextActive
                    ]}>
                      {outcome.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {formData.status === 'scheduled' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Schedule</Text>
              
              <View style={styles.inputWrapper}>
                <Calendar size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Scheduled date (e.g., Jan 15, 2024)"
                  placeholderTextColor="#94a3b8"
                  value={formData.scheduledDate}
                  onChangeText={(value) => updateFormData('scheduledDate', value)}
                />
              </View>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <LinearGradient
              colors={['#2563eb', '#1d4ed8']}
              style={styles.saveButtonGradient}
            >
              <Text style={styles.saveButtonText}>Log Activity</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
    minWidth: '30%',
    justifyContent: 'center',
  },
  typeButtonActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  typeButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
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
    gap: 8,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statusButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  statusButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
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
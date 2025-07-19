import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { X, User, Mail, Phone, Building, Briefcase, Star, FileText, Link } from 'lucide-react-native';
import { useData, Contact } from '@/contexts/DataContext';

interface ContactFormProps {
  contact?: Contact;
  onClose: () => void;
  onSave?: (contact: Contact) => void;
}

export default function ContactForm({ contact, onClose, onSave }: ContactFormProps) {
  const { addContact, updateContact, accounts } = useData();
  const isEditing = !!contact;

  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    title: contact?.title || '',
    department: contact?.department || '',
    accountId: contact?.accountId || (accounts.length > 0 ? accounts[0].id : ''),
    isPrimary: contact?.isPrimary || false,
    linkedInUrl: contact?.linkedInUrl || '',
    notes: contact?.notes || ''
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Please select an account';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const contactData = {
      ...formData
    };

    if (isEditing && contact) {
      updateContact(contact.id, contactData);
      onSave?.(contact);
    } else {
      addContact(contactData);
    }

    Alert.alert(
      'Success',
      `Contact ${isEditing ? 'updated' : 'created'} successfully!`,
      [{ text: 'OK', onPress: onClose }]
    );
  };

  const updateFormData = (field: string, value: string | boolean) => {
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
          {isEditing ? 'Edit Contact' : 'Add New Contact'}
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
          <Text style={styles.sectionTitle}>Professional Details</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Briefcase size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, errors.title && styles.inputError]}
                placeholder="Job title *"
                placeholderTextColor="#94a3b8"
                value={formData.title}
                onChangeText={(value) => updateFormData('title', value)}
              />
            </View>
            {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            <View style={styles.inputWrapper}>
              <Building size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Department"
                placeholderTextColor="#94a3b8"
                value={formData.department}
                onChangeText={(value) => updateFormData('department', value)}
              />
            </View>

            <View style={styles.pickerWrapper}>
              <Building size={20} color="#64748b" style={styles.inputIcon} />
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerLabel}>Account *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.accountChip,
                        formData.accountId === account.id && styles.accountChipActive
                      ]}
                      onPress={() => updateFormData('accountId', account.id)}
                    >
                      <Text style={[
                        styles.accountChipText,
                        formData.accountId === account.id && styles.accountChipTextActive
                      ]}>
                        {account.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
            {errors.accountId && <Text style={styles.errorText}>{errors.accountId}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Settings</Text>
          
          <TouchableOpacity
            style={[styles.primaryToggle, formData.isPrimary && styles.primaryToggleActive]}
            onPress={() => updateFormData('isPrimary', !formData.isPrimary)}
          >
            <Star size={20} color={formData.isPrimary ? '#fbbf24' : '#9ca3af'} fill={formData.isPrimary ? '#fbbf24' : 'none'} />
            <Text style={[
              styles.primaryToggleText,
              formData.isPrimary && styles.primaryToggleTextActive
            ]}>
              {formData.isPrimary ? 'Primary Contact' : 'Set as Primary Contact'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.inputWrapper}>
              <Link size={20} color="#64748b" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="LinkedIn URL"
                placeholderTextColor="#94a3b8"
                value={formData.linkedInUrl}
                onChangeText={(value) => updateFormData('linkedInUrl', value)}
                autoCapitalize="none"
                keyboardType="url"
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
              {isEditing ? 'Update Contact' : 'Create Contact'}
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
  pickerWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  pickerContainer: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  accountChip: {
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  accountChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  accountChipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  accountChipTextActive: {
    color: '#ffffff',
  },
  primaryToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  primaryToggleActive: {
    backgroundColor: '#fef3c7',
    borderColor: '#fbbf24',
  },
  primaryToggleText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  primaryToggleTextActive: {
    color: '#d97706',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#dc2626',
    marginTop: 4,
    marginLeft: 16,
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
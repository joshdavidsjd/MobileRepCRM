import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, Star, Phone, Mail, Building, MapPin, Calendar, CreditCard as Edit, Trash2, Target, MessageSquare, Activity } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import LeadForm from '@/components/forms/LeadForm';
import ActivityTimeline from '@/components/ActivityTimeline';

const InfoCard = ({ title, children }: any) => (
  <View style={styles.infoCard}>
    <Text style={styles.infoCardTitle}>{title}</Text>
    {children}
  </View>
);

const InfoRow = ({ icon: Icon, label, value, onPress }: any) => (
  <TouchableOpacity style={styles.infoRow} onPress={onPress} disabled={!onPress}>
    <View style={styles.infoRowLeft}>
      <Icon size={16} color="#6b7280" />
      <Text style={styles.infoRowLabel}>{label}</Text>
    </View>
    <Text style={styles.infoRowValue}>{value}</Text>
  </TouchableOpacity>
);

const ActivityItem = ({ activity }: any) => (
  <View style={styles.activityItem}>
    <View style={styles.activityIcon}>
      <Activity size={16} color="#2563eb" />
    </View>
    <View style={styles.activityContent}>
      <Text style={styles.activityTitle}>{activity.title}</Text>
      <Text style={styles.activityDescription}>{activity.description}</Text>
      <Text style={styles.activityDate}>
        {new Date(activity.createdAt).toLocaleDateString()}
      </Text>
    </View>
  </View>
);

export default function LeadDetails() {
  const { id } = useLocalSearchParams();
  const { getLead, deleteLead, convertLeadToOpportunity, getLeadActivities } = useData();
  const [showEditForm, setShowEditForm] = useState(false);

  const lead = getLead(id as string);
  const activities = getLeadActivities(id as string);

  if (!lead) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Lead not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
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
            router.back();
          }
        }
      ]
    );
  };

  const handleConvert = () => {
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
              value: '50k',
              stage: 'Discovery',
              closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
              winProbability: 50,
              urgent: false
            });
            Alert.alert('Success', 'Lead converted to opportunity successfully!');
            router.back();
          }
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return '#dc2626';
      case 'Warm': return '#d97706';
      case 'Cold': return '#0284c7';
      default: return '#6b7280';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lead Details</Text>
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
        {/* Lead Header */}
        <View style={styles.leadHeader}>
          <View style={styles.leadInfo}>
            <Text style={styles.leadName}>{lead.name}</Text>
            <Text style={styles.leadCompany}>{lead.company}</Text>
            <View style={styles.leadMeta}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(lead.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(lead.status) }]}>
                  {lead.status}
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Star size={14} color="#fbbf24" fill="#fbbf24" />
                <Text style={styles.scoreText}>{lead.score.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* AI Insight */}
        <View style={styles.aiInsightCard}>
          <Text style={styles.aiInsightLabel}>AI Insight</Text>
          <Text style={styles.aiInsightText}>{lead.aiInsight}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Mail size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.convertButton} onPress={handleConvert}>
            <Target size={20} color="#16a34a" />
            <Text style={styles.convertButtonText}>Convert</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <InfoCard title="Contact Information">
          <InfoRow icon={Mail} label="Email" value={lead.email} />
          <InfoRow icon={Phone} label="Phone" value={lead.phone} />
          <InfoRow icon={Building} label="Industry" value={lead.industry} />
          <InfoRow icon={MapPin} label="Location" value={lead.location} />
        </InfoCard>

        {/* Lead Details */}
        <InfoCard title="Lead Details">
          <InfoRow icon={Calendar} label="Created" value={lead.createdAt.toLocaleDateString()} />
          <InfoRow icon={Calendar} label="Updated" value={lead.updatedAt.toLocaleDateString()} />
          {lead.source && <InfoRow icon={Building} label="Source" value={lead.source} />}
        </InfoCard>

        {/* Notes */}
        {lead.notes && (
          <InfoCard title="Notes">
            <Text style={styles.notesText}>{lead.notes}</Text>
          </InfoCard>
        )}

        {/* Recent Activities */}
        <InfoCard title="Activity Timeline">
          <ActivityTimeline entityId={id as string} entityType="lead" />
        </InfoCard>
      </ScrollView>

      <Modal
        visible={showEditForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <LeadForm
          lead={lead}
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
  leadHeader: {
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
  leadInfo: {
    alignItems: 'center',
  },
  leadName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  leadCompany: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 16,
  },
  leadMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  scoreText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#d97706',
  },
  aiInsightCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  aiInsightLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0284c7',
    marginBottom: 8,
  },
  aiInsightText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  convertButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  convertButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
  },
  notesText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
  activityItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { ArrowLeft, DollarSign, Calendar, TrendingUp, CircleAlert as AlertCircle, CreditCard as Edit, Trash2, Phone, Mail, Activity } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import OpportunityForm from '@/components/forms/OpportunityForm';
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

export default function OpportunityDetails() {
  const { id } = useLocalSearchParams();
  const { getOpportunity, deleteOpportunity, getOpportunityActivities } = useData();
  const [showEditForm, setShowEditForm] = useState(false);

  const opportunity = getOpportunity(id as string);
  const activities = getOpportunityActivities(id as string);

  if (!opportunity) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Opportunity not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Opportunity',
      `Are you sure you want to delete "${opportunity.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteOpportunity(opportunity.id);
            router.back();
          }
        }
      ]
    );
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Proposal': return '#d97706';
      case 'Negotiation': return '#dc2626';
      case 'Qualification': return '#0284c7';
      case 'Discovery': return '#2563eb';
      case 'Closed Won': return '#16a34a';
      case 'Closed Lost': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return '#16a34a';
    if (probability >= 60) return '#d97706';
    if (probability >= 40) return '#ea580c';
    return '#dc2626';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Opportunity Details</Text>
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
        {/* Opportunity Header */}
        <View style={styles.opportunityHeader}>
          <View style={styles.opportunityInfo}>
            <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
            <Text style={styles.opportunityCompany}>{opportunity.company}</Text>
            <Text style={styles.opportunityContact}>{opportunity.contactName}</Text>
            <View style={styles.opportunityMeta}>
              <View style={[styles.stageBadge, { backgroundColor: getStageColor(opportunity.stage) + '20' }]}>
                <Text style={[styles.stageText, { color: getStageColor(opportunity.stage) }]}>
                  {opportunity.stage}
                </Text>
              </View>
              {opportunity.urgent && (
                <View style={styles.urgentBadge}>
                  <AlertCircle size={12} color="#dc2626" />
                  <Text style={styles.urgentText}>Urgent</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.valueContainer}>
            <Text style={styles.valueAmount}>${opportunity.value}</Text>
            <Text style={styles.valueLabel}>Deal Value</Text>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <TrendingUp size={20} color={getProbabilityColor(opportunity.winProbability)} />
            <Text style={styles.metricValue}>{opportunity.winProbability}%</Text>
            <Text style={styles.metricLabel}>Win Probability</Text>
          </View>
          <View style={styles.metricCard}>
            <Calendar size={20} color="#2563eb" />
            <Text style={styles.metricValue}>{opportunity.closeDate}</Text>
            <Text style={styles.metricLabel}>Close Date</Text>
          </View>
        </View>

        {/* AI Analysis */}
        <View style={styles.aiAnalysisCard}>
          <Text style={styles.aiAnalysisLabel}>AI Analysis</Text>
          <Text style={styles.aiAnalysisText}>{opportunity.aiAnalysis}</Text>
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
        </View>

        {/* Opportunity Details */}
        <InfoCard title="Opportunity Information">
          <InfoRow icon={DollarSign} label="Value" value={`$${opportunity.value}`} />
          <InfoRow icon={TrendingUp} label="Stage" value={opportunity.stage} />
          <InfoRow icon={Calendar} label="Close Date" value={opportunity.closeDate} />
          <InfoRow icon={TrendingUp} label="Win Probability" value={`${opportunity.winProbability}%`} />
        </InfoCard>

        {/* Timeline */}
        <InfoCard title="Timeline">
          <InfoRow icon={Calendar} label="Created" value={opportunity.createdAt.toLocaleDateString()} />
          <InfoRow icon={Calendar} label="Last Updated" value={opportunity.updatedAt.toLocaleDateString()} />
        </InfoCard>

        {/* Description */}
        {opportunity.description && (
          <InfoCard title="Description">
            <Text style={styles.descriptionText}>{opportunity.description}</Text>
          </InfoCard>
        )}

        {/* Recent Activities */}
        <InfoCard title="Activity Timeline">
          <ActivityTimeline entityId={id as string} entityType="opportunity" />
        </InfoCard>
      </ScrollView>

      <Modal
        visible={showEditForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <OpportunityForm
          opportunity={opportunity}
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
  opportunityHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunityTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  opportunityCompany: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 2,
  },
  opportunityContact: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 12,
  },
  opportunityMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  stageText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  urgentText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#dc2626',
  },
  valueContainer: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
    marginBottom: 4,
  },
  valueLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  metricsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 18,
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
  aiAnalysisCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  aiAnalysisLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#0284c7',
    marginBottom: 8,
  },
  aiAnalysisText: {
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
  descriptionText: {
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
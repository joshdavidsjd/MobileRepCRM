import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Phone, Mail, Users, Video, FileText, Activity, Clock, CircleCheck as CheckCircle, CircleAlert as AlertCircle } from 'lucide-react-native';
import { useData, Activity as ActivityType } from '@/contexts/DataContext';

interface ActivityTimelineProps {
  entityId: string;
  entityType: 'lead' | 'opportunity' | 'account' | 'contact';
}

export default function ActivityTimeline({ entityId, entityType }: ActivityTimelineProps) {
  const { 
    getLeadActivities, 
    getOpportunityActivities, 
    getAccountActivities, 
    getContactActivities 
  } = useData();

  const getActivities = () => {
    switch (entityType) {
      case 'lead':
        return getLeadActivities(entityId);
      case 'opportunity':
        return getOpportunityActivities(entityId);
      case 'account':
        return getAccountActivities(entityId);
      case 'contact':
        return getContactActivities(entityId);
      default:
        return [];
    }
  };

  const activities = getActivities().sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return Phone;
      case 'email': return Mail;
      case 'meeting': return Users;
      case 'demo': return Video;
      case 'proposal': return FileText;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'call': return '#2563eb';
      case 'email': return '#16a34a';
      case 'meeting': return '#ea580c';
      case 'demo': return '#7c3aed';
      case 'proposal': return '#dc2626';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'scheduled': return Clock;
      default: return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#16a34a';
      case 'scheduled': return '#2563eb';
      default: return '#ea580c';
    }
  };

  const getOutcomeColor = (outcome?: string) => {
    switch (outcome) {
      case 'successful': return '#16a34a';
      case 'unsuccessful': return '#dc2626';
      case 'follow-up-needed': return '#ea580c';
      default: return '#6b7280';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };

  if (activities.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Activity size={48} color="#9ca3af" />
        <Text style={styles.emptyStateTitle}>No activities yet</Text>
        <Text style={styles.emptyStateText}>
          Activities will appear here as you interact with this {entityType}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {activities.map((activity, index) => {
        const ActivityIcon = getActivityIcon(activity.type);
        const StatusIcon = getStatusIcon(activity.status);
        const activityColor = getActivityColor(activity.type);
        const statusColor = getStatusColor(activity.status);

        return (
          <View key={activity.id} style={styles.activityItem}>
            <View style={styles.timeline}>
              <View style={[styles.timelineDot, { backgroundColor: activityColor }]}>
                <ActivityIcon size={16} color="#ffffff" />
              </View>
              {index < activities.length - 1 && <View style={styles.timelineLine} />}
            </View>

            <View style={styles.activityContent}>
              <View style={styles.activityHeader}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <View style={styles.activityStatus}>
                  <StatusIcon size={14} color={statusColor} />
                  <Text style={[styles.statusText, { color: statusColor }]}>
                    {activity.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.activityDescription}>{activity.description}</Text>

              <View style={styles.activityMeta}>
                <Text style={styles.activityDate}>
                  {formatDate(activity.createdAt)}
                </Text>
                {activity.duration && (
                  <Text style={styles.activityDuration}>
                    {activity.duration} min
                  </Text>
                )}
                {activity.outcome && (
                  <View style={[styles.outcomeTag, { backgroundColor: getOutcomeColor(activity.outcome) + '20' }]}>
                    <Text style={[styles.outcomeText, { color: getOutcomeColor(activity.outcome) }]}>
                      {activity.outcome.replace('-', ' ')}
                    </Text>
                  </View>
                )}
              </View>

              {activity.notes && (
                <View style={styles.notesContainer}>
                  <Text style={styles.notesLabel}>Notes:</Text>
                  <Text style={styles.notesText}>{activity.notes}</Text>
                </View>
              )}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timeline: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 8,
  },
  activityContent: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  activityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  activityDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  activityDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9ca3af',
  },
  outcomeTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  outcomeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'capitalize',
  },
  notesContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#374151',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 18,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});
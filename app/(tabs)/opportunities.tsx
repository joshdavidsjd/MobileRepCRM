import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DollarSign, Calendar, TrendingUp, CircleAlert as AlertCircle, Plus, Filter, CreditCard as Edit, Trash2, MoveVertical as MoreVertical } from 'lucide-react-native';
import { useData, Opportunity } from '@/contexts/DataContext';
import { router } from 'expo-router';
import OpportunityForm from '@/components/forms/OpportunityForm';

const OpportunityCard = ({ opportunity, onPress, onEdit, onDelete }: any) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <TouchableOpacity style={styles.opportunityCard} onPress={() => onPress(opportunity)}>
      <View style={styles.opportunityHeader}>
        <View style={styles.opportunityInfo}>
          <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
          <Text style={styles.opportunityCompany}>{opportunity.company}</Text>
        </View>
        <View style={styles.opportunityActions}>
          <View style={styles.opportunityValue}>
            <Text style={styles.valueAmount}>${opportunity.value}</Text>
            <Text style={styles.valueLabel}>Value</Text>
          </View>
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setShowMenu(true)}
          >
            <MoreVertical size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.opportunityMeta}>
        <View style={styles.metaItem}>
          <Calendar size={14} color="#6b7280" />
          <Text style={styles.metaText}>Close: {opportunity.closeDate}</Text>
        </View>
        <View style={styles.metaItem}>
          <TrendingUp size={14} color="#16a34a" />
          <Text style={styles.metaText}>{opportunity.winProbability}% win probability</Text>
        </View>
      </View>

      <View style={styles.aiAnalysis}>
        <Text style={styles.aiAnalysisLabel}>AI Analysis:</Text>
        <Text style={styles.aiAnalysisText}>{opportunity.aiAnalysis}</Text>
      </View>

      <View style={styles.opportunityFooter}>
        <View style={[styles.stageBadge, { backgroundColor: getStageColor(opportunity.stage) }]}>
          <Text style={[styles.stageText, { color: getStageTextColor(opportunity.stage) }]}>
            {opportunity.stage}
          </Text>
        </View>
        {opportunity.urgent && (
          <View style={styles.urgentBadge}>
            <AlertCircle size={14} color="#dc2626" />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
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
                onEdit(opportunity);
              }}
            >
              <Edit size={20} color="#2563eb" />
              <Text style={styles.menuItemText}>Edit Opportunity</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.menuItem, styles.menuItemDanger]}
              onPress={() => {
                setShowMenu(false);
                onDelete(opportunity);
              }}
            >
              <Trash2 size={20} color="#dc2626" />
              <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>Delete Opportunity</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Proposal': return '#fef3c7';
    case 'Negotiation': return '#fee2e2';
    case 'Qualification': return '#e0f2fe';
    case 'Discovery': return '#f0f9ff';
    case 'Closed Won': return '#dcfce7';
    case 'Closed Lost': return '#f3f4f6';
    default: return '#f3f4f6';
  }
};

const getStageTextColor = (stage: string) => {
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

const PipelineStage = ({ stage, opportunities, value }: any) => (
  <View style={styles.stageColumn}>
    <View style={styles.stageHeader}>
      <Text style={styles.stageName}>{stage}</Text>
      <Text style={styles.stageValue}>${value}k</Text>
    </View>
    <Text style={styles.stageCount}>{opportunities.length} deals</Text>
  </View>
);

export default function Opportunities() {
  const { opportunities, deleteOpportunity } = useData();
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list');
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState<Opportunity | undefined>();

  const pipelineData = [
    { stage: 'Discovery', opportunities: opportunities.filter(o => o.stage === 'Discovery'), value: opportunities.filter(o => o.stage === 'Discovery').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Qualification', opportunities: opportunities.filter(o => o.stage === 'Qualification'), value: opportunities.filter(o => o.stage === 'Qualification').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Proposal', opportunities: opportunities.filter(o => o.stage === 'Proposal'), value: opportunities.filter(o => o.stage === 'Proposal').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Negotiation', opportunities: opportunities.filter(o => o.stage === 'Negotiation'), value: opportunities.filter(o => o.stage === 'Negotiation').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
  ];

  const totalPipelineValue = opportunities.reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0);
  const avgWinRate = opportunities.length > 0 ? Math.round(opportunities.reduce((sum, o) => sum + o.winProbability, 0) / opportunities.length) : 0;

  const handleOpportunityPress = (opportunity: Opportunity) => {
    router.push(`/opportunity-details/${opportunity.id}`);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  const handleDeleteOpportunity = (opportunity: Opportunity) => {
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
            Alert.alert('Success', 'Opportunity deleted successfully');
          }
        }
      ]
    );
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOpportunity(undefined);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Opportunities ({opportunities.length})</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.viewModeButton, viewMode === 'pipeline' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('pipeline')}
          >
            <Text style={[styles.viewModeText, viewMode === 'pipeline' && styles.viewModeTextActive]}>
              Pipeline
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Plus size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <DollarSign size={16} color="#16a34a" />
          <Text style={styles.summaryLabel}>Total Pipeline</Text>
          <Text style={styles.summaryValue}>${totalPipelineValue}k</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <TrendingUp size={16} color="#2563eb" />
          <Text style={styles.summaryLabel}>Avg Win Rate</Text>
          <Text style={styles.summaryValue}>{avgWinRate}%</Text>
        </View>
      </View>

      {viewMode === 'list' ? (
        <ScrollView style={styles.opportunitiesList} showsVerticalScrollIndicator={false}>
          {opportunities.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No opportunities yet</Text>
              <Text style={styles.emptyStateText}>
                Create your first opportunity to start tracking deals
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setShowForm(true)}
              >
                <Text style={styles.emptyStateButtonText}>Add Opportunity</Text>
              </TouchableOpacity>
            </View>
          ) : (
            opportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity} 
                onPress={handleOpportunityPress}
                onEdit={handleEditOpportunity}
                onDelete={handleDeleteOpportunity}
              />
            ))
          )}
        </ScrollView>
      ) : (
        <ScrollView horizontal style={styles.pipelineView} showsHorizontalScrollIndicator={false}>
          {pipelineData.map((stage) => (
            <PipelineStage key={stage.stage} {...stage} />
          ))}
        </ScrollView>
      )}

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <OpportunityForm
          opportunity={editingOpportunity}
          onClose={handleCloseForm}
          onSave={handleCloseForm}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
  },
  viewModeButtonActive: {
    backgroundColor: '#2563eb',
  },
  viewModeText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  viewModeTextActive: {
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  opportunitiesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  opportunityCard: {
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
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  opportunityInfo: {
    flex: 1,
  },
  opportunityTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  opportunityCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  opportunityActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  opportunityValue: {
    alignItems: 'flex-end',
  },
  valueAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  valueLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  menuButton: {
    padding: 4,
  },
  opportunityMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  aiAnalysis: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  aiAnalysisLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#0284c7',
    marginBottom: 4,
  },
  aiAnalysisText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#0f172a',
    lineHeight: 18,
  },
  opportunityFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    gap: 4,
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#dc2626',
  },
  pipelineView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stageColumn: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  stageHeader: {
    marginBottom: 8,
  },
  stageName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  stageValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#16a34a',
  },
  stageCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
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
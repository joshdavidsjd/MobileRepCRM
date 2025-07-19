import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, Lightbulb, ArrowRight, Clock, Search, Settings, ChartBar as BarChart3 } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import GlobalSearch from '@/components/GlobalSearch';
import { PipelineChart, ConversionChart, IndustryChart } from '@/components/DashboardCharts';
import { useState } from 'react';

const MetricCard = ({ title, value, change, changeType, icon: Icon, onPress }: any) => (
  <TouchableOpacity style={styles.metricCard} onPress={onPress}>
    <View style={styles.metricHeader}>
      <Icon size={24} color="#2563eb" />
      <View style={styles.metricChange}>
        {changeType === 'up' ? (
          <TrendingUp size={16} color="#16a34a" />
        ) : (
          <TrendingDown size={16} color="#dc2626" />
        )}
        <Text style={[styles.changeText, { color: changeType === 'up' ? '#16a34a' : '#dc2626' }]}>
          {change}
        </Text>
      </View>
    </View>
    <Text style={styles.metricValue}>{value}</Text>
    <Text style={styles.metricTitle}>{title}</Text>
  </TouchableOpacity>
);

const InsightCard = ({ title, description, priority, type }: any) => (
  <View style={styles.insightCard}>
    <View style={styles.insightHeader}>
      <Lightbulb size={20} color="#ea580c" />
      <View style={[styles.priorityBadge, { backgroundColor: priority === 'high' ? '#fee2e2' : '#fef3c7' }]}>
        <Text style={[styles.priorityText, { color: priority === 'high' ? '#dc2626' : '#d97706' }]}>
          {priority.toUpperCase()}
        </Text>
      </View>
    </View>
    <Text style={styles.insightTitle}>{title}</Text>
    <Text style={styles.insightDescription}>{description}</Text>
    <TouchableOpacity style={styles.insightAction}>
      <Text style={styles.insightActionText}>Take Action</Text>
      <ArrowRight size={16} color="#2563eb" />
    </TouchableOpacity>
  </View>
);

const ActivityItem = ({ time, action, contact, status }: any) => (
  <View style={styles.activityItem}>
    <View style={styles.activityTime}>
      <Clock size={16} color="#6b7280" />
      <Text style={styles.activityTimeText}>{time}</Text>
    </View>
    <Text style={styles.activityAction}>{action}</Text>
    <Text style={styles.activityContact}>{contact}</Text>
    <View style={[styles.activityStatus, { backgroundColor: status === 'completed' ? '#dcfce7' : '#fef3c7' }]}>
      <Text style={[styles.activityStatusText, { color: status === 'completed' ? '#16a34a' : '#d97706' }]}>
        {status}
      </Text>
    </View>
  </View>
);

export default function Dashboard() {
  const { leads, opportunities, activities } = useData();
  const [showSearch, setShowSearch] = useState(false);
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const { userProfile, updateDashboardWidgets } = useData();

  // Calculate metrics from real data
  const totalPipelineValue = opportunities.reduce((sum, opp) => sum + parseInt(opp.value.replace('k', '')), 0);
  const hotLeads = leads.filter(lead => lead.status === 'Hot').length;
  const avgWinRate = opportunities.length > 0 
    ? Math.round(opportunities.reduce((sum, opp) => sum + opp.winProbability, 0) / opportunities.length)
    : 0;
  const activeDeals = opportunities.filter(opp => !['Closed Won', 'Closed Lost'].includes(opp.stage)).length;

  // Get recent activities
  const recentActivities = activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Generate AI insights based on real data
  const generateInsights = () => {
    const insights = [];
    
    // High priority insights
    const urgentOpportunities = opportunities.filter(opp => opp.urgent);
    if (urgentOpportunities.length > 0) {
      insights.push({
        title: `Follow up on ${urgentOpportunities.length} urgent opportunities`,
        description: `${urgentOpportunities[0].title} and ${urgentOpportunities.length - 1} other urgent deals need immediate attention.`,
        priority: 'high',
        type: 'follow-up'
      });
    }

    // Medium priority insights
    const hotLeadsCount = leads.filter(lead => lead.status === 'Hot').length;
    if (hotLeadsCount > 0) {
      insights.push({
        title: `Convert ${hotLeadsCount} hot leads to opportunities`,
        description: 'These leads are showing strong buying signals and are ready for the next stage.',
        priority: 'medium',
        type: 'opportunity'
      });
    }

    return insights.slice(0, 2); // Return top 2 insights
  };

  const insights = generateInsights();

  const availableWidgets = [
    { id: 'pipeline-value', title: 'Pipeline Value', component: null },
    { id: 'win-rate', title: 'Win Rate', component: null },
    { id: 'hot-leads', title: 'Hot Leads', component: null },
    { id: 'activities', title: 'Recent Activities', component: null },
    { id: 'pipeline-chart', title: 'Pipeline Chart', component: PipelineChart },
    { id: 'conversion-chart', title: 'Conversion Chart', component: ConversionChart },
    { id: 'industry-chart', title: 'Industry Chart', component: IndustryChart },
  ];

  const isWidgetEnabled = (widgetId: string) => {
    return userProfile.dashboardWidgets.includes(widgetId);
  };

  const toggleWidget = (widgetId: string) => {
    const currentWidgets = userProfile.dashboardWidgets;
    const newWidgets = currentWidgets.includes(widgetId)
      ? currentWidgets.filter(id => id !== widgetId)
      : [...currentWidgets, widgetId];
    updateDashboardWidgets(newWidgets);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good morning, Sarah!</Text>
          <Text style={styles.subtitle}>Here's your sales overview for today</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowSearch(true)}>
            <Search size={20} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={() => setShowWidgetConfig(true)}>
            <Settings size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isWidgetEnabled('pipeline-value') && isWidgetEnabled('win-rate') && (
          <View style={styles.metricsGrid}>
            {isWidgetEnabled('pipeline-value') && (
              <MetricCard
                title="Pipeline Value"
                value={`$${totalPipelineValue}K`}
                change="+8.3%"
                changeType="up"
                icon={DollarSign}
              />
            )}
            {isWidgetEnabled('win-rate') && (
              <MetricCard
                title="Win Rate"
                value={`${avgWinRate}%`}
                change="-2.1%"
                changeType="down"
                icon={TrendingUp}
              />
            )}
            {isWidgetEnabled('hot-leads') && (
              <MetricCard
                title="Hot Leads"
                value={hotLeads.toString()}
                change="+2"
                changeType="up"
                icon={Calendar}
              />
            )}
          </View>
        )}

        {isWidgetEnabled('pipeline-chart') && (
          <View style={styles.chartSection}>
            <PipelineChart />
          </View>
        )}

        {isWidgetEnabled('conversion-chart') && (
          <View style={styles.chartSection}>
            <ConversionChart />
          </View>
        )}

        {isWidgetEnabled('industry-chart') && (
          <View style={styles.chartSection}>
            <IndustryChart />
          </View>
        )}

        {insights.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>AI Insights & Recommendations</Text>
            {insights.map((insight, index) => (
              <InsightCard
                key={index}
                title={insight.title}
                description={insight.description}
                priority={insight.priority}
                type={insight.type}
              />
            ))}
          </View>
        )}

        {recentActivities.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentActivities.map((activity) => (
              <ActivityItem
                key={activity.id}
                time={getRelativeTime(activity.createdAt)}
                action={activity.title}
                contact={`${activity.contactName} @ ${activity.company}`}
                status={activity.status}
              />
            ))}
          </View>
        )}

        {leads.length === 0 && opportunities.length === 0 && !isWidgetEnabled('pipeline-chart') && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Welcome to SalesAI Pro!</Text>
            <Text style={styles.emptyStateText}>
              Start by adding your first lead or opportunity to see your dashboard come to life.
            </Text>
          </View>
        )}
      </ScrollView>

      <GlobalSearch visible={showSearch} onClose={() => setShowSearch(false)} />

      <Modal
        visible={showWidgetConfig}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.widgetConfigContainer}>
          <View style={styles.widgetConfigHeader}>
            <Text style={styles.widgetConfigTitle}>Customize Dashboard</Text>
            <TouchableOpacity onPress={() => setShowWidgetConfig(false)}>
              <Text style={styles.widgetConfigDone}>Done</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.widgetConfigList}>
            {availableWidgets.map((widget) => (
              <TouchableOpacity
                key={widget.id}
                style={styles.widgetConfigItem}
                onPress={() => toggleWidget(widget.id)}
              >
                <Text style={styles.widgetConfigItemTitle}>{widget.title}</Text>
                <View style={[
                  styles.widgetToggle,
                  isWidgetEnabled(widget.id) && styles.widgetToggleActive
                ]}>
                  {isWidgetEnabled(widget.id) && (
                    <View style={styles.widgetToggleIndicator} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)} days ago`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
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
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  chartSection: {
    paddingHorizontal: 20,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '47%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  metricChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  metricValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  metricTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  insightCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  insightTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  insightDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  insightAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  insightActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  activityItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  activityTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  activityTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  activityAction: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  activityContact: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    marginBottom: 8,
  },
  activityStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  widgetConfigContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  widgetConfigHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  widgetConfigTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  widgetConfigDone: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2563eb',
  },
  widgetConfigList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  widgetConfigItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  widgetConfigItemTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  widgetToggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  widgetToggleActive: {
    backgroundColor: '#2563eb',
    alignItems: 'flex-end',
  },
  widgetToggleIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});
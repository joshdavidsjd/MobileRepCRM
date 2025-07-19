import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLine, VictoryPie, VictoryAxis, VictoryTheme } from 'victory-native';
import { useData } from '@/contexts/DataContext';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;

export const PipelineChart = () => {
  const { opportunities } = useData();

  const pipelineData = [
    { stage: 'Discovery', value: opportunities.filter(o => o.stage === 'Discovery').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Qualification', value: opportunities.filter(o => o.stage === 'Qualification').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Proposal', value: opportunities.filter(o => o.stage === 'Proposal').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
    { stage: 'Negotiation', value: opportunities.filter(o => o.stage === 'Negotiation').reduce((sum, o) => sum + parseInt(o.value.replace('k', '')), 0) },
  ];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Pipeline Value by Stage</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        width={chartWidth}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 60 }}
      >
        <VictoryAxis dependentAxis tickFormat={(t) => `$${t}k`} />
        <VictoryAxis />
        <VictoryBar
          data={pipelineData}
          x="stage"
          y="value"
          style={{
            data: { fill: "#2563eb" }
          }}
        />
      </VictoryChart>
    </View>
  );
};

export const ConversionChart = () => {
  const { leads, opportunities } = useData();

  // Mock conversion data over time
  const conversionData = [
    { month: 'Jan', rate: 15 },
    { month: 'Feb', rate: 22 },
    { month: 'Mar', rate: 18 },
    { month: 'Apr', rate: 28 },
    { month: 'May', rate: 25 },
    { month: 'Jun', rate: 32 },
  ];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Lead Conversion Rate</Text>
      <VictoryChart
        theme={VictoryTheme.material}
        width={chartWidth}
        height={200}
        padding={{ left: 60, top: 20, right: 40, bottom: 60 }}
      >
        <VictoryAxis dependentAxis tickFormat={(t) => `${t}%`} />
        <VictoryAxis />
        <VictoryLine
          data={conversionData}
          x="month"
          y="rate"
          style={{
            data: { stroke: "#16a34a", strokeWidth: 3 }
          }}
          animate={{
            duration: 1000,
            onLoad: { duration: 500 }
          }}
        />
      </VictoryChart>
    </View>
  );
};

export const IndustryChart = () => {
  const { accounts } = useData();

  const industryData = accounts.reduce((acc, account) => {
    acc[account.industry] = (acc[account.industry] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(industryData).map(([industry, count]) => ({
    x: industry,
    y: count
  }));

  const colors = ['#2563eb', '#16a34a', '#ea580c', '#7c3aed', '#dc2626'];

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Accounts by Industry</Text>
      <VictoryPie
        data={pieData}
        width={chartWidth}
        height={200}
        colorScale={colors}
        labelRadius={({ innerRadius }) => innerRadius as number + 40 }
        innerRadius={30}
        animate={{
          duration: 1000
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
});
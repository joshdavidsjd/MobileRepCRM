import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, Users, Target, Bot, User } from 'lucide-react-native';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FloatingActionButton from '@/components/FloatingActionButton';

const TabBarIcon = ({ icon: Icon, color, focused }: any) => (
  <View style={styles.tabIconContainer}>
    {focused && (
      <LinearGradient
        colors={['#2563eb', '#3b82f6']}
        style={styles.tabIconBackground}
      />
    )}
    <Icon 
      size={focused ? 26 : 24} 
      color={focused ? '#ffffff' : color} 
      strokeWidth={focused ? 2.5 : 2}
    />
  </View>
);

const TabBarLabel = ({ children, focused }: any) => (
  <Text style={[
    styles.tabLabel,
    { 
      color: focused ? '#2563eb' : '#6b7280',
      fontFamily: focused ? 'Inter-SemiBold' : 'Inter-Medium'
    }
  ]}>
    {children}
  </Text>
);

export default function TabLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 0,
            paddingTop: 12,
            paddingBottom: 12,
            height: 80,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 8,
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={BarChart3} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="leads"
          options={{
            title: 'Leads',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={Users} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="opportunities"
          options={{
            title: 'Pipeline',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={Target} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="crm"
          options={{
            title: 'CRM',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={Users} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="assistant"
          options={{
            title: 'AI Assistant',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={Bot} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon icon={User} color={color} focused={focused} />
            ),
            tabBarLabel: ({ children, focused }) => (
              <TabBarLabel focused={focused}>{children}</TabBarLabel>
            ),
          }}
        />
        {/* Hide the old accounts and contacts tabs */}
        <Tabs.Screen
          name="accounts"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="contacts"
          options={{
            href: null,
          }}
        />
      </Tabs>
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  },
  tabIconBackground: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
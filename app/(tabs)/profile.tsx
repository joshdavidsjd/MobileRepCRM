import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, Target, TrendingUp, Award, CreditCard as Edit } from 'lucide-react-native';
import { useData } from '@/contexts/DataContext';
import ProfileEditForm from '@/components/forms/ProfileEditForm';

const ProfileCard = ({ userProfile, onEdit }: any) => (
  <View style={styles.profileCard}>
    <View style={styles.profileHeader}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <User size={32} color="#ffffff" />
        </View>
        <View style={styles.statusIndicator} />
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Edit size={20} color="#2563eb" />
      </TouchableOpacity>
    </View>
    <View style={styles.profileInfo}>
      <Text style={styles.profileName}>{userProfile.name}</Text>
      <Text style={styles.profileTitle}>{userProfile.title}</Text>
      <Text style={styles.profileCompany}>{userProfile.company}</Text>
      {userProfile.bio && (
        <Text style={styles.profileBio}>{userProfile.bio}</Text>
      )}
      <View style={styles.profileDetails}>
        {userProfile.location && (
          <Text style={styles.profileDetail}>📍 {userProfile.location}</Text>
        )}
        {userProfile.quotaTarget && (
          <Text style={styles.profileDetail}>🎯 {userProfile.quotaTarget} quota</Text>
        )}
      </View>
    </View>
  </View>
);

const StatsCard = () => (
  <View style={styles.statsCard}>
    <Text style={styles.statsTitle}>This Month's Performance</Text>
    <View style={styles.statsGrid}>
      <View style={styles.statItem}>
        <Target size={20} color="#2563eb" />
        <Text style={styles.statValue}>127%</Text>
        <Text style={styles.statLabel}>Quota Attainment</Text>
      </View>
      <View style={styles.statItem}>
        <TrendingUp size={20} color="#16a34a" />
        <Text style={styles.statValue}>$847K</Text>
        <Text style={styles.statLabel}>Revenue Closed</Text>
      </View>
      <View style={styles.statItem}>
        <Award size={20} color="#ea580c" />
        <Text style={styles.statValue}>#2</Text>
        <Text style={styles.statLabel}>Team Ranking</Text>
      </View>
    </View>
  </View>
);

const SettingsItem = ({ icon: Icon, title, subtitle, onPress, hasSwitch, switchValue, onSwitchChange }: any) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress}>
    <View style={styles.settingsIcon}>
      <Icon size={20} color="#6b7280" />
    </View>
    <View style={styles.settingsContent}>
      <Text style={styles.settingsTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
    </View>
    {hasSwitch ? (
      <Switch
        value={switchValue}
        onValueChange={onSwitchChange}
        trackColor={{ false: '#e5e7eb', true: '#dbeafe' }}
        thumbColor={switchValue ? '#2563eb' : '#f3f4f6'}
      />
    ) : (
      <ChevronRight size={20} color="#9ca3af" />
    )}
  </TouchableOpacity>
);

export default function Profile() {
  const { userProfile } = useData();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [aiInsightsEnabled, setAiInsightsEnabled] = useState(true);
  const [showEditForm, setShowEditForm] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        <ProfileCard 
          userProfile={userProfile} 
          onEdit={() => setShowEditForm(true)}
        />
        <StatsCard />

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon={Bell}
              title="Push Notifications"
              subtitle="Get notified about important updates"
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchChange={setNotificationsEnabled}
            />
            <SettingsItem
              icon={Settings}
              title="AI Insights"
              subtitle="Receive AI-powered recommendations"
              hasSwitch={true}
              switchValue={aiInsightsEnabled}
              onSwitchChange={setAiInsightsEnabled}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon={User}
              title="Personal Information"
              subtitle="Update your profile details"
              onPress={() => setShowEditForm(true)}
            />
            <SettingsItem
              icon={Shield}
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => console.log('Privacy & Security pressed')}
            />
            <SettingsItem
              icon={Settings}
              title="App Settings"
              subtitle="Customize your app experience"
              onPress={() => console.log('App Settings pressed')}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsGroup}>
            <SettingsItem
              icon={HelpCircle}
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => console.log('Help & Support pressed')}
            />
          </View>
        </View>

        <View style={styles.settingsSection}>
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.logoutButton}>
              <LogOut size={20} color="#dc2626" />
              <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>SalesAI Pro v2.1.0</Text>
          <Text style={styles.footerText}>© 2024 TechSales Corp</Text>
        </View>
      </ScrollView>

      <Modal
        visible={showEditForm}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <ProfileEditForm
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    backgroundColor: '#2563eb',
    borderRadius: 40,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#16a34a',
    borderRadius: 10,
    width: 20,
    height: 20,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  editButton: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  profileTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    marginBottom: 2,
  },
  profileCompany: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
    marginBottom: 12,
  },
  profileBio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 12,
  },
  profileDetails: {
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  profileDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
  },
  statsCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6b7280',
    textAlign: 'center',
  },
  settingsSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  settingsGroup: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingsIcon: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#dc2626',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9ca3af',
  },
});
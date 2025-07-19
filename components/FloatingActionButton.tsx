import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Users, Target, Activity, X } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface QuickAction {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  route: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'lead',
    title: 'Create Lead',
    subtitle: 'Add new prospect',
    icon: Users,
    color: '#2563eb',
    route: '/lead-form'
  },
  {
    id: 'opportunity',
    title: 'Create Opportunity',
    subtitle: 'Track new deal',
    icon: Target,
    color: '#16a34a',
    route: '/opportunity-form'
  },
  {
    id: 'activity',
    title: 'Add Activity',
    subtitle: 'Log interaction',
    icon: Activity,
    color: '#ea580c',
    route: '/activity-form'
  }
];

export default function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  const toggleMenu = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    
    rotation.value = withSpring(newState ? 45 : 0, { damping: 15 });
    scale.value = withSpring(newState ? 0.9 : 1, { damping: 15 });
  };

  const handleActionPress = (action: QuickAction) => {
    setIsOpen(false);
    rotation.value = withSpring(0, { damping: 15 });
    scale.value = withSpring(1, { damping: 15 });
    
    // Navigate to the appropriate form
    router.push(action.route as any);
  };

  const fabAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${rotation.value}deg` },
      { scale: scale.value }
    ],
  }));

  const ActionItem = ({ action, index }: { action: QuickAction; index: number }) => {
    const itemOpacity = useSharedValue(0);
    const itemTranslateY = useSharedValue(20);
    const itemScale = useSharedValue(0.8);

    React.useEffect(() => {
      if (isOpen) {
        itemOpacity.value = withTiming(1, { duration: 200 + index * 50 });
        itemTranslateY.value = withSpring(0, { damping: 15 });
        itemScale.value = withSpring(1, { damping: 15 });
      } else {
        itemOpacity.value = withTiming(0, { duration: 150 });
        itemTranslateY.value = withTiming(20, { duration: 150 });
        itemScale.value = withTiming(0.8, { duration: 150 });
      }
    }, [isOpen]);

    const itemAnimatedStyle = useAnimatedStyle(() => ({
      opacity: itemOpacity.value,
      transform: [
        { translateY: itemTranslateY.value },
        { scale: itemScale.value }
      ],
    }));

    return (
      <Animated.View style={[styles.actionItem, itemAnimatedStyle]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleActionPress(action)}
        >
          <View style={[styles.actionIconContainer, { backgroundColor: action.color }]}>
            <action.icon size={20} color="#ffffff" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{action.title}</Text>
            <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      {/* Overlay */}
      <Modal
        visible={isOpen}
        transparent
        animationType="none"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.overlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.menuContainer}>
            {quickActions.map((action, index) => (
              <ActionItem key={action.id} action={action} index={index} />
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Floating Action Button */}
      <Animated.View style={[styles.fab, fabAnimatedStyle]}>
        <TouchableOpacity onPress={toggleMenu}>
          <LinearGradient
            colors={['#2563eb', '#1d4ed8']}
            style={styles.fabGradient}
          >
            {isOpen ? (
              <X size={24} color="#ffffff" />
            ) : (
              <Plus size={24} color="#ffffff" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    borderRadius: 28,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 1000,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    paddingBottom: 180,
    paddingRight: 20,
  },
  menuContainer: {
    alignItems: 'flex-end',
    gap: 12,
  },
  actionItem: {
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    minWidth: 200,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
  },
});
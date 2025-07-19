import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Zap } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  withDelay,
  runOnJS
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const { user, isLoading, isOnboarded } = useAuth();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const backgroundOpacity = useSharedValue(0);

  const navigateToNext = () => {
    if (user) {
      if (isOnboarded) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)');
      }
    } else {
      // Navigate directly to login instead of auth welcome
      router.replace('/(auth)/login');
    }
  };

  useEffect(() => {
    // Start animations
    backgroundOpacity.value = withTiming(1, { duration: 800 });
    
    logoScale.value = withDelay(300, withSequence(
      withTiming(1.2, { duration: 600 }),
      withTiming(1, { duration: 200 })
    ));
    
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    textOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));

    // Navigate after animations and loading complete
    const timer = setTimeout(() => {
      if (!isLoading) {
        navigateToNext();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoading, user, isOnboarded]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const backgroundAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backgroundOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, backgroundAnimatedStyle]}>
        <LinearGradient
          colors={['#1e40af', '#2563eb', '#3b82f6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />
      </Animated.View>

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <View style={styles.logoBackground}>
            <TrendingUp size={48} color="#ffffff" strokeWidth={2.5} />
            <View style={styles.sparkle}>
              <Zap size={20} color="#fbbf24" fill="#fbbf24" />
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
          <Text style={styles.title}>SalesAI Pro</Text>
          <Text style={styles.subtitle}>Intelligent Sales Excellence</Text>
          <View style={styles.loadingDots}>
            <View style={[styles.dot, styles.dot1]} />
            <View style={[styles.dot, styles.dot2]} />
            <View style={[styles.dot, styles.dot3]} />
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Advanced AI</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e40af',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 40,
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  sparkle: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 40,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  dot1: {
    animationDelay: '0s',
  },
  dot2: {
    animationDelay: '0.2s',
  },
  dot3: {
    animationDelay: '0.4s',
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowRight, ArrowLeft, Target, Users, Bot, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  runOnJS
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const onboardingSteps = [
  {
    id: 1,
    title: 'Welcome to SalesAI Pro',
    subtitle: 'Your intelligent sales companion',
    description: 'Transform your sales performance with AI-powered insights, lead management, and personalized coaching.',
    icon: TrendingUp,
    color: '#2563eb',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 2,
    title: 'Smart Lead Management',
    subtitle: 'Never miss an opportunity',
    description: 'AI-powered lead scoring helps you prioritize prospects and focus on deals most likely to close.',
    icon: Users,
    color: '#16a34a',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 3,
    title: 'Pipeline Intelligence',
    subtitle: 'Predict and optimize',
    description: 'Get real-time insights into your sales pipeline with predictive analytics and win probability scoring.',
    icon: Target,
    color: '#ea580c',
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: 4,
    title: 'AI Sales Assistant',
    subtitle: '24/7 personalized coaching',
    description: 'Get instant help with email drafting, objection handling, and strategic advice tailored to your deals.',
    icon: Bot,
    color: '#7c3aed',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export default function OnboardingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const { completeOnboarding } = useAuth();
  
  const slideX = useSharedValue(0);
  const contentOpacity = useSharedValue(1);

  const animateToStep = (stepIndex: number) => {
    contentOpacity.value = withTiming(0, { duration: 200 }, () => {
      slideX.value = withTiming(-stepIndex * width, { duration: 400 });
      contentOpacity.value = withTiming(1, { duration: 300 });
    });
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      animateToStep(newStep);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      animateToStep(newStep);
    }
  };

  const slideAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideX.value }],
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#f8fafc', '#e2e8f0']}
        style={styles.gradient}
      />

      <View style={styles.header}>
        <View style={styles.progressContainer}>
          {onboardingSteps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentStep && styles.progressDotActive,
                { backgroundColor: index === currentStep ? currentStepData.color : '#e2e8f0' }
              ]}
            />
          ))}
        </View>
        
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={completeOnboarding}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.contentContainer, contentAnimatedStyle]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentStepData.image }}
            style={styles.stepImage}
            resizeMode="cover"
          />
          <View style={[styles.iconOverlay, { backgroundColor: currentStepData.color }]}>
            <currentStepData.icon size={32} color="#ffffff" />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={[styles.stepSubtitle, { color: currentStepData.color }]}>
            {currentStepData.subtitle}
          </Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
        </View>
      </Animated.View>

      <View style={styles.navigationContainer}>
        <TouchableOpacity 
          style={[styles.navButton, styles.backButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft size={24} color={currentStep === 0 ? '#94a3b8' : '#64748b'} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.navButton, styles.nextButton]}
          onPress={nextStep}
        >
          <LinearGradient
            colors={[currentStepData.color, currentStepData.color + 'dd']}
            style={styles.nextButtonGradient}
          >
            {currentStep === onboardingSteps.length - 1 ? (
              <Text style={styles.nextButtonText}>Get Started</Text>
            ) : (
              <ArrowRight size={24} color="#ffffff" />
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e2e8f0',
  },
  progressDotActive: {
    width: 24,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748b',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 48,
    alignItems: 'center',
  },
  stepImage: {
    width: width - 48,
    height: 280,
    borderRadius: 24,
    backgroundColor: '#f1f5f9',
  },
  iconOverlay: {
    position: 'absolute',
    bottom: -20,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  stepTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    marginBottom: 16,
  },
  stepDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  navButtonDisabled: {
    backgroundColor: '#f8fafc',
  },
  nextButton: {
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  nextButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
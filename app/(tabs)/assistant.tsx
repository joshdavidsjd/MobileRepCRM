import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, Lightbulb, Mail, Phone, Calendar, FileText } from 'lucide-react-native';

const Message = ({ message, isUser }: any) => (
  <View style={[styles.messageContainer, isUser ? styles.userMessage : styles.aiMessage]}>
    <View style={styles.messageIcon}>
      {isUser ? (
        <User size={16} color="#ffffff" />
      ) : (
        <Bot size={16} color="#2563eb" />
      )}
    </View>
    <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.aiBubble]}>
      <Text style={[styles.messageText, isUser ? styles.userText : styles.aiText]}>
        {message}
      </Text>
    </View>
  </View>
);

const QuickAction = ({ icon: Icon, title, description, onPress }: any) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress}>
    <View style={styles.quickActionIcon}>
      <Icon size={20} color="#2563eb" />
    </View>
    <View style={styles.quickActionContent}>
      <Text style={styles.quickActionTitle}>{title}</Text>
      <Text style={styles.quickActionDescription}>{description}</Text>
    </View>
  </TouchableOpacity>
);

const SuggestedPrompt = ({ prompt, onPress }: any) => (
  <TouchableOpacity style={styles.suggestedPrompt} onPress={() => onPress(prompt)}>
    <Text style={styles.suggestedPromptText}>{prompt}</Text>
  </TouchableOpacity>
);

export default function Assistant() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi Sarah! I'm your AI sales assistant. I can help you with lead qualification, deal analysis, email drafting, objection handling, and much more. What would you like to work on today?",
      isUser: false,
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickActions = [
    {
      icon: Mail,
      title: 'Draft Email',
      description: 'Create personalized follow-up emails',
      action: () => handleSuggestedPrompt('Help me draft a follow-up email for TechCorp deal'),
    },
    {
      icon: Phone,
      title: 'Call Prep',
      description: 'Prepare for upcoming sales calls',
      action: () => handleSuggestedPrompt('Help me prepare for my call with Jennifer Wilson'),
    },
    {
      icon: FileText,
      title: 'Proposal Help',
      description: 'Create compelling proposals',
      action: () => handleSuggestedPrompt('Help me create a proposal for DataFlow Solutions'),
    },
    {
      icon: Lightbulb,
      title: 'Deal Strategy',
      description: 'Get strategic advice for deals',
      action: () => handleSuggestedPrompt('What strategy should I use for the TechCorp negotiation?'),
    },
  ];

  const suggestedPrompts = [
    "Analyze my pipeline for Q1",
    "What objections might I face with GreenTech?",
    "Help me prioritize my leads this week",
    "Draft a LinkedIn connection message",
  ];

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
      };
      
      setMessages(prev => [...prev, newMessage]);
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse = generateAIResponse(inputText);
        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponse,
          isUser: false,
        };
        setMessages(prev => [...prev, aiMessage]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInputText(prompt);
  };

  const generateAIResponse = (userInput: string): string => {
    // Simple AI response simulation
    const input = userInput.toLowerCase();
    
    if (input.includes('email') || input.includes('follow-up')) {
      return "I'll help you draft a compelling follow-up email. Based on your recent interaction with TechCorp, here's a personalized approach:\n\nSubject: Next Steps for Your Digital Transformation Initiative\n\nHi Jennifer,\n\nThank you for the productive conversation yesterday. Based on your concerns about integration complexity, I've prepared a detailed technical overview that addresses your specific infrastructure requirements.\n\nI'd love to schedule a 30-minute call with your technical team to walk through our seamless integration process. Are you available this Thursday at 2 PM?\n\nBest regards,\nSarah";
    }
    
    if (input.includes('call') || input.includes('prep')) {
      return "Great! Let me help you prepare for your call with Jennifer Wilson from TechCorp. Here's what I recommend:\n\n🎯 **Key Points to Cover:**\n• Their budget approval timeline (Q1 priority)\n• Integration with their existing CRM system\n• Security compliance requirements\n\n📊 **Talking Points:**\n• Highlight our 99.9% uptime guarantee\n• Reference similar implementations (DataFlow case study)\n• Prepare ROI calculator for their team size\n\n❓ **Questions to Ask:**\n• What's driving the urgency for Q1 implementation?\n• Who else is involved in the final decision?\n• What's their biggest concern about switching platforms?";
    }
    
    if (input.includes('strategy') || input.includes('negotiation')) {
      return "For the TechCorp negotiation, I recommend a consultative approach. Here's my analysis:\n\n💡 **Key Insights:**\n• They're price-sensitive but value-focused\n• Decision timeline is Q1 (creates urgency)\n• Technical integration is their main concern\n\n🎯 **Recommended Strategy:**\n1. Lead with ROI and long-term value\n2. Offer phased implementation to reduce risk\n3. Include additional training/support in initial package\n4. Position as strategic partnership, not vendor relationship\n\n⚠️ **Watch Out For:**\n• Don't compete solely on price\n• Address integration concerns proactively\n• Get multiple stakeholders involved early";
    }
    
    if (input.includes('pipeline') || input.includes('analyze')) {
      return "Here's your Q1 pipeline analysis:\n\n📈 **Pipeline Health: Strong**\n• Total value: $845K across 23 deals\n• Average deal size: $37K (above target)\n• Win rate trending: 68% (up 5% from last quarter)\n\n🔥 **Hot Opportunities:**\n• TechCorp ($250K) - 85% probability, closes Mar 15\n• SecureBank ($95K) - 68% probability, urgent timeline\n\n⚠️ **Attention Needed:**\n• DataFlow deal stalled in negotiation - recommend value-based approach\n• GreenTech needs technical validation - schedule demo ASAP\n\n🎯 **Recommendation:**\nFocus on closing TechCorp and SecureBank this month to exceed Q1 target by 15%.";
    }
    
    return "I understand you're looking for help with that. Let me provide some insights based on your sales data and best practices. Could you provide more specific details about what you'd like me to focus on? I can help with lead qualification, deal analysis, email drafting, objection handling, or strategic planning.";
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Bot size={24} color="#2563eb" />
          </View>
          <Text style={styles.title}>AI Sales Assistant</Text>
        </View>

        {messages.length === 1 && (
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <QuickAction
                  key={index}
                  icon={action.icon}
                  title={action.title}
                  description={action.description}
                  onPress={action.action}
                />
              ))}
            </View>
          </View>
        )}

        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map((message) => (
            <Message key={message.id} message={message.text} isUser={message.isUser} />
          ))}
        </ScrollView>

        {messages.length === 1 && (
          <View style={styles.suggestedPromptsContainer}>
            <Text style={styles.suggestedPromptsTitle}>Try asking:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {suggestedPrompts.map((prompt, index) => (
                <SuggestedPrompt
                  key={index}
                  prompt={prompt}
                  onPress={handleSuggestedPrompt}
                />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ask me anything about your sales..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Send size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  headerIcon: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    width: '47%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActionIcon: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 2,
  },
  quickActionDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6b7280',
    lineHeight: 16,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
    gap: 12,
  },
  userMessage: {
    flexDirection: 'row-reverse',
  },
  aiMessage: {
    flexDirection: 'row',
  },
  messageIcon: {
    backgroundColor: '#2563eb',
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 16,
  },
  userBubble: {
    backgroundColor: '#2563eb',
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#111827',
  },
  suggestedPromptsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  suggestedPromptsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6b7280',
    marginBottom: 12,
  },
  suggestedPrompt: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  suggestedPromptText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    maxHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: '#2563eb',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
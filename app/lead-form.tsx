import React from 'react';
import { Modal } from 'react-native';
import { router } from 'expo-router';
import LeadForm from '@/components/forms/LeadForm';

export default function LeadFormScreen() {
  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <LeadForm
        onClose={handleClose}
        onSave={handleClose}
      />
    </Modal>
  );
}
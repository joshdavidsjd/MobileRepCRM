import React from 'react';
import { Modal } from 'react-native';
import { router } from 'expo-router';
import OpportunityForm from '@/components/forms/OpportunityForm';

export default function OpportunityFormScreen() {
  const handleClose = () => {
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <OpportunityForm
        onClose={handleClose}
        onSave={handleClose}
      />
    </Modal>
  );
}
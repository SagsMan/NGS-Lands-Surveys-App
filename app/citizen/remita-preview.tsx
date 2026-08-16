/**
 * Screenshot-only route — pre-opens the Remita payment modal for slide capture.
 * Hidden from the tab bar (no tabBarIcon).
 */
import React from 'react';
import { View } from 'react-native';
import RemitaPaymentModal from '@/components/RemitaPaymentModal';

export default function RemitaPreview() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <RemitaPaymentModal
        visible={true}
        onClose={() => {}}
        amount={15000}
        description="Certificate of Occupancy Application Fee"
        rrr="230006753476"
      />
    </View>
  );
}

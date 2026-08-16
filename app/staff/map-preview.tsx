/**
 * Screenshot-only route — shows the satellite map modal pre-opened.
 */
import React from 'react';
import { View } from 'react-native';
import MapModal from '@/components/MapModal';

export default function MapPreview() {
  return (
    <View style={{ flex: 1 }}>
      <MapModal
        visible={true}
        onClose={() => {}}
        lat={9.6139}
        lng={6.5569}
        address="No. 14, Tunga Layout, Minna"
        lga="Chanchaga"
      />
    </View>
  );
}

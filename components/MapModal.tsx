import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PRIMARY = '#13bf43';

interface MapModalProps {
  visible: boolean;
  onClose: () => void;
  lat: number;
  lng: number;
  address: string;
  lga?: string;
}

export function MapModal({ visible, onClose, lat, lng, address, lga }: MapModalProps) {
  const insets = useSafeAreaInsets();

  const region = {
    latitude: lat,
    longitude: lng,
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'fullScreen'}
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="location" size={18} color={PRIMARY} />
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={styles.address} numberOfLines={1}>{address}</Text>
              {lga ? <Text style={styles.lga}>{lga} LGA · Niger State</Text> : null}
            </View>
          </View>
          <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
            <Ionicons name="close" size={20} color="#374151" />
          </Pressable>
        </View>

        {/* Native satellite map — loads instantly, no CDN */}
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          mapType="hybrid"
          initialRegion={region}
          showsUserLocation={false}
          showsBuildings
          showsCompass
          rotateEnabled={false}
        >
          <Marker
            coordinate={{ latitude: lat, longitude: lng }}
            title={address}
            description={lga ? `${lga} LGA, Niger State` : 'Niger State'}
            pinColor={PRIMARY}
          />
        </MapView>

        {/* Footer */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
          <Text style={styles.footerNote}>Satellite imagery © Google Maps</Text>
          <Pressable onPress={onClose} style={styles.doneBtn}>
            <Text style={styles.doneBtnLabel}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    gap: 8,
  },
  headerLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  address: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#0a0a0a' },
  lga: { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#6b7280', marginTop: 2 },
  closeBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#f3f4f6',
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  map: { flex: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  footerNote: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 11, color: '#9ca3af' },
  doneBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 9,
  },
  doneBtnLabel: { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#fff' },
});

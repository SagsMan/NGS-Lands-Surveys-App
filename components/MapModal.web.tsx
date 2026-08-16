// Web-compatible map view — used instead of react-native-maps on web builds.
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#13bf43';
const BG = '#1a3a2a';
const CARD = '#ffffff';
const TEXT = '#0a0a0a';
const MUTED = '#6b7280';

interface MapModalProps {
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  lga?: string;
}

const MapModal: React.FC<MapModalProps> = ({
  visible = false,
  onClose,
  address = 'No. 14, Tunga Layout, Minna',
  lga = 'Chanchaga',
  lat = 9.6139,
  lng = 6.5569,
}) => (
  <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onClose} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={TEXT} />
        </Pressable>
        <Text style={styles.headerTitle}>Satellite Map — Inspection</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Satellite map mockup */}
      <View style={styles.mapArea}>
        {/* Simulated satellite tile grid */}
        <View style={styles.satGrid}>
          {[...Array(20)].map((_, i) => (
            <View key={i} style={[styles.satTile, { opacity: 0.6 + (i % 5) * 0.06 }]} />
          ))}
        </View>

        {/* Road-like overlays */}
        <View style={[styles.road, { top: '40%', left: 0, right: 0, height: 4 }]} />
        <View style={[styles.road, { top: 0, bottom: 0, left: '35%', width: 4 }]} />
        <View style={[styles.road, { top: '65%', left: 0, right: 0, height: 2.5, opacity: 0.5 }]} />

        {/* Land parcel outline */}
        <View style={styles.parcel}>
          <View style={styles.parcelInner} />
        </View>

        {/* Location pin */}
        <View style={styles.pinWrap}>
          <View style={styles.pinOuter}>
            <View style={styles.pinInner} />
          </View>
          <View style={styles.pinTail} />
        </View>

        {/* Coordinate badge */}
        <View style={styles.coordBadge}>
          <Ionicons name="location" size={12} color={PRIMARY} />
          <Text style={styles.coordText}>{lat.toFixed(4)}° N, {lng.toFixed(4)}° E</Text>
        </View>

        {/* Hybrid label */}
        <View style={styles.hybridBadge}>
          <Text style={styles.hybridText}>HYBRID</Text>
        </View>
      </View>

      {/* Info card */}
      <View style={styles.infoCard}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={PRIMARY} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Property Address</Text>
              <Text style={styles.infoValue}>{address}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Ionicons name="map-outline" size={18} color={PRIMARY} />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Local Government Area</Text>
              <Text style={styles.infoValue}>{lga} LGA, Minna, Niger State</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statVal}>450 sqm</Text>
              <Text style={styles.statLabel}>Land Size</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statVal}>Chanchaga</Text>
              <Text style={styles.statLabel}>District</Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statVal, { color: PRIMARY }]}>Verified</Text>
              <Text style={styles.statLabel}>Boundary</Text>
            </View>
          </View>
          <Pressable style={styles.startBtn} onPress={onClose}>
            <Ionicons name="camera-outline" size={18} color="#fff" />
            <Text style={styles.startBtnLabel}>Capture GPS & Start Inspection</Text>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

export default MapModal;
export { MapModal };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 56, paddingBottom: 14,
    backgroundColor: CARD, borderBottomWidth: 1, borderBottomColor: '#e5e7eb',
  },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: TEXT },
  mapArea: {
    flex: 1, backgroundColor: '#2d5a3d', overflow: 'hidden', position: 'relative',
  },
  satGrid: {
    position: 'absolute', inset: 0,
    flexDirection: 'row', flexWrap: 'wrap',
  },
  satTile: {
    width: '20%', height: '25%',
    backgroundColor: '#1e4a2e',
    borderWidth: 0.5, borderColor: '#2a5535',
  },
  road: { position: 'absolute', backgroundColor: '#8a7560' },
  parcel: {
    position: 'absolute', top: '28%', left: '25%', width: '30%', height: '30%',
    borderWidth: 3, borderColor: '#ffff00', borderStyle: 'dashed',
  },
  parcelInner: { flex: 1, backgroundColor: 'rgba(255,255,100,0.12)' },
  pinWrap: {
    position: 'absolute', top: '36%', left: '37%',
    alignItems: 'center',
  },
  pinOuter: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: PRIMARY, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, shadowRadius: 4,
    elevation: 8,
  },
  pinInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#fff' },
  pinTail: { width: 3, height: 10, backgroundColor: PRIMARY, marginTop: -2 },
  coordBadge: {
    position: 'absolute', bottom: 16, left: 16,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  coordText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#fff' },
  hybridBadge: {
    position: 'absolute', bottom: 16, right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)', borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  hybridText: { fontFamily: 'Inter_700Bold', fontSize: 11, color: '#fff', letterSpacing: 1 },
  infoCard: {
    backgroundColor: CARD, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: 20, paddingTop: 20, paddingBottom: 32, maxHeight: '42%',
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12,
    elevation: 16,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingVertical: 10 },
  infoLabel: { fontFamily: 'Inter_400Regular', fontSize: 12, color: MUTED },
  infoValue: { fontFamily: 'Inter_500Medium', fontSize: 14, color: TEXT, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#f3f4f6' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14 },
  stat: { alignItems: 'center' },
  statVal: { fontFamily: 'Inter_700Bold', fontSize: 15, color: TEXT },
  statLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: MUTED, marginTop: 2 },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: PRIMARY, borderRadius: 26, height: 52, marginTop: 12,
  },
  startBtnLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' },
});

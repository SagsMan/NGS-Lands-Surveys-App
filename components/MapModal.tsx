import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
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

/** Builds a self-contained HTML page with Leaflet + Google Satellite tiles */
function buildMapHtml(lat: number, lng: number, address: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', {
    center: [${lat}, ${lng}],
    zoom: 18,
    zoomControl: true,
    attributionControl: true
  });

  /* Google Satellite tiles — high-res real imagery */
  L.tileLayer(
    'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    {
      attribution: '&copy; Google Maps',
      maxZoom: 22,
      subdomains: ['mt0','mt1','mt2','mt3']
    }
  ).addTo(map);

  /* Custom green marker matching app brand */
  var icon = L.divIcon({
    html: '<div style="width:28px;height:38px;position:relative;">'
        + '<svg viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">'
        + '<path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24S28 24.5 28 14C28 6.3 21.7 0 14 0z" fill="#13bf43"/>'
        + '<circle cx="14" cy="14" r="6" fill="white"/>'
        + '</svg>'
        + '</div>',
    iconSize: [28, 38],
    iconAnchor: [14, 38],
    popupAnchor: [0, -40],
    className: ''
  });

  L.marker([${lat}, ${lng}], { icon: icon })
    .addTo(map)
    .bindPopup('<b style="font-size:13px;">${address.replace(/'/g, "\\'")}' + '</b>')
    .openPopup();
</script>
</body>
</html>`;
}

export function MapModal({ visible, onClose, lat, lng, address, lga }: MapModalProps) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = React.useState(true);

  const html = React.useMemo(() => buildMapHtml(lat, lng, address), [lat, lng, address]);

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

        {/* Satellite Map */}
        <View style={styles.mapContainer}>
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color={PRIMARY} />
              <Text style={styles.loadingText}>Loading satellite view…</Text>
            </View>
          )}
          <WebView
            source={{ html }}
            style={styles.webview}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState={false}
            originWhitelist={['*']}
          />
        </View>

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
  mapContainer: { flex: 1 },
  webview: { flex: 1 },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#1a1a2e',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    zIndex: 10,
  },
  loadingText: { fontFamily: 'Inter_400Regular', fontSize: 14, color: '#e5e7eb' },
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

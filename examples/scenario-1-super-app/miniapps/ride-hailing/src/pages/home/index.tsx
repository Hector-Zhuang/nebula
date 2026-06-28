import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  Map as NebulaMap,
  MarkerItem,
  PolylineItem,
} from '@nebula-rn/components';
import { Miniapp, usePageOnLoad } from '@nebula-rn/sdk';
import AccountScreen from '../account';
import {
  IconScan,
  IconLocate,
  IconCarClock,
  IconCarUser,
  IconPlane,
  IconPaw,
  IconPercent,
  IconCarLogo,
  IconUser,
} from './Icons';

const defaultRegion = {
  latitude: 43.6456,
  longitude: -79.3807,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

const servicesList = [
  { id: 'schedule', label: 'Schedule', component: <IconCarClock /> },
  { id: 'others', label: 'For Others', component: <IconCarUser /> },
  { id: 'airport', label: 'Airport', component: <IconPlane /> },
  { id: 'pet', label: 'Pet', component: <IconPaw /> },
  { id: 'code', label: 'Promo', component: <IconPercent /> },
] as const;

export default function HomeScreen() {
  const [pickupText, setPickupText] = useState('');
  const [destinationText, setDestinationText] = useState('');
  const [activeTab, setActiveTab] = useState<'taxi' | 'account'>('taxi');

  usePageOnLoad(() => {
    setPickupText('Union Station');
  });

  const markers = useMemo<MarkerItem[]>(() => {
    return [
      {
        id: 1,
        latitude: defaultRegion.latitude,
        longitude: defaultRegion.longitude,
        title: 'Pickup',
        iconPath: '',
      },
    ];
  }, []);

  const polyline = useMemo<PolylineItem[]>(() => [], []);

  const onFocusPickup = () => {};

  const onFocusDestination = () => {};

  const onPressScan = async () => {
    await Miniapp.showToast('Scanner opened');
  };

  const onPressService = async (serviceName: string) => {
    await Miniapp.showToast(`${serviceName} selected`);
  };

  const onPressLocate = async () => {
    await Miniapp.showToast('Locating user');
  };

  const onPressAccount = () => {
    setActiveTab('account');
  };

  const onPressTaxi = () => {
    setActiveTab('taxi');
  };

  if (activeTab === 'account') {
    return <AccountScreen onBackToTaxi={onPressTaxi} />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.mapContainer}>
        <NebulaMap
          latitude={defaultRegion.latitude}
          longitude={defaultRegion.longitude}
          showLocation={true}
          showCompass={false}
          enableZoom={true}
          enableScroll={true}
          enableRotate={false}
          markers={markers}
          polyline={polyline}
        />
      </View>

      <View style={styles.topArea}>
        <Pressable style={styles.cityBadge}>
          <Text style={styles.cityText}>Toronto</Text>
          <View style={styles.triangleDown} />
        </Pressable>
        <Pressable style={styles.scanButton} onPress={onPressScan}>
          <IconScan size={16} />
          <Text style={styles.scanText}>Scan</Text>
        </Pressable>
      </View>

      <View style={styles.bottomArea}>
        <View style={styles.locateButtonContainer}>
          <Pressable style={styles.locateButton} onPress={onPressLocate}>
            <IconLocate size={20} />
          </Pressable>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.inputRow}>
            <View style={styles.dotGreen} />
            <TextInput
              style={styles.pickupInput}
              value={pickupText}
              onChangeText={setPickupText}
              onFocus={onFocusPickup}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.inputRow}>
            <View style={styles.dotOrange} />
            <TextInput
              style={styles.destinationInput}
              placeholder="Where to?"
              placeholderTextColor="#000000"
              value={destinationText}
              onChangeText={setDestinationText}
              onFocus={onFocusDestination}
            />
          </View>
        </View>

        <View style={styles.servicesGrid}>
          {servicesList.map(service => (
            <Pressable
              key={service.id}
              style={styles.serviceItem}
              onPress={() => {
                onPressService(service.label).catch(onError);
              }}
            >
              <View style={styles.serviceIconContainer}>
                {service.component}
              </View>
              <Text style={styles.serviceLabel}>{service.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.linksContainer}>
          <Text style={styles.linkText}>Agreements & Rules</Text>
          <Text style={styles.linkText}>Business Licenses</Text>
        </View>

        <View style={styles.bottomNav}>
          <View style={styles.navItem}>
            <IconCarLogo size={24} />
            <Text style={styles.navTextActive}>Taxi</Text>
          </View>
          <Pressable style={styles.navItem} onPress={onPressAccount}>
            <IconUser size={24} />
            <Text style={styles.navTextInactive}>Account</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

function onError(error: unknown) {
  console.error('[Nebula] Miniapp action failed', error);
  Alert.alert(
    'Action Failed',
    error instanceof Error ? error.message : 'Unexpected application error.',
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mapContainer: {
    height: '60%',
    width: '100%',
    position: 'absolute',
    top: 0,
  },
  topArea: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  cityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 6,
  },
  triangleDown: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#0f172a',
    transform: [{ rotate: '180deg' }],
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  scanText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 6,
  },
  bottomArea: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  locateButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  locateButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mainCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dotGreen: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 12,
  },
  dotOrange: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
    marginRight: 12,
  },
  pickupInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    padding: 0,
  },
  destinationInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
    padding: 0,
  },
  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginLeft: 20,
    marginVertical: 4,
  },
  servicesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  serviceItem: {
    alignItems: 'center',
  },
  serviceIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontSize: 12,
    color: '#334155',
  },
  linksContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 40,
  },
  linkText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 12,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navTextActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#f97316',
  },
  navTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
});

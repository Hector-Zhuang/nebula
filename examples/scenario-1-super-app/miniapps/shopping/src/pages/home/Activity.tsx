import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import {
  IconHome,
  IconReceipt,
  IconUser,
  IconStar,
  IconStarOutline,
  IconCar,
  IconMapPin,
  IconClock,
} from './Icons';

type ActivityProps = {
  onSwitchTab: (tab: 'home' | 'activity' | 'account') => void;
};

const featuredTrip = {
  id: 'featured',
  title: 'Downtown Mall',
  from: 'City Art Museum',
  to: 'Main Boulevard',
  date: 'May 12',
  time: '7:48 PM',
  fare: '$25.00',
  mapColor: '#1e293b',
};

const pastTrips = [
  {
    id: '1',
    title: 'Central Park',
    date: 'May 12',
    time: '7:01 PM',
    fare: '$29.32',
    cancelled: false,
  },
  {
    id: '2',
    title: 'Main Street 45B',
    date: 'May 12',
    time: '6:54 PM',
    fare: '$0.00',
    cancelled: true,
    note: 'Cancelled - 2 drivers',
  },
  {
    id: '3',
    title: 'National Monument',
    date: 'May 12',
    time: '6:27 PM',
    fare: '$34.74',
    cancelled: false,
  },
  {
    id: '4',
    title: 'Hillside Ave 36C',
    date: 'May 11',
    time: '5:15 PM',
    fare: '$18.50',
    cancelled: false,
  },
];

export default function Activity({ onSwitchTab }: ActivityProps) {
  const onPressRate = async () => {
    await Miniapp.showToast('Rating opened');
  };

  const onPressTrip = async (title: string) => {
    await Miniapp.showToast(`Opened ${title}`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity</Text>
          <Text style={styles.headerSubtitle}>Past</Text>
        </View>

        <Pressable
          style={styles.featuredCard}
          onPress={() => onPressTrip(featuredTrip.title).catch(console.error)}
        >
          <View
            style={[
              styles.mapPreview,
              { backgroundColor: featuredTrip.mapColor },
            ]}
          >
            <View style={styles.mapRouteLine} />
            <View style={styles.mapDotOrigin} />
            <View style={styles.mapDotDest} />
          </View>
          <View style={styles.featuredInfo}>
            <Text style={styles.featuredTitle}>{featuredTrip.title}</Text>
            <View style={styles.routeRow}>
              <IconMapPin size={14} color="#ef4444" />
              <Text style={styles.routeText}>{featuredTrip.from}</Text>
            </View>
            <View style={styles.routeRow}>
              <IconMapPin size={14} color="#22c55e" />
              <Text style={styles.routeText}>{featuredTrip.to}</Text>
            </View>
            <View style={styles.tripMeta}>
              <IconClock size={14} />
              <Text style={styles.metaText}>
                {featuredTrip.date} - {featuredTrip.time}
              </Text>
              <Text style={styles.fareText}>{featuredTrip.fare}</Text>
            </View>
            <Pressable style={styles.rateButton} onPress={onPressRate}>
              <IconStar size={14} color="#f59e0b" />
              <Text style={styles.rateText}>Rate</Text>
            </Pressable>
          </View>
        </Pressable>

        <View style={styles.tripList}>
          {pastTrips.map(trip => (
            <Pressable
              key={trip.id}
              style={styles.tripItem}
              onPress={() => onPressTrip(trip.title).catch(console.error)}
            >
              <View style={styles.tripIconContainer}>
                <IconCar size={24} />
              </View>
              <View style={styles.tripContent}>
                <Text style={styles.tripTitle}>{trip.title}</Text>
                <View style={styles.tripMetaRow}>
                  <IconClock size={12} />
                  <Text style={styles.tripMetaText}>
                    {trip.date} - {trip.time}
                  </Text>
                </View>
                {trip.cancelled ? (
                  <Text style={styles.tripCancelled}>{trip.note}</Text>
                ) : (
                  <Text style={styles.tripFare}>{trip.fare}</Text>
                )}
              </View>
              <View style={styles.tripStars}>
                {[1, 2, 3, 4, 5].map(i => (
                  <IconStarOutline key={i} size={12} />
                ))}
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => onSwitchTab('home')}>
          <IconHome size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Home</Text>
        </Pressable>
        <View style={styles.navItem}>
          <IconReceipt size={24} color="#0f172a" />
          <Text style={styles.navTextActive}>Activity</Text>
        </View>
        <Pressable
          style={styles.navItem}
          onPress={() => onSwitchTab('account')}
        >
          <IconUser size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
    marginTop: 4,
  },
  featuredCard: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapPreview: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  mapRouteLine: {
    position: 'absolute',
    left: '30%',
    top: 20,
    width: 2,
    height: 100,
    backgroundColor: '#475569',
    borderRadius: 1,
  },
  mapDotOrigin: {
    position: 'absolute',
    left: '28%',
    top: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ef4444',
  },
  mapDotDest: {
    position: 'absolute',
    left: '28%',
    bottom: 16,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
  },
  featuredInfo: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  routeText: {
    fontSize: 14,
    color: '#64748b',
  },
  tripMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  metaText: {
    fontSize: 13,
    color: '#64748b',
  },
  fareText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 'auto',
  },
  rateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  rateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  tripList: {
    paddingHorizontal: 16,
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    gap: 14,
  },
  tripIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripContent: {
    flex: 1,
  },
  tripTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 4,
  },
  tripMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  tripMetaText: {
    fontSize: 13,
    color: '#64748b',
  },
  tripFare: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  tripCancelled: {
    fontSize: 13,
    color: '#ef4444',
  },
  tripStars: {
    flexDirection: 'row',
    gap: 2,
  },
  spacer: {
    height: 100,
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
    color: '#0f172a',
  },
  navTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
});

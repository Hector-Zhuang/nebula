import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { IconSearch, IconMapPin, IconChevronDown, IconClock } from './Icons';

type TabKey = 'home' | 'cinemas' | 'shows' | 'profile';

interface CinemasProps {
  onSwitchTab: (tab: TabKey) => void;
}

const cinemas = [
  {
    id: 'c1',
    name: 'AMC Empire 25',
    address: '234 W 42nd St, New York, NY 10036',
    parking: 'Free parking 3 hrs',
    distance: '0.1 mi',
    price: 'From $12.99',
    tags: ['Reschedule', 'Snacks', 'Loyalty', 'Coupons'],
    promos: [
      {
        label: 'OFF',
        color: '#ef4444',
        text: 'Buy 2+ tickets for Despicable Me 5, save up to $5 each',
      },
      { label: 'DEAL', color: '#f59e0b', text: '10 films on special offer' },
      { label: 'SALE', color: '#10b981', text: 'Weekend matinee special' },
      { label: 'CPN', color: '#8b5cf6', text: 'Claim your $2 coupon' },
    ],
  },
  {
    id: 'c2',
    name: 'Regal Cinemas Times Square',
    address: '247 W 42nd St, New York, NY 10036',
    parking: '',
    distance: '0.4 mi',
    price: 'From $12.99',
    tags: ['Refund', 'Reschedule', 'Snacks', 'Loyalty', 'Coupons'],
    promos: [
      {
        label: 'OFF',
        color: '#ef4444',
        text: 'Buy 2+ tickets for Despicable Me 5, save up to $5 each',
      },
      { label: 'DEAL', color: '#f59e0b', text: '3 films discounted this week' },
      { label: 'SALE', color: '#10b981', text: 'Tuesday discount all day' },
      { label: 'CPN', color: '#8b5cf6', text: 'Claim your $2 coupon' },
    ],
  },
  {
    id: 'c3',
    name: 'Cinemark XD & Luxury Loungers',
    address: '800 3rd Ave, New York, NY 10022',
    parking: '',
    distance: '0.8 mi',
    price: 'From $16.99',
    tags: ['Refund', 'Reschedule', 'Loyalty', 'IMAX', 'RealD 3D', 'Kids'],
    promos: [
      {
        label: 'OFF',
        color: '#ef4444',
        text: 'Buy 2+ tickets for Despicable Me 5, save up to $5 each',
      },
      {
        label: 'VIP',
        color: '#ec4899',
        text: 'Join loyalty program, first order up to $3 off',
      },
    ],
  },
];

export default function Cinemas({ onSwitchTab }: CinemasProps) {
  return (
    <View style={styles.screen}>
      {/* Header with tabs */}
      <View style={styles.header}>
        <View style={styles.tabsRow}>
          <Pressable style={styles.tab} onPress={() => onSwitchTab('home')}>
            <Text style={styles.tabText}>Now Playing</Text>
          </Pressable>
          <Pressable style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Cinemas</Text>
            <View style={styles.tabUnderline} />
          </Pressable>
          <Pressable style={styles.tab} onPress={() => onSwitchTab('shows')}>
            <Text style={styles.tabText}>Coming Soon</Text>
          </Pressable>
        </View>

        <View style={styles.cityRow}>
          <View style={styles.citySelector}>
            <IconMapPin size={12} color="#ef4444" />
            <Text style={styles.cityName}>New York</Text>
            <IconChevronDown size={12} color="#64748b" />
          </View>
          <Pressable style={styles.searchBar}>
            <IconSearch size={14} />
            <Text style={styles.searchText}>Search cinemas</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {cinemas.map(cinema => (
          <View key={cinema.id} style={styles.cinemaCard}>
            <View style={styles.cinemaHeader}>
              <View style={styles.cinemaTitleRow}>
                <Text style={styles.cinemaName}>{cinema.name}</Text>
                <View style={styles.distanceBadge}>
                  <IconMapPin size={10} color="#ef4444" />
                  <Text style={styles.distanceText}>{cinema.distance}</Text>
                </View>
              </View>
              <View style={styles.addressRow}>
                <Text style={styles.addressText}>{cinema.address}</Text>
                {cinema.parking ? (
                  <View style={styles.parkingTag}>
                    <IconClock size={10} color="#ef4444" />
                    <Text style={styles.parkingText}>{cinema.parking}</Text>
                  </View>
                ) : null}
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceText}>{cinema.price}</Text>
              </View>
            </View>

            <View style={styles.tagsRow}>
              {cinema.tags.map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>

            <View style={styles.promosSection}>
              {cinema.promos.map((promo, idx) => (
                <View key={idx} style={styles.promoRow}>
                  <View
                    style={[
                      styles.promoLabel,
                      { backgroundColor: promo.color },
                    ]}
                  >
                    <Text style={styles.promoLabelText}>{promo.label}</Text>
                  </View>
                  <Text style={styles.promoText} numberOfLines={1}>
                    {promo.text}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 24,
  },
  tab: {
    paddingBottom: 8,
    position: 'relative',
  },
  tabActive: {},
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '25%',
    right: '25%',
    height: 3,
    backgroundColor: '#ef4444',
    borderRadius: 2,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 10,
  },
  citySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cityName: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  searchText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  scrollArea: {
    flex: 1,
  },
  cinemaCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    padding: 14,
  },
  cinemaHeader: {
    marginBottom: 10,
  },
  cinemaTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cinemaName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginLeft: 8,
  },
  distanceText: {
    fontSize: 12,
    color: '#64748b',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 12,
    color: '#64748b',
  },
  parkingTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  parkingText: {
    fontSize: 11,
    color: '#ef4444',
  },
  priceRow: {
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ef4444',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#475569',
  },
  promosSection: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    gap: 6,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoLabel: {
    height: 18,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promoLabelText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '700',
  },
  promoText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
  },
  bottomSpace: {
    height: 80,
  },
});

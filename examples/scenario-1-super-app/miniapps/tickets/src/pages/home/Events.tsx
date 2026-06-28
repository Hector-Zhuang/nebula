import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import {
  IconSearch,
  IconMic,
  IconSmile,
  IconTheater,
  IconMusic,
  IconHeadphones,
  IconStar,
  IconTicket,
  IconGift,
  IconChevronRight,
  IconCalendar,
  IconCoupon,
} from './Icons';

type TabKey = 'home' | 'cinemas' | 'shows' | 'profile';

interface EventsProps {
  onSwitchTab: (tab: TabKey) => void;
}

const categories = [
  {
    id: '1',
    name: 'Concerts',
    icon: <IconMic size={22} color="#8b5cf6" />,
    bg: '#ede9fe',
  },
  {
    id: '2',
    name: 'Comedy',
    icon: <IconSmile size={22} color="#ec4899" />,
    bg: '#fce7f3',
  },
  {
    id: '3',
    name: 'Exhibitions',
    icon: <IconStar size={22} color="#f59e0b" />,
    bg: '#fef3c7',
  },
  {
    id: '4',
    name: 'Theater',
    icon: <IconTheater size={22} color="#f97316" />,
    bg: '#ffedd5',
  },
  {
    id: '5',
    name: 'Festivals',
    icon: <IconMusic size={22} color="#3b82f6" />,
    bg: '#dbeafe',
  },
  {
    id: '6',
    name: 'Family',
    icon: <IconSmile size={22} color="#a855f7" />,
    bg: '#f3e8ff',
  },
  {
    id: '7',
    name: 'Symphony',
    icon: <IconHeadphones size={22} color="#7c3aed" />,
    bg: '#ede9fe',
  },
  {
    id: '8',
    name: 'Opera',
    icon: <IconTheater size={22} color="#ef4444" />,
    bg: '#fee2e2',
  },
  {
    id: '9',
    name: 'Top Charts',
    icon: <IconStar size={22} color="#f59e0b" />,
    bg: '#fef3c7',
  },
  {
    id: '10',
    name: 'Watch Party',
    icon: <IconGift size={22} color="#f97316" />,
    bg: '#fff7ed',
  },
];

const hotPicks = [
  {
    id: 'h1',
    category: 'Theater',
    title: 'Hamilton – Broadway Revival',
    price: 'From $79',
    imgColor: '#1e293b',
  },
  {
    id: 'h2',
    category: 'Exhibitions',
    title: 'Van Gogh Immersive Experience',
    price: 'From $35',
    imgColor: '#7c3aed',
  },
  {
    id: 'h3',
    category: 'Exhibitions',
    title: 'TeamLab Borderless NYC',
    price: '40% Off',
    imgColor: '#0ea5e9',
    discount: true,
  },
  {
    id: 'h4',
    category: 'Theater',
    title: 'The Lion King – Broadway',
    price: '$20 off per ticket',
    imgColor: '#be123c',
    discount: true,
  },
];

const performers = [
  { name: 'Taylor Swift', color: '#1e293b' },
  { name: 'Ed Sheeran', color: '#7c3aed' },
  { name: 'Bruno Mars', color: '#b45309' },
  { name: 'Coldplay', color: '#0369a1' },
  { name: 'Adele', color: '#4c1d95' },
  { name: 'Beyoncé', color: '#be123c' },
];

export default function Events({ onSwitchTab }: EventsProps) {
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.searchBar}>
          <IconSearch size={14} />
          <Text style={styles.searchText}>Search artists, events, venues</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {/* Category grid */}
        <View style={styles.categoryGrid}>
          {categories.map(cat => (
            <Pressable key={cat.id} style={styles.categoryItem}>
              <View style={[styles.catIconWrap, { backgroundColor: cat.bg }]}>
                {cat.icon}
              </View>
              <Text style={styles.catName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        {/* Featured banner */}
        <Pressable style={styles.featuredBanner}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextBlock}>
              <Text style={styles.bannerTitle} numberOfLines={2}>
                Taylor Swift | The Eras Tour – New York
              </Text>
              <Text style={styles.bannerVenue}>
                MetLife Stadium, East Rutherford, NJ
              </Text>
              <View style={styles.bannerStatusRow}>
                <View style={styles.hotBadge}>
                  <Text style={styles.hotBadgeText}>Selling Fast</Text>
                </View>
              </View>
            </View>
            <View style={styles.bannerCTA}>
              <Text style={styles.bannerCTAText}>Get Tickets {'>'}</Text>
            </View>
          </View>
        </Pressable>

        {/* Today's Picks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Picks</Text>
            <Text style={styles.sectionLink}>More {'>'}</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotScroll}
          >
            {hotPicks.map(item => (
              <Pressable key={item.id} style={styles.hotCard}>
                <View
                  style={[styles.hotPoster, { backgroundColor: item.imgColor }]}
                >
                  {item.discount ? (
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>{item.price}</Text>
                    </View>
                  ) : null}
                  <View style={styles.catBadge}>
                    <Text style={styles.catBadgeText}>{item.category}</Text>
                  </View>
                </View>
                <Text style={styles.hotTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.hotPrice}>{item.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Highlighted concert card */}
        <Pressable style={styles.highlightCard}>
          <View style={styles.highlightImg}>
            <Text style={styles.highlightImgLabel}>Taylor Swift</Text>
          </View>
          <View style={styles.highlightBody}>
            <Text style={styles.highlightTitle}>
              Taylor Swift | The Eras Tour
            </Text>
            <Text style={styles.highlightSubtitle}>
              New York – MetLife Stadium
            </Text>
            <View style={styles.highlightStatusRow}>
              <View style={styles.fireHotBadge}>
                <Text style={styles.fireHotText}>🔥 Selling Fast</Text>
              </View>
            </View>
            <View style={styles.highlightBtns}>
              <View style={styles.btnBuy}>
                <Text style={styles.btnBuyText}>Get Tickets</Text>
              </View>
              <View style={styles.btnAdd}>
                <Text style={styles.btnAddText}>+ Request Show</Text>
              </View>
            </View>
          </View>

          {/* Performers row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.performerRow}
          >
            {performers.map(p => (
              <View key={p.name} style={styles.performerItem}>
                <View
                  style={[styles.performerAvatar, { backgroundColor: p.color }]}
                />
                <Text style={styles.performerName}>{p.name}</Text>
              </View>
            ))}
          </ScrollView>
        </Pressable>

        {/* Event Calendar */}
        <View style={styles.serviceRow}>
          <Pressable style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: '#dbeafe' }]}>
              <IconCalendar size={20} color="#3b82f6" />
            </View>
            <View style={styles.serviceTexts}>
              <Text style={styles.serviceName}>Event Calendar</Text>
              <Text style={styles.serviceDesc}>Browse by date</Text>
            </View>
          </Pressable>

          <Pressable style={styles.serviceCard}>
            <View style={[styles.serviceIcon, { backgroundColor: '#fee2e2' }]}>
              <IconCoupon size={20} color="#ef4444" />
            </View>
            <View style={styles.serviceTexts}>
              <Text style={styles.serviceName}>Daily Deals</Text>
              <Text style={styles.serviceDesc}>Grab $50 coupons</Text>
            </View>
            <View style={styles.serviceDiscountBadge}>
              <Text style={styles.serviceDiscountText}>Up to 40% off</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  searchText: { fontSize: 13, color: '#94a3b8' },
  scrollArea: { flex: 1 },

  // Category grid
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  categoryItem: {
    width: '20%',
    alignItems: 'center',
    marginBottom: 12,
  },
  catIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  catName: { fontSize: 11, color: '#334155', textAlign: 'center' },

  // Featured banner
  featuredBanner: {
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    overflow: 'hidden',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
  },
  bannerTextBlock: { flex: 1, marginRight: 10 },
  bannerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 6,
  },
  bannerVenue: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 8,
  },
  bannerStatusRow: {},
  hotBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  hotBadgeText: { fontSize: 11, color: '#ffffff', fontWeight: '600' },
  bannerCTA: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  bannerCTAText: { fontSize: 13, fontWeight: '700', color: '#7c2d12' },

  // Today's Picks
  section: { paddingTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
  sectionLink: { fontSize: 12, color: '#64748b' },
  hotScroll: { paddingHorizontal: 12, gap: 10 },
  hotCard: { width: 120 },
  hotPoster: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginBottom: 6,
    padding: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catBadgeText: { color: '#ffffff', fontSize: 10 },
  discountBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#ef4444',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: { color: '#ffffff', fontSize: 10, fontWeight: '700' },
  hotTitle: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    marginBottom: 3,
  },
  hotPrice: { fontSize: 11, color: '#ef4444', fontWeight: '600' },

  // Highlighted concert card
  highlightCard: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#fdf2f8',
    borderRadius: 12,
    padding: 12,
  },
  highlightImg: {
    height: 100,
    backgroundColor: '#be185d',
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightImgLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  highlightBody: { marginBottom: 12 },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  highlightSubtitle: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 6,
  },
  highlightStatusRow: { marginBottom: 10 },
  fireHotBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  fireHotText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
  highlightBtns: { flexDirection: 'row', gap: 8 },
  btnBuy: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnBuyText: { color: '#ffffff', fontSize: 13, fontWeight: '700' },
  btnAdd: {
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnAddText: { color: '#ef4444', fontSize: 13, fontWeight: '600' },

  // Performers
  performerRow: { gap: 12, paddingBottom: 4 },
  performerItem: { alignItems: 'center', width: 52 },
  performerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 4,
  },
  performerName: { fontSize: 11, color: '#334155', textAlign: 'center' },

  // Service row
  serviceRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingTop: 12,
    gap: 8,
  },
  serviceCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  serviceIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTexts: { flex: 1 },
  serviceName: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  serviceDesc: { fontSize: 11, color: '#64748b', marginTop: 2 },
  serviceDiscountBadge: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  serviceDiscountText: { fontSize: 10, color: '#ef4444', fontWeight: '700' },
  bottomSpace: { height: 80 },
});

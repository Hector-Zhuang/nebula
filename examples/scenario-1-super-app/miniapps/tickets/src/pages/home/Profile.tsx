import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import {
  IconChevronRight,
  IconStar,
  IconFilm,
  IconMusic,
  IconTicket,
  IconSmile,
  IconCoupon,
  IconUser,
  IconEdit,
  IconHeart,
  IconGift,
} from './Icons';

type TabKey = 'home' | 'cinemas' | 'shows' | 'profile';

interface ProfileProps {
  onSwitchTab: (tab: TabKey) => void;
}

const orderTabs = [
  {
    id: 'o1',
    name: 'Movies',
    icon: <IconFilm size={22} color="#ef4444" />,
    bg: '#fee2e2',
  },
  {
    id: 'o2',
    name: 'Concerts',
    icon: <IconMusic size={22} color="#8b5cf6" />,
    bg: '#ede9fe',
  },
  {
    id: 'o3',
    name: 'Streaming',
    icon: <IconTicket size={22} color="#3b82f6" />,
    bg: '#dbeafe',
  },
  {
    id: 'o4',
    name: 'Merch',
    icon: <IconSmile size={22} color="#f59e0b" />,
    bg: '#fef3c7',
  },
];

const cardStats = [
  { id: 'k1', label: 'Coupons', value: '0 Available' },
  { id: 'k2', label: 'Cinema Card', value: '1 Expired' },
  { id: 'k3', label: 'Gift Card', value: 'Add Card' },
  { id: 'k4', label: 'Rewards', value: '181 pts' },
];

const featuredServices = [
  {
    id: 'f1',
    name: 'Attendee Info',
    desc: 'Manage ID & address\nBook faster',
    icon: <IconEdit size={22} color="#f97316" />,
    bg: '#fff7ed',
  },
  {
    id: 'f2',
    name: 'Group Bookings',
    desc: 'View details & invoices\nTap to enter',
    icon: <IconTicket size={22} color="#ec4899" />,
    bg: '#fdf2f8',
  },
  {
    id: 'f3',
    name: 'Free Events',
    desc: 'Exhibitions & shows\nFree experiences',
    icon: <IconStar size={22} color="#8b5cf6" />,
    bg: '#f3e8ff',
  },
  {
    id: 'f4',
    name: 'Saver Pass',
    desc: 'Dual perks\nInstant discounts',
    icon: <IconHeart size={22} color="#10b981" />,
    bg: '#d1fae5',
  },
];

export default function Profile({ onSwitchTab }: ProfileProps) {
  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {/* User info header */}
        <View style={styles.userHeader}>
          <View style={styles.userRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar} />
            </View>
            <View style={styles.userInfo}>
              <View style={styles.usernameRow}>
                <Text style={styles.username}>John Smith</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelText}>Lv2</Text>
                </View>
              </View>
              <View style={styles.growthRow}>
                <View style={styles.growthBar}>
                  <View style={[styles.growthFill, { width: '23%' }]} />
                </View>
                <Text style={styles.growthText}>200/850</Text>
              </View>
            </View>
            <Pressable style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>My Profile</Text>
              <IconChevronRight size={14} color="#64748b" />
            </Pressable>
          </View>
        </View>

        {/* Watchlist */}
        <View style={styles.whiteCard}>
          <View style={styles.watchRow}>
            <Pressable style={styles.watchItem}>
              <Text style={styles.watchCount}>25</Text>
              <Text style={styles.watchLabel}>To Review</Text>
            </Pressable>
            <View style={styles.watchDivider} />
            <Pressable style={styles.watchItem}>
              <Text style={styles.watchCount}>27</Text>
              <Text style={styles.watchLabel}>Saved Events</Text>
            </Pressable>
            <View style={styles.watchDivider} />
            <Pressable style={styles.watchItem}>
              <Text style={styles.watchCount}>0</Text>
              <Text style={styles.watchLabel}>Fast Pass</Text>
            </Pressable>
          </View>
        </View>

        {/* My Orders */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>My Orders</Text>
          <View style={styles.orderRow}>
            {orderTabs.map(item => (
              <Pressable key={item.id} style={styles.orderItem}>
                <View
                  style={[styles.orderIconWrap, { backgroundColor: item.bg }]}
                >
                  {item.icon}
                </View>
                <Text style={styles.orderName}>{item.name}</Text>
              </Pressable>
            ))}
          </View>

          {/* Order recommend */}
          <View style={styles.orderRecommend}>
            <View style={styles.recPoster} />
            <View style={styles.recInfo}>
              <Text style={styles.recTitle}>Dune: Part Two</Text>
              <Text style={styles.recDesc}>
                Review to earn 10 reward points
              </Text>
            </View>
            <Pressable style={styles.recBtn}>
              <Text style={styles.recBtnText}>Review</Text>
            </Pressable>
          </View>
        </View>

        {/* Cards & Coupons */}
        <View style={styles.whiteCard}>
          <View style={styles.cardStatsRow}>
            {cardStats.map(s => (
              <Pressable key={s.id} style={styles.cardStatItem}>
                <Text style={styles.cardStatValue}>{s.value}</Text>
                <Text style={styles.cardStatLabel}>{s.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Featured Services */}
        <View style={styles.whiteCard}>
          <Text style={styles.cardTitle}>Featured Services</Text>
          <View style={styles.serviceGrid}>
            {featuredServices.map(s => (
              <Pressable key={s.id} style={styles.serviceCard}>
                <View
                  style={[styles.serviceIconWrap, { backgroundColor: s.bg }]}
                >
                  {s.icon}
                </View>
                <View style={styles.serviceTexts}>
                  <Text style={styles.serviceName}>{s.name}</Text>
                  <Text style={styles.serviceDesc}>{s.desc}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8fafc' },
  scrollArea: { flex: 1 },

  // User header
  userHeader: {
    backgroundColor: '#fce7f3',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: { marginRight: 4 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
  },
  userInfo: { flex: 1 },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  levelBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  levelText: { fontSize: 11, color: '#7c2d12', fontWeight: '700' },
  growthRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  growthBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  growthFill: {
    height: 6,
    backgroundColor: '#ef4444',
    borderRadius: 3,
  },
  growthText: { fontSize: 12, color: '#475569' },
  profileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  profileBtnText: { fontSize: 13, color: '#64748b' },

  // White cards
  whiteCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    padding: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },

  // Watchlist
  watchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  watchItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  watchCount: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  watchLabel: { fontSize: 12, color: '#64748b' },
  watchDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f1f5f9',
  },

  // My Orders
  orderRow: {
    flexDirection: 'row',
    marginBottom: 14,
  },
  orderItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  orderIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderName: { fontSize: 11, color: '#334155' },

  // Order recommend
  orderRecommend: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    gap: 10,
  },
  recPoster: {
    width: 48,
    height: 64,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
  recInfo: { flex: 1, gap: 4 },
  recTitle: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  recDesc: { fontSize: 11, color: '#64748b' },
  recBtn: {
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recBtnText: { fontSize: 12, color: '#ef4444', fontWeight: '600' },

  // Cards & Coupons
  cardStatsRow: {
    flexDirection: 'row',
  },
  cardStatItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  cardStatValue: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  cardStatLabel: { fontSize: 11, color: '#64748b' },

  // Featured Services
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceCard: {
    width: '48%',
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    gap: 8,
    alignItems: 'flex-start',
  },
  serviceIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceTexts: { flex: 1 },
  serviceName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 3,
  },
  serviceDesc: { fontSize: 10, color: '#64748b', lineHeight: 14 },

  bottomSpace: { height: 80 },
});

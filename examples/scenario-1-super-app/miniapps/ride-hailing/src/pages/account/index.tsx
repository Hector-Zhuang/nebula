import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import { IconCarLogo, IconUser } from '../home/Icons';

type AccountScreenProps = {
  onBackToTaxi: () => void;
};
import {
  IconClipboard,
  IconWallet,
  IconReceipt,
  IconHeadset,
  IconTicket,
  IconCard,
  IconCode,
  IconGift,
  IconShield,
  IconGlobe,
  IconGear,
  IconChevronRight,
  IconMegaphone,
} from './Icons';

const quickActions = [
  { id: 'trips', label: 'My Trips', icon: <IconClipboard size={26} /> },
  { id: 'wallet', label: 'Wallet', icon: <IconWallet size={26} /> },
  { id: 'invoice', label: 'Invoice', icon: <IconReceipt size={26} /> },
  { id: 'help', label: 'Help', icon: <IconHeadset size={26} /> },
] as const;

const menuItems = [
  { id: 'coupon', label: 'Coupon', icon: <IconTicket /> },
  { id: 'travel-card', label: 'Travel Card', icon: <IconCard /> },
  { id: 'code', label: 'Code', icon: <IconCode /> },
  { id: 'deals', label: 'Deals', icon: <IconGift /> },
  { id: 'safety', label: 'Safety', icon: <IconShield /> },
  { id: 'language', label: 'Language', icon: <IconGlobe />, badge: 'EN' },
  { id: 'settings', label: 'Settings', icon: <IconGear /> },
] as const;

export default function AccountScreen({ onBackToTaxi }: AccountScreenProps) {
  const onPressQuickAction = async (label: string) => {
    await Miniapp.showToast(`${label} opened`);
  };

  const onPressMenuItem = async (label: string) => {
    await Miniapp.showToast(`${label} opened`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>V</Text>
          </View>
          <Text style={styles.phoneText}>+647****0123</Text>
        </View>

        <View style={styles.quickActions}>
          {quickActions.map(item => (
            <Pressable
              key={item.id}
              style={styles.quickActionItem}
              onPress={() => {
                onPressQuickAction(item.label).catch(console.error);
              }}
            >
              <View style={styles.quickActionIcon}>{item.icon}</View>
              <Text style={styles.quickActionLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.promoBanner}>
          <View style={styles.promoLeft}>
            <Text style={styles.promoTitle}>Share Your Thoughts!</Text>
            <Text style={styles.promoSubtitle}>Your opinion matters to us</Text>
          </View>
          <View style={styles.promoIcon}>
            <IconMegaphone size={28} color="#ffffff" />
          </View>
        </View>

        <View style={styles.menuList}>
          {menuItems.map(item => (
            <Pressable
              key={item.id}
              style={styles.menuItem}
              onPress={() => {
                onPressMenuItem(item.label).catch(console.error);
              }}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>{item.icon}</View>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuRight}>
                {'badge' in item && item.badge ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                ) : null}
                <IconChevronRight />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={onBackToTaxi}>
          <IconCarLogo size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Taxi</Text>
        </Pressable>
        <View style={styles.navItem}>
          <IconUser size={24} color="#f97316" />
          <Text style={styles.navTextActive}>Account</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#0f172a',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  quickActionItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 13,
    color: '#334155',
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: '#f97316',
  },
  promoLeft: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  promoIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuList: {
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuLabel: {
    fontSize: 16,
    color: '#334155',
  },
  menuRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400e',
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
    color: '#f97316',
  },
  navTextInactive: {
    fontSize: 12,
    fontWeight: '500',
    color: '#94a3b8',
  },
});

import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import {
  IconHome,
  IconReceipt,
  IconUser,
  IconHeadset,
  IconWallet,
  IconShield,
  IconInbox,
  IconChevronRight,
  IconLeaf,
  IconUsers,
  IconGift,
  IconStar,
} from './Icons';

type AccountProps = {
  onSwitchTab: (tab: 'home' | 'activity' | 'account') => void;
};

const quickActions = [
  {
    id: 'help',
    label: 'Help',
    icon: <IconHeadset size={24} color="#334155" />,
  },
  {
    id: 'wallet',
    label: 'Wallet',
    icon: <IconWallet size={24} color="#334155" />,
  },
  {
    id: 'safety',
    label: 'Safety',
    icon: <IconShield size={24} color="#334155" />,
  },
  {
    id: 'inbox',
    label: 'Inbox',
    icon: <IconInbox size={24} color="#334155" />,
  },
] as const;

export default function Account({ onSwitchTab }: AccountProps) {
  const onPressQuickAction = async (label: string) => {
    await Miniapp.showToast(`${label} opened`);
  };

  const onPressMenuItem = async (label: string) => {
    await Miniapp.showToast(`${label} opened`);
  };

  return (
    <View style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <IconUser size={36} color="#94a3b8" />
          </View>
          <Text style={styles.userName}>Héctor Chong</Text>
          <View style={styles.ratingBadge}>
            <IconStar size={12} color="#f59e0b" />
            <Text style={styles.ratingText}>4.95</Text>
          </View>
        </View>

        <View style={styles.quickGrid}>
          {quickActions.map(item => (
            <Pressable
              key={item.id}
              style={styles.quickCard}
              onPress={() =>
                onPressQuickAction(item.label).catch(console.error)
              }
            >
              <View style={styles.quickCardIcon}>{item.icon}</View>
              <Text style={styles.quickCardLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Pressable
            style={styles.listCard}
            onPress={() =>
              onPressMenuItem('Safety checkup').catch(console.error)
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBlue}>
                <IconShield size={20} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Safety checkup</Text>
                <Text style={styles.cardSubtitle}>
                  Learn ways to make rides safer
                </Text>
              </View>
            </View>
            <View style={styles.progressCircle}>
              <Text style={styles.progressText}>1/7</Text>
            </View>
          </Pressable>

          <Pressable
            style={styles.listCard}
            onPress={() =>
              onPressMenuItem('Privacy checkup').catch(console.error)
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBlue}>
                <IconShield size={20} color="#2563eb" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Privacy checkup</Text>
                <Text style={styles.cardSubtitle}>
                  Take an interactive tour of your privacy settings
                </Text>
              </View>
            </View>
            <IconChevronRight />
          </Pressable>

          <Pressable
            style={styles.listCard}
            onPress={() =>
              onPressMenuItem('Estimated CO₂ saved').catch(console.error)
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBlue}>
                <IconLeaf size={20} color="#22c55e" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Estimated CO₂ saved</Text>
              </View>
            </View>
            <Text style={styles.co2Value}>0 g</Text>
          </Pressable>

          <Pressable
            style={styles.listCard}
            onPress={() =>
              onPressMenuItem('Invite friends to Uber').catch(console.error)
            }
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBlue}>
                <IconGift size={20} color="#f59e0b" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Invite friends to Uber</Text>
                <Text style={styles.cardSubtitle}>
                  Each of you will get TWD 300 off 1 Uber rides
                </Text>
              </View>
            </View>
            <IconChevronRight />
          </Pressable>
        </View>

        <View style={styles.section}>
          <Pressable
            style={styles.listCard}
            onPress={() => onPressMenuItem('Family').catch(console.error)}
          >
            <View style={styles.cardLeft}>
              <View style={styles.cardIconBlue}>
                <IconUsers size={20} color="#64748b" />
              </View>
              <View>
                <Text style={styles.cardTitle}>Family</Text>
                <Text style={styles.cardSubtitle}>
                  Manage teen, adult, and senior accounts
                </Text>
              </View>
            </View>
            <IconChevronRight />
          </Pressable>
        </View>

        <Text style={styles.footerText}>A simplified app for older adults</Text>

        <View style={styles.spacer} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => onSwitchTab('home')}>
          <IconHome size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Home</Text>
        </Pressable>
        <Pressable
          style={styles.navItem}
          onPress={() => onSwitchTab('activity')}
        >
          <IconReceipt size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Activity</Text>
        </Pressable>
        <View style={styles.navItem}>
          <IconUser size={24} color="#0f172a" />
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
  scroll: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 6,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  quickCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  quickCardIcon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickCardLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
  section: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cardIconBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  progressCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  co2Value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#22c55e',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 16,
  },
  spacer: {
    height: 40,
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

import { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { defaultHostApis } from '@nebula-rn/host-apis';
import type { MiniappLoadingProps } from '@nebula-rn/sdk';
import { NebulaAPI } from '@nebula-rn/sdk';
import Animated, {
  Easing,
  FadeInUp,
  FadeOut,
  FadeOutDown,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Line, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

const HOST_SERVER_BASE_URL = 'http://localhost:3001/api';

const MINI_APPS = {
  ride: { appId: 'superapp-ride-hailing', label: 'Ride', icon: '🚗' },
  shop: { appId: 'superapp-shopping', label: 'Shop', icon: '🛍️' },
  travel: { appId: 'superapp-travel', label: 'Tickets', icon: '🎫' },
  pay: { appId: 'superapp-payments', label: 'Pay', icon: '💳' },
} as const;

const FABRICATED_CHATS = [
  {
    id: '1',
    name: 'Hector Zhuang',
    preview: 'Are we still on for the meeting tomorrow?',
    time: '12:05',
    unread: 2,
    isRead: false,
    avatarColor: '#ec4899',
  },
  {
    id: '2',
    name: 'Tech Team Alpha',
    preview: 'James: The deployment was successful.',
    time: 'Yesterday',
    unread: 0,
    isRead: true,
    avatarColor: '#3b82f6',
  },
  {
    id: '3',
    name: 'Michael Chen',
    preview: 'Sounds good, see you then!',
    time: 'Sunday',
    unread: 0,
    isRead: true,
    avatarColor: '#f59e0b',
  },
  {
    id: '4',
    name: 'Design Sync',
    preview: 'Sarah sent an attachment.',
    time: 'Sunday',
    unread: 0,
    isRead: false,
    avatarColor: '#10b981',
  },
  {
    id: '5',
    name: 'Mom',
    preview: 'Call me when you get home.',
    time: 'Saturday',
    unread: 0,
    isRead: true,
    avatarColor: '#8b5cf6',
  },
];

const IconEllipsis = ({ size = 24, color = '#111827' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="5" cy="12" r="1.5" fill={color} />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Circle cx="19" cy="12" r="1.5" fill={color} />
  </Svg>
);

const IconCamera = ({ size = 20, color = '#111827' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <Circle cx="12" cy="13" r="4" />
  </Svg>
);

const IconPlus = ({ size = 24, color = '#ffffff' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Line x1="12" y1="5" x2="12" y2="19" />
    <Line x1="5" y1="12" x2="19" y2="12" />
  </Svg>
);

const IconSearch = ({ size = 18, color = '#6b7280' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="11" cy="11" r="8" />
    <Line x1="21" y1="21" x2="16.65" y2="16.65" />
  </Svg>
);

const IconReadTicks = ({ size = 16, color = '#3b82f6' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Polyline points="18 6 11 15 7 11" />
    <Polyline points="22 6 15 15 13 13" />
  </Svg>
);

const IconUpdates = ({ size = 24, color = '#111827' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Circle cx="12" cy="12" r="10" strokeDasharray="8 4" />
    <Circle cx="12" cy="12" r="4" fill={color} />
  </Svg>
);

const IconCalls = ({ size = 24, color = '#111827' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const IconCommunities = ({ size = 24, color = '#111827' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <Circle cx="9" cy="7" r="4" />
    <Path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <Path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </Svg>
);

const IconChats = ({ size = 24, color = '#111827' }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

function DefaultMiniappLoadingScreen({
  appId,
  title,
  status,
}: MiniappLoadingProps) {
  const [closing, setClosing] = useState(false);

  const message =
    status === 'installing'
      ? 'Installing latest update...'
      : status === 'error'
        ? 'Failed to load.'
        : 'Preparing...';

  const onCancelPress = async () => {
    if (closing) return;
    try {
      setClosing(true);
      await NebulaAPI.closeMiniApp(appId);
    } catch {
      Alert.alert('Error', 'Unable to close the miniapp right now.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <Animated.View
      exiting={FadeOut.duration(160)}
      style={styles.miniappLoadingOverlay}
    >
      <Animated.View
        entering={FadeInUp.duration(300)
          .easing(Easing.out(Easing.cubic))
          .withInitialValues({
            transform: [{ translateY: 20 }, { scale: 0.98 }],
            opacity: 0,
          })}
        exiting={FadeOutDown.duration(200)}
        style={styles.miniappLoadingCard}
      >
        <ActivityIndicator
          size="large"
          color="#16a34a"
          style={styles.miniappLoadingIndicator}
        />
        <Text style={styles.miniappLoadingTitle}>{title || appId}</Text>
        <Text style={styles.miniappLoadingMessage}>{message}</Text>

        {status !== 'installing' && (
          <Pressable
            disabled={closing}
            onPress={onCancelPress}
            style={styles.miniappLoadingCloseButton}
          >
            <Text style={styles.miniappLoadingCloseButtonText}>
              {closing ? 'Closing...' : 'Cancel'}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </Animated.View>
  );
}

function HostAppContent() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState('All');

  const onPressOpenApp = useCallback(async (appId: string, title: string) => {
    try {
      await NebulaAPI.uninstallMiniApp(appId);

      await NebulaAPI.openMiniApp(appId, {}, 'release');
    } catch (error) {
      Alert.alert(
        'Launch Failed',
        `${title} could not be opened. ${error instanceof Error ? error.message : ''}`,
      );
    }
  }, []);

  const onPressFilter = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <Pressable style={styles.iconCircleLight}>
          <IconEllipsis size={20} />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.iconCircleLight}>
            <IconCamera size={20} />
          </Pressable>
          <Pressable style={styles.iconCircleGreen}>
            <IconPlus size={24} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.pageTitle}>Chats</Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.flex1}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <IconSearch size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Ask Meta AI or Search"
            placeholderTextColor="#6b7280"
            editable={false}
          />
        </View>

        <View style={styles.miniappsContainer}>
          {Object.values(MINI_APPS).map(app => (
            <Pressable
              key={app.appId}
              style={styles.miniappItem}
              onPress={() => onPressOpenApp(app.appId, app.label)}
            >
              <View style={styles.miniappIconBox}>
                <Text style={styles.miniappEmoji}>{app.icon}</Text>
              </View>
              <Text style={styles.miniappLabel}>{app.label}</Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {['All', 'Unread 3', 'Favourites', 'Groups', '+'].map(filter => {
            const isActive = activeFilter === filter;
            return (
              <Pressable
                key={filter}
                style={[styles.filterPill, isActive && styles.filterPillActive]}
                onPress={() => onPressFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.chatList}>
          {FABRICATED_CHATS.map(chat => (
            <Pressable key={chat.id} style={styles.chatRow}>
              <View
                style={[styles.avatar, { backgroundColor: chat.avatarColor }]}
              >
                <Text style={styles.avatarText}>{chat.name.charAt(0)}</Text>
              </View>
              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text
                    style={[
                      styles.chatTime,
                      chat.unread > 0 && styles.chatTimeUnread,
                    ]}
                  >
                    {chat.time}
                  </Text>
                </View>
                <View style={styles.previewRow}>
                  {chat.isRead && chat.unread === 0 && (
                    <View style={styles.readTicks}>
                      <IconReadTicks size={16} />
                    </View>
                  )}
                  <Text style={styles.chatPreview} numberOfLines={1}>
                    {chat.preview}
                  </Text>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomNavWrapper,
          { bottom: Math.max(insets.bottom, 24) },
        ]}
      >
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem}>
            <IconUpdates size={22} color="#6b7280" />
            <Text style={styles.navText}>Updates</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <IconCalls size={22} color="#6b7280" />
            <Text style={styles.navText}>Calls</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <IconCommunities size={22} color="#6b7280" />
            <Text style={styles.navText}>Communities</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <View style={styles.navIconActiveWrap}>
              <IconChats size={22} color="#111827" />
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.navTextActive}>Chats</Text>
          </Pressable>
          <Pressable style={styles.navItem}>
            <View style={styles.navAvatar}>
              <Text style={styles.navAvatarText}>Y</Text>
            </View>
            <Text style={styles.navText}>You</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const WrappedApp = NebulaAPI.wrap({
  hostApis: [...defaultHostApis],
  serverBaseURL: HOST_SERVER_BASE_URL,
  miniappLoading: {
    component: DefaultMiniappLoadingScreen,
    enterContentDelayMs: 200,
  },
})(HostAppContent);

export default function App() {
  return (
    <SafeAreaProvider>
      <WrappedApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  flex1: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircleLight: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    marginHorizontal: 16,
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#111827',
    fontSize: 16,
  },
  miniappsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  miniappItem: {
    alignItems: 'center',
    gap: 6,
  },
  miniappIconBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  miniappEmoji: {
    fontSize: 24,
  },
  miniappLabel: {
    fontSize: 12,
    color: '#4b5563',
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 16,
  },
  filterPill: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillActive: {
    backgroundColor: '#dcfce7',
  },
  filterText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#16a34a',
  },
  chatList: {
    paddingHorizontal: 16,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  chatContent: {
    flex: 1,
    gap: 4,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },
  chatTime: {
    color: '#6b7280',
    fontSize: 13,
  },
  chatTimeUnread: {
    color: '#16a34a',
    fontWeight: '600',
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readTicks: {
    marginRight: 4,
  },
  chatPreview: {
    flex: 1,
    color: '#6b7280',
    fontSize: 15,
  },
  unreadBadge: {
    backgroundColor: '#22c55e',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomNavWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navText: {
    color: '#6b7280',
    fontSize: 10,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#111827',
    fontSize: 10,
    fontWeight: '600',
  },
  navIconActiveWrap: {
    position: 'relative',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
  },
  navBadge: {
    position: 'absolute',
    top: -2,
    right: 2,
    backgroundColor: '#22c55e',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    paddingHorizontal: 4,
  },
  navBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '700',
  },
  navAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navAvatarText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  miniappLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  miniappLoadingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingHorizontal: 32,
    paddingVertical: 28,
    alignItems: 'center',
    width: width * 0.75,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 8,
  },
  miniappLoadingIndicator: {
    marginBottom: 20,
    transform: [{ scale: 1.1 }],
  },
  miniappLoadingTitle: {
    color: '#111827',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  miniappLoadingMessage: {
    color: '#6b7280',
    fontSize: 15,
    marginBottom: 28,
    textAlign: 'center',
  },
  miniappLoadingCloseButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    width: '100%',
    alignItems: 'center',
  },
  miniappLoadingCloseButtonText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
  },
});

import { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import Cinemas from './Cinemas';
import Events from './Events';
import Profile from './Profile';
import {
  IconSearch,
  IconFilm,
  IconMic,
  IconMusic,
  IconSmile,
  IconTicket,
  IconUser,
  IconCat,
  IconRefresh,
} from './Icons';

const categories = [
  { id: '1', name: 'Movies', icon: <IconFilm size={28} />, color: '#f59e0b' },
  { id: '2', name: 'Concerts', icon: <IconMic size={28} />, color: '#ec4899' },
  { id: '3', name: 'Shows', icon: <IconMusic size={28} />, color: '#8b5cf6' },
  {
    id: '4',
    name: 'Stand-up',
    icon: <IconSmile size={28} />,
    color: '#f43f5e',
  },
  {
    id: '5',
    name: 'Exhibits',
    icon: <IconTicket size={28} />,
    color: '#ef4444',
  },
];

const hotMovies = [
  {
    id: 'm1',
    name: 'Fire Chariot',
    rating: '9.5',
    isPresale: false,
    imgColor: '#0f172a',
  },
  {
    id: 'm2',
    name: 'The Vanishing',
    rating: '9.5',
    isPresale: false,
    imgColor: '#334155',
  },
  {
    id: 'm3',
    name: 'Secret Day',
    rating: 'TBD',
    isPresale: true,
    imgColor: '#78350f',
  },
  {
    id: 'm4',
    name: 'Love Letter',
    rating: '9.7',
    isPresale: false,
    imgColor: '#451a03',
  },
];

const hotShows = [
  {
    id: 's1',
    name: 'Coldplay Live',
    desc: 'Music of the Spheres...',
    imgColor: '#9f1239',
  },
  {
    id: 's2',
    name: 'Taylor Swift Eras',
    desc: 'The Eras Tour...',
    imgColor: '#854d0e',
  },
  { id: 's3', name: 'Hamilton', desc: 'Broadway Revival', imgColor: '#0369a1' },
  {
    id: 's4',
    name: 'Wicked',
    desc: 'The Broadway Musical...',
    imgColor: '#be123c',
  },
];

const upcomingMovies = [
  { id: 'u1', name: 'Super Brain', date: 'Limit', imgColor: '#4c1d95' },
  { id: 'u2', name: 'Together', date: 'Limit', imgColor: '#065f46' },
  { id: 'u3', name: 'Galaxy Comedy', date: 'Jun 27', imgColor: '#b45309' },
  { id: 'u4', name: 'Odyssey', date: 'Jul 1', imgColor: '#1e293b' },
];

export default function EntertainmentScreen() {
  const [activeUpcomingTab, setActiveUpcomingTab] = useState('Upcoming');
  const [activeTab, setActiveTab] = useState<
    'home' | 'cinemas' | 'shows' | 'profile'
  >('home');

  const onPressNav = (tab: 'home' | 'cinemas' | 'shows' | 'profile') => {
    setActiveTab(tab);
  };

  const onPressSearch = async () => {
    await Miniapp.showToast('Opening search');
  };

  const onPressCategory = async (name: string) => {
    await Miniapp.showToast(`Category: ${name}`);
  };

  const onPressPromo = async (type: string) => {
    await Miniapp.showToast(`Opened promo: ${type}`);
  };

  const onPressItem = async (name: string) => {
    await Miniapp.showToast(`Selected: ${name}`);
  };

  const onPressBuy = async (name: string) => {
    await Miniapp.showToast(`Booking: ${name}`);
  };

  const onPressUpcomingTab = (tab: string) => {
    setActiveUpcomingTab(tab);
  };

  if (activeTab === 'cinemas') {
    return (
      <View style={styles.screen}>
        <Cinemas onSwitchTab={onPressNav} />
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem} onPress={() => onPressNav('home')}>
            <IconCat size={24} color="#64748b" />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('cinemas')}
          >
            <View style={styles.navIconRed}>
              <IconFilm size={20} />
            </View>
            <Text style={styles.navTextActive}>Movies</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => onPressNav('shows')}>
            <IconRefresh size={24} color="#64748b" />
            <Text style={styles.navText}>Shows</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('profile')}
          >
            <IconUser size={24} color="#64748b" />
            <Text style={styles.navText}>Profile</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (activeTab === 'shows') {
    return (
      <View style={styles.screen}>
        <Events onSwitchTab={onPressNav} />
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem} onPress={() => onPressNav('home')}>
            <IconCat size={24} color="#64748b" />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('cinemas')}
          >
            <IconFilm size={24} color="#64748b" />
            <Text style={styles.navText}>Movies</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => onPressNav('shows')}>
            <View style={styles.navIconRed}>
              <IconRefresh size={20} />
            </View>
            <Text style={styles.navTextActive}>Shows</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('profile')}
          >
            <IconUser size={24} color="#64748b" />
            <Text style={styles.navText}>Profile</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  if (activeTab === 'profile') {
    return (
      <View style={styles.screen}>
        <Profile onSwitchTab={onPressNav} />
        <View style={styles.bottomNav}>
          <Pressable style={styles.navItem} onPress={() => onPressNav('home')}>
            <IconCat size={24} color="#64748b" />
            <Text style={styles.navText}>Home</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('cinemas')}
          >
            <IconFilm size={24} color="#64748b" />
            <Text style={styles.navText}>Movies</Text>
          </Pressable>
          <Pressable style={styles.navItem} onPress={() => onPressNav('shows')}>
            <IconRefresh size={24} color="#64748b" />
            <Text style={styles.navText}>Shows</Text>
          </Pressable>
          <Pressable
            style={styles.navItem}
            onPress={() => onPressNav('profile')}
          >
            <View style={styles.navIconRed}>
              <IconUser size={20} />
            </View>
            <Text style={styles.navTextActive}>Profile</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.searchBar} onPress={onPressSearch}>
          <IconSearch size={16} />
          <Text style={styles.searchText}>Toy Story 5 pre-sale open</Text>
          <View style={styles.searchBadge}>
            <Text style={styles.searchBadgeText}>Offer</Text>
          </View>
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.mainBanner}
          onPress={() => onPressPromo('banner').catch(onError)}
        >
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerTitle}>Toy Story 5</Text>
              <Text style={styles.bannerSub}>Official Merch</Text>
            </View>

            <View style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Buy Now {'>'}</Text>
            </View>
          </View>
        </Pressable>

        <View style={styles.categoriesRow}>
          {categories.map(cat => (
            <Pressable
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => onPressCategory(cat.name).catch(onError)}
            >
              <View
                style={[
                  styles.categoryIconWrap,
                  { backgroundColor: cat.color },
                ]}
              >
                {cat.icon}
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.promoCardsRow}>
          <Pressable
            style={styles.promoCard}
            onPress={() => onPressPromo('ticket').catch(onError)}
          >
            <Text style={styles.promoCardTitle}>Ticket Alert</Text>
            <View style={styles.promoCardContent}>
              <View style={styles.promoImagePlaceholder} />
              <View style={styles.promoCardTexts}>
                <Text style={styles.promoCardDesc} numberOfLines={2}>
                  Coldplay World Tour...
                </Text>
                <View style={styles.promoTagHot}>
                  <Text style={styles.promoTagHotText}>Hot</Text>
                </View>
              </View>
            </View>
          </Pressable>
          <Pressable
            style={styles.promoCard}
            onPress={() => onPressPromo('merch').catch(onError)}
          >
            <Text style={styles.promoCardTitle}>Hot Merch</Text>
            <View style={styles.promoCardContent}>
              <View
                style={[
                  styles.promoImagePlaceholder,
                  { backgroundColor: '#e0f2fe' },
                ]}
              />
              <View style={styles.promoCardTexts}>
                <Text style={styles.promoCardDesc} numberOfLines={2}>
                  Official merch surprise drop
                </Text>
                <View style={styles.promoTagOfficial}>
                  <Text style={styles.promoTagOfficialText}>Official</Text>
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Movies & Shows</Text>
            <Pressable
              onPress={() => onPressPromo('all_popular').catch(onError)}
            >
              <Text style={styles.sectionLink}>View All {'>'}</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {hotMovies.map(movie => (
              <View key={movie.id} style={styles.movieCard}>
                <Pressable
                  style={[
                    styles.moviePoster,
                    { backgroundColor: movie.imgColor },
                  ]}
                  onPress={() => onPressItem(movie.name).catch(onError)}
                >
                  <View style={styles.ratingBadge}>
                    <Text style={styles.ratingText}>Score {movie.rating}</Text>
                  </View>
                </Pressable>
                <Text style={styles.movieName} numberOfLines={1}>
                  {movie.name}
                </Text>
                <Pressable
                  style={[
                    styles.buyButton,
                    movie.isPresale && styles.buyButtonBlue,
                  ]}
                  onPress={() => onPressBuy(movie.name).catch(onError)}
                >
                  <Text style={styles.buyButtonText}>Book</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScrollShows}
          >
            {hotShows.map(show => (
              <View key={show.id} style={styles.showCard}>
                <Pressable
                  style={[
                    styles.showPoster,
                    { backgroundColor: show.imgColor },
                  ]}
                  onPress={() => onPressItem(show.name).catch(onError)}
                >
                  <View style={styles.showTypeBadge}>
                    <Text style={styles.showTypeText}>Concert</Text>
                  </View>
                </Pressable>
                <Text style={styles.showName} numberOfLines={1}>
                  {show.name}
                </Text>
                <Text style={styles.showDesc} numberOfLines={1}>
                  {show.desc}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.tabRow}>
              {['Upcoming', 'Coming Soon', 'Imported'].map(tab => (
                <Pressable key={tab} onPress={() => onPressUpcomingTab(tab)}>
                  <Text
                    style={[
                      styles.tabText,
                      activeUpcomingTab === tab && styles.tabTextActive,
                    ]}
                  >
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              onPress={() => onPressPromo('all_upcoming').catch(onError)}
            >
              <Text style={styles.sectionLink}>All 70 {'>'}</Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hScroll}
          >
            {upcomingMovies.map(movie => (
              <View key={movie.id} style={styles.movieCard}>
                <Pressable
                  style={[
                    styles.moviePoster,
                    { backgroundColor: movie.imgColor },
                  ]}
                  onPress={() => onPressItem(movie.name).catch(onError)}
                >
                  <View style={styles.dateBadge}>
                    <Text style={styles.dateText}>{movie.date}</Text>
                  </View>
                </Pressable>
                <Text style={styles.movieName} numberOfLines={1}>
                  {movie.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => onPressNav('home')}>
          <View style={styles.navIconRed}>
            <IconCat size={20} />
          </View>
          <Text style={styles.navTextActive}>Home</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => onPressNav('cinemas')}>
          <IconFilm size={24} color="#64748b" />
          <Text style={styles.navText}>Movies</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => onPressNav('shows')}>
          <IconRefresh size={24} color="#64748b" />
          <Text style={styles.navText}>Shows</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => onPressNav('profile')}>
          <IconUser size={24} color="#64748b" />
          <Text style={styles.navText}>Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

function onError(error: unknown) {
  Alert.alert(
    'Error',
    error instanceof Error ? error.message : 'Unknown error',
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 4,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 36,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#64748b',
  },
  searchBadge: {
    backgroundColor: '#ffe4e6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  searchBadgeText: {
    fontSize: 10,
    color: '#e11d48',
    fontWeight: '600',
  },
  scrollArea: {
    flex: 1,
  },
  mainBanner: {
    marginHorizontal: 12,
    marginTop: 8,
    height: 90,
    backgroundColor: '#bae6fd',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'center',
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0369a1',
    marginBottom: 8,
  },
  bannerSub: {
    fontSize: 14,
    color: '#0ea5e9',
    fontWeight: '700',
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bannerButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bannerButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryItem: {
    alignItems: 'center',
    gap: 6,
  },
  categoryIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 12,
    color: '#334155',
  },
  promoCardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  promoCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
  },
  promoCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  promoCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000000',
  },
  promoCardTexts: {
    flex: 1,
    gap: 4,
  },
  promoCardDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  promoTagHot: {
    alignSelf: 'flex-start',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoTagHotText: {
    fontSize: 10,
    color: '#dc2626',
  },
  promoTagOfficial: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#94a3b8',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promoTagOfficialText: {
    fontSize: 10,
    color: '#64748b',
  },
  section: {
    paddingTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },
  sectionLink: {
    fontSize: 13,
    color: '#64748b',
  },
  tabRow: {
    flexDirection: 'row',
    gap: 16,
  },
  tabText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  hScroll: {
    paddingHorizontal: 12,
    gap: 10,
  },
  hScrollShows: {
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 16,
  },
  movieCard: {
    width: 90,
  },
  moviePoster: {
    width: 90,
    height: 126,
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginBottom: 6,
  },
  ratingBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  ratingText: {
    color: '#fbbf24',
    fontSize: 11,
    fontWeight: '700',
  },
  dateBadge: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  dateText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  movieName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
  },
  buyButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: 'center',
  },
  buyButtonBlue: {
    backgroundColor: '#3b82f6',
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  showCard: {
    width: 120,
  },
  showPoster: {
    width: 120,
    height: 70,
    borderRadius: 8,
    marginBottom: 6,
    padding: 6,
  },
  showTypeBadge: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-start',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  showTypeText: {
    color: '#ffffff',
    fontSize: 10,
  },
  showName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 2,
  },
  showDesc: {
    fontSize: 11,
    color: '#64748b',
  },
  bottomSpace: {
    height: 80,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingTop: 8,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  navIconRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTextActive: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
  navText: {
    fontSize: 11,
    color: '#64748b',
  },
});

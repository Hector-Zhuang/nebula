import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import Activity from './Activity';
import Account from './Account';
import {
  IconSearch,
  IconLocation,
  IconCart,
  IconChevronDown,
  IconArrowRight,
  IconWalking,
  IconTag,
  IconStar,
  IconHome,
  IconReceipt,
  IconUser,
} from './Icons';

const categories = [
  'All',
  'Grocery',
  'Convenience',
  'Alcohol',
  'Beauty',
  'Health',
];

const foodTypes = [
  { id: 'dineout', name: 'Dine Out', emoji: '🍽️' },
  { id: 'pizza', name: 'Pizza', emoji: '🍕' },
  { id: 'fastfood', name: 'Fast Food', emoji: '🍟' },
  { id: 'seafood', name: 'Seafood', emoji: '🦐' },
  { id: 'chinese', name: 'Chinese', emoji: '🥡' },
];

const filters = [
  { id: 'pickup', label: 'Pickup', icon: <IconWalking size={16} /> },
  { id: 'offers', label: 'Offers', icon: <IconTag size={16} /> },
  { id: 'delivery', label: 'Delivery fee', hasDropdown: true },
  { id: 'under30', label: 'Under 30 min' },
];

const featuredRestaurants = [
  {
    id: 'churchs',
    name: "Church's Texas Chicken",
    promo: 'Buy 1, get 1',
    deliveryFee: '$0.99 Delivery Fee',
    rating: '4.3',
    reviews: '4,000+',
    time: '15 min',
    tag: '#2 Fast food',
    bgColor: '#a11c1c',
  },
  {
    id: 'popeyes',
    name: 'Popeyes',
    promo: 'Buy 1, get 1',
    deliveryFee: '$2.99 Delivery Fee',
    rating: '4.5',
    reviews: '1,000+',
    time: '13 min',
    tag: '#10 American',
    bgColor: '#e28743',
  },
  {
    id: 'kfc',
    name: 'KFC',
    promo: 'Buy 1, get 1',
    deliveryFee: '$1.49 Delivery Fee',
    rating: '4.2',
    reviews: '2,000+',
    time: '20 min',
    tag: '#5 Fast food',
    bgColor: '#3f6336',
  },
];

export default function DeliveryScreen() {
  const [searchText, setSearchText] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeFilter, setActiveFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'home' | 'activity' | 'account'>(
    'home',
  );

  const onPressLocation = async () => {
    await Miniapp.showToast('Location selector opened');
  };

  const onPressCart = async () => {
    await Miniapp.showToast('Cart opened');
  };

  const onPressCategory = (category: string) => {
    setActiveCategory(category);
  };

  const onPressFoodType = async (name: string) => {
    await Miniapp.showToast(`Selected ${name}`);
  };

  const onPressFilter = (id: string) => {
    setActiveFilter(id);
  };

  const onPressRestaurant = async (name: string) => {
    await Miniapp.showToast(`Opened ${name}`);
  };

  const onPressMoreFeatured = async () => {
    await Miniapp.showToast('Loading more featured restaurants');
  };

  const onPressTab = (tab: 'home' | 'activity' | 'account') => {
    setActiveTab(tab);
  };

  if (activeTab === 'activity') {
    return <Activity onSwitchTab={onPressTab} />;
  }

  if (activeTab === 'account') {
    return <Account onSwitchTab={onPressTab} />;
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <IconSearch size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Uber Eats"
              placeholderTextColor="#64748b"
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View style={styles.locationCartRow}>
            <Pressable style={styles.locationButton} onPress={onPressLocation}>
              <IconLocation size={20} />
              <Text style={styles.locationText}>University of Windsor</Text>
              <IconChevronDown size={16} />
            </Pressable>
            <Pressable style={styles.cartButton} onPress={onPressCart}>
              <IconCart size={20} />
              <Text style={styles.cartText}>Cart (0)</Text>
            </Pressable>
          </View>
        </View>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => {
              const isActive = category === activeCategory;
              return (
                <Pressable
                  key={category}
                  style={[
                    styles.categoryTab,
                    isActive && styles.categoryTabActive,
                  ]}
                  onPress={() => onPressCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isActive && styles.categoryTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.foodTypesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodTypesContainer}
          >
            {foodTypes.map(item => (
              <Pressable
                key={item.id}
                style={styles.foodTypeItem}
                onPress={() => onPressFoodType(item.name).catch(onError)}
              >
                <View style={styles.foodEmojiContainer}>
                  <Text style={styles.foodEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.foodTypeText}>{item.name}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {filters.map(filter => {
              const isActive = filter.id === activeFilter;
              return (
                <Pressable
                  key={filter.id}
                  style={[
                    styles.filterPill,
                    isActive && styles.filterPillActive,
                  ]}
                  onPress={() => onPressFilter(filter.id)}
                >
                  {filter.icon}
                  <Text
                    style={[
                      styles.filterText,
                      isActive && styles.filterTextActive,
                    ]}
                  >
                    {filter.label}
                  </Text>
                  {filter.hasDropdown && <IconChevronDown size={16} />}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.disclaimerContainer}>
          <Text style={styles.disclaimerText}>
            Delivery Fees & Service Fees are charged for delivery orders in
            addition to item prices{' '}
            <Text style={styles.disclaimerLink}>Learn more</Text>
          </Text>
        </View>

        <View style={styles.featuredHeader}>
          <Text style={styles.featuredTitle}>Featured on UWin Eats</Text>
          <Pressable style={styles.moreButton} onPress={onPressMoreFeatured}>
            <IconArrowRight size={20} />
          </Pressable>
        </View>

        <View style={styles.restaurantsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restaurantsContainer}
          >
            {featuredRestaurants.map(restaurant => (
              <Pressable
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() =>
                  onPressRestaurant(restaurant.name).catch(onError)
                }
              >
                <View
                  style={[
                    styles.restaurantImagePlaceholder,
                    { backgroundColor: restaurant.bgColor },
                  ]}
                >
                  <View style={styles.promoBadge}>
                    <Text style={styles.promoText}>{restaurant.promo}</Text>
                  </View>
                </View>

                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName} numberOfLines={1}>
                    {restaurant.name}
                  </Text>
                  <Text style={styles.deliveryFeeText}>
                    {restaurant.deliveryFee}
                  </Text>

                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{restaurant.rating}</Text>
                    <IconStar size={12} color="#0f172a" />
                    <Text style={styles.reviewsText}>
                      ({restaurant.reviews}) • {restaurant.time}
                    </Text>
                  </View>

                  <View style={styles.tagBadge}>
                    <Text style={styles.tagText}>{restaurant.tag}</Text>
                    <IconArrowRight size={12} color="#166534" />
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={styles.navItem}>
          <IconHome size={24} color="#0f172a" />
          <Text style={styles.navTextActive}>Home</Text>
        </View>
        <Pressable
          style={styles.navItem}
          onPress={() => onPressTab('activity')}
        >
          <IconReceipt size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Activity</Text>
        </Pressable>
        <Pressable style={styles.navItem} onPress={() => onPressTab('account')}>
          <IconUser size={24} color="#94a3b8" />
          <Text style={styles.navTextInactive}>Account</Text>
        </Pressable>
      </View>
    </View>
  );
}

function onError(error: unknown) {
  Alert.alert(
    'Error',
    error instanceof Error ? error.message : 'An unknown error occurred.',
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 48,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#0f172a',
  },
  locationCartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  cartText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 20,
    paddingBottom: 8,
  },
  categoryTab: {
    paddingBottom: 10,
  },
  categoryTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
  },
  categoryText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#64748b',
  },
  categoryTextActive: {
    fontWeight: '700',
    color: '#0f172a',
  },
  foodTypesSection: {
    marginTop: 12,
    marginBottom: 20,
  },
  foodTypesContainer: {
    paddingHorizontal: 16,
    gap: 24,
  },
  foodTypeItem: {
    alignItems: 'center',
    width: 64,
  },
  foodEmojiContainer: {
    width: 56,
    height: 56,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodEmoji: {
    fontSize: 32,
  },
  foodTypeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0f172a',
    textAlign: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: '#e2e8f0',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  filterTextActive: {
    color: '#0f172a',
  },
  disclaimerContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#64748b',
  },
  disclaimerLink: {
    color: '#64748b',
    textDecorationLine: 'underline',
  },
  featuredHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantsSection: {
    marginBottom: 40,
  },
  restaurantsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  restaurantCard: {
    width: 280,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 16,
    overflow: 'hidden',
  },
  restaurantImagePlaceholder: {
    height: 140,
    width: '100%',
    padding: 12,
  },
  promoBadge: {
    backgroundColor: '#dc2626',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promoText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  restaurantInfo: {
    padding: 12,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  deliveryFeeText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  reviewsText: {
    fontSize: 13,
    color: '#64748b',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
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

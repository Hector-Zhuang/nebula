import React from 'react';
import { ScrollView, StyleSheet, Text, View, Dimensions } from 'react-native';
import { Swiper as NebulaSwiper, SwiperItem as NebulaSwiperItem } from '@nebula/components';

const { width } = Dimensions.get('window');

export default function ComponentsSwiperPage() {
  const [swiperIndex, setSwiperIndex] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const slides = colors.map((color, idx) => ({
    id: idx,
    color,
    title: `Slide ${idx + 1}`,
  }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🎠 Swiper & Image Components</Text>

      {/* Swiper Component */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Swiper with Auto-play</Text>
        <Text style={styles.hint}>swipe to navigate between slides</Text>
        
        <View style={styles.swiperWrapper}>
          <NebulaSwiper
            current={swiperIndex}
            indicatorDots={true}
            indicatorColor="rgba(255,255,255,0.5)"
            indicatorActiveColor="#fff"
            autoplay={autoplay}
            interval={3000}
            circular={true}
            onChange={(e) => {
              setSwiperIndex(e.detail.current);
            }}
            onAnimationFinish={(e) => {
              console.log('Swiper animation finished:', e.detail);
            }}
            style={styles.swiper}
          >
            {slides.map((slide) => (
              <NebulaSwiperItem key={slide.id} style={[styles.slide, { backgroundColor: slide.color }]}>
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>{slide.title}</Text>
                  <Text style={styles.slideSubtitle}>Swipe to explore</Text>
                </View>
              </NebulaSwiperItem>
            ))}
          </NebulaSwiper>
        </View>

        <View style={styles.spacer} />
        <Text style={styles.meta}>Current Slide: {swiperIndex + 1} / {slides.length}</Text>
        <Text style={styles.meta}>Autoplay: {autoplay ? '▶️ On' : '⏹️ Off'}</Text>
      </View>

      {/* Vertical Swiper */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Vertical Swiper</Text>
        <Text style={styles.hint}>vertical scrolling carousel</Text>
        
        <View style={[styles.swiperWrapper, { height: 150 }]}>
          <NebulaSwiper
            current={0}
            indicatorDots={false}
            autoplay={true}
            vertical={true}
            interval={2000}
            circular={true}
            style={styles.swiper}
          >
            {['Item 1', 'Item 2', 'Item 3', 'Item 4'].map((item, idx) => (
              <NebulaSwiperItem key={idx} style={[styles.slide, { backgroundColor: colors[idx % colors.length] }]}>
                <View style={styles.slideContent}>
                  <Text style={styles.slideTitle}>{item}</Text>
                </View>
              </NebulaSwiperItem>
            ))}
          </NebulaSwiper>
        </View>
      </View>

      {/* Manual Controls */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manual Navigation</Text>
        <View style={styles.controlGrid}>
          {slides.map((slide) => (
            <View
              key={slide.id}
              style={[
                styles.slideButton,
                { backgroundColor: slide.color, opacity: swiperIndex === slide.id ? 1 : 0.5 },
              ]}
            >
              <Text style={styles.slideButtonText}>{slide.id + 1}</Text>
            </View>
          ))}
        </View>
        <View style={styles.spacer} />
        <View style={styles.buttonRow}>
          <View style={styles.buttonHalf}>
            <Text style={styles.buttonText} onPress={() => setAutoplay(!autoplay)}>
              {autoplay ? '⏸️ Stop' : '▶️ Play'} Autoplay
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5fbff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 10,
  },
  swiperWrapper: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f4f8',
  },
  swiper: {
    width: '100%',
    height: '100%',
  },
  slide: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContent: {
    alignItems: 'center',
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  spacer: {
    height: 8,
  },
  meta: {
    fontSize: 13,
    color: '#475569',
    marginTop: 4,
  },
  controlGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slideButton: {
    width: '19%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonHalf: {
    flex: 1,
  },
  buttonText: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#3b82f6',
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
});

import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Miniapp } from '@nebula-rn/sdk';
import {
  IconScanFrame,
  IconMore,
  IconChevronDown,
  IconChevronRight,
  IconBankLogo,
  IconCheck,
  IconReceive,
  IconPackets,
  IconTransfer,
} from './Icons';

export default function PaymentCodeScreen() {
  const onPressScan = async () => {
    await Miniapp.showToast('Scanner opened');
  };

  const onPressMore = async () => {
    await Miniapp.showToast('More options opened');
  };

  const onPressChangeMethod = async () => {
    await Miniapp.showToast('Change payment method');
  };

  const onPressMenuItem = async (title: string) => {
    await Miniapp.showToast(`Navigating to ${title}`);
  };

  const onPressReceive = () => {
    Miniapp.navigateTo('/receive');
  };

  const onPressPackets = async () => {
    try {
      await Miniapp.navigateTo('/packets');
    } catch (e: any) {
      Miniapp.showToast('Failed to open /packets: ' + e.message);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Pressable style={styles.cardHeaderLeft} onPress={onPressScan}>
              <IconScanFrame size={22} />
              <Text style={styles.cardHeaderTitle}>Payment Code</Text>
            </Pressable>
            <Pressable style={styles.cardHeaderRight} onPress={onPressMore}>
              <IconMore size={22} />
            </Pressable>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.instructionText}>Tap to view payment code</Text>

            <View style={styles.barcodeWrapper}>
              <Image
                source={require('./barcode.png')}
                style={{ width: 300, height: 80 }}
              />
            </View>

            <View style={styles.qrWrapper}>
              <Image
                source={require('./qrcode.png')}
                style={{ width: 140, height: 140 }}
              />
            </View>
          </View>

          <View style={styles.paymentMethodSection}>
            <View style={styles.methodHeader}>
              <Text style={styles.methodLabel}>Default Payment Method</Text>
              <Pressable
                style={styles.changeButton}
                onPress={onPressChangeMethod}
              >
                <Text style={styles.changeButtonText}>Change</Text>
                <IconChevronDown size={14} />
              </Pressable>
            </View>

            <Pressable
              style={styles.selectedMethodBox}
              onPress={onPressChangeMethod}
            >
              <View style={styles.methodInfo}>
                <IconBankLogo size={20} />
                <View style={styles.methodTexts}>
                  <Text style={styles.methodName}>CIBC Debit Card</Text>
                  <Text style={styles.methodNumber}>**** **** **** 1963</Text>
                </View>
              </View>
              <IconCheck size={24} />
            </Pressable>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Pressable style={styles.menuItem} onPress={onPressReceive}>
            <View style={styles.menuItemLeft}>
              <IconReceive size={24} />
              <Text style={styles.menuItemText}>Receive Money</Text>
            </View>
            <IconChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable style={styles.menuItem} onPress={onPressPackets}>
            <View style={styles.menuItemLeft}>
              <IconPackets size={24} />
              <Text style={styles.menuItemText}>Packets Nearby</Text>
            </View>
            <IconChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
          </Pressable>

          <View style={styles.menuDivider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => onPressMenuItem('Transfer to Bank')}
          >
            <View style={styles.menuItemLeft}>
              <IconTransfer size={24} />
              <Text style={styles.menuItemText}>
                Transfer to Bank Card/Mobile No.
              </Text>
            </View>
            <IconChevronRight size={20} color="rgba(255, 255, 255, 0.5)" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#2ba25f',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0f172a',
  },
  cardHeaderRight: {
    padding: 4,
  },
  codeContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 32,
  },
  instructionText: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 24,
  },
  barcodeWrapper: {
    marginBottom: 36,
  },
  qrWrapper: {
    marginBottom: 20,
  },
  paymentMethodSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  methodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  methodLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedMethodBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff7ed',
    borderRadius: 8,
    padding: 16,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  methodTexts: {
    gap: 2,
  },
  methodName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    marginBottom: 2,
  },
  methodNumber: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  menuSection: {
    backgroundColor: 'transparent',
    paddingHorizontal: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '400',
  },
  menuDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginLeft: 40,
  },
});

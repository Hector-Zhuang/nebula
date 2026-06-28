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
  IconBankLogo,
  IconCopy,
  IconShare,
  IconSaveQR,
} from '../home/Icons';

export default function () {
  const onPressMore = async () => {
    await Miniapp.showToast('More options');
  };

  const onPressCopyAccount = async () => {
    await Miniapp.showToast('Account number copied');
  };

  const onPressShare = async () => {
    await Miniapp.showToast('Share opened');
  };

  const onPressSaveQR = async () => {
    await Miniapp.showToast('QR code saved');
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Enter Amount</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>$</Text>
            <Text style={styles.amountValue}>0.00</Text>
          </View>
          <View style={styles.amountDivider} />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <IconScanFrame size={22} />
              <Text style={styles.cardHeaderTitle}>Collection Code</Text>
            </View>
            <Pressable style={styles.cardHeaderRight} onPress={onPressMore}>
              <IconMore size={22} />
            </Pressable>
          </View>

          <View style={styles.codeContainer}>
            <Text style={styles.instructionText}>
              Show this code to the payer
            </Text>

            <View style={styles.barcodeWrapper}>
              <Image
                source={require('../home/barcode.png')}
                style={{ width: 300, height: 80 }}
              />
            </View>

            <View style={styles.qrWrapper}>
              <Image
                source={require('../home/qrcode.png')}
                style={{ width: 160, height: 160 }}
              />
            </View>
          </View>

          <View style={styles.quickActions}>
            <Pressable style={styles.actionButton} onPress={onPressSaveQR}>
              <IconSaveQR size={20} color="#e0b742" />
              <Text style={styles.actionText}>Save QR</Text>
            </Pressable>
            <View style={styles.actionDivider} />
            <Pressable style={styles.actionButton} onPress={onPressShare}>
              <IconShare size={20} color="#e0b742" />
              <Text style={styles.actionText}>Share</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <Text style={styles.accountLabel}>Receiving Account</Text>
          </View>
          <View style={styles.accountInfo}>
            <IconBankLogo size={24} />
            <View style={styles.accountTexts}>
              <Text style={styles.accountName}>CIBC Debit Card</Text>
              <Text style={styles.accountNumber}>**** **** **** 1963</Text>
            </View>
            <Pressable style={styles.copyButton} onPress={onPressCopyAccount}>
              <IconCopy size={18} color="#e0b742" />
              <Text style={styles.copyText}>Copy</Text>
            </Pressable>
          </View>
        </View>

        <Text style={styles.footerNote}>
          This code can be used to receive payments from others{'\n'}
          Amount will be credited to your default account
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e0b742',
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  amountSection: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
  },
  currencySymbol: {
    fontSize: 36,
    fontWeight: '300',
    color: '#ffffff',
  },
  amountValue: {
    fontSize: 48,
    fontWeight: '300',
    color: '#ffffff',
    letterSpacing: 2,
  },
  amountDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: 'hidden',
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
    paddingBottom: 16,
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
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  quickActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  actionText: {
    fontSize: 14,
    color: '#e0b742',
    fontWeight: '500',
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
  },
  accountHeader: {
    marginBottom: 12,
  },
  accountLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  accountTexts: {
    flex: 1,
    gap: 2,
  },
  accountName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  accountNumber: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  copyText: {
    fontSize: 13,
    color: '#e0b742',
    fontWeight: '500',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
    marginTop: 8,
    paddingHorizontal: 32,
  },
});

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { Campaign } from '../screens/MyAdsScreen';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  couponCode: string;
  onComplete: (newCampaign: Campaign) => void;
}

const NEW_CAMPAIGN: Campaign = {
  id: 'hm-summer-2026',
  brand: 'H&M',
  brandColor: '#e53935',
  brandInitials: 'H&M',
  contentTypes: ['Reels', 'Videopost'],
  description: 'Summer Collection 2026',
  payoutPct: 18,
  status: 'ACTIVE',
};

export default function CouponSheet({ couponCode, onComplete }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const [copied, setCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, [translateY]);

  const handleCopy = () => {
    Clipboard.setString(couponCode);
    setCopied(true);
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleGoToCampaigns = () => {
    onComplete(NEW_CAMPAIGN);
  };

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        <View style={styles.content}>
          {/* Success icon */}
          <View style={styles.successCircle}>
            <CheckmarkIcon />
          </View>

          <Text style={styles.title}>You're in! Coupon assigned</Text>
          <Text style={styles.subtitle}>H&M Summer Collection 2026</Text>

          {/* Coupon box */}
          <View style={styles.couponBox}>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
              <Text style={styles.copyBtnText}>{copied ? 'Copied!' : 'Copy'}</Text>
            </TouchableOpacity>

            <View style={styles.brandRow}>
              <View style={styles.hmBadge}>
                <Text style={styles.hmBadgeText}>H&M</Text>
              </View>
              <Text style={styles.brandCrossText}>H&M × Moontech</Text>
            </View>

            <Text style={styles.couponCode}>{couponCode}</Text>
            <Text style={styles.commissionText}>18% commission on all sales</Text>
          </View>

          {/* Meta grid */}
          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Valid from</Text>
              <Text style={styles.metaValue}>Apr 15, 2026</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Valid until</Text>
              <Text style={styles.metaValue}>May 31, 2026</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Status</Text>
              <Text style={[styles.metaValue, { color: '#0f6e56' }]}>Active</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Tracked sales</Text>
              <Text style={styles.metaValue}>0</Text>
            </View>
          </View>

          {/* Go to campaigns button */}
          <TouchableOpacity style={styles.goBtn} onPress={handleGoToCampaigns}>
            <Text style={styles.goBtnText}>Go to my campaigns</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function CheckmarkIcon() {
  return (
    <View style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
      {/* Checkmark using borders */}
      <View style={{
        width: 14,
        height: 8,
        borderLeftWidth: 2.5,
        borderBottomWidth: 2.5,
        borderColor: '#0f6e56',
        transform: [{ rotate: '-45deg' }, { translateY: -2 }],
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 120,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  content: {
    padding: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  successCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e1f5ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
  },
  couponBox: {
    width: '100%',
    backgroundColor: '#f7f6f2',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#c4b5f4',
    borderStyle: 'dashed',
    padding: 18,
    alignItems: 'center',
  },
  copyBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#eeedfe',
    borderRadius: 8,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  copyBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#534ab7',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  hmBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#faeeda',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hmBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#633806',
  },
  brandCrossText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  couponCode: {
    fontSize: 22,
    fontWeight: '700',
    color: '#534ab7',
    letterSpacing: 3,
    fontFamily: 'monospace',
  },
  commissionText: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    width: '100%',
  },
  metaCell: {
    width: '47.5%',
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  goBtn: {
    width: '100%',
    backgroundColor: '#534ab7',
    borderRadius: 12,
    padding: 13,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  goBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
});

import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface Props {
  isGenerating: boolean;
  onJoin: () => void;
  onDecline: () => void;
  visible: boolean;
}

export default function CampaignSheet({ isGenerating, onJoin, onDecline, visible }: Props) {
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const stepDots = [true, false, false, false];

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.sheet, { transform: [{ translateY }] }]}>
        {/* Drag handle */}
        <View style={styles.dragHandle} />

        {/* Hero section */}
        <View style={styles.hero}>
          <View style={styles.brandCircleLarge}>
            <Text style={styles.brandCircleLargeText}>H&M</Text>
          </View>
          <Text style={styles.campaignName}>H&M — Summer Collection 2026</Text>
          <Text style={styles.campaignSubtitle}>You've been selected for this campaign</Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: '25%' }]} />
          </View>
          <View style={styles.dotsRow}>
            {stepDots.map((active, i) => (
              <View
                key={i}
                style={active ? styles.dotActive : styles.dotInactive}
              />
            ))}
          </View>
        </View>

        {/* Scrollable body */}
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
          {/* Info grid */}
          <View style={styles.grid}>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Content type</Text>
              <Text style={styles.cellValue}>Reels / Video</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Payout</Text>
              <Text style={[styles.cellValue, { color: '#534ab7' }]}>18% commission</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Campaign period</Text>
              <Text style={styles.cellValue}>Apr 15 – May 31</Text>
            </View>
            <View style={styles.gridCell}>
              <Text style={styles.cellLabel}>Invite expires</Text>
              <Text style={[styles.cellValue, { color: '#c0392b' }]}>Apr 10, 2026</Text>
            </View>
          </View>

          {/* Brief block */}
          <View style={styles.briefBlock}>
            <Text style={styles.briefText}>
              Showcase H&M's summer styles your way — outfit transitions, styling tips,
              feel-good content. Authentic and on-brand.
            </Text>
          </View>

          {/* What happens label */}
          <Text style={styles.stepsLabel}>WHAT HAPPENS AFTER YOU JOIN</Text>

          {/* Steps block */}
          <View style={styles.stepsBlock}>
            {[
              'Join to confirm — your spot is reserved',
              'Your unique coupon code is generated instantly',
              'Create and post content using your code',
              'Earn 18% on every sale traced to your code',
            ].map((step, i) => (
              <View key={i} style={[styles.stepRow, i < 3 && styles.stepRowBorder]}>
                <View style={styles.stepCircle}>
                  <Text style={styles.stepNumber}>{i + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Bottom padding for CTA bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* CTA bar */}
        <View style={styles.ctaBar}>
          <TouchableOpacity
            style={[styles.joinBtn, isGenerating && styles.joinBtnDisabled]}
            onPress={onJoin}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.joinBtnText}>Join campaign</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onDecline} style={styles.declineBtn}>
            <Text style={styles.declineBtnText}>No thanks, decline invite</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    zIndex: 110,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '92%',
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
  },
  hero: {
    backgroundColor: '#1a0a2e',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingHorizontal: 16,
    paddingBottom: 18,
    alignItems: 'center',
  },
  brandCircleLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCircleLargeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  campaignName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 4,
  },
  campaignSubtitle: {
    fontSize: 11,
    color: '#c4b5f4',
    textAlign: 'center',
    marginTop: 3,
  },
  progressContainer: {
    marginTop: 14,
    marginHorizontal: 14,
  },
  progressBarBg: {
    height: 3,
    backgroundColor: '#eeedfe',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 3,
    backgroundColor: '#534ab7',
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
    gap: 4,
  },
  dotActive: {
    width: 18,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#534ab7',
  },
  dotInactive: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e0dfd6',
  },
  body: {
    padding: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridCell: {
    width: '47.5%',
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
  },
  cellLabel: {
    fontSize: 10,
    color: '#888',
    marginBottom: 2,
  },
  cellValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  briefBlock: {
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  briefText: {
    fontSize: 12,
    color: '#444',
    lineHeight: 18,
  },
  stepsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 12,
    marginBottom: 8,
  },
  stepsBlock: {
    backgroundColor: '#f7f6f2',
    borderRadius: 10,
    padding: 8,
    paddingHorizontal: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  stepRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0efe8',
  },
  stepCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#eeedfe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumber: {
    fontSize: 10,
    fontWeight: '700',
    color: '#534ab7',
  },
  stepText: {
    fontSize: 12,
    color: '#444',
    flex: 1,
  },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingHorizontal: 14,
    paddingBottom: 20,
    borderTopWidth: 0.5,
    borderTopColor: '#f0efe8',
    backgroundColor: '#fff',
  },
  joinBtn: {
    backgroundColor: '#534ab7',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  joinBtnDisabled: {
    opacity: 0.85,
  },
  joinBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  declineBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  declineBtnText: {
    fontSize: 12,
    color: '#bbb',
  },
});

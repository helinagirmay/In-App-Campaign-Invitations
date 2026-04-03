import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface Props {
  onDismiss: () => void;
  onViewInvite: () => void;
}

export default function InviteNotificationBanner({ onDismiss, onViewInvite }: Props) {
  const translateY = useRef(new Animated.Value(-200)).current;
  const isExiting = useRef(false);

  useEffect(() => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 350,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [translateY]);

  const animateOut = (callback: () => void) => {
    if (isExiting.current) return;
    isExiting.current = true;
    Animated.timing(translateY, {
      toValue: -200,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => callback());
  };

  const handleDismiss = () => animateOut(onDismiss);
  const handleViewInvite = () => animateOut(onViewInvite);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
        {/* Header row */}
        <View style={styles.headerRow}>
          <View style={styles.appIcon}>
            {/* Bell SVG */}
            <BellIcon />
          </View>
          <Text style={styles.appName}>Moontech</Text>
          <Text style={styles.timeLabel}>now</Text>
        </View>

        {/* Body row */}
        <View style={styles.bodyRow}>
          <View style={styles.brandCircle}>
            <Text style={styles.brandInitials}>H&M</Text>
          </View>
          <View style={styles.bodyText}>
            <Text style={styles.bodyTitle}>New campaign invite</Text>
            <Text style={styles.bodySubtitle}>
              H&M wants you for their Summer Collection 2026. Tap to view.
            </Text>
          </View>
        </View>

        {/* Action row */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.dismissBtn} onPress={handleDismiss}>
            <Text style={styles.dismissBtnText}>Dismiss</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.viewBtn} onPress={handleViewInvite}>
            <Text style={styles.viewBtnText}>View invite</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

function BellIcon() {
  return (
    <View style={{ width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
      {/* Bell body */}
      <View style={{
        width: 13, height: 11,
        borderWidth: 1.5, borderColor: '#fff',
        borderRadius: 6,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        marginTop: 2,
      }} />
      {/* Bell top */}
      <View style={{
        position: 'absolute', top: 1,
        width: 2, height: 3,
        backgroundColor: '#fff',
        borderRadius: 1,
      }} />
      {/* Bell bottom */}
      <View style={{
        position: 'absolute', bottom: 2,
        width: 6, height: 2,
        backgroundColor: '#fff',
        borderRadius: 1,
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
    backgroundColor: 'rgba(15, 5, 35, 0.55)',
    zIndex: 100,
  },
  banner: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 52,
    marginHorizontal: 18,
    padding: 14,
    paddingHorizontal: 14,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIcon: {
    width: 24,
    height: 24,
    backgroundColor: '#7b5ea7',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  appName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  timeLabel: {
    fontSize: 10,
    color: '#bbb',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  brandCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e53935',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandInitials: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  bodyText: {
    flex: 1,
  },
  bodyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  bodySubtitle: {
    fontSize: 11,
    color: '#555',
    marginTop: 2,
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  dismissBtn: {
    flex: 1,
    backgroundColor: '#f1efe8',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  dismissBtnText: {
    fontSize: 12,
    color: '#444',
    fontWeight: '500',
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#534ab7',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
});

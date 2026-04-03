import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCampaignInvite } from '../hooks/useCampaignInvite';
import InviteNotificationBanner from '../components/InviteNotificationBanner';
import CampaignSheet from '../components/CampaignSheet';
import CouponSheet from '../components/CouponSheet';

// ─────────────────────────────────────────
// DATA MODEL
// ─────────────────────────────────────────

export type ContentType = 'Stories' | 'Carousel' | 'Reels' | 'Videopost';
export type CampaignStatus = 'PENDING' | 'COMPLETED' | 'ACTIVE';

export interface Campaign {
  id: string;
  brand: string;
  brandColor: string;
  brandInitials: string;
  contentTypes: ContentType[];
  description: string;
  payoutPct: number;
  status?: CampaignStatus;
}

interface AdStats {
  completedAds: number;
  totalAds: number;
  earnings: number;
  earningGoal: number;
  earningProgress: number;
}

// ─────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'adidas-1',
    brand: 'Adidas',
    brandColor: '#1a1a1a',
    brandInitials: 'AD',
    contentTypes: ['Stories', 'Carousel'],
    description: 'Sweet February! Enjoy your 20% discount',
    payoutPct: 15,
  },
  {
    id: 'hm-1',
    brand: 'H&M',
    brandColor: '#e53935',
    brandInitials: 'H&M',
    contentTypes: ['Reels', 'Videopost'],
    description: 'Sweet February! Enjoy your 20% discount',
    payoutPct: 15,
    status: 'PENDING',
  },
  {
    id: 'aldo-1',
    brand: 'ALDO',
    brandColor: '#cc0000',
    brandInitials: 'AL',
    contentTypes: ['Stories', 'Carousel'],
    description: 'Sweet February! Enjoy your 20% discount',
    payoutPct: 15,
    status: 'COMPLETED',
  },
];

const AD_STATS: AdStats = {
  completedAds: 60,
  totalAds: 100,
  earnings: 100000,
  earningGoal: 100,
  earningProgress: 50,
};

// ─────────────────────────────────────────
// CALENDAR DATA
// ─────────────────────────────────────────

const CALENDAR_DAYS = [
  { dow: 'THU', num: 23, brand: 'Adidas', brandColor: '#1a1a1a', isToday: false },
  { dow: 'FRI', num: 24, brand: 'Amazon', brandColor: '#f59e0b', isToday: false },
  { dow: 'SAT', num: 25, brand: 'H&M', brandColor: '#e53935', isToday: false },
  { dow: 'SUN', num: 26, brand: 'ALDO', brandColor: '#cc0000', isToday: true },
  { dow: 'MON', num: 27, brand: 'MuseMax', brandColor: '#7b5ea7', isToday: false },
  { dow: 'TUE', num: 28, brand: 'Adidas', brandColor: '#1a1a1a', isToday: false },
  { dow: 'WED', num: 29, brand: 'ALDO', brandColor: '#cc0000', isToday: false },
];

// ─────────────────────────────────────────
// BRAND STRIP DATA
// ─────────────────────────────────────────

const BRANDS = [
  { name: 'Adidas', color: '#1a1a1a', initials: 'AD', active: false },
  { name: 'Amazon', color: '#f59e0b', initials: 'AMZ', active: false },
  { name: 'H&M', color: '#e53935', initials: 'H&M', active: true },
  { name: 'ALDO', color: '#cc0000', initials: 'AL', active: false },
  { name: 'MuseMax', color: '#7b5ea7', initials: 'MM', active: false },
  { name: 'Adidas', color: '#1a1a1a', initials: 'AD', active: false },
];

// ─────────────────────────────────────────
// CONTENT PILL COLORS
// ─────────────────────────────────────────

const CONTENT_PILL_COLORS: Record<ContentType, { bg: string; text: string }> = {
  Stories: { bg: '#eeedfe', text: '#534ab7' },
  Carousel: { bg: '#e1f5ee', text: '#0f6e56' },
  Reels: { bg: '#faeeda', text: '#633806' },
  Videopost: { bg: '#faece7', text: '#712b13' },
};

const STATUS_PILL_COLORS: Record<CampaignStatus, { bg: string; text: string }> = {
  PENDING: { bg: '#fff3e0', text: '#e65100' },
  COMPLETED: { bg: '#e1f5ee', text: '#0f6e56' },
  ACTIVE: { bg: '#eeedfe', text: '#534ab7' },
};

// ─────────────────────────────────────────
// SUBCOMPONENTS
// ─────────────────────────────────────────

function WalletIcon() {
  return (
    <View style={{ width: 18, height: 18, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{
        width: 14, height: 10,
        borderWidth: 1.5, borderColor: '#fff',
        borderRadius: 3,
      }} />
      <View style={{
        position: 'absolute',
        top: 4, right: 2,
        width: 4, height: 4,
        borderRadius: 2,
        borderWidth: 1.5, borderColor: '#fff',
      }} />
    </View>
  );
}

function ContentPills({ types }: { types: ContentType[] }) {
  const showTypes = types.slice(0, 2);
  const hasMore = types.length > 2;

  return (
    <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
      {showTypes.map((t) => {
        const colors = CONTENT_PILL_COLORS[t];
        return (
          <View key={t} style={[styles.pill, { backgroundColor: colors.bg }]}>
            <Text style={[styles.pillText, { color: colors.text }]}>{t}</Text>
          </View>
        );
      })}
      {hasMore && (
        <View style={[styles.pill, { backgroundColor: '#f0f0f0' }]}>
          <Text style={[styles.pillText, { color: '#666' }]}>···</Text>
        </View>
      )}
    </View>
  );
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const statusColors = campaign.status ? STATUS_PILL_COLORS[campaign.status] : null;

  return (
    <TouchableOpacity
      style={styles.campaignCard}
      onPress={() => console.log('Campaign tapped:', campaign.id)}
    >
      {/* Top row */}
      <View style={styles.campaignCardTopRow}>
        <View style={[styles.brandCircleSm, { backgroundColor: campaign.brandColor }]}>
          <Text style={styles.brandCircleSmText}>{campaign.brandInitials}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={styles.campaignBrandName}>{campaign.brand}</Text>
          <ContentPills types={campaign.contentTypes} />
        </View>
      </View>

      {/* Description */}
      <Text style={styles.campaignDescription}>{campaign.description}</Text>

      {/* Footer */}
      <View style={styles.campaignFooter}>
        <Text style={styles.payoutText}>Payout {campaign.payoutPct}%</Text>
        {statusColors && campaign.status && (
          <View style={[styles.statusPill, { backgroundColor: statusColors.bg }]}>
            <Text style={[styles.statusPillText, { color: statusColors.text }]}>
              {campaign.status}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────
// BOTTOM NAV
// ─────────────────────────────────────────

function MyAdsIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 16, height: 12, borderWidth: 1.5, borderColor: '#fff', borderRadius: 2 }} />
      <View style={{ position: 'absolute', top: 3, width: 10, height: 1.5, backgroundColor: '#fff', borderRadius: 1 }} />
      <View style={{ position: 'absolute', top: 7, width: 10, height: 1.5, backgroundColor: '#fff', borderRadius: 1 }} />
    </View>
  );
}

function EarningsIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 14, height: 14, borderRadius: 7, borderWidth: 1.5, borderColor: '#fff' }} />
      <View style={{ position: 'absolute', top: 7, left: 6, width: 1.5, height: 8, backgroundColor: '#fff', borderRadius: 1 }} />
    </View>
  );
}

function CommunityIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff', position: 'absolute', top: 1, left: 3 }} />
      <View style={{ width: 8, height: 8, borderRadius: 4, borderWidth: 1.5, borderColor: '#fff', position: 'absolute', top: 1, right: 3 }} />
      <View style={{ position: 'absolute', bottom: 2, left: 0, right: 0, height: 6, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 1.5, borderColor: '#fff', borderBottomWidth: 0 }} />
    </View>
  );
}

function CouponsIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 16, height: 10, borderWidth: 1.5, borderColor: '#fff', borderRadius: 2, borderStyle: 'dashed' }} />
      <View style={{ position: 'absolute', top: 6, width: 10, height: 1.5, backgroundColor: '#fff', borderRadius: 1 }} />
    </View>
  );
}

function AccountIcon() {
  return (
    <View style={{ width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 1.5, borderColor: '#fff', position: 'absolute', top: 0 }} />
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 8, borderTopLeftRadius: 8, borderTopRightRadius: 8, borderWidth: 1.5, borderColor: '#fff', borderBottomWidth: 0 }} />
    </View>
  );
}

const NAV_TABS = [
  { label: 'My Ads', icon: MyAdsIcon, active: true },
  { label: 'Earnings', icon: EarningsIcon, active: false },
  { label: 'Community', icon: CommunityIcon, active: false },
  { label: 'My Coupons', icon: CouponsIcon, active: false },
  { label: 'Account', icon: AccountIcon, active: false },
];

// ─────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────

export default function MyAdsScreen() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);

  const {
    flowStep,
    couponCode,
    isGenerating,
    startFlow,
    dismissNotif,
    openSheet,
    joinCampaign,
    completeFlow,
  } = useCampaignInvite();

  const handleInviteComplete = (newCampaign: Campaign) => {
    completeFlow(() => {
      setCampaigns((prev) => [newCampaign, ...prev]);
    });
  };

  const progressPct = (AD_STATS.completedAds / AD_STATS.totalAds) * 100;

  return (
    <View style={styles.root}>
      {/* ── Main content ── */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Debug trigger button */}
        <View style={styles.debugRow}>
          <TouchableOpacity style={styles.debugBtn} onPress={startFlow}>
            <Text style={styles.debugBtnText}>Test: Trigger Invite</Text>
          </TouchableOpacity>
        </View>

        {/* 1. PROGRESS SECTION */}
        <View style={styles.sectionCard}>
          <View style={styles.progressTopRow}>
            <Text style={styles.progressLabel}>Completed Ads</Text>
            <Text style={styles.progressPct}>
              {Math.round(progressPct)}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
          <View style={styles.progressSubRow}>
            <Text style={styles.progressSubText}>
              {AD_STATS.completedAds}/{AD_STATS.totalAds} Ads completed
            </Text>
            <Text style={styles.rocketEmoji}>🚀</Text>
          </View>

          {/* Earnings card */}
          <View style={styles.earningsCard}>
            <View style={styles.earningsLeft}>
              <View style={styles.walletIconBox}>
                <WalletIcon />
              </View>
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.earningsLabel}>Earnings</Text>
                <Text style={styles.earningsAmount}>
                  {AD_STATS.earnings.toLocaleString()}$
                </Text>
              </View>
            </View>
            <View style={styles.earningsRight}>
              <Text style={styles.earningsGoalText}>
                {AD_STATS.earningProgress}$/{AD_STATS.earningGoal}$
              </Text>
              <TouchableOpacity onPress={() => console.log('edit goal')}>
                <Text style={styles.editGoalText}>✏ Edit earning goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 2. SCHEDULED ADS */}
        <View style={[styles.sectionCard, { marginTop: 6, paddingHorizontal: 14, paddingVertical: 10 }]}>
          <View style={styles.scheduledHeader}>
            <Text style={styles.scheduledTitle}>Your Scheduled Ads</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <CalendarIcon />
              <Text style={styles.scheduledMonth}>September 2025</Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {CALENDAR_DAYS.map((day, i) => (
              <View key={i} style={styles.dayColumn}>
                <Text style={[styles.dayDOW, day.isToday && { color: '#7b5ea7' }]}>
                  {day.dow}
                </Text>
                <View style={[
                  styles.dayCircle,
                  day.isToday && { backgroundColor: '#7b5ea7' },
                ]}>
                  <Text style={[
                    styles.dayNum,
                    day.isToday && { color: '#fff' },
                  ]}>
                    {day.num}
                  </Text>
                </View>
                <View style={[styles.brandDot, { backgroundColor: day.brandColor }]} />
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 3. BRAND LOGO STRIP */}
        <View style={styles.brandStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BRANDS.map((brand, i) => (
              <View key={i} style={styles.brandBubbleCol}>
                <View style={[
                  styles.brandBubble,
                  { backgroundColor: brand.color },
                  brand.active && styles.brandBubbleActive,
                ]}>
                  <Text style={styles.brandBubbleText}>{brand.initials}</Text>
                </View>
                <Text style={styles.brandBubbleName}>{brand.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 4. CAMPAIGN CARDS */}
        <View style={styles.campaignListContainer}>
          {campaigns.map((campaign, i) => (
            <View key={campaign.id + i}>
              {i > 0 && <View style={styles.campaignDivider} />}
              <CampaignCard campaign={campaign} />
            </View>
          ))}
        </View>

        {/* 5. SEE MORE */}
        <View style={styles.seeMoreContainer}>
          <TouchableOpacity onPress={() => console.log('load more')}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* ── Bottom Navigation ── */}
      <View style={styles.bottomNav}>
        {NAV_TABS.map((tab, i) => {
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.navTab, { opacity: tab.active ? 1 : 0.45 }]}
            >
              <Icon />
              <Text style={styles.navLabel}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Campaign Invite Flow Overlays ── */}
      {flowStep === 'notification' && (
        <InviteNotificationBanner
          onDismiss={dismissNotif}
          onViewInvite={openSheet}
        />
      )}

      {(flowStep === 'sheet' || flowStep === 'coupon') && (
        <CampaignSheet
          visible={true}
          isGenerating={isGenerating}
          onJoin={joinCampaign}
          onDecline={dismissNotif}
        />
      )}

      {flowStep === 'coupon' && couponCode && (
        <CouponSheet
          couponCode={couponCode}
          onComplete={handleInviteComplete}
        />
      )}
    </View>
  );
}

function CalendarIcon() {
  return (
    <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: '#aaa', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 6, height: 1, backgroundColor: '#aaa', borderRadius: 0.5 }} />
    </View>
  );
}

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#f7f6f4',
  },
  scroll: {
    flex: 1,
  },
  debugRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 14,
    paddingTop: 52,
    paddingBottom: 4,
  },
  debugBtn: {
    backgroundColor: '#7b5ea7',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  debugBtnText: {
    fontSize: 10,
    color: '#fff',
  },

  // ── Section card ──
  sectionCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    paddingHorizontal: 14,
  },

  // ── Progress ──
  progressTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 13,
    color: '#555',
  },
  progressPct: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  progressBarBg: {
    height: 7,
    backgroundColor: '#eeede6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 7,
    backgroundColor: '#7b5ea7',
    borderRadius: 4,
  },
  progressSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  progressSubText: {
    fontSize: 11,
    color: '#aaa',
  },
  rocketEmoji: {
    fontSize: 13,
  },

  // ── Earnings card ──
  earningsCard: {
    backgroundColor: '#f3f0fc',
    borderRadius: 10,
    padding: 10,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  earningsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#7b5ea7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  earningsLabel: {
    fontSize: 10,
    color: '#888',
  },
  earningsAmount: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  earningsRight: {
    alignItems: 'flex-end',
  },
  earningsGoalText: {
    fontSize: 9,
    color: '#888',
  },
  editGoalText: {
    fontSize: 10,
    color: '#7b5ea7',
    marginTop: 2,
  },

  // ── Scheduled Ads ──
  scheduledHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduledTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  scheduledMonth: {
    fontSize: 11,
    color: '#aaa',
  },
  dayColumn: {
    alignItems: 'center',
    marginRight: 10,
    width: 42,
  },
  dayDOW: {
    fontSize: 9,
    color: '#aaa',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  brandDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginTop: 6,
  },

  // ── Brand strip ──
  brandStrip: {
    backgroundColor: '#fff',
    borderTopWidth: 0.5,
    borderTopColor: '#f0efe8',
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  brandBubbleCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  brandBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandBubbleActive: {
    borderWidth: 2,
    borderColor: '#7b5ea7',
  },
  brandBubbleText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  brandBubbleName: {
    fontSize: 8,
    color: '#555',
    marginTop: 3,
  },

  // ── Campaign cards ──
  campaignListContainer: {
    backgroundColor: '#f7f6f4',
    marginTop: 6,
  },
  campaignCard: {
    backgroundColor: '#fff',
    padding: 12,
    paddingHorizontal: 14,
  },
  campaignDivider: {
    height: 0.5,
    backgroundColor: '#f0efe8',
  },
  campaignCardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  brandCircleSm: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCircleSmText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#fff',
  },
  campaignBrandName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  pill: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '500',
  },
  campaignDescription: {
    fontSize: 12,
    color: '#333',
    marginBottom: 8,
  },
  campaignFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payoutText: {
    fontSize: 11,
    color: '#aaa',
  },
  statusPill: {
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // ── See more ──
  seeMoreContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 14,
  },
  seeMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },

  // ── Bottom nav ──
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#1a0a2e',
    paddingTop: 8,
    paddingBottom: 20,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  navLabel: {
    fontSize: 8,
    color: '#fff',
  },
});

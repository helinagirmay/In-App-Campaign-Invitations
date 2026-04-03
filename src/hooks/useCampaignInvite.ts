import { useState, useCallback } from 'react';

type FlowStep = 'idle' | 'notification' | 'sheet' | 'coupon';

interface UseCampaignInviteReturn {
  flowStep: FlowStep;
  couponCode: string | null;
  isGenerating: boolean;
  startFlow: () => void;
  dismissNotif: () => void;
  openSheet: () => void;
  joinCampaign: () => void;
  completeFlow: (cb: () => void) => void;
}

function generateCouponCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const suffix = Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
  return 'HM-' + suffix;
}

export function useCampaignInvite(): UseCampaignInviteReturn {
  const [flowStep, setFlowStep] = useState<FlowStep>('idle');
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const startFlow = useCallback(() => {
    setFlowStep('notification');
  }, []);

  const dismissNotif = useCallback(() => {
    setFlowStep('idle');
  }, []);

  const openSheet = useCallback(() => {
    setFlowStep('sheet');
  }, []);

  const joinCampaign = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const code = generateCouponCode();
      setCouponCode(code);
      setIsGenerating(false);
      setFlowStep('coupon');
    }, 1200);
  }, []);

  const completeFlow = useCallback((cb: () => void) => {
    setFlowStep('idle');
    setCouponCode(null);
    cb();
  }, []);

  return {
    flowStep,
    couponCode,
    isGenerating,
    startFlow,
    dismissNotif,
    openSheet,
    joinCampaign,
    completeFlow,
  };
}

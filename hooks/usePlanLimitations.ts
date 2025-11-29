
import { useAuth } from '../contexts/AuthContext';
import { PLAN_LIMITS } from '../constants';

export const usePlanLimitations = () => {
  const { tenant } = useAuth();
  
  const currentPlan = tenant?.plan === 'pro' ? 'pro' : 'basic';
  const limits = PLAN_LIMITS[currentPlan];

  const checkLimit = (feature: keyof typeof limits) => {
      return limits[feature];
  };

  return {
    currentPlan,
    limits,
    // Helpers booleanos para facilitar o uso na UI
    canAddProduct: (currentCount: number) => limits.maxProducts === Infinity || currentCount < limits.maxProducts,
    canUseCustomDomain: limits.allowCustomDomain,
    canViewReports: limits.allowAdvancedReports,
    isPro: currentPlan === 'pro'
  };
};

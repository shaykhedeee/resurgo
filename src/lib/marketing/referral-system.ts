export interface ReferralConfig {
  referrerReward: {
    type: 'extend_trial' | 'extra_goals' | 'pro_days';
    value: number;
    description: string;
  };
  refereeReward: {
    type: 'extend_trial' | 'extra_goals' | 'pro_days';
    value: number;
    description: string;
  };
  maxReferrals: number;
}

export const REFERRAL_CONFIG: ReferralConfig = {
  referrerReward: {
    type: 'pro_days',
    value: 7,
    description: 'You earn 7 Pro days for each successful referral.',
  },
  refereeReward: {
    type: 'pro_days',
    value: 7,
    description: 'Your friend gets 7 Pro days when they join through your link.',
  },
  maxReferrals: 50,
};

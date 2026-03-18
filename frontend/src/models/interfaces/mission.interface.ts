export interface IMission {
  code: string;
  conditions: string;
  createdAt: string;
  description: string;
  isActive: string;
  isClaimed: boolean;
  isCompleted: boolean;
  isRepeatable: boolean;
  name: string;
  points: string;
  progress: number;
  repeatFrequency: string;
  sortOrder: string;
  type: string;
  typeId: string;
  updatedAt: string;
}

export interface IMissionDailyCheckIn {
  checked: boolean;
  date: string;
  day: number;
  points: number;
}

export interface IMissionDailyCheckInResponse {
  consecutive: boolean;
  dayNumber: number;
  message: string;
  pointsEarned: number;
  streak: number;
  success: boolean;
  totalPoints: number;
}

export interface IMissionDailyStatus {
  canCheckinToday: boolean;
  checkins: string[];
  nextCheckinPoints: number;
  streakBroken: boolean;
  totalPoints: number;
  weekStart: string;
}

export interface IMissionDailyStatusParsed {
  canCheckinToday: boolean;
  checkins: IMissionDailyCheckIn[];
  nextCheckinPoints: number;
  streakBroken: boolean;
  totalPoints: number;
  weekStart: string;
}

export interface IMissionDailyStatusResponse {
  canCheckinToday: boolean;
  checkins: string[];
  nextCheckinPoints: number;
  streakBroken: boolean;
  totalPoints: number;
  weekStart: string;
}

export interface IMissionReward {
  createdAt: string;
  exchanged: boolean;
  exchangePoints: number;
  rewardData: string;
  rewardId: number;
  shortDescription: string;
  title: string;
  updatedAt: string;
}

export interface IMissionRewardExchangeRequest {
  rewardId: number;
}

export interface IMissionRewardExchangeResponse {
  customerId: number;
  exchangeId: number;
  pointsSpent: number;
  rewardId: number;
  status: string;
}

export interface IMissionRewardHistory {
  createdAt: string;
  customerId: number;
  exchangeId: number;
  pointsSpent: number;
  rewardId: number;
  status: string;
}

export interface ITransformedMission {
  code: string;
  description: string;
  id: number;
  isCompleted: boolean;
  point: number;
  title: string;
}

export interface ITransformedMissionRewardHistory {
  date: string;
  description: string;
  id: number;
  point: number;
  title: string;
}

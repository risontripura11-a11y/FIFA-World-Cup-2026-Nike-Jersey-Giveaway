export interface CountryKit {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  numberColor: string;
  accentColor: string;
  stars: number;
  flag: string;
  patternType: 'solid' | 'stripes' | 'sash' | 'shoulders' | 'waves' | 'halves';
}

export interface JerseyCustomization {
  countryId: string;
  playerName: string;
  playerNumber: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  gender: 'Men' | 'Women' | 'Youth';
  badgeStyle: 'Standard' | 'Retro' | 'Gold Edition';
  viewMode: 'front' | 'back';
}

export interface ParticipantSubmission {
  id: string;
  fullName: string;
  email: string;
  instagramHandle: string;
  customization: JerseyCustomization;
  triviaAnswerCorrect: boolean;
  spinReward: string;
  entryCode: string;
  submittedAt: string;
}

export interface LiveTicket {
  ticketCode: string;
  fullName: string;
  countryName: string;
  playerName: string;
  playerNumber: string;
  rewardName: string;
  timestamp: string;
}

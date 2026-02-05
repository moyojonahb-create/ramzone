export interface RadioStation {
  id: string;
  name: string;
  logo: string;
  frequency?: string;
  genre: string;
  location: string;
  streamUrl: string;
  isLive: boolean;
  listeners: number;
  description: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  listeners: string;
}
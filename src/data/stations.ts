import { RadioStation } from "@/types/radio";

export const radioStations: RadioStation[] = [
  {
    id: "1",
    name: "ZBC Radio Zimbabwe",
    logo: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=200&h=200&fit=crop",
    frequency: "95.0 FM",
    genre: "News & Talk",
    location: "Harare",
    streamUrl: "https://stream.example.com/zbc",
    isLive: true,
    listeners: 12540,
    description: "Zimbabwe's premier national broadcaster"
  },
  {
    id: "2",
    name: "Star FM",
    logo: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop",
    frequency: "89.7 FM",
    genre: "Pop & Hits",
    location: "Harare",
    streamUrl: "https://stream.example.com/starfm",
    isLive: true,
    listeners: 8920,
    description: "The biggest hits from Zimbabwe and beyond"
  },
  {
    id: "3",
    name: "Power FM",
    logo: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop",
    frequency: "99.3 FM",
    genre: "Urban",
    location: "Bulawayo",
    streamUrl: "https://stream.example.com/powerfm",
    isLive: true,
    listeners: 6750,
    description: "Urban beats and city vibes"
  },
  {
    id: "4",
    name: "Capitalk 100.4",
    logo: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=200&h=200&fit=crop",
    frequency: "100.4 FM",
    genre: "Business & Talk",
    location: "Harare",
    streamUrl: "https://stream.example.com/capitalk",
    isLive: true,
    listeners: 5430,
    description: "Zimbabwe's business radio"
  },
  {
    id: "5",
    name: "Breeze FM",
    logo: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=200&h=200&fit=crop",
    frequency: "91.5 FM",
    genre: "Gospel",
    location: "Mutare",
    streamUrl: "https://stream.example.com/breezefm",
    isLive: true,
    listeners: 4210,
    description: "Uplifting gospel music"
  },
  {
    id: "6",
    name: "Diamond FM",
    logo: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=200&h=200&fit=crop",
    frequency: "102.1 FM",
    genre: "Afrobeats",
    location: "Masvingo",
    streamUrl: "https://stream.example.com/diamondfm",
    isLive: false,
    listeners: 3890,
    description: "African rhythms and vibes"
  },
  {
    id: "7",
    name: "Classic 263",
    logo: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=200&h=200&fit=crop",
    frequency: "103.8 FM",
    genre: "Classical",
    location: "Harare",
    streamUrl: "https://stream.example.com/classic263",
    isLive: true,
    listeners: 2150,
    description: "Timeless classical music"
  },
  {
    id: "8",
    name: "Nyaminyami FM",
    logo: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=200&h=200&fit=crop",
    frequency: "88.5 FM",
    genre: "Community",
    location: "Kariba",
    streamUrl: "https://stream.example.com/nyaminyami",
    isLive: true,
    listeners: 1890,
    description: "Voice of the Kariba community"
  },
  {
    id: "9",
    name: "Khulumani FM",
    logo: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&h=200&fit=crop",
    frequency: "90.7 FM",
    genre: "News & Talk",
    location: "Bulawayo",
    streamUrl: "https://stream.example.com/khulumani",
    isLive: true,
    listeners: 4560,
    description: "Matabeleland's voice"
  },
  {
    id: "10",
    name: "Skyz Metro FM",
    logo: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop",
    frequency: "96.6 FM",
    genre: "Hip Hop",
    location: "Bulawayo",
    streamUrl: "https://stream.example.com/skyzmetro",
    isLive: true,
    listeners: 7230,
    description: "Urban culture and hip hop"
  },
  {
    id: "11",
    name: "Hevoi FM",
    logo: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=200&h=200&fit=crop",
    frequency: "97.1 FM",
    genre: "Community",
    location: "Masvingo",
    streamUrl: "https://stream.example.com/hevoi",
    isLive: true,
    listeners: 2340,
    description: "Community radio for all"
  },
  {
    id: "12",
    name: "YA FM",
    logo: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=200&h=200&fit=crop",
    frequency: "94.2 FM",
    genre: "Youth",
    location: "Harare",
    streamUrl: "https://stream.example.com/yafm",
    isLive: false,
    listeners: 5670,
    description: "Young, fresh, and dynamic"
  },
];

export const subscriptionPlans = [
  {
    id: "starter",
    name: "Starter",
    price: 29,
    currency: "USD",
    listeners: "Up to 100 listeners",
    features: [
      "Basic streaming",
      "128kbps quality",
      "Basic analytics",
      "Email support",
      "1 stream mount"
    ]
  },
  {
    id: "professional",
    name: "Professional",
    price: 79,
    currency: "USD",
    listeners: "Up to 500 listeners",
    popular: true,
    features: [
      "HD streaming",
      "320kbps quality",
      "Advanced analytics",
      "Priority support",
      "3 stream mounts",
      "Custom player",
      "Auto DJ integration"
    ]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 199,
    currency: "USD",
    listeners: "Unlimited listeners",
    features: [
      "Ultra HD streaming",
      "Highest quality",
      "Real-time analytics",
      "24/7 phone support",
      "Unlimited mounts",
      "White-label player",
      "API access",
      "Custom mobile app"
    ]
  }
];
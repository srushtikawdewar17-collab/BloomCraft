export interface FlowerColor {
  name: string;
  hex: string;
  petalHex: string;
  accentHex: string;
}

export interface FlowerData {
  id: string;
  name: string;
  type: 'main' | 'filler' | 'greenery';
  meaning: string;
  description: string;
  colors: FlowerColor[];
  defaultScale: number;
}

export const FLOWERS: FlowerData[] = [
  // Main Flowers
  {
    id: 'rose',
    name: 'Rose',
    type: 'main',
    meaning: 'Love & Passion',
    description: 'The classic symbol of deep love and devotion. Its layered petals bloom outwards in perfect elegance.',
    defaultScale: 1.0,
    colors: [
      { name: 'Blush Pink', hex: '#FFB7C5', petalHex: '#FFC0CB', accentHex: '#E297A7' },
      { name: 'Crimson Red', hex: '#D2143A', petalHex: '#E63956', accentHex: '#9E0A24' },
      { name: 'Champagne Yellow', hex: '#FFF2D4', petalHex: '#FFF8E7', accentHex: '#E6D3A8' },
      { name: 'Pure White', hex: '#FFFFFF', petalHex: '#FAFAFA', accentHex: '#DCDCDC' },
    ]
  },
  {
    id: 'peony',
    name: 'Peony',
    type: 'main',
    meaning: 'Prosperity & Romance',
    description: 'A lush, multi-petaled bloom signifying good fortune, prosperity, and a happy marriage.',
    defaultScale: 1.15,
    colors: [
      { name: 'Soft Coral', hex: '#FCAE96', petalHex: '#FFC8B8', accentHex: '#E3927A' },
      { name: 'Blush Pink', hex: '#FFC3D0', petalHex: '#FFD3DF', accentHex: '#EAA4B4' },
      { name: 'Deep Crimson', hex: '#B81D43', petalHex: '#C92B54', accentHex: '#8C0827' },
    ]
  },
  {
    id: 'ranunculus',
    name: 'Ranunculus',
    type: 'main',
    meaning: 'Charm & Attraction',
    description: 'Intricately paper-thin petals spun tight, representing glowing radiant charm and sparkling attractiveness.',
    defaultScale: 0.9,
    colors: [
      { name: 'Peach Cream', hex: '#FFD6C0', petalHex: '#FFE6D9', accentHex: '#E5BCA8' },
      { name: 'Sunset Orange', hex: '#FF8A5B', petalHex: '#FFA07A', accentHex: '#D8683B' },
      { name: 'Buttercup Yellow', hex: '#FFDB58', petalHex: '#FFE787', accentHex: '#D1AF29' },
    ]
  },
  {
    id: 'garden-rose',
    name: 'Garden Rose',
    type: 'main',
    meaning: 'Grace & Admiration',
    description: 'Rich ruffled center with vintage perfume, speaking of gentle admiration and timeless grace.',
    defaultScale: 1.05,
    colors: [
      { name: 'Dusty Rose', hex: '#DCAE96', petalHex: '#EAD1C2', accentHex: '#BC8A70' },
      { name: 'Cream Ivory', hex: '#FFF8EE', petalHex: '#FFFAF3', accentHex: '#EAE1CE' },
      { name: 'Lavender Mist', hex: '#E6E6FA', petalHex: '#F0E6FF', accentHex: '#C3B0FA' },
    ]
  },
  {
    id: 'hydrangea',
    name: 'Hydrangea',
    type: 'main',
    meaning: 'Gratitude & Understanding',
    description: 'A beautiful cloud of tiny florets, embodying sincere heartfelt feelings and mutual understanding.',
    defaultScale: 1.3,
    colors: [
      { name: 'Powder Blue', hex: '#B0C4DE', petalHex: '#C5D8F1', accentHex: '#8FA7C6' },
      { name: 'Blush Pink', hex: '#FFB3C6', petalHex: '#FFC8D6', accentHex: '#E68CA3' },
      { name: 'Soft Lavender', hex: '#E3D2FD', petalHex: '#ECE0FF', accentHex: '#BEA6E6' },
    ]
  },
  {
    id: 'tulip',
    name: 'Tulip',
    type: 'main',
    meaning: 'Happiness & New Beginnings',
    description: 'A sleek, cup-shaped bloom signaling the warm renewal of spring and perfect absolute happiness.',
    defaultScale: 0.85,
    colors: [
      { name: 'Sunny Yellow', hex: '#FFDB58', petalHex: '#FFE47E', accentHex: '#D9B426' },
      { name: 'Blush Pink', hex: '#FFB7C5', petalHex: '#FFD1DC', accentHex: '#E790A2' },
      { name: 'Scarlet Red', hex: '#E53E3E', petalHex: '#FC8181', accentHex: '#9B2C2C' },
    ]
  },
  {
    id: 'orchid',
    name: 'Orchid',
    type: 'main',
    meaning: 'Elegance & Luxury',
    description: 'Exotic structural petals indicating refined beauty, rare luxury, and strong elegance.',
    defaultScale: 0.95,
    colors: [
      { name: 'Royal Magenta', hex: '#C71585', petalHex: '#E258B8', accentHex: '#93095D' },
      { name: 'Pure White', hex: '#FBFBFA', petalHex: '#FFFFFF', accentHex: '#DDDCD8' },
      { name: 'Imperial Violet', hex: '#8A2BE2', petalHex: '#AB61F5', accentHex: '#6116AB' },
    ]
  },
  {
    id: 'lily',
    name: 'Lily',
    type: 'main',
    meaning: 'Purity & Grace',
    description: 'Striking trumpet blooms with gentle stamens, representing purity of heart, grace, and majesty.',
    defaultScale: 1.1,
    colors: [
      { name: 'Pure White', hex: '#FAFAF5', petalHex: '#FFFFFF', accentHex: '#E2E2D7' },
      { name: 'Stargazer Pink', hex: '#FF69B4', petalHex: '#FF8DC6', accentHex: '#C93C85' },
      { name: 'Sunset Peach', hex: '#FFC8A2', petalHex: '#FFE3D1', accentHex: '#E3A273' },
    ]
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    type: 'main',
    meaning: 'Joy & Positivity',
    description: 'Bright golden rays tracking the sun, speaking of unwavering loyalty, radiant joy, and optimism.',
    defaultScale: 1.2,
    colors: [
      { name: 'Golden Yellow', hex: '#FFD700', petalHex: '#FFE04D', accentHex: '#C99D00' },
      { name: 'Autumn Bronze', hex: '#CD7F32', petalHex: '#E29E57', accentHex: '#9A520E' },
    ]
  },
  {
    id: 'cherry-blossom',
    name: 'Cherry Blossom',
    type: 'main',
    meaning: 'Beauty & Renewal',
    description: 'Delicate ephemeral spring blossom, reminding us of the fleeting nature of beauty and new life.',
    defaultScale: 0.8,
    colors: [
      { name: 'Sakura Pink', hex: '#FFC0CB', petalHex: '#FFE4E1', accentHex: '#EB9FA9' },
      { name: 'Snow White', hex: '#FFF8F8', petalHex: '#FFFFFF', accentHex: '#E8D4D4' },
    ]
  },

  // Fillers
  {
    id: 'babys-breath',
    name: "Baby's Breath",
    type: 'filler',
    meaning: 'Everlasting Love',
    description: 'Clouds of tiny white blossoms, signifying eternal love and the purity of innocent hearts.',
    defaultScale: 0.65,
    colors: [
      { name: 'Pearl White', hex: '#FDFCFA', petalHex: '#FFFFFF', accentHex: '#DDDCD8' },
      { name: 'Blush Mist', hex: '#FFE4EC', petalHex: '#FFF0F5', accentHex: '#E6C4D0' },
    ]
  },
  {
    id: 'wax-flower',
    name: 'Wax Flower',
    type: 'filler',
    meaning: 'Riches & Long-lasting Love',
    description: 'Small, waxy, five-petaled star flowers that symbolize lasting prosperity and enduring affection.',
    defaultScale: 0.6,
    colors: [
      { name: 'Berry Pink', hex: '#DB7093', petalHex: '#FF8DA1', accentHex: '#A23E62' },
      { name: 'Soft Ivory', hex: '#FFFFFD', petalHex: '#FFFFFF', accentHex: '#D8D8CF' },
    ]
  },
  {
    id: 'statice',
    name: 'Statice',
    type: 'filler',
    meaning: 'Remembrance & Sympathy',
    description: 'Clusters of paper-like blossoms that retain color long after drying, representing remembrance.',
    defaultScale: 0.7,
    colors: [
      { name: 'Deep Purple', hex: '#800080', petalHex: '#A825A8', accentHex: '#580058' },
      { name: 'Mist Blue', hex: '#87CEEB', petalHex: '#ADD8E6', accentHex: '#5297B2' },
    ]
  },

  // Greenery
  {
    id: 'eucalyptus',
    name: 'Eucalyptus',
    type: 'greenery',
    meaning: 'Protection & Healing',
    description: 'Round, silvery sage-green leaves that form a beautiful structural frame and add soothing energy.',
    defaultScale: 0.75,
    colors: [
      { name: 'Silver Dollar', hex: '#778C85', petalHex: '#8EA7A0', accentHex: '#5F726C' },
      { name: 'Sage Green', hex: '#8FBC8F', petalHex: '#A2CCA2', accentHex: '#729E72' },
    ]
  },
  {
    id: 'ruscus',
    name: 'Italian Ruscus',
    type: 'greenery',
    meaning: 'Thoughtfulness & Modesty',
    description: 'Glossy, tear-shaped deep green foliage cascading elegantly to frame and lift focal blooms.',
    defaultScale: 0.7,
    colors: [
      { name: 'Classic Green', hex: '#2E5A27', petalHex: '#3D7734', accentHex: '#1E3E19' },
    ]
  },
  {
    id: 'fern',
    name: 'Fern Leaves',
    type: 'greenery',
    meaning: 'Sincerity & Fascination',
    description: 'Delicate feathered fronds offering visual texture and symbolizing sincere fascination.',
    defaultScale: 0.8,
    colors: [
      { name: 'Forest Green', hex: '#228B22', petalHex: '#32CD32', accentHex: '#176017' },
    ]
  },
  {
    id: 'olive',
    name: 'Olive Branches',
    type: 'greenery',
    meaning: 'Peace & Reconciliation',
    description: 'Slender, elongated leaves with soft white-green undersides, representing peace and harmony.',
    defaultScale: 0.85,
    colors: [
      { name: 'Muted Olive', hex: '#6B8E23', petalHex: '#808000', accentHex: '#4E6B15' },
    ]
  }
];

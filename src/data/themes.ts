export interface WrapOption {
  id: string;
  name: string;
  hex: string;
  gradient: string; // CSS gradient description
  textColor: string;
}

export interface RibbonOption {
  id: string;
  name: string;
  hex: string;
  texture: 'satin' | 'velvet' | 'organza' | 'lace';
}

export interface ThemeData {
  id: string;
  name: string;
  tagline: string;
  backgroundClass: string; // Gradient class for time of day / override
  defaultWrapId: string;
  defaultRibbonId: string;
  effect: 'petals' | 'sakura' | 'fireflies' | 'gold-shimmer' | 'bokeh' | 'none';
  accentColor: string;
}

export const WRAPS: WrapOption[] = [
  { id: 'ivory-silk', name: 'Ivory Silk', hex: '#FAF9F6', gradient: 'linear-gradient(135deg, #FAF9F6 0%, #EFEBE4 100%)', textColor: '#4A453E' },
  { id: 'blush-satin', name: 'Blush Satin', hex: '#FFD3DF', gradient: 'linear-gradient(135deg, #FFD3DF 0%, #F5AEBF 100%)', textColor: '#6A2A38' },
  { id: 'champagne-gold', name: 'Champagne Gold', hex: '#E6C587', gradient: 'linear-gradient(135deg, #F9F3E5 0%, #D8B168 100%)', textColor: '#5C431A' },
  { id: 'lavender-mist', name: 'Lavender Mist', hex: '#E1D5FA', gradient: 'linear-gradient(135deg, #E1D5FA 0%, #BBA6EC 100%)', textColor: '#3D2278' },
  { id: 'pearl-white', name: 'Pearl White', hex: '#FFFFFF', gradient: 'linear-gradient(135deg, #FFFFFF 0%, #E2DFD9 100%)', textColor: '#333333' },
  { id: 'sage-green', name: 'Sage Green', hex: '#C3DEC9', gradient: 'linear-gradient(135deg, #E3EFE5 0%, #A2CCA2 100%)', textColor: '#1E3C21' },
  { id: 'dusty-rose', name: 'Dusty Rose', hex: '#D7A19E', gradient: 'linear-gradient(135deg, #EAD4D3 0%, #C28481 100%)', textColor: '#522120' },
  { id: 'midnight-luxury', name: 'Midnight Luxury Black', hex: '#1C1C1F', gradient: 'linear-gradient(135deg, #323238 0%, #151517 100%)', textColor: '#EAEAEA' }
];

export const RIBBONS: RibbonOption[] = [
  { id: 'satin-ribbon', name: 'Satin Ribbon', hex: '#FF69B4', texture: 'satin' },
  { id: 'velvet-ribbon', name: 'Velvet Ribbon', hex: '#8B0000', texture: 'velvet' },
  { id: 'organza-ribbon', name: 'Organza Ribbon', hex: '#E6E6FA', texture: 'organza' },
  { id: 'lace-ribbon', name: 'Lace Ribbon', hex: '#FFF8DC', texture: 'lace' },
  { id: 'double-luxury-bow', name: 'Double Luxury Bow', hex: '#D4AF37', texture: 'satin' }
];

export const THEMES: ThemeData[] = [
  {
    id: 'romantic',
    name: 'Romantic',
    tagline: 'Deep crimson tones, blushing wrappers, and drifting rose petals.',
    backgroundClass: 'from-pink-50 via-rose-100 to-red-100',
    defaultWrapId: 'blush-satin',
    defaultRibbonId: 'velvet-ribbon',
    effect: 'petals',
    accentColor: '#D2143A'
  },
  {
    id: 'princess',
    name: 'Princess',
    tagline: 'A royal treatment of pinks, pearls, and soft bokeh lights.',
    backgroundClass: 'from-purple-50 via-pink-100 to-rose-100',
    defaultWrapId: 'pearl-white',
    defaultRibbonId: 'satin-ribbon',
    effect: 'bokeh',
    accentColor: '#FF69B4'
  },
  {
    id: 'cottagecore',
    name: 'Cottagecore',
    tagline: 'Warm rustic greens, sage wrapping, and wild summer air.',
    backgroundClass: 'from-amber-50 via-emerald-50 to-green-100',
    defaultWrapId: 'sage-green',
    defaultRibbonId: 'lace-ribbon',
    effect: 'none',
    accentColor: '#8FBC8F'
  },
  {
    id: 'fairy-garden',
    name: 'Fairy Garden',
    tagline: 'Whimsical forest settings with floating glow-in-the-dark fireflies.',
    backgroundClass: 'from-teal-50 via-emerald-100 to-purple-100',
    defaultWrapId: 'lavender-mist',
    defaultRibbonId: 'organza-ribbon',
    effect: 'fireflies',
    accentColor: '#8A2BE2'
  },
  {
    id: 'luxury',
    name: 'Luxury',
    tagline: 'Polished golds, champagne ribbons, and premium golden shimmers.',
    backgroundClass: 'from-amber-50 via-yellow-100 to-amber-200',
    defaultWrapId: 'champagne-gold',
    defaultRibbonId: 'double-luxury-bow',
    effect: 'gold-shimmer',
    accentColor: '#D4AF37'
  },
  {
    id: 'vintage',
    name: 'Vintage',
    tagline: 'Nostalgic cream palettes, dusty rose wraps, and classic sepia tones.',
    backgroundClass: 'from-amber-100/30 via-orange-50 to-amber-100/50',
    defaultWrapId: 'dusty-rose',
    defaultRibbonId: 'lace-ribbon',
    effect: 'none',
    accentColor: '#BC8A70'
  },
  {
    id: 'dreamy-pastels',
    name: 'Dreamy Pastels',
    tagline: 'Soft watercolor hues, ivory ribbons, and gentle cloud-like lights.',
    backgroundClass: 'from-sky-50 via-violet-50 to-pink-50',
    defaultWrapId: 'ivory-silk',
    defaultRibbonId: 'organza-ribbon',
    effect: 'bokeh',
    accentColor: '#B0C4DE'
  },
  {
    id: 'royal-elegance',
    name: 'Royal Elegance',
    tagline: 'Rich indigo velvet and gold leaf details for majestic statements.',
    backgroundClass: 'from-slate-100 via-indigo-100 to-blue-200',
    defaultWrapId: 'midnight-luxury',
    defaultRibbonId: 'double-luxury-bow',
    effect: 'gold-shimmer',
    accentColor: '#C71585'
  },
  {
    id: 'spring-blossom',
    name: 'Spring Blossom',
    tagline: 'Bright sakura colors with elegant drifting cherry blossoms.',
    backgroundClass: 'from-green-50 via-rose-50 to-pink-100',
    defaultWrapId: 'pearl-white',
    defaultRibbonId: 'satin-ribbon',
    effect: 'sakura',
    accentColor: '#FFC0CB'
  },
  {
    id: 'dark-floral',
    name: 'Dark Floral',
    tagline: 'Dramatic, intense dark backdrops, moody roses, and golden sparkles.',
    backgroundClass: 'from-[#0d0d12] via-[#161424] to-[#0d0d12]',
    defaultWrapId: 'midnight-luxury',
    defaultRibbonId: 'velvet-ribbon',
    effect: 'gold-shimmer',
    accentColor: '#B81D43'
  }
];

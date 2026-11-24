import { TownshipOption } from './types';
import { MOCK_TOWNSHIPS } from './mockData';

// Geographic center coordinates, aliases, and formal names for Myanmar townships
export interface TownshipGeoMeta {
  name: string;
  lat: number;
  lng: number;
  aliases: string[];
  townshipEn: string;
  townshipMy: string;
  stateEn: string;
  stateMy: string;
}

export const TOWNSHIP_GEO_METAS: TownshipGeoMeta[] = [
  {
    name: 'Kamayut, Yangon',
    lat: 16.8285,
    lng: 96.1285,
    aliases: ['kamayut', 'kamaryut', 'ကမာရွတ်', 'ကမာရွတ်မြို့နယ်', 'kamayut township'],
    townshipEn: 'Kamayut Township',
    townshipMy: 'ကမာရွတ်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Hledan, Yangon',
    lat: 16.8258,
    lng: 96.1287,
    aliases: ['hledan', 'hle dan', 'လှည်းတန်း', 'လှည်းတန်းလမ်းဆုံ'],
    townshipEn: 'Hledan, Kamayut Township',
    townshipMy: 'လှည်းတန်း၊ ကမာရွတ်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Bahan, Yangon',
    lat: 16.8122,
    lng: 96.1544,
    aliases: ['bahan', 'ဗဟန်း', 'ဗဟန်းမြို့နယ်', 'bahan township'],
    townshipEn: 'Bahan Township',
    townshipMy: 'ဗဟန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Sanchaung, Yangon',
    lat: 16.8045,
    lng: 96.1342,
    aliases: ['sanchaung', 'san chaung', 'စမ်းချောင်း', 'စမ်းချောင်းမြို့နယ်', 'sanchaung township'],
    townshipEn: 'Sanchaung Township',
    townshipMy: 'စမ်းချောင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Dagon, Yangon',
    lat: 16.7975,
    lng: 96.1485,
    aliases: ['dagon', 'ဒဂုံ', 'ဒဂုံမြို့နယ်', 'dagon township'],
    townshipEn: 'Dagon Township',
    townshipMy: 'ဒဂုံမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Kyauktada, Yangon',
    lat: 16.7744,
    lng: 96.1601,
    aliases: ['kyauktada', 'kyauk tada', 'ကျောက်တံတား', 'ကျောက်တံတားမြို့နယ်', 'kyauktada township'],
    townshipEn: 'Kyauktada Township',
    townshipMy: 'ကျောက်တံတားမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Pabedan, Yangon',
    lat: 16.7765,
    lng: 96.1554,
    aliases: ['pabedan', 'panbedan', 'ပန်းဘဲတန်း', 'ပန်းဘဲတန်းမြို့နယ်', 'pabedan township'],
    townshipEn: 'Pabedan Township',
    townshipMy: 'ပန်းဘဲတန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Latha, Yangon',
    lat: 16.7760,
    lng: 96.1495,
    aliases: ['latha', 'lar thar', 'လသာ', 'လသာမြို့နယ်', 'latha township'],
    townshipEn: 'Latha Township',
    townshipMy: 'လသာမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Lanmadaw, Yangon',
    lat: 16.7780,
    lng: 96.1430,
    aliases: ['lanmadaw', 'lan ma daw', 'လမ်းမတော်', 'လမ်းမတော်မြို့နယ်', 'lanmadaw township'],
    townshipEn: 'Lanmadaw Township',
    townshipMy: 'လမ်းမတော်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Ahlone, Yangon',
    lat: 16.7865,
    lng: 96.1310,
    aliases: ['ahlone', 'ahlon', 'alone', 'အလုံ', 'အလုံမြို့နယ်', 'ahlone township'],
    townshipEn: 'Ahlone Township',
    townshipMy: 'အလုံမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Kyeemyindaing, Yangon',
    lat: 16.8010,
    lng: 96.1215,
    aliases: ['kyeemyindaing', 'kyimyindaing', 'kyimyindine', 'ကြည့်မြင်တိုင်', 'ကြည့်မြင်တိုင်မြို့နယ်', 'kyeemyindaing township'],
    townshipEn: 'Kyeemyindaing Township',
    townshipMy: 'ကြည့်မြင်တိုင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Botahtaung, Yangon',
    lat: 16.7780,
    lng: 96.1705,
    aliases: ['botahtaung', 'botataung', 'ဗိုလ်တထောင်', 'ဗိုလ်တထောင်မြို့နယ်', 'botataung township', 'botahtaung township'],
    townshipEn: 'Botahtaung Township',
    townshipMy: 'ဗိုလ်တထောင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Pazundaung, Yangon',
    lat: 16.7860,
    lng: 96.1780,
    aliases: ['pazundaung', 'pa zun daung', 'ပုဇွန်တောင်', 'ပုဇွန်တောင်မြို့နယ်', 'pazundaung township'],
    townshipEn: 'Pazundaung Township',
    townshipMy: 'ပုဇွန်တောင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mingalar Taung Nyunt, Yangon',
    lat: 16.7950,
    lng: 96.1700,
    aliases: ['mingalar taung nyunt', 'mingalar taungnyunt', 'မင်္ဂလာတောင်ညွန့်', 'မင်္ဂလာတောင်ညွန့်မြို့နယ်', 'mingala taung nyunt'],
    townshipEn: 'Mingalar Taung Nyunt Township',
    townshipMy: 'မင်္ဂလာတောင်ညွန့်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Yankin, Yangon',
    lat: 16.8375,
    lng: 96.1636,
    aliases: ['yankin', 'yan kin', 'ရန်ကင်း', 'ရန်ကင်းမြို့နယ်', 'yankin township'],
    townshipEn: 'Yankin Township',
    townshipMy: 'ရန်ကင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mayangone, Yangon',
    lat: 16.8711,
    lng: 96.1444,
    aliases: ['mayangone', 'mayangon', 'မရမ်းကုန်း', 'မရမ်းကုန်းမြို့နယ်', 'mayangone township'],
    townshipEn: 'Mayangone Township',
    townshipMy: 'မရမ်းကုန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Hlaing, Yangon',
    lat: 16.8488,
    lng: 96.1264,
    aliases: ['hlaing', 'လှိုင်', 'လှိုင်မြို့နယ်', 'hlaing township'],
    townshipEn: 'Hlaing Township',
    townshipMy: 'လှိုင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Insein, Yangon',
    lat: 16.8900,
    lng: 96.0950,
    aliases: ['insein', 'in sein', 'အင်းစိန်', 'အင်းစိန်မြို့နယ်', 'insein township'],
    townshipEn: 'Insein Township',
    townshipMy: 'အင်းစိန်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Tamwe, Yangon',
    lat: 16.8092,
    lng: 96.1712,
    aliases: ['tamwe', 'ta mwe', 'တာမွေ', 'တာမွေမြို့နယ်', 'tamwe township'],
    townshipEn: 'Tamwe Township',
    townshipMy: 'တာမွေမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Thingangyun, Yangon',
    lat: 16.8200,
    lng: 96.1950,
    aliases: ['thingangyun', 'thin gan gyun', 'သင်္ဃန်းကျွန်း', 'သင်္ဃန်းကျွန်းမြို့နယ်', 'thingangyun township'],
    townshipEn: 'Thingangyun Township',
    townshipMy: 'သင်္ဃန်းကျွန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Thaketa, Yangon',
    lat: 16.7900,
    lng: 96.2050,
    aliases: ['thaketa', 'tha ke ta', 'သာကေတ', 'သာကေတမြို့နယ်', 'thaketa township'],
    townshipEn: 'Thaketa Township',
    townshipMy: 'သာကေတမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Dawbon, Yangon',
    lat: 16.7820,
    lng: 96.1920,
    aliases: ['dawbon', 'daw bon', 'ဒေါပုံ', 'ဒေါပုံမြို့နယ်', 'dawbon township'],
    townshipEn: 'Dawbon Township',
    townshipMy: 'ဒေါပုံမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'South Okkalapa, Yangon',
    lat: 16.8485,
    lng: 96.1842,
    aliases: ['south okkalapa', 'south okkalapa township', 'တောင်ဥက္ကလာပ', 'တောင်ဥက္ကလာ', 'တောင်ဥက္ကလာပမြို့နယ်'],
    townshipEn: 'South Okkalapa Township',
    townshipMy: 'တောင်ဥက္ကလာပမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'North Okkalapa, Yangon',
    lat: 16.8925,
    lng: 96.1710,
    aliases: ['north okkalapa', 'north okkalapa township', 'မြောက်ဥက္ကလာပ', 'မြောက်ဥက္ကလာ', 'မြောက်ဥက္ကလာပမြို့နယ်'],
    townshipEn: 'North Okkalapa Township',
    townshipMy: 'မြောက်ဥက္ကလာပမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'North Dagon, Yangon',
    lat: 16.8650,
    lng: 96.2200,
    aliases: ['north dagon', 'dagon myothit north', 'dagon north', 'မြောက်ဒဂုံ', 'ဒဂုံမြောက်ပိုင်း', 'ဒဂုံမြို့သစ်မြောက်ပိုင်း', 'ဒဂုံမြို့သစ်မြောက်ပိုင်းမြို့နယ်'],
    townshipEn: 'North Dagon Township',
    townshipMy: 'ဒဂုံမြို့သစ်မြောက်ပိုင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'South Dagon, Yangon',
    lat: 16.8400,
    lng: 96.2400,
    aliases: ['south dagon', 'dagon myothit south', 'dagon south', 'တောင်ဒဂုံ', 'ဒဂုံတောင်ပိုင်း', 'ဒဂုံမြို့သစ်တောင်ပိုင်း', 'ဒဂုံမြို့သစ်တောင်ပိုင်းမြို့နယ်'],
    townshipEn: 'South Dagon Township',
    townshipMy: 'ဒဂုံမြို့သစ်တောင်ပိုင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'East Dagon, Yangon',
    lat: 16.8800,
    lng: 96.2500,
    aliases: ['east dagon', 'dagon myothit east', 'dagon east', 'အရှေ့ဒဂုံ', 'ဒဂုံအရှေ့ပိုင်း', 'ဒဂုံမြို့သစ်အရှေ့ပိုင်း', 'ဒဂုံမြို့သစ်အရှေ့ပိုင်းမြို့နယ်'],
    townshipEn: 'East Dagon Township',
    townshipMy: 'ဒဂုံမြို့သစ်အရှေ့ပိုင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Dagon Seikkan, Yangon',
    lat: 16.8150,
    lng: 96.2550,
    aliases: ['dagon seikkan', 'dagon port', 'ဒဂုံဆိပ်ကမ်း', 'ဒဂုံဆိပ်ကမ်းမြို့နယ်', 'dagon seikkan township'],
    townshipEn: 'Dagon Seikkan Township',
    townshipMy: 'ဒဂုံဆိပ်ကမ်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Hlaingtharya, Yangon',
    lat: 16.8650,
    lng: 96.0500,
    aliases: ['hlaingtharya', 'hlaing tharyar', 'hlaing tharya', 'လှိုင်သာယာ', 'လှိုင်သာယာမြို့နယ်', 'hlaingtharyar township'],
    townshipEn: 'Hlaingtharya Township',
    townshipMy: 'လှိုင်သာယာမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Shwepyitha, Yangon',
    lat: 16.9400,
    lng: 96.0700,
    aliases: ['shwepyitha', 'shwe pyi tha', 'shwepyithar', 'ရွှေပြည်သာ', 'ရွှေပြည်သာမြို့နယ်', 'shwepyitha township'],
    townshipEn: 'Shwepyitha Township',
    townshipMy: 'ရွှေပြည်သာမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mingaladon, Yangon',
    lat: 16.9200,
    lng: 96.1600,
    aliases: ['mingaladon', 'mingalardon', 'မင်္ဂလာဒုံ', 'မင်္ဂလာဒုံမြို့နယ်', 'mingaladon township'],
    townshipEn: 'Mingaladon Township',
    townshipMy: 'မင်္ဂလာဒုံမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Thanlyin, Yangon',
    lat: 16.7600,
    lng: 96.2500,
    aliases: ['thanlyin', 'syriam', 'သန်လျင်', 'သန်လျင်မြို့နယ်', 'thanlyin township'],
    townshipEn: 'Thanlyin Township',
    townshipMy: 'သန်လျင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Kyauktan, Yangon',
    lat: 16.6300,
    lng: 96.3300,
    aliases: ['kyauktan', 'ကျောက်တန်း', 'ကျောက်တန်းမြို့နယ်', 'kyauktan township'],
    townshipEn: 'Kyauktan Township',
    townshipMy: 'ကျောက်တန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mandalay City (Express Delivery)',
    lat: 21.9750,
    lng: 96.0836,
    aliases: ['mandalay', 'mandalay city', 'မန္တလေး', 'မန္တလေးမြို့'],
    townshipEn: 'Mandalay City',
    townshipMy: 'မန္တလေးမြို့',
    stateEn: 'Mandalay Region',
    stateMy: 'မန္တလေးတိုင်းဒေသကြီး',
  },
];

/**
 * Calculates haversine distance in kilometers between two geo-coordinates
 */
export function calculateHaversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Finds the exact or closest township matching the coordinates or raw name
 */
export function resolveTownship(
  lat: number,
  lng: number,
  rawName?: string
): TownshipOption | null {
  const meta = resolveTownshipMeta(lat, lng, rawName);
  if (!meta) return null;
  return MOCK_TOWNSHIPS.find((t) => t.name === meta.name) || null;
}

/**
 * Finds the TownshipGeoMeta matching the coordinates or raw name
 */
export function resolveTownshipMeta(
  lat: number,
  lng: number,
  rawName?: string
): TownshipGeoMeta | null {
  const normalizedRaw = (rawName || '').trim().toLowerCase();

  // 1. Check exact or alias matching if a name was returned by geocoder
  if (normalizedRaw) {
    // 1a. Direct exact match against any alias or name
    for (const meta of TOWNSHIP_GEO_METAS) {
      if (
        meta.name.toLowerCase() === normalizedRaw ||
        meta.townshipEn.toLowerCase() === normalizedRaw ||
        meta.townshipMy === normalizedRaw ||
        meta.aliases.some((alias) => alias.toLowerCase() === normalizedRaw)
      ) {
        return meta;
      }
    }

    // 1b. Cleaned name exact match (strip "township", "မြို့နယ်", etc.)
    const cleanRaw = normalizedRaw
      .replace(/(township|city|district|quarter|ward|myothit|မြို့နယ်|မြို့|ရပ်ကွက်)/gi, '')
      .trim();

    if (cleanRaw) {
      for (const meta of TOWNSHIP_GEO_METAS) {
        for (const alias of meta.aliases) {
          const cleanAlias = alias
            .replace(/(township|city|district|quarter|ward|myothit|မြို့နယ်|မြို့|ရပ်ကွက်)/gi, '')
            .trim()
            .toLowerCase();
          if (cleanRaw === cleanAlias) {
            return meta;
          }
        }
      }
    }

    // 1c. Substring match, sorted so longer/more specific names match first
    // (e.g. "hlaingtharya" matches Hlaingtharya, NOT Hlaing; "north dagon" matches North Dagon, NOT Dagon)
    const sortedMetas = [...TOWNSHIP_GEO_METAS].sort((a, b) => {
      const maxA = Math.max(...a.aliases.map((al) => al.length));
      const maxB = Math.max(...b.aliases.map((al) => al.length));
      return maxB - maxA;
    });

    for (const meta of sortedMetas) {
      const sortedAliases = [...meta.aliases].sort((x, y) => y.length - x.length);
      for (const alias of sortedAliases) {
        const lowerAlias = alias.toLowerCase();
        if (
          lowerAlias.length >= 3 &&
          (normalizedRaw.includes(lowerAlias) || (cleanRaw && cleanRaw.includes(lowerAlias)))
        ) {
          return meta;
        }
      }
    }
  }

  // 2. If coordinates are provided, find closest township by geographic distance
  if (!Number.isNaN(lat) && !Number.isNaN(lng) && lat !== 0 && lng !== 0) {
    let closestMeta: TownshipGeoMeta | null = null;
    let minDistance = Infinity;

    for (const meta of TOWNSHIP_GEO_METAS) {
      const dist = calculateHaversineDistanceKm(lat, lng, meta.lat, meta.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestMeta = meta;
      }
    }

    if (closestMeta) {
      return closestMeta;
    }
  }

  return null;
}

/**
 * Formats a formal, structured Myanmar address:
 * [House Number], [Street], [Ward], [Township], [State / Region]
 */
export interface FormalAddressInput {
  houseNumber?: string;
  road?: string;
  ward?: string;
  township?: string;
  state?: string;
  language?: 'en' | 'my';
  matchedMeta?: TownshipGeoMeta | null;
}

export function formatFormalMyanmarAddress({
  houseNumber,
  road,
  ward,
  township,
  state,
  language = 'en',
  matchedMeta,
}: FormalAddressInput): string {
  const isMm = language === 'my';

  // 1. House Number
  let cleanHouse = (houseNumber || '').trim();
  if (cleanHouse) {
    cleanHouse = isMm ? `အမှတ် ${cleanHouse}` : `No. ${cleanHouse}`;
  }

  // 2. Road / Street
  let cleanRoad = (road || '').trim();
  if (cleanRoad) {
    if (isMm) {
      if (!cleanRoad.endsWith('လမ်း') && !cleanRoad.endsWith('လမ်းသွယ်')) {
        cleanRoad += 'လမ်း';
      }
    } else {
      if (
        !/(street|road|lane|way|avenue|boulevard|drive|expressway|highway)$/i.test(
          cleanRoad
        )
      ) {
        cleanRoad += ' Street';
      }
    }
  }

  const streetPart = [cleanHouse, cleanRoad]
    .filter(Boolean)
    .join(isMm ? '၊ ' : ', ');

  // 3. Ward (ရပ်ကွက်)
  let cleanWard = (ward || '').trim();
  if (cleanWard) {
    if (isMm) {
      cleanWard = cleanWard.replace(/-?ရပ်ကွက်$/, '').trim();
      if (cleanWard === 'က' || cleanWard === 'က-' || cleanWard === '(က)') {
        cleanWard = '(က)';
      }
      cleanWard = `${cleanWard} ရပ်ကွက်`;
    } else {
      if (!/ward$/i.test(cleanWard)) {
        cleanWard = `${cleanWard} Ward`;
      }
    }
  }

  // 4. Township (မြို့နယ်)
  let cleanTownship = '';
  if (matchedMeta) {
    cleanTownship = isMm ? matchedMeta.townshipMy : matchedMeta.townshipEn;
  } else if (township) {
    cleanTownship = township.trim();
    if (isMm) {
      if (!cleanTownship.endsWith('မြို့နယ်') && !cleanTownship.endsWith('မြို့')) {
        cleanTownship += 'မြို့နယ်';
      }
    } else {
      if (!/township$/i.test(cleanTownship) && !/city$/i.test(cleanTownship)) {
        cleanTownship += ' Township';
      }
    }
  }

  // 5. State / Region (တိုင်းဒေသကြီး / ပြည်နယ်)
  let cleanState = '';
  if (matchedMeta) {
    cleanState = isMm ? matchedMeta.stateMy : matchedMeta.stateEn;
  } else if (state) {
    cleanState = state.trim();
    if (isMm) {
      if (cleanState.includes('ရန်ကုန်') || cleanState.includes('Yangon')) {
        cleanState = 'ရန်ကုန်တိုင်းဒေသကြီး';
      } else if (cleanState.includes('မန္တလေး') || cleanState.includes('Mandalay')) {
        cleanState = 'မန္တလေးတိုင်းဒေသကြီး';
      }
    } else {
      if (/yangon/i.test(cleanState)) {
        cleanState = 'Yangon Region';
      } else if (/mandalay/i.test(cleanState)) {
        cleanState = 'Mandalay Region';
      }
    }
  } else {
    cleanState = isMm ? 'ရန်ကုန်တိုင်းဒေသကြီး' : 'Yangon Region';
  }

  const separator = isMm ? '၊ ' : ', ';
  const parts = [streetPart, cleanWard, cleanTownship, cleanState].filter(Boolean);
  return parts.join(separator);
}

/**
 * Acquires a high-precision GPS coordinate with multi-sampling convergence
 */
export async function acquireAccuratePosition(
  timeoutMs: number = 8000
): Promise<{ latitude: number; longitude: number; accuracy: number }> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return reject(new Error('Geolocation not supported'));
    }

    let bestPosition: GeolocationPosition | null = null;
    let watchId: number | null = null;
    let timer: NodeJS.Timeout | null = null;

    const cleanup = () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
      }
      if (timer !== null) {
        clearTimeout(timer);
        timer = null;
      }
    };

    const finalize = () => {
      cleanup();
      if (bestPosition) {
        resolve({
          latitude: bestPosition.coords.latitude,
          longitude: bestPosition.coords.longitude,
          accuracy: bestPosition.coords.accuracy,
        });
      } else {
        reject(new Error('Unable to acquire location fix.'));
      }
    };

    timer = setTimeout(() => {
      finalize();
    }, timeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        bestPosition = pos;
        if (pos.coords.accuracy <= 35) {
          finalize();
          return;
        }

        try {
          watchId = navigator.geolocation.watchPosition(
            (updatedPos) => {
              if (
                !bestPosition ||
                updatedPos.coords.accuracy < bestPosition.coords.accuracy
              ) {
                bestPosition = updatedPos;
              }
              if (updatedPos.coords.accuracy <= 30) {
                finalize();
              }
            },
            () => {},
            {
              enableHighAccuracy: true,
              maximumAge: 0,
            }
          );
        } catch {
          finalize();
        }
      },
      (err) => {
        cleanup();
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: Math.min(timeoutMs, 6000),
        maximumAge: 0,
      }
    );
  });
}

export interface GeocodeResult {
  formattedAddress: string;
  township?: TownshipOption | null;
  landmark?: string;
}

/**
 * Reverse geocodes coordinates into a formal Myanmar address:
 * Street, Ward, Township, State
 */
export async function reverseGeocodeHighPrecision(
  lat: number,
  lng: number,
  language: 'en' | 'my' = 'en'
): Promise<GeocodeResult> {
  const isMm = language === 'my';
  const langHeader = isMm ? 'my,en' : 'en,my';

  // 1. Try Nominatim with maximum zoom level (zoom 18 = building / address)
  try {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&extratags=1&namedetails=1`;
    const res = await fetch(nominatimUrl, {
      headers: {
        'Accept-Language': langHeader,
      },
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;

        const houseNumber = addr.house_number || addr.building_number || addr.housename;
        let road =
          addr.road ||
          addr.street ||
          addr.pedestrian ||
          addr.footway ||
          addr.path ||
          addr.residential;

        // If zoom 18 did not contain road (e.g. inside a compound), fetch nearest road via zoom 17
        if (!road) {
          try {
            const roadRes = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=17&addressdetails=1`,
              {
                headers: { 'Accept-Language': langHeader },
              }
            );
            if (roadRes.ok) {
              const roadData = await roadRes.json();
              road = roadData.address?.road || roadData.name || '';
            }
          } catch {}
        }

        const ward =
          addr.quarter ||
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.village;

        const rawTownship =
          addr.township ||
          addr.city_district ||
          addr.district ||
          addr.municipality ||
          addr.county ||
          addr.suburb;

        const rawState = addr.state || addr.city || 'Yangon';

        const matchedMeta = resolveTownshipMeta(lat, lng, rawTownship || ward);
        const matchedTownship = matchedMeta
          ? MOCK_TOWNSHIPS.find((t) => t.name === matchedMeta.name) || null
          : null;

        const formalAddress = formatFormalMyanmarAddress({
          houseNumber,
          road,
          ward: ward && ward !== rawTownship ? ward : undefined,
          township: rawTownship,
          state: rawState,
          language,
          matchedMeta,
        });

        const landmark =
          addr.amenity ||
          addr.shop ||
          addr.tourism ||
          addr.historic ||
          (data.namedetails?.name && data.namedetails.name !== road ? data.namedetails.name : undefined);

        if (formalAddress) {
          return {
            formattedAddress: formalAddress,
            township: matchedTownship,
            landmark,
          };
        }
      }
    }
  } catch (err) {
    console.warn('Nominatim reverse geocoding failed:', err);
  }

  // 2. Secondary fallback: BigDataCloud client reverse geocoding
  try {
    const bdcUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=${isMm ? 'my' : 'en'}`;
    const bdcRes = await fetch(bdcUrl);
    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      const adminList = bdcData.localityInfo?.administrative || [];

      // Extract admin entities
      type AdminEntity = { adminLevel?: number; name?: string };
      const wardName =
        (adminList as AdminEntity[]).find((a) => a.adminLevel === 8 || a.adminLevel === 7)?.name ||
        bdcData.locality;

      const townshipName =
        (adminList as AdminEntity[]).find((a) => a.adminLevel === 6 || a.adminLevel === 7)?.name ||
        bdcData.locality;

      const stateName =
        (adminList as AdminEntity[]).find((a) => a.adminLevel === 4)?.name ||
        bdcData.principalSubdivision ||
        'Yangon';

      const matchedMeta = resolveTownshipMeta(lat, lng, townshipName || wardName);
      const matchedTownship = matchedMeta
        ? MOCK_TOWNSHIPS.find((t) => t.name === matchedMeta.name) || null
        : null;

      const formalAddress = formatFormalMyanmarAddress({
        ward: wardName,
        township: townshipName,
        state: stateName,
        language,
        matchedMeta,
      });

      if (formalAddress) {
        return {
          formattedAddress: formalAddress,
          township: matchedTownship,
        };
      }
    }
  } catch {}

  // 3. Fallback based purely on closest coordinate township
  const matchedMeta = resolveTownshipMeta(lat, lng);
  const matchedTownship = matchedMeta
    ? MOCK_TOWNSHIPS.find((t) => t.name === matchedMeta.name) || null
    : null;

  const formalAddress = formatFormalMyanmarAddress({
    language,
    matchedMeta,
  });

  return {
    formattedAddress: formalAddress,
    township: matchedTownship,
  };
}

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
    aliases: ['kamayut', 'kamaryut', 'ကမာရွတ်', 'ကမာရွတ်မြို့နယ်'],
    townshipEn: 'Kamayut Township',
    townshipMy: 'ကမာရွတ်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Hledan, Yangon',
    lat: 16.8258,
    lng: 96.1287,
    aliases: ['hledan', 'hle dan', 'လှည်းတန်း'],
    townshipEn: 'Hledan, Kamayut Township',
    townshipMy: 'လှည်းတန်း၊ ကမာရွတ်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Bahan, Yangon',
    lat: 16.8122,
    lng: 96.1544,
    aliases: ['bahan', 'ဗဟန်း', 'ဗဟန်းမြို့နယ်'],
    townshipEn: 'Bahan Township',
    townshipMy: 'ဗဟန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Sanchaung, Yangon',
    lat: 16.8045,
    lng: 96.1342,
    aliases: ['sanchaung', 'san chaung', 'စမ်းချောင်း', 'စမ်းချောင်းမြို့နယ်'],
    townshipEn: 'Sanchaung Township',
    townshipMy: 'စမ်းချောင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Dagon, Yangon',
    lat: 16.7975,
    lng: 96.1485,
    aliases: ['dagon', 'ဒဂုံ', 'ဒဂုံမြို့နယ်'],
    townshipEn: 'Dagon Township',
    townshipMy: 'ဒဂုံမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Kyauktada, Yangon',
    lat: 16.7744,
    lng: 96.1601,
    aliases: ['kyauktada', 'kyauk tada', 'ကျောက်တံတား', 'ကျောက်တံတားမြို့နယ်'],
    townshipEn: 'Kyauktada Township',
    townshipMy: 'ကျောက်တံတားမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Yankin, Yangon',
    lat: 16.8375,
    lng: 96.1636,
    aliases: ['yankin', 'yan kin', 'ရန်ကင်း', 'ရန်ကင်းမြို့နယ်'],
    townshipEn: 'Yankin Township',
    townshipMy: 'ရန်ကင်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mayangone, Yangon',
    lat: 16.8711,
    lng: 96.1444,
    aliases: ['mayangone', 'mayangon', 'မရမ်းကုန်း', 'မရမ်းကုန်းမြို့နယ်', 'mayangon district'],
    townshipEn: 'Mayangone Township',
    townshipMy: 'မရမ်းကုန်းမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Hlaing, Yangon',
    lat: 16.8488,
    lng: 96.1264,
    aliases: ['hlaing', 'လှိုင်', 'လှိုင်မြို့နယ်'],
    townshipEn: 'Hlaing Township',
    townshipMy: 'လှိုင်မြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Tamwe, Yangon',
    lat: 16.8092,
    lng: 96.1712,
    aliases: ['tamwe', 'တာမွေ', 'တာမွေမြို့နယ်'],
    townshipEn: 'Tamwe Township',
    townshipMy: 'တာမွေမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'South Okkalapa, Yangon',
    lat: 16.8485,
    lng: 96.1842,
    aliases: ['south okkalapa', 'south okkalapa township', 'တောင်ဥက္ကလာပ', 'တောင်ဥက္ကလာ'],
    townshipEn: 'South Okkalapa Township',
    townshipMy: 'တောင်ဥက္ကလာပမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'North Okkalapa, Yangon',
    lat: 16.8925,
    lng: 96.1710,
    aliases: ['north okkalapa', 'north okkalapa township', 'မြောက်ဥက္ကလာပ', 'မြောက်ဥက္ကလာ'],
    townshipEn: 'North Okkalapa Township',
    townshipMy: 'မြောက်ဥက္ကလာပမြို့နယ်',
    stateEn: 'Yangon Region',
    stateMy: 'ရန်ကုန်တိုင်းဒေသကြီး',
  },
  {
    name: 'Mandalay City (Express Delivery)',
    lat: 21.9750,
    lng: 96.0836,
    aliases: ['mandalay', 'mandalay city', 'မန္တလေး'],
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

  // 1. Check exact alias matching if a name was returned by geocoder
  if (normalizedRaw) {
    for (const meta of TOWNSHIP_GEO_METAS) {
      if (
        meta.aliases.some(
          (alias) =>
            normalizedRaw === alias ||
            normalizedRaw.includes(alias) ||
            alias.includes(normalizedRaw)
        )
      ) {
        return meta;
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

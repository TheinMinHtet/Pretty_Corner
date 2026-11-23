import { TownshipOption } from '../types';
import { MOCK_TOWNSHIPS } from '../mockData';
import {
  acquireAccuratePosition,
  reverseGeocodeHighPrecision,
  resolveTownshipMeta,
  formatFormalMyanmarAddress,
  TownshipGeoMeta,
  TOWNSHIP_GEO_METAS,
} from '../location';

export interface DeliveryLocationFix {
  formattedAddress: string;
  township: TownshipOption | null;
  landmark?: string;
  coordinates: { lat: number; lng: number };
  accuracyMeters?: number;
}

export interface ResolvedDeliveryFix extends DeliveryLocationFix {
  deliveryFee: number;
  zone: string;
}

export interface IAddressResolver {
  resolveCurrentDeliveryLocation(
    language: 'en' | 'my',
    timeoutMs?: number
  ): Promise<DeliveryLocationFix>;

  resolveFromCoordinates(
    lat: number,
    lng: number,
    language: 'en' | 'my'
  ): Promise<DeliveryLocationFix>;

  resolveDeliveryFix(
    input: { lat: number; lng: number } | { useCurrentGps: true; timeoutMs?: number },
    language: 'en' | 'my'
  ): Promise<ResolvedDeliveryFix>;

  formatAddressWithTownship(street: string, townshipName?: string): string;

  mapGeolocationError(err: unknown, language: 'en' | 'my'): string;
}

interface GeolocationPositionErrorLike {
  code?: number;
  message?: string;
}

export class MyanmarAddressResolver implements IAddressResolver {
  async resolveCurrentDeliveryLocation(
    language: 'en' | 'my',
    timeoutMs: number = 8000
  ): Promise<DeliveryLocationFix> {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      throw new Error(
        language === 'my'
          ? 'သင့်ဘရောင်ဇာတွင် GPS အသုံးမပြုနိုင်ပါ'
          : 'GPS location is not supported by your browser.'
      );
    }

    const { latitude, longitude, accuracy } = await acquireAccuratePosition(timeoutMs);
    const result = await reverseGeocodeHighPrecision(latitude, longitude, language);

    const formatted = result.formattedAddress
      ? result.formattedAddress
      : `GPS: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;

    return {
      formattedAddress: formatted,
      township: result.township || null,
      landmark: result.landmark,
      coordinates: { lat: latitude, lng: longitude },
      accuracyMeters: Math.round(accuracy),
    };
  }

  async resolveFromCoordinates(
    lat: number,
    lng: number,
    language: 'en' | 'my'
  ): Promise<DeliveryLocationFix> {
    const result = await reverseGeocodeHighPrecision(lat, lng, language);
    return {
      formattedAddress: result.formattedAddress,
      township: result.township || null,
      landmark: result.landmark,
      coordinates: { lat, lng },
    };
  }

  async resolveDeliveryFix(
    input: { lat: number; lng: number } | { useCurrentGps: true; timeoutMs?: number },
    language: 'en' | 'my'
  ): Promise<ResolvedDeliveryFix> {
    const base = 'useCurrentGps' in input
      ? await this.resolveCurrentDeliveryLocation(language, input.timeoutMs)
      : await this.resolveFromCoordinates(input.lat, input.lng, language);

    const fee = base.township?.fee ?? 3000;
    const zone = base.township?.zone ?? 'Downtown / Inner Yangon';

    return {
      ...base,
      deliveryFee: fee,
      zone,
    };
  }

  formatAddressWithTownship(street: string, townshipName?: string): string {
    const cleanStreet = street.trim();
    if (!cleanStreet) return '';
    if (!townshipName) return cleanStreet;

    const lower = cleanStreet.toLowerCase();
    const townLower = townshipName.toLowerCase();

    return lower.includes(townLower) ? cleanStreet : `${cleanStreet}, ${townshipName}`;
  }

  mapGeolocationError(err: unknown, language: 'en' | 'my'): string {
    const geoErr = err as GeolocationPositionErrorLike;
    if (geoErr?.code === 1) {
      return language === 'my'
        ? 'တည်နေရာအသုံးပြုခွင့် မရရှိပါ။ ဘရောင်ဇာ Setting တွင် တည်နေရာဖွင့်ပေးပါရန်။'
        : 'Location permission was denied. Please allow location permissions in your browser.';
    }
    if (geoErr?.code === 2) {
      return language === 'my'
        ? 'GPS တည်နေရာရှာမတွေ့ပါ။ စက်တွင် GPS ဖွင့်ထားခြင်းရှိမရှိ စစ်ဆေးပေးပါ။'
        : 'GPS position unavailable. Please ensure GPS/Location is turned on.';
    }
    if (geoErr?.code === 3) {
      return language === 'my'
        ? 'အချိန်ကြာမြင့်သွားပါသည်။ ထပ်မံနှိပ်ပေးပါ။'
        : 'GPS request timed out. Please click again.';
    }
    return language === 'my'
      ? 'တည်နေရာမတွေ့ရှိပါ။ လိပ်စာကို ကိုယ်တိုင်ရိုက်ထည့်ပေးပါရန်။'
      : 'Could not detect location. Please enter delivery address manually.';
  }
}

/**
 * Offline address resolver for automated tests and network-free resolution
 */
export class OfflineAddressResolver implements IAddressResolver {
  async resolveCurrentDeliveryLocation(
    language: 'en' | 'my'
  ): Promise<DeliveryLocationFix> {
    const defaultMeta = TOWNSHIP_GEO_METAS[0];
    const defaultTownship = MOCK_TOWNSHIPS[0];
    return {
      formattedAddress: language === 'my' ? defaultMeta.townshipMy : defaultMeta.name,
      township: defaultTownship,
      coordinates: { lat: defaultMeta.lat, lng: defaultMeta.lng },
      accuracyMeters: 10,
    };
  }

  async resolveFromCoordinates(
    lat: number,
    lng: number,
    language: 'en' | 'my'
  ): Promise<DeliveryLocationFix> {
    const matchedMeta = resolveTownshipMeta(lat, lng);
    const matchedTownship = matchedMeta
      ? MOCK_TOWNSHIPS.find((t) => t.name === matchedMeta.name) || null
      : null;

    const formalAddress = formatFormalMyanmarAddress({ language, matchedMeta });
    return {
      formattedAddress: formalAddress,
      township: matchedTownship,
      coordinates: { lat, lng },
    };
  }

  async resolveDeliveryFix(
    input: { lat: number; lng: number } | { useCurrentGps: true; timeoutMs?: number },
    language: 'en' | 'my'
  ): Promise<ResolvedDeliveryFix> {
    const base = 'useCurrentGps' in input
      ? await this.resolveCurrentDeliveryLocation(language)
      : await this.resolveFromCoordinates(input.lat, input.lng, language);

    const fee = base.township?.fee ?? 3000;
    const zone = base.township?.zone ?? 'Downtown / Inner Yangon';

    return {
      ...base,
      deliveryFee: fee,
      zone,
    };
  }

  formatAddressWithTownship(street: string, townshipName?: string): string {
    const cleanStreet = street.trim();
    if (!townshipName) return cleanStreet;
    return cleanStreet.includes(townshipName) ? cleanStreet : `${cleanStreet}, ${townshipName}`;
  }

  mapGeolocationError(_err: unknown, language: 'en' | 'my'): string {
    return language === 'my'
      ? 'တည်နေရာရှာဖွေမှု အဆင်မပြေပါ။'
      : 'Location service unavailable.';
  }
}

let addressResolverInstance: IAddressResolver | null = null;

export function getAddressResolver(): IAddressResolver {
  if (!addressResolverInstance) {
    addressResolverInstance = new MyanmarAddressResolver();
  }
  return addressResolverInstance;
}

export function setAddressResolver(resolver: IAddressResolver): void {
  addressResolverInstance = resolver;
}

export type { TownshipGeoMeta };

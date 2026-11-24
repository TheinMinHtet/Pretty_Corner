'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import { getAddressResolver } from '@/lib/location/MyanmarAddressResolver';
import { TOWNSHIP_GEO_METAS } from '@/lib/location';

interface DeliveryMapPickerProps {
  coords: { lat: number; lng: number } | null;
  onLocationSelect: (coords: { lat: number; lng: number }, address: string, landmark?: string) => void;
  language: 'en' | 'my';
  onLocateGps?: () => void;
  isLocatingGps?: boolean;
  selectedTownshipName?: string;
}

interface SearchSuggestion {
  id: string;
  name: string;
  secondary: string;
  lat: number;
  lng: number;
}

const DEFAULT_CENTER = { lat: 16.8285, lng: 96.1285 }; // Kamayut / Yangon center

export default function DeliveryMapPicker({
  coords,
  onLocationSelect,
  language,
  onLocateGps,
  isLocatingGps,
  selectedTownshipName,
}: DeliveryMapPickerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  const [isResolving, setIsResolving] = useState(false);
  const [pinnedAddress, setPinnedAddress] = useState<string>('');
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>(coords || DEFAULT_CENTER);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Search Engine State
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search Engine implementation: local township fast match + Nominatim debounce
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // 1. Instant local township matches
    const localMatches: SearchSuggestion[] = TOWNSHIP_GEO_METAS.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.townshipEn.toLowerCase().includes(q) ||
        t.townshipMy.includes(q) ||
        t.stateEn.toLowerCase().includes(q) ||
        t.stateMy.includes(q) ||
        t.aliases.some((a) => a.toLowerCase().includes(q))
      );
    }).map((t) => ({
      id: `local-${t.name}`,
      name: language === 'my' ? t.townshipMy : t.townshipEn,
      secondary: language === 'my' ? t.stateMy : `${t.stateEn}, Myanmar`,
      lat: t.lat,
      lng: t.lng,
    }));

    setSuggestions(localMatches);

    // 2. Query OpenStreetMap Nominatim for street/city precision (debounced 350ms)
    const controller = new AbortController();
    setIsSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
            q
          )}&countrycodes=mm&addressdetails=1&limit=6`,
          {
            signal: controller.signal,
            headers: {
              'Accept-Language': language === 'my' ? 'my,en' : 'en,my',
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const remoteResults: SearchSuggestion[] = data.map((item: { place_id: number; display_name: string; lat: string; lon: string }) => ({
              id: `osm-${item.place_id}`,
              name: item.display_name.split(',')[0],
              secondary: item.display_name.split(',').slice(1, 4).join(',').trim(),
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
            }));

            setSuggestions((prev) => {
              const existingCoords = new Set(
                prev.map((p) => `${p.lat.toFixed(3)},${p.lng.toFixed(3)}`)
              );
              const uniqueRemote = remoteResults.filter(
                (r) => !existingCoords.has(`${r.lat.toFixed(3)},${r.lng.toFixed(3)}`)
              );
              return [...prev, ...uniqueRemote];
            });
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name !== 'AbortError') {
          console.warn('Nominatim search error:', err);
        }
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, language]);

  // Reverse geocodes coordinates and calls callback immediately
  const handleGeocodeAndSelect = useCallback(
    async (lat: number, lng: number) => {
      setIsResolving(true);
      try {
        const resolver = getAddressResolver();
        const fix = await resolver.resolveFromCoordinates(lat, lng, language);
        const resolved = fix.formattedAddress || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setPinnedAddress(resolved);
        onLocationSelect({ lat, lng }, resolved, fix.landmark);

        if (markerRef.current) {
          markerRef.current
            .bindPopup(
              `<div style="font-family: inherit; font-size: 12px; color: #38262e; padding: 2px 4px;">
                <b style="color: #b73d67;">${language === 'my' ? 'ပို့ဆောင်မည့်နေရာ' : 'Delivery Pin'}</b><br/>
                <span style="display:inline-block; margin-top:2px;">${resolved}</span>
              </div>`,
              { closeButton: false, offset: [0, -36] }
            )
            .openPopup();
        }
      } catch (err) {
        console.warn('Geocoding failed:', err);
        const fallback = `GPS: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
        setPinnedAddress(fallback);
        onLocationSelect({ lat, lng }, fallback);
      } finally {
        setIsResolving(false);
      }
    },
    [language, onLocationSelect]
  );

  // Select a suggestion from search results
  const handleSelectSuggestion = (s: SearchSuggestion) => {
    setSearchQuery(s.name);
    setShowSuggestions(false);
    if (mapRef.current && markerRef.current) {
      markerRef.current.setLatLng([s.lat, s.lng]);
      mapRef.current.setView([s.lat, s.lng], 16, { animate: true });
    }
    setCurrentCoords({ lat: s.lat, lng: s.lng });
    handleGeocodeAndSelect(s.lat, s.lng);
  };

  // Initialize Leaflet Map
  useEffect(() => {
    let isCancelled = false;
    if (!containerRef.current) return;

    import('leaflet').then((L) => {
      if (isCancelled || !containerRef.current || mapRef.current) return;

      const initialLat = coords?.lat || DEFAULT_CENTER.lat;
      const initialLng = coords?.lng || DEFAULT_CENTER.lng;

      const map = L.map(containerRef.current, {
        center: [initialLat, initialLng],
        zoom: 16,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      // Custom Pink Branded Marker Icon
      const customPinIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div style="position: relative; width: 34px; height: 44px; transform: translate(-17px, -44px); cursor: grab;">
            <svg width="34" height="44" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0 4px 6px rgba(56, 38, 46, 0.45));">
              <path d="M12 0C5.37258 0 0 5.37258 0 12C0 19.5 10.5 28.5 11.4 29.3C11.75 29.6 12.25 29.6 12.6 29.3C13.5 28.5 24 19.5 24 12C24 5.37258 18.6274 0 12 0Z" fill="#b73d67"/>
              <circle cx="12" cy="11" r="5" fill="#ffffff"/>
              <circle cx="12" cy="11" r="2.5" fill="#b73d67"/>
            </svg>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([initialLat, initialLng], {
        draggable: true,
        icon: customPinIcon,
      }).addTo(map);

      // Event: Pin dragged
      marker.on('dragend', () => {
        const position = marker.getLatLng();
        setCurrentCoords({ lat: position.lat, lng: position.lng });
        handleGeocodeAndSelect(position.lat, position.lng);
      });

      // Event: Click on map to place pin
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        setCurrentCoords({ lat, lng });
        handleGeocodeAndSelect(lat, lng);
      });

      mapRef.current = map;
      markerRef.current = marker;
      setIsMapLoaded(true);

      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    });

    return () => {
      isCancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [handleGeocodeAndSelect]);

  // Sync external coords (e.g. from GPS button) to map marker
  useEffect(() => {
    if (!coords || !mapRef.current || !markerRef.current) return;
    const currentPos = markerRef.current.getLatLng();
    const isDifferent =
      Math.abs(currentPos.lat - coords.lat) > 0.0001 ||
      Math.abs(currentPos.lng - coords.lng) > 0.0001;

    if (isDifferent) {
      markerRef.current.setLatLng([coords.lat, coords.lng]);
      mapRef.current.setView([coords.lat, coords.lng], 16, { animate: true });
      setCurrentCoords(coords);
    }
  }, [coords]);

  const handleCenterOnMe = () => {
    if (onLocateGps) {
      onLocateGps();
    } else if (navigator.geolocation) {
      setIsResolving(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          if (mapRef.current && markerRef.current) {
            markerRef.current.setLatLng([lat, lng]);
            mapRef.current.setView([lat, lng], 17, { animate: true });
          }
          setCurrentCoords({ lat, lng });
          handleGeocodeAndSelect(lat, lng);
        },
        () => {
          setIsResolving(false);
        },
        { enableHighAccuracy: true, timeout: 6000 }
      );
    }
  };

  return (
    <div className="w-full bg-[#fcf9fa] border border-[#eedfe5] rounded-xl overflow-hidden mt-2 shadow-2xs">
      {/* Search Engine & GPS Control Bar */}
      <div className="bg-white p-2.5 border-b border-[#eedfe5] relative z-30" ref={searchContainerRef}>
        <div className="flex items-center gap-2">
          {/* Search Engine Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7a6870]">
              {isSearching ? (
                <div className="w-3.5 h-3.5 border-2 border-[#b73d67] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              )}
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setShowSuggestions(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (suggestions.length > 0) {
                    handleSelectSuggestion(suggestions[0]);
                  }
                }
              }}
              placeholder={
                language === 'my'
                  ? 'မြို့နယ်၊ မြို့ သို့မဟုတ် လမ်းအမည် ရှာဖွေပါ (ဥပမာ - Kamayut, ဗဟန်း)...'
                  : 'Search township, city, or street (e.g. Kamayut, Bahan)...'
              }
              className="w-full h-[38px] pl-9 pr-8 bg-[#fcf9fa] border border-[#eedfe5] rounded-lg text-[13px] text-[#38262e] placeholder-[#a89aa0] outline-none focus:border-[#b73d67] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#a89aa0] hover:text-[#38262e] cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Auto-complete Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#eedfe5] rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-[#eedfe5]/60 z-50">
                {suggestions.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(item)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-[#fceef2]/60 flex items-center gap-2.5 transition-colors cursor-pointer group"
                  >
                    <svg className="w-4 h-4 text-[#b73d67] shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-[#38262e] truncate">{item.name}</p>
                      {item.secondary && (
                        <p className="text-[11px] text-[#7a6870] truncate">{item.secondary}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick GPS Center Button */}
          <button
            type="button"
            onClick={handleCenterOnMe}
            disabled={isLocatingGps || isResolving}
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#b73d67] hover:text-[#8e294d] bg-[#fceef2] hover:bg-[#fadce6] px-3 h-[38px] rounded-lg transition-all cursor-pointer shadow-2xs shrink-0 disabled:opacity-60"
            title="Center on my current GPS location"
          >
            <svg
              className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
            <span className="text-[12px] font-semibold whitespace-nowrap">
              {isLocatingGps
                ? (language === 'my' ? 'ရှာနေသည်…' : 'Locating…')
                : (language === 'my' ? 'လက်ရှိနေရာ' : 'My GPS')}
            </span>
          </button>
        </div>

        {/* Live Status indicator */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-[11.5px] text-[#7a6870] px-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {isResolving ? (
              <span className="text-[#b73d67] font-medium flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 border-2 border-[#b73d67] border-t-transparent rounded-full animate-spin" />
                {language === 'my' ? 'လိပ်စာ ရှာဖွေနေပါသည်…' : 'Updating address…'}
              </span>
            ) : pinnedAddress ? (
              <span className="text-emerald-700 font-medium truncate">
                ✓ {pinnedAddress}
              </span>
            ) : null}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {selectedTownshipName && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#fceef2] text-[#b73d67] font-semibold text-[11px] border border-[#f5d9e3]">
                <span>📍 {selectedTownshipName}</span>
              </span>
            )}
            <span className="font-mono text-[10px] text-[#a89aa0]">
              {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}
            </span>
          </div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <div className="relative w-full h-[250px] sm:h-[300px] bg-[#f2ecf0]">
        <div ref={containerRef} className="w-full h-full z-0" />

        {!isMapLoaded && (
          <div className="absolute inset-0 bg-[#fcf9fa]/90 flex flex-col items-center justify-center gap-2 z-10">
            <div className="w-6 h-6 border-2 border-[#b73d67] border-t-transparent rounded-full animate-spin" />
            <span className="text-[12px] font-medium text-[#7a6870]">
              {language === 'my' ? 'မြေပုံ ဖွင့်နေပါသည်…' : 'Loading interactive map…'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

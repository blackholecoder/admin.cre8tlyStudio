const CACHE_KEY = "geoCache_v1";

export function loadGeoCache() {
  return JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
}

export function saveGeoCache(cache) {
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
}
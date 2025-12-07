
import { loadGeoCache, saveGeoCache } from "./geocodeCache";
import { api } from "../api/axios";

export async function geocodeCity(city, region, country) {
  if (!city) return null;

  const cache = loadGeoCache();
  const key = `${city},${region},${country}`;

  // Return cached result
  if (cache[key]) return cache[key];

  try {
    const res = await api.get("/admin/web-analytics/geo", {
      params: { city, region, country },
    });

    const data = res.data;
    if (!data) return null;

    cache[key] = data;
    saveGeoCache(cache);

    return data;
  } catch (err) {
    console.error("Geocode failed:", err);
    return null;
  }
}

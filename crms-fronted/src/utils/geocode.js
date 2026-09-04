/*
 * Geocoding via the Mapbox Geocoding API -- turns a free-text location
 * string (a real address, or one of the app's known pickup/drop-off
 * points) into [lat, lng] map coordinates.
 *
 * Requires VITE_MAPBOX_TOKEN (see .env.example). Get a free token at
 * https://account.mapbox.com/auth/signup/ -- no credit card required,
 * 100,000 free geocoding requests/month.
 *
 * If the token isn't configured, or a lookup fails (no network, no
 * match, rate limited), this falls back to central Nairobi so the map
 * always has something reasonable to show rather than breaking.
 */

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const NAIROBI_CBD = [-1.2864, 36.8172]

// In-memory cache so re-rendering the same location (e.g. a vehicle
// shown on both the listing and detail page) doesn't re-fetch it.
const cache = new Map()

/*
 * Returns [lat, lng] for a free-text location string. Async, since it
 * may call out to the Mapbox API.
 */
export async function geocodeLocation(name) {
  if (!name) return NAIROBI_CBD

  if (cache.has(name)) {
    return cache.get(name)
  }

  if (!MAPBOX_TOKEN) {
    console.warn(
      'VITE_MAPBOX_TOKEN is not set -- falling back to Nairobi CBD. ' +
      'See .env.example for how to add a free Mapbox token.'
    )
    return NAIROBI_CBD
  }

  try {
    const query = encodeURIComponent(name)
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json` +
      `?access_token=${MAPBOX_TOKEN}` +
      `&country=ke` +
      `&proximity=36.8172,-1.2864` +
      `&limit=1`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Mapbox geocoding request failed (${response.status})`)
    }

    const data = await response.json()
    const feature = data?.features?.[0]

    if (!feature?.center) {
      throw new Error(`No geocoding match for "${name}"`)
    }

    // Mapbox returns [lng, lat]; Leaflet expects [lat, lng].
    const [lng, lat] = feature.center
    const coords = [lat, lng]

    cache.set(name, coords)
    return coords
  } catch (err) {
    console.error('Geocoding failed for', name, err)
    return NAIROBI_CBD
  }
}

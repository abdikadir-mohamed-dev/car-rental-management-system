/*
 * Tiny offline "geocoder" for the handful of Nairobi-area location
 * names this app actually uses (vehicle/branch locations, booking
 * pickup/dropoff). There's no maps API key configured anywhere in
 * this project, so rather than call a live geocoding service, match
 * on known neighbourhood names and fall back to central Nairobi.
 */
const KNOWN_LOCATIONS = [
  { match: /jomo kenyatta|jkia|airport/i, coords: [-1.3192, 36.9278] },
  { match: /karen/i, coords: [-1.3197, 36.7076] },
  { match: /westlands/i, coords: [-1.2647, 36.806] },
  { match: /kilimani/i, coords: [-1.2914, 36.785] },
  { match: /industrial area/i, coords: [-1.3103, 36.8514] },
  { match: /nairobi west/i, coords: [-1.3053, 36.8172] },
  { match: /cbd|central business/i, coords: [-1.2864, 36.8172] },
]

const NAIROBI_CBD = [-1.2864, 36.8172]

/*
 * Returns [lat, lng] for a free-text location string, e.g. "Karen
 * Branch" or "Westlands Office". Falls back to Nairobi CBD for
 * anything unrecognized, so a marker is always shown somewhere
 * sensible rather than the map failing to render.
 */
export function geocodeLocation(name) {
  if (!name) return NAIROBI_CBD

  const found = KNOWN_LOCATIONS.find((entry) => entry.match.test(name))

  return found ? found.coords : NAIROBI_CBD
}

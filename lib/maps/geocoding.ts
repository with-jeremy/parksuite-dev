/**
 * Google Maps Geocoding Service
 */
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 * Convert address to coordinates
 * @param {string} address - The address to geocode
 * @returns {Promise<{lat: number, lng: number} | null>}
 */
export async function geocodeAddress(address) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is missing");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error("Geocoding failed:", data.status, data.error_message);
      return null;
    }

    const { lat, lng } = data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
}

/**
 * Convert coordinates to address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string | null>}
 */
export async function reverseGeocode(lat, lng) {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key is missing");
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== "OK") {
      console.error(
        "Reverse geocoding failed:",
        data.status,
        data.error_message
      );
      return null;
    }

    // Get a formatted address - usually the first result is the most specific
    return data.results[0].formatted_address;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
}

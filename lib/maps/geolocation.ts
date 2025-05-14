/**
 * IP-based geolocation services
 */

/**
 * Gets a general location based on IP address using a free geolocation API
 * No API key required for basic usage
 * @returns {Promise<{lat: number, lng: number, city: string, country: string, isGeneralLocation: boolean} | null>}
 */
export async function getGeneralLocation() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    return {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
      city: data.city,
      country: data.country_name,
      isGeneralLocation: true // flag to indicate this is an approximate location
    };
  } catch (error) {
    console.error('Error getting general location:', error);
    return null;
  }
}
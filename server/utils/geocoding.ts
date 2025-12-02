interface GeocodeResult {
  lat: string;
  lon: string;
}

export async function geocodeAddress(street: string, city: string, state: string, zipCode?: string): Promise<[number, number] | null> {
  try {
    const address = `${street}, ${city}, ${state}${zipCode ? ', ' + zipCode : ''}, USA`;
    const encodedAddress = encodeURIComponent(address);
    
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=us`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'PottySpotty/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status}`);
      return null;
    }

    const data: GeocodeResult[] = await response.json();

    if (data && data.length > 0 && data[0]) {
      const result = data[0];
      return [parseFloat(result.lon), parseFloat(result.lat)]; // [longitude, latitude] for GeoJSON
    }

    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}



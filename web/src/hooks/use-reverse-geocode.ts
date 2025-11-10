import { useState } from 'react';
import type { Coordinates } from '@/interfaces/location';

export function useReverseGeocode() {
  const [address, setAddress] = useState<string>('');

  const reverseGeocode = async (coordinates: Coordinates | null) => {
    setAddress('');

    if (!coordinates) return;

    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: coordinates });

      if (response.results[0]) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
    }
  };

  return {
    address,
    reverseGeocode,
  };
}

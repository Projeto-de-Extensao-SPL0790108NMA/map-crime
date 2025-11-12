import { useCallback, useEffect, useState } from 'react';
import { Loader2, LocateFixed, MapPin } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { toast } from '@/lib/sonner';

import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Field, FieldDescription, FieldError, FieldLabel } from './ui/field';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

import type { Coordinates } from '@/interfaces/location';
import { env } from '@/env';
import { useReverseGeocode } from '@/hooks/use-reverse-geocode';

interface LocationPickerProps {
  onLocationSelect?: (coordinates: Coordinates) => void;
  onAddressSelect?: (address: string) => void;
  value?: Coordinates | null;
  mapHeight?: string;
  errors?: Array<{ message?: string } | undefined>;
}

const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '0.75rem',
};

const mapOptions: google.maps.MapOptions = {
  draggingCursor: 'grabbing',
  draggableCursor: 'pointer',
  disableDefaultUI: false,
  zoomControl: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
  ],
};

const DEFAULT_CENTER = { lat: -3.119, lng: -60.0217 }; // Manaus

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value = null,
  onLocationSelect,
  onAddressSelect,
  mapHeight = '500px',
  errors,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(
    null,
  );
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] =
    useState(false);
  const [showMap, setShowMap] = useState(false);

  const { address, reverseGeocode } = useReverseGeocode();

  useEffect(() => {
    setSelectedLocation(value);
  }, [value, setSelectedLocation]);

  useEffect(() => {
    if (onAddressSelect && address) {
      onAddressSelect(address);
    }
  }, [address, onAddressSelect]);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const getCurrentLocation = useCallback(() => {
    setIsLoadingCurrentLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords: Coordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setSelectedLocation(coords);

        await reverseGeocode(coords);
        setIsLoadingCurrentLocation(false);

        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      },
      (error) => {
        setIsLoadingCurrentLocation(false);
        console.error('Erro ao obter localização:', error);

        let errorMessage = 'Não foi possível obter sua localização';
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage =
            'Permissão de localização negada. Por favor, habilite nas configurações do navegador.';
        }

        toast('Erro', {
          description: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  }, [onLocationSelect, reverseGeocode]);

  const handleMapClick = useCallback(
    async (event: google.maps.MapMouseEvent) => {
      if (event.latLng) {
        const coords: Coordinates = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        };
        setSelectedLocation(coords);
        await reverseGeocode(coords);

        if (onLocationSelect) {
          onLocationSelect(coords);
        }
      }
    },
    [reverseGeocode, onLocationSelect],
  );

  return (
    <Field className="w-full">
      <FieldLabel>Localização *</FieldLabel>

      <FieldDescription className="text-xs italic">
        Use sua localização atual ou escolha um ponto no mapa
      </FieldDescription>

      {errors && errors.length > 0 && <FieldError errors={errors} />}

      <div className="grid grid-cols-2 gap-2">
        <Button
          onClick={getCurrentLocation}
          disabled={isLoadingCurrentLocation}
          type="button"
        >
          {isLoadingCurrentLocation ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-xs">Obtendo localização...</span>
            </>
          ) : (
            <>
              <LocateFixed className="h-4 w-4" />
              <span className="text-xs font-medium">Localização Atual</span>
            </>
          )}
        </Button>

        <Button
          onClick={() => setShowMap(true)}
          variant="outline"
          disabled={isLoadingCurrentLocation}
          type="button"
        >
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Marcar no Mapa
          </span>
        </Button>
      </div>

      {selectedLocation && address && (
        <Card className="text-primary shadow-xs animate-in fade-in slide-in-from-bottom-2 py-4">
          <CardContent className="px-4">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary mb-1">
                  Localização Selecionada:
                </p>
                <p className="text-sm text-muted-foreground wrap-break-words">
                  {address}
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Lat: {selectedLocation.lat.toFixed(6)}, Lng:{' '}
                  {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={showMap} onOpenChange={setShowMap}>
        <DialogContent className="max-w-[calc(100%-1rem)]">
          <DialogHeader>
            <DialogTitle>Escolher Localização no Mapa</DialogTitle>
            <DialogDescription>
              Clique no mapa para selecionar a localização desejada
            </DialogDescription>
          </DialogHeader>

          <div className="w-full">
            {loadError ? (
              <div className="p-4 text-sm text-red-500">
                Erro ao carregar o mapa.
              </div>
            ) : !isLoaded ? (
              <div
                className="flex items-center justify-center"
                style={{ height: mapHeight }}
              >
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <GoogleMap
                mapContainerStyle={{ ...mapContainerStyle, height: mapHeight }}
                center={selectedLocation || DEFAULT_CENTER}
                zoom={selectedLocation ? 15 : 12}
                options={mapOptions}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker
                    position={selectedLocation}
                    animation={google.maps.Animation.BOUNCE}
                  />
                )}
              </GoogleMap>
            )}
          </div>

          <div className="mt-4">
            <Button
              className="w-full text-xs"
              onClick={() => setShowMap(false)}
              disabled={!(selectedLocation && address)}
            >
              Confirmar Localização
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Field>
  );
};

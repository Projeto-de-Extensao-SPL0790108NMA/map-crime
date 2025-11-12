import { useEffect, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { env } from '@/env';
import api from '@/lib/axios';

interface HeatmapPoint {
  lat: number;
  lng: number;
  weight: number;
}

const libraries: Array<'visualization'> = ['visualization'];

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const center = {
  lat: -3.1019,
  lng: -60.025,
};

export function DashboardHeatmap() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const { data: heatmapData, error } = useQuery<Array<HeatmapPoint>>({
    queryKey: ['heatmapData'],
    queryFn: async () => {
      const { data } = await api.get<{ points: Array<HeatmapPoint> }>(
        '/dashboard/heatmap',
        { withCredentials: true },
      );
      return data.points;
    },
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor por Região</CardTitle>
          <CardDescription>
            Distribuição geográfica nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            Erro ao carregar os dados do mapa de calor.
          </div>
        </CardContent>
      </Card>
    );
  }

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const heatmapLayerRef = useRef<google.maps.visualization.HeatmapLayer | null>(
    null,
  );

  useEffect(() => {
    if (map && isLoaded && heatmapData && heatmapData.length > 0) {
      const googleHeatmapData = heatmapData.map(
        (point) => ({
          location: new google.maps.LatLng(point.lat, point.lng),
          weight: point.weight,
        }),
      );

      if (heatmapLayerRef.current) {
        heatmapLayerRef.current.setMap(null);
      }

      const heatmap = new google.maps.visualization.HeatmapLayer({
        data: googleHeatmapData,
        map: map,
      });

      heatmap.set('radius', 12);
      heatmap.set('opacity', 0.5);

      const gradient = [
      'rgba(0, 255, 0, 0)',
      'rgba(0, 255, 0, 1)', 
      'rgba(255, 255, 0, 1)', 
      'rgba(255, 140, 0, 1)', 
      'rgba(255, 0, 0, 1)'
      ];

      heatmap.set('gradient', gradient);

      heatmapLayerRef.current = heatmap;
    }
  }, [map, isLoaded, heatmapData]);

  if (loadError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor por Região</CardTitle>
          <CardDescription>
            Distribuição geográfica nos últimos 6 meses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            Erro ao carregar o mapa. Verifique a chave da API do Google Maps.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor por Região</CardTitle>
          <CardDescription>
            Distribuição geográfica de denúncias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
            Carregando mapa...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mapa de Calor por Região</CardTitle>
        <CardDescription>
          Distribuição geográfica de {heatmapData?.length} denúncias
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={setMap}
          options={{
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
          }}
        ></GoogleMap>
      </CardContent>
    </Card>
  );
}

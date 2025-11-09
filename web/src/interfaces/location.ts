export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  coordinates: Coordinates;
  address: string;
}

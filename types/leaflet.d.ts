// Déclaration de types pour Leaflet
declare namespace L {
  function map(element: HTMLElement | string, options?: any): any
  function tileLayer(url: string, options?: any): any
  function marker(latLng: [number, number], options?: any): any
  function divIcon(options?: any): any
  function featureGroup(layers?: any[]): any

  interface LatLngBounds {
    pad(bufferRatio: number): LatLngBounds
  }
}

interface Window {
  L: typeof L
}

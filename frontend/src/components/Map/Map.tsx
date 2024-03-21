import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface Location {
    coordinates: number[];
    companyName: string;
}

const MapComponent = ({ locations }: { locations: Location[] }) => {
    const mapRef = useRef<mapboxgl.Map>();
    const mapContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoiYW5kcmVpcDI1IiwiYSI6ImNsdTEyZWVhZTA5aGcya21uNW52d3NpazMifQ.54y2A8gWuDn04XmwxrEh_Q';

        const map = new mapboxgl.Map({
            container: mapContainerRef.current as HTMLElement,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [locations[0].coordinates[0], locations[0].coordinates[1]],
            zoom: 12
        });

        map.on('load', () => {
            locations.forEach(location => {
                new mapboxgl.Marker()
                    .setLngLat(location.coordinates as mapboxgl.LngLatLike)
                    .setPopup(new mapboxgl.Popup({ offset: 25 }).setText(location.companyName))
                    .addTo(map);
            });

            map.addSource('route', {
              'type': 'geojson',
              'data': {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                      'type': 'LineString',
                      'coordinates': locations.map(location => location.coordinates)
                  }
              }
          });

          map.addLayer({
            'id': 'route',
            'type': 'line',
            'source': 'route',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#888',
                'line-width': 8
            }
        });

            const bounds = locations.reduce((bounds, location) => bounds.extend(location.coordinates as mapboxgl.LngLatLike), new mapboxgl.LngLatBounds(locations[0].coordinates as mapboxgl.LngLatLike, locations[0].coordinates as mapboxgl.LngLatLike));

            map.fitBounds(bounds, {
                padding: 20
            });
        });

        mapRef.current = map;

        return () => map.remove();
    }, [locations]);

    return (
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
    );
};

export default MapComponent;
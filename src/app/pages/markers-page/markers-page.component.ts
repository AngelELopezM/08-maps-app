import {
  AfterViewInit,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { v4 as UUIDV4 } from 'uuid';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

mapboxgl.accessToken = environment.mapBoxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [CommonModule],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.css',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    if (!this.divElement()) return;

    // await new Promise((resolve) => setTimeout(resolve, 80))

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.40985, 37.793085], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

    const marker = new mapboxgl.Marker({ color: '#000' })
      .setLngLat([-122.40985, 37.793085])
      .addTo(map);

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {
    map.on('click', (event) => {
      console.log({ event });
      this.mapClick(event);
    });

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if (!this.map()) return;

    const map = this.map()!;
    const coordinates = event.lngLat;
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({ color: color })
      .setLngLat([coordinates.lng, coordinates.lat])
      .addTo(map);

    const newMarkes: Marker = {
      id: UUIDV4(),
      mapboxMarker: marker,
    };

    this.markers.set([newMarkes, ...this.markers()]);
  }

  flyToMarker( lngLat: LngLatLike ){
    if(!this.map())
      return;

    this.map()!.flyTo({
      center: lngLat,
      zoom: 14,
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
    });
  }

  deleteMarker(marker: Marker){
    if(!this.map())
      return;

    const map = this.map()!;

    marker.mapboxMarker.remove();

    this.markers.set(this.markers().filter(x=> x.id !== marker.id));
  }
}

import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

mapboxgl.accessToken = environment.mapBoxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [CommonModule],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.css',
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal<mapboxgl.Map | null>(null);

  zoom = signal(14);
  coordinates = signal({
    lng: -74.5,
    lat: 40,
  });

  zoomEffect = effect(() => {
    if(!this.map())
       return;

    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit() {
    if (!this.divElement()) return;

    // await new Promise((resolve) => setTimeout(resolve, 80))

    const element = this.divElement()?.nativeElement;
    const {lng, lat} = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map) {

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    })

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center)
    });

    //Añade controles de navegación y tambien para poner el mapa en pantalla completa
    map.addControl(new mapboxgl.NavigationControl())
    map.addControl(new mapboxgl.FullscreenControl())

    this.map.set(map);
  }
}

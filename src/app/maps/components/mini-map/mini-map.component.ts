import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapBoxKey;

interface lngLat {
  lng: number;
  lat: number;
}

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.css',
})
export class MiniMapComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  lngLat = input.required<lngLat>();

  ngAfterViewInit(): void {
    if(!this.divElement())
      return;

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [this.lngLat().lng, this.lngLat().lat], // starting position [lng, lat]
      zoom: 14, // starting zoom
      interactive: false, // Disable interaction for mini-map
    });

    new mapboxgl.Marker().setLngLat([this.lngLat().lng, this.lngLat().lat]).addTo(map);
  }

 }

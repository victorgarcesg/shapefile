import { Component, OnInit } from '@angular/core';
import * as turf from '@turf/turf';
import Map from 'ol/Map';
import 'ol/ol.css';
import * as shp from 'shpjs';
declare var L;
declare var ol: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shapefile';
  map: Map;
  currentGeoJson: any;
  selectedPolygon: any;
  index = 0;
  switch = false;

  async ngOnInit() {
    const map = L.map('map').setView([18.476466668402324, -69.91353750228882], 8);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    map.on('click', (e) => {
      this.selectedPolygon = null;
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;
      const point = turf.point([lng, lat]);
      this.currentGeoJson.features.forEach(feature => {
        if (feature.geometry.coordinates.length > 1) {
          const multiPolygon = turf.multiPolygon(feature.geometry.coordinates);
          if (turf.booleanPointInPolygon(point, multiPolygon)) {
            this.selectedPolygon = feature;
          }
        } else {
          const parentPolygon = turf.polygon(feature.geometry.coordinates);
          if (turf.booleanPointInPolygon(point, parentPolygon)) {
            this.selectedPolygon = feature;
          }
        }
      });
      if (this.selectedPolygon !== null) {
        console.log(this.selectedPolygon.properties);
        L.popup().setLatLng(coord).setContent(this.selectedPolygon.properties.TOPONIMIA).openOn(map);
      }
    });

    shp('assets/BPCenso2010').then(geoJson => {
      console.log(geoJson);
      this.currentGeoJson = geoJson;
      // L.geoJSON(geoJson, {
      //   onEachFeature: this.onEachFeature
      // }).addTo(this.map);
    });
  }

  private onEachFeature(feature, layer) {
    layer.bindPopup(feature.properties.TOPONIMIA);
  }

  async printJson() {
    let locations = [];
    await shp('assets/BPCenso2010').then(geoJson => {
      console.log(geoJson);
      geoJson.features.forEach(feature => {
        locations = [...locations, feature.properties];
      });
    });
    const str = JSON.stringify(locations, null, 2);
    //console.log(str);
  }
}

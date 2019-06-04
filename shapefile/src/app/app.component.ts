import { Component, OnInit } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import 'ol/ol.css';
import { OSM, Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import * as shp from 'shpjs';
import { loadshp } from '../../src/machuque/preview.js';
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
  index = 0;

  async ngOnInit() {
    // await shp('assets/reg.zip').then(geoJson => {
    //   console.log(geoJson);
    //   this.currentGeoJson = geoJson;
    // });

    // loadshp({
    //   url: 'assets/reg.zip', // path or your upload file
    //   encoding: 'utf-8', // default utf-8
    //   EPSG: 4326 // default 4326
    // }, (geojson) => {
    //   console.log(geojson);
    //   vector.addData(geojson);
    //   map.fitBounds(vector.getBounds());
    // });

    //////////// LEAFTLEFT /////////////////////////
    const map = L.map('map').setView([18.476466668402324, -69.91353750228882], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    shp('assets/REGCenso2010').then(geoJson => {
      L.geoJSON(geoJson, {
        onEachFeature: this.onEachFeature
      }).addTo(map);
    });

    // loadshp({
    //   url: 'assets/reg.zip', // path or your upload file
    //   encoding: 'utf-8', // default utf-8
    //   EPSG: 4326 // default 4326
    // }, (geoJson) => {
    //   L.geoJSON(geoJson, {
    //     onEachFeature: this.onEachFeature
    //   }).addTo(map);
    // });

  }

  private onEachFeature(feature, layer) {
    console.log(feature.properties);
    layer.bindPopup(feature.properties.TOPONIMIA);
  }
}

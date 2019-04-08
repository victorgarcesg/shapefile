import { Component, OnInit } from '@angular/core';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import Map from 'ol/Map';
import 'ol/ol.css';
import { OSM, Vector as VectorSource } from 'ol/source';
import View from 'ol/View';
import * as shp from 'shpjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shapefile';
  map: Map;
  currentGeoJson: any;

  async ngOnInit() {
    await shp('assets/REGCenso2010').then(geoJson => {
      this.currentGeoJson = geoJson;
      this.currentGeoJson.crs = {
        type: 'name',
        properties: {
          name: 'EPSG:3857'
        }
      };
    });

    const geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857'
        }
      },
      'features': [{
        'type': 'Feature',
        'geometry': {
          'type': 'Point',
          'coordinates': [0, 0]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[4e6, -2e6], [8e6, 2e6]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'LineString',
          'coordinates': [[4e6, 2e6], [8e6, -2e6]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'Polygon',
          'coordinates': [[[-5e6, -1e6], [-4e6, 1e6], [-3e6, -1e6]]]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiLineString',
          'coordinates': [
            [[-1e6, -7.5e5], [-1e6, 7.5e5]],
            [[1e6, -7.5e5], [1e6, 7.5e5]],
            [[-7.5e5, -1e6], [7.5e5, -1e6]],
            [[-7.5e5, 1e6], [7.5e5, 1e6]]
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'MultiPolygon',
          'coordinates': [
            [[[-5e6, 6e6], [-5e6, 8e6], [-3e6, 8e6], [-3e6, 6e6]]],
            [[[-2e6, 6e6], [-2e6, 8e6], [0, 8e6], [0, 6e6]]],
            [[[1e6, 6e6], [1e6, 8e6], [3e6, 8e6], [3e6, 6e6]]]
          ]
        }
      }, {
        'type': 'Feature',
        'geometry': {
          'type': 'GeometryCollection',
          'geometries': [{
            'type': 'LineString',
            'coordinates': [[-5e6, -5e6], [0, -5e6]]
          }, {
            'type': 'Point',
            'coordinates': [4e6, -5e6]
          }, {
            'type': 'Polygon',
            'coordinates': [[[1e6, -6e6], [2e6, -4e6], [3e6, -6e6]]]
          }]
        }
      }]
    };

    const vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(this.currentGeoJson)
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource
    });

    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        vectorLayer
      ],
      target: 'map',
      view: new View({
        center: [0, 0],
        zoom: 2
      })
    });
  }
}

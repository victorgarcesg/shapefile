import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import Circle from 'ol/geom/Circle';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'shapefile';

  ngOnInit() {

    const image = new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({ color: 'red', width: 1 })
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
      features: (new GeoJSON()).readFeatures(geojsonObject)
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource.addFeature(new Feature(new Circle([5e6, 7e6], 1e6)))
    });

    const map = new Map({
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

/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { EJSON } from 'meteor/ejson';

import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

/**
 * Rest api for delivering a complete description of a map, including all services and layers.
 * 
 * { 
 *  api-version: '',
 *  maps: []
 * }
 * 
 */

Router.map(function () {
    /**
     * This service accepts a map parameter. If this map exists, then only layers and services from this map are returned.
     * If the map parameter is not found, no maps are returned.
     */
    this.route('json_map_api-map', {
        path: '/json-map-api-map/2.0/:mapName',
        where: 'server',
        action: function () {
            let mapsApi = {};
            const m = Maps.findOne({text: this.params.mapName})
            if (m) {
                mapsApi = createMapsApi([m], this.request);
            } else {
                //maps = Maps.find().fetch();
                // do nothing
            }
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(EJSON.stringify(mapsApi, {indent: true}));
        }
    });

    /**
     * This service returns all maps and associated layers and services
     */
    this.route('json_map_api-maps', {
        path: '/json-map-api-maps/2.0',
        where: 'server',
        action: function () {
            const mapsApi = createMapsApi(Maps.find().fetch(), this.request);
            this.response.setHeader('Content-Type', 'application/json');
            this.response.end(EJSON.stringify(mapsApi, {indent: true}));
        }
    });
});

/**
 * This function builds the whole map object from the three collections Maps, Layers and Services
 * 
 * @param {Array} maps An Arary with map objects from the Maps collection
 * 
 * @returns {Object} Returns an object whith version and maps (an array with map objects).
 * 
 * {
 *  api_version: String,
 *  maps: []
 * }
 * 
 */
function createMapsApi(maps, request) {
    const mapsApi = {
        api_version: '2.0',
        maps: []
    }

    maps.forEach(m => {
        const mapApi = {
            name: m.text,
            label: m.label,
            crs: m.crs,
            initial_extent: m.initial_extent,
        }
        mapApi.children = m.children.map(child => getMapLayers(child, request));

        mapsApi.maps.push(mapApi);
    });

    return mapsApi
}

/**
 * 
 * @param {Object} maplayer A maplayer object from the map or the children from within a group
 * 
 * @returns {Object} An object with all the information of a maplayer
 * 
 * {
 *  type: {map: String, layer: String},
 *  state: {visible: Boolean},
 *  name: String, 
 *  label: String,
 *  properties: {initial_query: String}
 *  service: {}
 *  maplayers: []
 * }
 * 
 * maplayers is onlye there if type.map = 'group'
 * type.layer, label, properties and service are only there when type.map = 'layer'
 * properties is only there if type.layer = 'cosurvey-sql'
 */
function getMapLayers(maplayer, request) {
    const mapLayerApi = {
        type: {},
        state: {}
    }
    
    mapLayerApi.type.map = maplayer.type;
    mapLayerApi.state.visible = maplayer.state.checked;

    if (maplayer.type === "layer") {
        // it's a layer
        const layer = Layers.findOne({_id: maplayer.data.layerid});
        
        mapLayerApi.name = layer.name
        mapLayerApi.label = layer.label
        mapLayerApi.type.layer = layer.type
        if (layer.type === "cosurvey-sql") { // the layer could be set back to default, but still you would have the properties in the collection. We don't want them in the api.
            mapLayerApi.properties = layer.properties
        }
        mapLayerApi.services = layer.service_layers.map(service_layer => getServiceLayers(service_layer, request)); // only use the first service_layer
    } else if (maplayer.type === "group") {
        // it's a group
        mapLayerApi.name = maplayer.text
        mapLayerApi.label = maplayer.text
        mapLayerApi.children = maplayer.children.map(child => getMapLayers(child, request));
    }

    return mapLayerApi
}

/**
 * 
 * @param {Object} servicelayer 
 * 
 * @return {Object}
 * 
 * {
 *  label: String
 *  metadataURL: String,
 *  maxScale: Integer,
 *  minScale: Integer,
 *  legendGraphic: String,
 *  layerInService: String,
 *  feature_types: [],
 *  name: String
 *  endpoint: String
 *  type: {serivce: String}
 *  version: String
 *  printFormat: String
 * }
 * 
 */
function getServiceLayers(servicelayer, request) {
    const protocol = request.headers['x-forwarded-proto'];
    const host = request.headers.host;
    let graphicUrl = servicelayer.legendGraphic;
    if ((graphicUrl) && (graphicUrl.indexOf('http') === -1)){
      /*
       * if the url does not contain http(s),
       * then it only contains the name of an uploaded image.
       * Change this into a full url.
       */
       graphicUrl = protocol + '://' + host + '/upload/' + graphicUrl;
    }

    const serviceLayerApi = {
        label: servicelayer.label,
        metadataURL: servicelayer.metadataURL,
        maxScale: servicelayer.maxScale,
        minScale: servicelayer.minScale,
        minZoom: calculateZoomFromScale(servicelayer.maxScale, 0.25),
        maxZoom: calculateZoomFromScale(servicelayer.minScale, 0.25),
        legendGraphic: graphicUrl,
        layerInService: servicelayer.nameInService,
    }
    if (servicelayer.featureType) {
        serviceLayerApi.feature_types = getFeatureTypes(servicelayer.featureType);
    }
    Object.assign(serviceLayerApi, getService(servicelayer.service)) // merge the service object into the serviceLayerApi

    return serviceLayerApi
}

/**
 * @param {Array} featureType
 * 
 * {
 * label: String
 * service: {}
 * featureTypeInWfsService: String
 * properties: 
 *  {
 *    name: String
 *    label: String
 *    enableSearch: Boolean
 *    enableInfo: Boolean
 *    namespace: String
 *  }
 * }
 */

function getFeatureTypes(featureTypes) {
    return featureTypes.map(featureType => {
        let props = [];
        if (featureType.searchTemplates && featureType.searchTemplates.length > 0) {
            props = featureType.searchTemplates.map(property => {
                return {
                    name: property.attribute_localname,
                    label: property.label,
                    enableSearch: property.enableSearch,
                    enableInfo: property.enableInfo,
                    namespace: property.attribute_namespace,
                }
            });
        }
        return {
            label: featureType.label,
            service: getService(featureType.service),
            featureTypeInWfsService: featureType.nameInWfsService,
            properties: props,
        }
    });
}

/**
 * 
 * @param {String} id
 * 
 * {
 *  name: String
 *  endpoint: String
 *  type: {serivce: String}
 *  version: String
 *  printFormat: String
 * }
 * 
 */
function getService(id) {
    const service = Services.findOne({_id: id})
    const serviceApi = {
        name: service.name,
        endpoint: service.endpoint,
        type: {},
        version: service.version
    }
    serviceApi.type.service = service.type
    if (service.type === 'WMS') {
        serviceApi.printFormat = service.printFormat
    }
    if (service.type === 'TMS') {
        serviceApi.tmsFormat = service.tmsFormat;
        serviceApi.invertY = (typeof service.invertY === 'undefined') ? true : service.invertY;
    }
    return serviceApi
}

/**
 * 
 * @param {Number} scale The scalefactor -> 1:'scalefactor'
 * @param {Number} precision Multiple where the resulting zoom will be rounded to.
 * 
 * Calculates the zoom level (required by leaflet/openlayers) out of a given scalefactor (the number after 1:)
 * If precision is set to 1, it rounds to integers.
 * If scale is outside the range of 188 to 12288000 (see well known scale set for Rd new) the function returns false.
 * 
 * calculateZoomFromScale(750) // 14
 * calculateZoomFromScale(1500) // 13
 * calculateZoomFromScale(12000) // 10
 */
function calculateZoomFromScale(scale, precision=1) {
    const maxScale = 12288000; // max scale (zoom = 0) within the RD new well known scale set
    const minScale = 188; // min scale (zoom = 16) within the RD new well known scale set
    if (!scale || scale > maxScale || scale < minScale) {
      return false
    } else {
      const zoom = Math.log2(maxScale/scale);
      return roundTo(zoom, precision);
    }
  }
  
  /**
   * 
   * @param {Number} x A Number to round
   * @param {Number} f A number acting as multiple to round to.
   * 
   * The result will be a number closest to x that is a multiple of f
   * 
   * roundTo(10, 3); // 9
   * roundTo(4, 5); // 5
   *  
   */
  function roundTo(x, f) {
    return Math.round(x/f) * f;
  }

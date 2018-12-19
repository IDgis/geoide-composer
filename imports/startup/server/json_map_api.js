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
                mapsApi = createMapsApi([m]);
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
            const mapsApi = createMapsApi(Maps.find().fetch());
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
function createMapsApi(maps) {
    const mapsApi = {
        api_version: '2.0',
        maps: []
    }

    maps.forEach(m => {
        const mapApi = {
            name: m.text,
            label: m.label,
            initial_extent: m.initial_extent,
        }
        mapApi.children = m.children.map(getMapLayers)

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
function getMapLayers(maplayer) {
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
        mapLayerApi.service = getServiceLayers(layer.service_layers[0]); // only use the first service_layer
    } else if (maplayer.type === "group") {
        // it's a group
        mapLayerApi.name = maplayer.text
        mapLayerApi.label = maplayer.text
        mapLayerApi.children = maplayer.children.map(getMapLayers);
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
function getServiceLayers(servicelayer) {
    const serviceLayerApi = {
        label: servicelayer.label,
        metadataURL: servicelayer.metadataURL,
        maxScale: servicelayer.maxScale,
        minScale: servicelayer.minScale,
        legendGraphic: servicelayer.legendGraphic,
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
        return {
            label: featureType.label,
            service: getService(featureType.service),
            featureTypeInWfsService: featureType.nameInWfsService,
            
            properties: featureType.searchTemplates.map(property => {
                return {
                    name: property.attribute_localname,
                    label: property.label,
                    enableSearch: property.enableSearch,
                    enableInfo: property.enableInfo,
                    namespace: property.attribute_namespace,
                }
            }),
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
    return serviceApi
}

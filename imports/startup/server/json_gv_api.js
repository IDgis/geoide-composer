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
 *  REST api for delivering json for the already existing Geoide-Viewer.
 *  
 *  NOTE:
 *  Identifiers cannot be represented by Mongo _id's, but must be stable and unique.
 *  The identifiers can have meaning because they may also be visible in other programs e.g. CRS2.
 *  
 *  They are made (as) unique (as possible) in the following way:
 *  1. id of an object at the highest level is equal to its name:
 *     'id: service.name' instead of 'id: service._id'
 *     The name of such a toplevel object is forced as unique in its schema
 *  2. id of an object at a lower level is assembled by concatenating the names of its parents:
 *     for 'layer.serviceLayer.featureType' the id becomes:
 *     featureType: layer.name + '.' + serviceLayer.nameInService + '.' + serviceLayer.featureType.nameInWfsService 
 *     
 *  The following dependencies are in place:
 *    services.json:        none
 *    featuretypes.json:    service
 *    servicelayers.json:   service, featuretype
 *    layers.json:          servicelayer
 *    maps.json:            layer
 *    searchtemplates.json: servicelayer, featuretype
 *  
 */

/**
 * Services
 * Deliver services collection as json.
 * 
 * The json structure that Geoide-Viewer expects 
 * is assembled in the gvServices object: 
 * {services:[
 * 
 *   {
 *     id: ,
 *     identification: 
 *     {
 *       serviceType: ,
 *       serviceEndpoint: ,
 *       serviceVersion: 
 *     },
 *     printFormat: 
 *   }
 * ]}
 * Note: 
 *    serviceEndpoint is assembled without trailing '?'
 */
Router.map(function () {
  this.route('json-gv-api-services', {
    path: '/json-gv-api-services',
    where: 'server',
    action: function () {
      const cursor = Services.find(); 
      const gvServices = {services:[]};
      cursor.forEach(function(service){
        gvServices.services.push(
            {
              id: service.name, 
              identification: {
                serviceType: service.type,
                serviceEndpoint: Meteor.call('removeQmarkFromUrl', service.endpoint),
                serviceVersion: service.version
              },
              printFormat: service.printFormat
            }
        );
      });
      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvServices, {indent: true}));
    }
  });
});

/**
 * Layers
 * Deliver layers collection as json,
 * including grouplayers from Maps collection
 * 
 * The json structure that Geoide-Viewer expects 
 * is assembled in the gvLayers object:
 *  
 * First write the layers: 
 * {layers:[
 *   {
 *     id: ,
 *     label: ,
 *     layerType: ,
 *     serviceLayers: ,
 *     state: ,
 *     properties: 
 *   }
 * ]}
 * 
 * then write grouplayers:
 * {layers:[
 *   {
 *     id: ,
 *     label: ,
 *     layerType: 'default'
 *   }
 * ]}
 * 
 * Note:
 *   The nesting in the map for the grouplayer structure is written out in code.
 * 
 */
Router.map(function () {
  this.route('json-gv-api-layers', {
    path: '/json-gv-api-layers',
    where: 'server',
    action: function () {
      const gvLayers = {layers:[]};
      /*
       * Get normal layers from Layers collection
       */
      const layerCursor = Layers.find(); 
      layerCursor.forEach(function(layer){
        const layerState = {};
        const layerProps = {};
        if (layer.properties){
          if (layer.properties.initial_visible){
            layerState.visible = layer.properties.initial_visible;
          }
          if (layer.properties.initial_query){
            layerState.query = layer.properties.initial_query;
          }
          if (layer.properties.applayer){
            layerProps.applayer = layer.properties.applayer;
          }
        }
        const layerServiceLayers = [];
        if (layer.service_layers) {
	        for (let index = layer.service_layers.length-1; index >= 0; index--)  {
	          const serviceLayer = layer.service_layers[index];
	          layerServiceLayers.push(layer.name + '.' + serviceLayer.nameInService);
	          // add searchfields to properties
	          if (serviceLayer.featureType){
	            layerProps.searchFields = [];
	            _.each(serviceLayer.featureType, function(ft){
	              _.each(ft.searchTemplates, function(st){
	                if (st){
	                  layerProps.searchFields.push({name:st.attribute_localname, label:st.label});
	                }
	              });            
	            });
	          }
	        }    
        }
        gvLayers.layers.push(
            {
              id: layer.name, 
              label: layer.label,
              layerType: layer.type,
              serviceLayers: layerServiceLayers,
              state: layerState,
              properties: layerProps 
            }
        );
      });
      /*
       * Get grouplayers from maps, 3 levels deep
       */
      const mapCursor = Maps.find(); 
      mapCursor.forEach(function(map){
        _.each(map.children, function(child1){
          if (child1.type === 'group'){
            _.each(child1.children, function(child2){
              if (child2.type === 'group'){
                _.each(child2.children, function(child3){
                  if (child3.type === 'group'){
                    gvLayers.layers.push(
                        {
                          id: child3.text , 
                          label: child3.text,
                          layerType: 'default'
                        }
                    );
                  }
                });
                gvLayers.layers.push(
                    {
                      id: child2.text , 
                      label: child2.text,
                      layerType: 'default'
                    }
                );
              }
            });
            gvLayers.layers.push(
                {
                  id: child1.text , 
                  label: child1.text,
                  layerType: 'default'
                }
            );
          }
        });
      });

      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvLayers, {indent: true}));
    }
  });
});

/**
 * ServiceLayers
 * Deliver serviceLayers from layers collection as json
 * 
 * The json structure that Geoide-Viewer expects 
 * is assembled in the gvServiceLayers object:
 *  
 * {serviceLayers:[
 *     {
 *       id: ,
 *       label: ,
 *       name: ,
 *       service: ,
 *       metadataURL: ,
 *       minZoom: ,
 *       maxZoom: ,
 *       minScale: ,
 *       maxScale: ,
 *       legendGraphicUrl: ,
 *       featureType: 
 *     }
 * ]}
 * 
 * Note:
 *   The featureType field is only added when it exists.
 * 
 */
Router.map(function () {
  this.route('json-gv-api-servicelayers', {
    path: '/json-gv-api-servicelayers',
    where: 'server',
    action: function () {
      const protocol =   this.request.headers['x-forwarded-proto'];
      const host = this.request.headers.host;
      const cursor = Layers.find(); 
      const gvServiceLayers = {serviceLayers:[]};
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          const aService = Services.findOne({_id: serviceLayer.service});
          let graphicUrl = serviceLayer.legendGraphic;
          if ((graphicUrl) && (graphicUrl.indexOf('http') === -1)){
            /*
             * if the url does not contain http(s),
             * then it only contains the name of an uploaded image.
             * Change this into a full url.
             */
             graphicUrl = protocol + '://' + host + '/upload/' + graphicUrl;
          }
          if (serviceLayer.featureType){
            let ft;
            if  (_.isArray(serviceLayer.featureType)){
              ft = serviceLayer.featureType[0];
            } else {
              ft = serviceLayer.featureType;
            }
            gvServiceLayers.serviceLayers.push(
                {
                  id: layer.name + '.' + serviceLayer.nameInService, 
                  label: (serviceLayer.label ? serviceLayer.label : ''),
                  name: serviceLayer.nameInService,
                  service: aService.name, //serviceLayer.service,
                  metadataURL: serviceLayer.metadataURL,
                  minZoom: calculateZoomFromScale(serviceLayer.maxScale, 0.25),
                  maxZoom: calculateZoomFromScale(serviceLayer.minScale, 0.25),
                  minScale: serviceLayer.minScale,
                  maxScale: serviceLayer.maxScale,
                  legendGraphicUrl: graphicUrl,
                  featureType: layer.name + '.' + serviceLayer.nameInService + '.' + ft.nameInWfsService
                }
            );
          } else {
            gvServiceLayers.serviceLayers.push(
                {
                  id: layer.name + '.' + serviceLayer.nameInService, 
                  label: serviceLayer.label,
                  name: serviceLayer.nameInService,
                  service: aService.name, //serviceLayer.service,
                  minZoom: calculateZoomFromScale(serviceLayer.maxScale, 0.25),
                  maxZoom: calculateZoomFromScale(serviceLayer.minScale, 0.25),
                  minScale: serviceLayer.minScale,
                  maxScale: serviceLayer.maxScale,
                  legendGraphicUrl: graphicUrl
                }
            );
          }
        });
      });
      
      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvServiceLayers, {indent: true}));
    }
  });
});

/**
 * FeatureTypes
 * Deliver FeatureTypes from layers collection as json
 * 
 * The json structure that Geoide-Viewer expects 
 * is assembled in the gvFeatureTypes object:
 *  
 * {featureTypes:[
 *     {
 *       id: ,
 *       label: ,
 *       name: ,
 *       service: 
 *     }
 * ]}
 * 
 */
Router.map(function () {
  this.route('json-gv-api-featuretypes', {
    path: '/json-gv-api-featuretypes',
    where: 'server',
    action: function () {
      const cursor = Layers.find(); 
      const gvFeatureTypes = {featureTypes:[]};
      const gvPropertyTypes = {propertyTypes:[]};
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          if (serviceLayer.featureType){
            let ft;
            if  (_.isArray(serviceLayer.featureType)){
              ft = serviceLayer.featureType[0];
            } else {
              ft = serviceLayer.featureType;
            }
            const aService = Services.findOne({_id: ft.service});
            if (aService){
              if (ft.searchTemplates && ft.searchTemplates.length > 0) {
                _.each(ft.searchTemplates, function(pt){
                  gvPropertyTypes.propertyTypes.push({
                    id: layer.name + '.' + serviceLayer.nameInService + '.' + ft.nameInWfsService + '.' + pt.attribute_localname,
                  });
                });
              }
              gvFeatureTypes.featureTypes.push(
                  {
                    id: layer.name + '.' + serviceLayer.nameInService + '.' + ft.nameInWfsService, 
                    label: (ft.label ? ft.label : ''),
                    name: ft.nameInWfsService,
                    service: aService.name,
                    propertyTypes: gvPropertyTypes.propertyTypes,
                  }
              );
            }
          }
        });
      });
      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvFeatureTypes, {indent: true}));
    }
  });
});

/**
 * PropertyTypes
 * Deliver PropertyTypes from layers collection as json
 * 
 * The propertTypes are called searchTemplates in the code and in the database schema.
 * Before it was only used to search, but now it can be used to hide properties from an information request or show a different label for that property.
 * 
 * The json structure that Geoide-Viewer expects
 * is assembled in the gvPropertyTypes object:
 * 
 * {propertyTypes:[
 *     {
 *       id: ,
 *       name: ,
 *       label: ,
 *       enableSearch: ,
 *       enableInfo: ,
 *       namespace: ,
 *     }
 * ]}
 */

Router.map(function(){
  this.route('json-gv-api-propertytypes', {
    path: '/json-gv-api-propertytypes',
    where: 'server',
    action: function () {
      const gvPropertyTypes = {propertyTypes:[]};

      const cursor = Layers.find();
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          if (serviceLayer.featureType){
            let ft;
            if (_.isArray(serviceLayer.featureType)){
              ft = serviceLayer.featureType[0];
            } else {
              ft = serviceLayer.featureType;
            }
            if (ft.searchTemplates && ft.searchTemplates.length > 0) {
              _.each(ft.searchTemplates, function(pt){
                gvPropertyTypes.propertyTypes.push(
                  {
                    id: layer.name + '.' + serviceLayer.nameInService + '.' + ft.nameInWfsService + '.' + pt.attribute_localname,
                    name:  pt.attribute_localname,
                    label: pt.label,
                    enableSearch: pt.enableSearch,
                    enableInfo: pt.enableInfo,
                    namespace: pt.attribute_namespace,
                  }
                );
              });
            }
          }
        });
      });

      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvPropertyTypes, {indent: true}));
    }
  });
});

/**
 * Maps
 * Deliver Maps from the maps collection as json
 * 
 * Groups and layers are sorted in reverse order 
 * as is required by Geoide-Viewer.
 * 
 * The json structure that Geoide-Viewer expects 
 * is assembled in the gvMaps object:
 *  
 * {maps:[
 *   {
 *     id: , 
 *     label: ,
 *     'initial-extent': ,
 *     maplayers: gvMapLayers
 *   }
 * ]}
 * 
 * where gvMapLayers has the following recursive structure:
 * [
 *   {
 *     layer: ,
 *     state: {
 *       visible : 
 *     },
 *     maplayers: gvMapLayers
 *   }
 * ]
 * 
 * The deepest level of gvMapLayers is an empty array
 *   gvMapLayers = [];
 *   
 * Note:
 *   The nesting depth in the mapLayers structure is written out in code.
 */
Router.map(function () {
  this.route('json-gv-api-maps', {
    path: '/json-gv-api-maps',
    where: 'server',
    action: function () {
      const gvMaps = {maps:[]};
      // get maps
      const cursor = Maps.find(); 
      const allMaps = cursor.fetch();
      // loop over allMaps array in reversed order  
      for (let index = allMaps.length-1; index >= 0; index--)  {
        const gvMapLayers1 = [];
        const map = allMaps[index];
        const mapChildren = map.children;
        if (mapChildren){
          for (let index1 = mapChildren.length-1; index1 >= 0; index1--)  {
            const child1 = mapChildren[index1];
            if (child1.type === 'group'){
              const gvMapLayers2 = [];
              const child1Children = _.toArray(child1.children);
              for (let index2 = child1Children.length-1; index2 >= 0; index2--)  {
                const child2 = child1Children[index2];
                if (child2.type === 'group'){
                  const gvMapLayers3 = [];
                  const child2Children = _.toArray(child2.children);
                  for (let index3 = child2Children.length-1; index3 >= 0; index3--)  {
                    const child3 = child2Children[index3];
                    if (child3.type === 'group'){
                      const gvMapLayers4 = [];
                      // group
                      gvMapLayers3.push(
                          {
                            layer: child3.text,
                            state: {
                              visible : child3.state.checked
                            },
                            maplayers: gvMapLayers4
                          }
                      );
                    } else {
                      // layer
                      const aLayer = Layers.findOne({_id: child3.data.layerid});
                      if (aLayer){
                        gvMapLayers3.push(
                            {
                              layer: aLayer.name,//child3.data.layerid,
                              state: {
                                visible : child3.state.checked
                              }
                            }
                        );
                      }
                    }
                  }
                  // group
                  gvMapLayers2.push(
                      {
                        layer: child2.text,
                        state: {
                          visible : child2.state.checked
                        },
                        maplayers: gvMapLayers3
                      }
                  );
                } else {
                  // layer
                  const aLayer = Layers.findOne({_id: child2.data.layerid});
                  if (aLayer){
                    gvMapLayers2.push(
                        {
                          layer: aLayer.name,//child2.data.layerid,
                          state: {
                            visible : child2.state.checked
                          }
                        }
                    );
                  }
                }
              }
              // group
              gvMapLayers1.push(
                  {
                    layer: child1.text,
                    state: {
                      visible : child1.state.checked
                    },
                    maplayers: gvMapLayers2
                  }
              );
            } else {
              // layer
              const aLayer = Layers.findOne({_id: child1.data.layerid});
              if (aLayer){
                gvMapLayers1.push(
                    {
                      layer: aLayer.name,//child1.data.layerid,
                      state: {
                        visible : child1.state.checked
                      }
                    }
                );
              }              
            }
          }
        }
        gvMaps.maps.push(
            {
              id: map.text, 
              label: map.label,
              'initial-extent': map['initial_extent'],
              maplayers: gvMapLayers1
            }
        );
      }
      this.response.setHeader('Content-Type', 'application/json');
      // make this streaming instead of pushing the whole object at once ??
      this.response.end(EJSON.stringify(gvMaps, {indent: true}));
    }
  });
 
});

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
function calculateZoomFromScale(scale, precision) {
  const maxScale = 12288000; // max scale (zoom = 0) within the RD new well known scale set
  const minScale = 188; // min scale (zoom = 16) within the RD new well known scale set
  if (scale > maxScale || scale < minScale) {
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

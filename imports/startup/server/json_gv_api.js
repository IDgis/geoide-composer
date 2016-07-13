import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';


/**
 *  REST api for delivering json for Geoide-Viewer
 *  NOTE:
 *  Identifiers cannot be represented by Mongo _id's, but must be human readable.
 *  They are made (as) unique (as possible) in the following way:
 *  1. id of an object at the highest level is equal to its name:
 *     'id: service.name' instead of 'id: service._id'
 *     The name of such a toplevel object is forced as unique in its schema
 *  2. id of an object at a lower level is assembled by concatenating the names of its parents:
 *     for 'layer.serviceLayer.featureType' the id becomes:
 *     featureType: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name 
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

Router.map(function () {
  /**
   * Objects for Geoide-Viewer json
   */
  var gvServices = {services:[]};
  var gvLayers = {layers:[]};
  var gvMaps = {maps:[]};
  var gvServiceLayers = {serviceLayers:[]};
  var gvSearchTemplates = {searchTemplates:[]};
  var gvFeatureTypes = {featureTypes:[]};

  /**
   * Services
   */
  this.route('json-gv-api-services', {
    path: '/json-gv-api-services',
    where: 'server',
    action: function () {
      var cursor = Services.find(); 
      gvServices = {services:[]};
      cursor.forEach(function(service){
        gvServices.services.push(
            {
//              id: service._id, 
              id: service.name, 
              label: service.name,
              identification: {
                serviceType: service.type,
                serviceEndpoint: service.endpoint,
                serviceVersion: service.version
              }
            }
        );
      });
      // TODO remove this before release
      console.log("gvServices", JSON.stringify(gvServices));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvServices));
    }
  });
  
  /**
   * Layers, including grouplayers from Maps
   */
  this.route('json-gv-api-layers', {
    path: '/json-gv-api-layers',
    where: 'server',
    action: function () {
      gvLayers = {layers:[]};
      /*
       * Get normal layers from Layers
       */
      var cursor = Layers.find(); 
      cursor.forEach(function(layer){
        var layerState = {};
        var layerProps = {};
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
        var layerServiceLayers = [];
        _.each(layer.service_layers, function(serviceLayer){
          layerServiceLayers.push(layer.name + '.' + serviceLayer.name);
        });
        gvLayers.layers.push(
            {
//              id: layer._id, 
              id: layer.name, 
              label: layer.name,
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
      var cursor = Maps.find(); 
      cursor.forEach(function(map){
        _.each(map.children, function(child1){
          if (child1.type == "group"){
            _.each(child1.children, function(child2){
              if (child2.type == "group"){
                _.each(child2.children, function(child3){
                  if (child3.type == "group"){
                    gvLayers.layers.push(
                        {
                          id: child3.text , 
                          label: child3.text,
                          layerType: "default",
                        }
                    );
                  }
                });
                gvLayers.layers.push(
                    {
                      id: child2.text , 
                      label: child2.text,
                      layerType: "default",
                    }
                );
              }
            });
            gvLayers.layers.push(
                {
                  id: child1.text , 
                  label: child1.text,
                  layerType: "default",
                }
            );
          }
        });
      });

      // TODO remove this before release
      console.log("gvLayers", JSON.stringify(gvLayers));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvLayers));
    }
  });
  
  /**
   * ServiceLayers
   */
  this.route('json-gv-api-servicelayers', {
    path: '/json-gv-api-servicelayers',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvServiceLayers = {serviceLayers:[]};
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          const aService = Services.findOne({_id: serviceLayer.service});
          gvServiceLayers.serviceLayers.push(
              {
                id: layer.name + '.' + serviceLayer.name, 
                label: serviceLayer.name,
                name: serviceLayer.nameInService,
                service: aService.name, //serviceLayer.service,
                featureType: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name,
              }
          );
        });
      });
      // TODO remove this before release
      console.log("gvServiceLayers", JSON.stringify(gvServiceLayers));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvServiceLayers));
    }
  });
    
  /**
   * FeatureTypes
   */
  this.route('json-gv-api-featuretypes', {
    path: '/json-gv-api-featuretypes',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvFeatureTypes = {featureTypes:[]};
      cursor.forEach(function(layer){
        console.log("gvFeatureTypes layer ", layer);
        _.each(layer.service_layers, function(serviceLayer){
          console.log("gvFeatureTypes serviceLayer ", serviceLayer);
          const aService = Services.findOne({_id: serviceLayer.featureType.service});
          console.log("gvFeatureTypes aService ", aService);
          gvFeatureTypes.featureTypes.push(
              {
                id: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name, 
                label: serviceLayer.featureType.name,
                name: serviceLayer.featureType.nameInService,
                service: aService.name, //serviceLayer.featureType.service,
              }
          );
        });
      });
      // TODO remove this before release
      console.log("gvFeatureTypes", JSON.stringify(gvFeatureTypes));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvFeatureTypes));
    }
  });

  /**
   * SearchTemplates
   */
  this.route('json-gv-api-searchtemplates', {
    path: '/json-gv-api-searchtemplates',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvSearchTemplates = {searchTemplates:[]};
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          _.each(serviceLayer.featureType.searchTemplates, function(searchTemplate){
            gvSearchTemplates.searchTemplates.push(
                {
                  id: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name + '.' + searchTemplate.label, 
                  label: searchTemplate.label,
                  featureType: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name,
                  attribute: {localName: searchTemplate.attribute_localname, namespace: searchTemplate.attibute_namespace},
                  serviceLayer: layer.name + '.' + serviceLayer.name,
                }
            );
          });
        });
      });
      // TODO remove this before release
      console.log("gvSearchTemplates", JSON.stringify(gvSearchTemplates));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvSearchTemplates));
    }
  });

  /**
   * Maps
   */
  this.route('json-gv-api-maps', {
    path: '/json-gv-api-maps',
    where: 'server',
    action: function () {
      gvMaps = {maps:[]};
      // get maps
      var cursor = Maps.find(); 
      cursor.forEach(function(map){
        var gvMapLayers1 = [];
        _.each(map.children, function(child1){
          if (child1.type == "group"){
            var gvMapLayers2 = [];
            _.each(child1.children, function(child2){
              if (child2.type == "group"){
                var gvMapLayers3 = [];
                _.each(child2.children, function(child3){
                  if (child3.type == "group"){
                    var gvMapLayers4 = [];
                    // group
                    gvMapLayers3.push(
                        {
                          layer: child3.text,
                          state: {
                            visible : child3.state.checked,
                          },
                          maplayers: gvMapLayers4,
                        }
                    );
                  } else {
                    // layer
                    const aLayer = Layers.findOne({_id: child3.data.layerid});
                    gvMapLayers3.push(
                        {
                          layer: aLayer.name,//child3.data.layerid,
                          state: {
                            visible : child3.state.checked,
                          },
                        }
                    );
                  }
                });
                // group
                gvMapLayers2.push(
                    {
                      layer: child2.text,
                      state: {
                        visible : child2.state.checked,
                      },
                      maplayers: gvMapLayers3,
                    }
                );
              } else {
                // layer
                const aLayer = Layers.findOne({_id: child2.data.layerid});
                gvMapLayers2.push(
                    {
                      layer: aLayer.name,//child2.data.layerid,
                      state: {
                        visible : child2.state.checked,
                      },
                    }
                );
              }
            });
            // group
            gvMapLayers1.push(
                {
                  layer: child1.text,
                  state: {
                    visible : child1.state.checked,
                  },
                  maplayers: gvMapLayers2,
                }
            );
          } else {
            // layer
            const aLayer = Layers.findOne({_id: child1.data.layerid});
            gvMapLayers1.push(
                {
                  layer: aLayer.name,//child1.data.layerid,
                  state: {
                    visible : child1.state.checked,
                  },
                }
            );
            
          }
        });
        gvMaps.maps.push(
            {
//              id: map._id, 
              id: map.text, 
              label: map.text,
              "initial-extent": map["initial_extent"],
              maplayers: gvMapLayers1,
  //              searchtemplates: ,
            }
        );
      });
      // TODO remove this before release
      console.log("gvMaps", JSON.stringify(gvMaps));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvMaps));
    }
  });

  
});
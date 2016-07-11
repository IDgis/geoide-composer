import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Router.map(function () {
  var gvServices = {services:[]};
  var gvLayers = {layers:[]};
  var gvMaps = {maps:[]};
  var gvServiceLayers = {serviceLayers:[]};
  var gvSearchTemplates = {searchTemplates:[]};
  var gvFeatureTypes = {featureTypes:[]};

  this.route('json-gv-api-services', {
    path: '/json-gv-api-services',
    where: 'server',
    action: function () {
      var cursor = Services.find(); 
      gvServices = {services:[]};// initialize
      cursor.forEach(function(service){
        gvServices.services.push(
            // Geoide-Viewer structuur services.json
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
  
  this.route('json-gv-api-layers', {
    path: '/json-gv-api-layers',
    where: 'server',
    action: function () {
      gvLayers = {layers:[]};// initialize
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
        // layers
        gvLayers.layers.push(
            // Geoide-Viewer structuur layers.json
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
                    // group layers from map
                    gvLayers.layers.push(
                        // Geoide-Viewer structuur layers.json
                        {
                          id: child3.text , 
                          label: child3.text,
                          layerType: "default",
                        }
                    );
                  }
                });
                // group layers from map
                gvLayers.layers.push(
                    // Geoide-Viewer structuur layers.json
                    {
                      id: child2.text , 
                      label: child2.text,
                      layerType: "default",
                    }
                );
              }
            });
            // group layers from map
            gvLayers.layers.push(
                // Geoide-Viewer structuur layers.json
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
  
  this.route('json-gv-api-servicelayers', {
    path: '/json-gv-api-servicelayers',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvServiceLayers = {serviceLayers:[]};// initialize
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          gvServiceLayers.serviceLayers.push(
              // Geoide-Viewer structuur serviceLayers.json
              {
                id: layer.name + '.' + serviceLayer.name, 
                label: serviceLayer.name,
                name: serviceLayer.nameInService,
                service: serviceLayer.service,
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
    
  this.route('json-gv-api-featuretypes', {
    path: '/json-gv-api-featuretypes',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvFeatureTypes = {featureTypes:[]};// initialize
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          gvFeatureTypes.featureTypes.push(
              // Geoide-Viewer structuur featuretypes.json
              {
                id: layer.name + '.' + serviceLayer.name + '.' + serviceLayer.featureType.name, 
                label: serviceLayer.featureType.name,
                name: serviceLayer.featureType.nameInService,
                service: serviceLayer.featureType.service,
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

  this.route('json-gv-api-searchtemplates', {
    path: '/json-gv-api-searchtemplates',
    where: 'server',
    action: function () {
      var cursor = Layers.find(); 
      gvSearchTemplates = {searchTemplates:[]};// initialize
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          _.each(serviceLayer.featureType.searchTemplates, function(searchTemplate){
            gvSearchTemplates.searchTemplates.push(
                // Geoide-Viewer structuur searchtemplates.json
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

  
  this.route('json-gv-api-maps', {
    path: '/json-gv-api-maps',
    where: 'server',
    action: function () {
      // initialize
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
                  } else{
                    // layer
                    const aLayer = Layers.findOne({_id: child3.data.layerid});
//                    console.log("aLayer: "+JSON.stringify(aLayer) + ", name: " + aLayer.name);
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
              } else{
                // layer
                const aLayer = Layers.findOne({_id: child2.data.layerid});
//                console.log("aLayer: "+JSON.stringify(aLayer) + ", name: " + aLayer.name);
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
//            console.log("aLayer: "+JSON.stringify(aLayer) + ", name: " + aLayer.name);
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
            // Geoide-Viewer structuur maps.json
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
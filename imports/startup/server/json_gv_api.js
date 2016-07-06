import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

Router.map(function () {
  var gvServices = {services:[]};
  var gvLayers = {layers:[]};
  var gvmaps = {maps:[]};
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
              id: service._id, 
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
      var cursor = Layers.find(); 
      gvLayers = {layers:[]};// initialize
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
            // Geoide-Viewer structuur layers.json
            {
              id: layer._id, 
              label: layer.name,
              layerType: layer.type,
              serviceLayers: layerServiceLayers,
              state: layerState,
              properties: layerProps 
            }
        );
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
      console.log("gvServiceLayers", JSON.stringify(gvFeatureTypes));
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
      console.log("gvServiceLayers", JSON.stringify(gvSearchTemplates));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvSearchTemplates));
    }
  });

  
  this.route('json-gv-api-maps', {
    path: '/json-gv-api-maps',
    where: 'server',
    action: function () {
      var cursor = Maps.find(); 
      gvMaps = {maps:[]};// initialize
      
      // TODO get maps
      
      // TODO remove this before release
      console.log("gvServiceLayers", JSON.stringify(gvMaps));
      this.response.setHeader('Content-Type', 'application/json');
      // TODO make this streaming instead of pushing the whole object at once ??
      this.response.end(JSON.stringify(gvMaps));
    }
  });

  
});
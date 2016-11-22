import { EJSON } from 'meteor/ejson';
import { Router } from 'meteor/iron:router';
import { Services } from '/imports/api/collections/services.js';
import { Layers } from '/imports/api/collections/layers.js';
import { Maps } from '/imports/api/collections/maps.js';

/**
 *  REST api for delivering json for Geoide-Viewer
 *  NOTE:
 *  Identifiers cannot be represented by Mongo _id's, but must be human readable,
 *  because they are also edited in CRS2.
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
   * Deliver services as json
   */
Router.map(function () {
  this.route('json-gv-api-services', {
    path: '/json-gv-api-services',
    where: 'server',
    action: function () {
      let cursor = Services.find(); 
      let gvServices = {services:[]};
      cursor.forEach(function(service){
        gvServices.services.push(
            {
//              id: service._id, 
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
   * Layers, including grouplayers from Maps
   */
Router.map(function () {
  this.route('json-gv-api-layers', {
    path: '/json-gv-api-layers',
    where: 'server',
    action: function () {
      let gvLayers = {layers:[]};
      /*
       * Get normal layers from Layers
       */
      let cursor = Layers.find(); 
      cursor.forEach(function(layer){
        let layerState = {};
        let layerProps = {};
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
        let layerServiceLayers = [];
        for (let index = layer.service_layers.length-1; index >= 0; index--)  {
          let serviceLayer = layer.service_layers[index];
          layerServiceLayers.push(layer.name + '.' + serviceLayer.nameInService);
          // add searchfields to properties
          if ((layer.type !== 'default') && (serviceLayer.featureType)){
            layerProps.searchFields = [];
            _.each(serviceLayer.featureType, function(ft){
              _.each(ft.searchTemplates, function(st){
                layerProps.searchFields.push({name:st.attribute_localname, label:st.label});
              });            
            });
          }
        };
        gvLayers.layers.push(
            {
//              id: layer._id, 
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
      cursor = Maps.find(); 
      cursor.forEach(function(map){
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
   */
Router.map(function () {
  this.route('json-gv-api-servicelayers', {
    path: '/json-gv-api-servicelayers',
    where: 'server',
    action: function () {
    	let protocol = 	this.request.headers['x-forwarded-proto'];
    	let host = this.request.headers.host;
      let cursor = Layers.find(); 
      let gvServiceLayers = {serviceLayers:[]};
      cursor.forEach(function(layer){
        _.each(layer.service_layers, function(serviceLayer){
          const aService = Services.findOne({_id: serviceLayer.service});
          if (serviceLayer.featureType){
            let ft;
            if  (_.isArray(serviceLayer.featureType)){
              ft = serviceLayer.featureType[0];
            } else {
              ft = serviceLayer.featureType;
            }
            let graphicUrl = serviceLayer.legendGraphic;
            if(graphicUrl.indexOf('http') === -1){
            	graphicUrl = protocol + '://' + host + '/upload/' + graphicUrl;
            } 
            gvServiceLayers.serviceLayers.push(
                {
                  id: layer.name + '.' + serviceLayer.nameInService, 
                  label: (serviceLayer.label ? serviceLayer.label : ''),
                  name: serviceLayer.nameInService,
                  service: aService.name, //serviceLayer.service,
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
                  legendGraphicUrl: serviceLayer.legendGraphic
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
   */
Router.map(function () {
  this.route('json-gv-api-featuretypes', {
    path: '/json-gv-api-featuretypes',
    where: 'server',
    action: function () {
      let cursor = Layers.find(); 
      let gvFeatureTypes = {featureTypes:[]};
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
              gvFeatureTypes.featureTypes.push(
                  {
                    id: layer.name + '.' + serviceLayer.nameInService + '.' + ft.nameInWfsService, 
                    label: (ft.label.label ? ft.label.label : ''),
                    name: ft.nameInWfsService,
                    service: aService.name
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
   * Maps
   */
  /*
   * groups and layers sorted in reverse order as required by Geoide-Viewer
   */
Router.map(function () {
  this.route('json-gv-api-maps', {
    path: '/json-gv-api-maps',
    where: 'server',
    action: function () {
      let gvMaps = {maps:[]};
      // get maps
      let cursor = Maps.find(); 
      let allMaps = cursor.fetch();
      // loop over allMaps array in reversed order  
      for (let index = allMaps.length-1; index >= 0; index--)  {
        let gvMapLayers1 = [];
        let map = allMaps[index];
        let mapChildren = map.children;
        if (mapChildren){
          for (let index1 = mapChildren.length-1; index1 >= 0; index1--)  {
            let child1 = mapChildren[index1];
            if (child1.type === 'group'){
              let gvMapLayers2 = [];
              let child1Children = _.toArray(child1.children);
              for (let index2 = child1Children.length-1; index2 >= 0; index2--)  {
                let child2 = child1Children[index2];
                if (child2.type === 'group'){
                  let gvMapLayers3 = [];
                  let child2Children = _.toArray(child2.children);
                  for (let index3 = child2Children.length-1; index3 >= 0; index3--)  {
                    let child3 = child2Children[index3];
                    if (child3.type === 'group'){
                      let gvMapLayers4 = [];
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
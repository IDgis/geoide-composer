import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';



SimpleSchema.mapLayerState = new SimpleSchema ({
	//mapLayer initial visible
	checked: {
		type: Boolean,
		optional: true
	}
});

SimpleSchema.mapLayerData = new SimpleSchema ({
	//id of layer is stored in dataattibute
	layerid: {
		type: String,
		optional: true
		
	}
});
//validatie op minx < maxx zie https://github.com/aldeed/meteor-simple-schema#custom-validation
SimpleSchema.initialExtent = new SimpleSchema ({
    "minx": {
    	type: Number,
    	min: 0,
    	max: 300000,
    	defaultValue: 0,
    	label:  function(){ return i18n('collections.maps.initial_extent.minX.label'); },
    	autoform: {
    	  "title": function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.minx'); },
    	},
    },
    "miny": {
    	type: Number,
    	min: 300000,
    	max: 620000,
    	defaultValue: 300000,
    	label: function(){ return i18n('collections.maps.initial_extent.minY.label'); },
      autoform: {
        "title": function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.miny'); },
      },
     },
     "maxx": {
    	type: Number,
    	min: 0,
    	max: 300000,
    	defaultValue: 300000,
    	label: function(){ return i18n('collections.maps.initial_extent.maxX.label'); },
      autoform: {
        "title": function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxx'); },
      },
    },
    "maxy":  {
    	type: Number,
     	min: 300000,
     	max: 620000,
     	defaultValue: 620000,
     	label: function(){ return i18n('collections.maps.initial_extent.maxY.label'); },
      autoform: {
        "title": function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.maxy'); }, 
      },
    }
});


export const MapSchema= new SimpleSchema({
	//name of map
	text: {
		type: String,
		label: function(){ return i18n('collections.maps.name.label'); },
		unique: true,
    autoform: {
      "title": function(){ return i18n ('tooltips.maps.autoform.fields.name'); },
    },
	}, 
  label: {
    type: String,
    label: function(){ return i18n('collections.maps.label.label'); },
    autoform: {
      "title": function(){ return i18n ('tooltips.maps.autoform.fields.label'); },
    },
  }, 
	//type in tree (not relevant for viewerconfig)
	type: {
		type: String,
		defaultValue: 'map'
	},
	initial_extent: {
		type: SimpleSchema.initialExtent,
		label: function(){ return i18n('collections.maps.initialExtent.label'); },
		optional: true,
    autoform: {
      "title": function(){ return i18n ('tooltips.maps.autoform.fields.initial_extent.label'); },
    },
	},
	children: {
		type: [Object],
		optional: true
	},
	//id in tree (not relevant for viewerconfig)
	'children.$.id': {
        type: String,
        optional: true
    },
    //layer name (overrules name in layerconfig)
    'children.$.text': {
        type: String,
        optional: true
    },
    'children.$.state': {
    	//layer visibility
    	type: SimpleSchema.mapLayerState,
    	optional: true
	},
    'children.$.type': {
       //type in tree (not relevant for viewerconfig)
   	   type: String,
   	   optional: true
    },
    'children.$.data': {
    	//layer_id
		type: SimpleSchema.mapLayerData,
		optional: true
	},
    'children.$.children': {
        type: [Object],
        optional: true
    },
    'children.$.children.$.id': {
         type: String,
         optional: true
     },
	'children.$.children.$.text': {
	     type: String,
	     optional: true
	 },
	 'children.$.children.$.state': {
		 type: SimpleSchema.mapLayerState,
		 optional: true
	 },
	'children.$.children.$.type': {
		 type: String,
		 optional: true
	 },
	 'children.$.children.$.data': {
			type: SimpleSchema.mapLayerData,
			optional: true
		},
	 'children.$.children.$.children': {
	     type: [Object],
	     optional: true
	 },
	'children.$.children.$.children.$.id': {
	     type: String,
	     optional: true
	 },
	 'children.$.children.$.children.$.text': {
	     type: String,
	     optional: true
	 },
	 'children.$.children.$.children.$.state': {
		 type: SimpleSchema.mapLayerState,
		 optional: true
	 },
	 'children.$.children.$.children.$.type': {
		 type: String,
		 optional: true
	 },
	 'children.$.children.$.children.$.data': {
		 type: SimpleSchema.mapLayerData,
	     optional: true
	 }
});

export const Maps = new Mongo.Collection("maps");
Maps.attachSchema(MapSchema);

Maps.allow({
  insert: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  },
  update: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  },
  remove: function(userId, doc) {
    // only allow posting if you are logged in
    return !! userId; 
  }
})
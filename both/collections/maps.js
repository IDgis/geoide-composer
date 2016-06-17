Maps = new Mongo.Collection("maps");

SimpleSchema.mapLayerState = new SimpleSchema ({
	//visible
	checked: {
		type: Boolean,
		optional: true
	}	
});

//validatie op minx < maxx zie https://github.com/aldeed/meteor-simple-schema#custom-validation
SimpleSchema.initialExtent = new SimpleSchema ({
    "minx": {
    	type: Number,
    	min: 0,
    	max: 300000,
    	label: 'minX'
    },
    "miny": {
    	type: Number,
    	min: 300000,
    	max: 620000,
    	label: 'minY'
     },
     "maxx": {
    	type: Number,
    	min: 0,
    	max: 300000,
    	label: 'maxX'
    },
    "maxy":  {
      	type: Number,
       	min: 300000,
       	max: 620000,
       	label: 'maxY'
    }
});

//dit werkt niet, slecht 1 niveau. children op volgend niveau zijn lege objecten
SimpleSchema.child = new SimpleSchema ({
	"id": {
		type: String,
	}, 
	"text": {
		type: String
	},
	"type": {
		type:String
	},
	"state": {
		type: SimpleSchema.mapLayerState,
	},
	"children": {
		type: [SimpleSchema.child]
	}	
});




Maps.attachSchema(new SimpleSchema({
	text: {
		type: String,
	}, 
	type: {
		type: String,
		defaultValue: 'map'
	},
	initial_extent: {
		type: SimpleSchema.initialExtent,
		label: "Initieel extent",
		optional: true
	},
	children: {
		type: [Object]
	}, 
	'children.$.id': {
        type: String,
    },
    'children.$.text': {
        type: String
    },
    'children.$.state': {
    	type: SimpleSchema.mapLayerState,
	},
    'children.$.type': {
   	   type: String
    },
    'children.$.children': {
        type: [Object],
        optional: true
    },
    'children.$.children.$.id': {
         type: String,
     },
	'children.$.children.$.text': {
	     type: String
	 },
	 'children.$.children.$.state': {
		 type: SimpleSchema.mapLayerState,
	 },
	'children.$.children.$.type': {
		 type: String
	 },
	 'children.$.children.$.children': {
	     type: [Object],
	 	 optional: true
	 },
	'children.$.children.$.children.$.id': {
	     type: String,
	 },
	 'children.$.children.$.children.$.text': {
	     type: String
	 },
	 'children.$.children.$.children.$.state': {
		 type: SimpleSchema.mapLayerState,
	 },
	 'children.$.children.$.children.$.type': {
		 type: String
	 }
}));

Maps.allow({
	  insert: function () { return true; },
	  update: function () { return true; },
	  remove: function () { return true; }
})
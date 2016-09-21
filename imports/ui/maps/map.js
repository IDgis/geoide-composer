import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {Session} from 'meteor/session';
import {Maps, MapSchema} from '/imports/api/collections/maps.js';
import {Layers} from '/imports/api/collections/layers.js';

import './map.html';
import '../i18n/maps/help.html';

Template.map.helpers({
	/**
	 * Mapscollection
	 */
	maps : function() {
		return Maps;
	},
	/**
	 * Maps schema
	 */
	mapSchema : function() {
		return MapSchema;
	},
	formType : function() {
		if (Session.get("selectedMapId")) {
			return "update";
		} else {
			return "insert";
		}
	},
	mapDoc : function() {
		if (Session.get("selectedMapId")) {
			return this;
		} else {
			return null;
		}
	},

});

Template.map.events({
	'click #return' : function() {
		console.log("clicked cancel mapform");
		Router.go('maps.list');
	},

	'click #help' : function() {
		var helpTemplate = i18n('maps.help.template');
		console.log("clicked help", helpTemplate);
		Modal.show(helpTemplate);
	},

	'submit #mapForm' : function(event) {
		console.log("submit mapForm ");
	},

	'click .jstree' : function() {
		console.log("click .jstree", this);
	},

	'click #createlayer' : function() {

		var ref = $.jstree.reference('#maptree'), sel = ref
				.get_top_selected();

		if (!sel) {
			return false;
		}

		var layerLabel = $('#layerselect option:selected').text();
		if (layerLabel){
  		var layerId = $('#layerselect option:selected').val();
  		ref.create_node(sel, {
  			"type" : "layer",
  			"text" : layerLabel,
  			"data" : {
  				"layerid" : layerId
  			},
  			"state" : {
  				"checked" : true
  			}
  		});
		}
		$('#maptree').jstree('open_node',sel);
		fillLayerSelect();
	},

	'click #creategroup' : function() {
		var ref = $.jstree.reference('#maptree'), sel = ref
				.get_top_selected();

		if (!sel) {
			return false;
		}
		sel = ref.create_node(sel, {
			"type" : "group",
			"state" : {
				"checked" : true
			}
		});
		if (sel) {
			ref.edit(sel);
		}
		
	},

	'click #renamenode' : function() {	
		var ref = $.jstree.reference('#maptree'), sel = ref
				.get_selected();
		if (!sel.length || ref.get_type(sel) === "map"
				|| ref.get_type(sel) === "layer") {
			return false;
		}
		sel = sel[0];
		ref.edit(sel);
	},

	'click #removenode' : function() {
		var ref = $.jstree.reference('#maptree');
		console.log('removenode', ref);
		var selObjects = ref.get_selected(true);
		console.log('selected list', selObjects);
		_.each(selObjects, function(sel){
		  console.log('selected ', sel);
		  if (ref.get_type(sel) === "map") {
		    return false;
		  }
		  if (ref.get_type(sel) === "layer") {
  			var lyr = Layers.findOne({
  				_id : sel.data.layerid
  			});
  			console.log('removenode layer: ', lyr);
  			if (lyr) {
  				console.log('removenode layer.type:', lyr.type);
  				var adminLoggedIn = false;
  				if (Meteor.user()) {
  					// a user is logged in
  					var name = Meteor.user().username;
  					adminLoggedIn = _.isEqual(name, 'idgis-admin');
  					console.log('adminLoggedIn', adminLoggedIn);
  					if (!adminLoggedIn && (lyr.type === 'cosurvey-sql')) {
  						console.log('not remove cosurvey-sql if user is no admin ');
  						return false;
  					}
  				} else {
  					console.log('no user logged in, no remove allowed');
  					return false;
  				}
  			} else {
  				// layer not found, remove is ok
  				console.log('layer not found, remove is ok');
  			}
  			ref.delete_node(sel);
  		}
      if (ref.get_type(sel) === "group") {
        new Confirmation({
          message: function(){ return i18n('collections.confirmation.delete.message.groups') + ': ' + sel.text; },
          title: function(){ return i18n('collections.confirmation.delete.title'); },
          cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
          okText: function(){ return i18n('collections.confirmation.delete.ok'); },
          success: false, // whether the button should be green or red
          focus: "ok" // which button to autofocus, "cancel" (default) or "ok", or "none"
        }, function (ok) {
          // ok is true if the user clicked on "ok", false otherwise
          if (ok){
            ref.delete_node(sel);
          }
        });
      }
		});
		
		fillLayerSelect();
	},

});

Template.map.rendered = function() {
	var mapId = Session.get("selectedMapId");
	var map;
	if (mapId) {
		map = Maps.find({
			_id : mapId
		}).fetch()[0];
		map.a_attr = {
			class : "no_checkbox",
		};
		map.state = {
			"selected": true,
		}
	} else {
		map = {
			text : 'Nieuwe kaart',
			type : 'map',
			'children' : [],
			'a_attr' : {
				class : "no_checkbox"
			},
			state: {
				"selected": true, 
			}
		};
	}
	
	$('#maptree').jstree({
		'core' : {
			'data' : [ map ],
			check_callback : true,
		},
		types : {
			"#" : {
				"max_children" : 1,
				"max_depth" : 4,
				"valid_children" : [ "map" ]
			},
			map : {
				"icon" : "glyphicon glyphicon-tree-deciduous",
				"valid_children" : [ "group", "layer" ],
			},
			group : {
				"icon" : "glyphicon glyphicon-duplicate",
				"valid_children" : [ "group", "layer" ]
			},
			layer : {
				"icon" : "glyphicon glyphicon-file",
				"valid_children" : [ "servicelayer" ],
			},
			servicelayer : {
				"icon" : "null",
				"valid_children" : [],
			}
		},
		checkbox : {
			three_state: false,
			tie_selection: false,
			whole_node : false,
		},
		plugins : [ "checkbox","dnd","types"]

	})
	
	.on("loaded.jstree", function(e, data) {
		$('#maptree').jstree('open_all');
		$('.jstree-checkbox').attr('title', i18n('tooltips.maps.jstree.check'));
		fillLayerSelect();
	})
	
	.on("move_node.jstree", function(e, data) {
		var parent = data.new_instance;
		$('#maptree').jstree('open_node',data.parent);
	})
	
}

fillLayerSelect = function() {
	var layers = Layers.find({}, {
		sort : [ [ "label", "asc" ] ],
		fields : {
			label : 1,
			_id : 1
		}
	}).fetch();
	 	
	$('#layerselect')
	     .find('option')
	     .remove()
	     .end()
    ;
	
	var layerOption = undefined;
	layers.forEach(function(entry) {
		if (!layerInTree($.jstree.reference('.tree').get_json('#')[0].children,
				entry._id)) {
			layerOption = "<option value=" + entry._id + ">" + entry.label
					+ "</option>"
			$('#layerselect').append(layerOption);
		}
	});
	
	// if the select box is empty, then disable button
	if (layerOption){
	  $('#createlayer').prop('disabled', false);
	} else{
    $('#createlayer').prop('disabled', true);
	}
}

layerInTree = function(children, layerId) {
	for (var j = 0; j < children.length; j++) {
		if (children[j].children[0]) {
			if (layerInTree(children[j].children, layerId)) {
				return true;
			};
		} else if (children[j].data.layerid === layerId) {
			return true;
		}
	};
	return false;
}

AutoForm.addHooks('mapForm',{
	before : {
		
		// Voeg de children uit de jstree toe aan het doc
		// object, voordat deze wordt
		// weggeschreven naar de database
		update : function(doc) {
			console.log($.jstree.reference('.tree').get_json('#')[0]);
			doc.$set.children = $.jstree.reference('.tree')
					.get_json('#')[0].children;
			return doc;
		},

		insert : function(doc) {
			doc.children = $.jstree.reference('.tree')
					.get_json('#')[0].children;
			return doc;
		}
	},

	/**
	 * When the autoform is succesfully submitted, go to the map list.
	 * Before doing this, trigger the Geoide viewer that the configuration has changed.
	 * When the viewer reload fails, alert the user.
	 */
	onSuccess : function(formType, result) {
		// Stuur een refresh request naar de viewer en ga naar
		// de list
		console.log("submit map autoform, goto list");
		Meteor.call('triggerViewerReload', function(lError,
				lResponse) {
			if (lError) {
				console.log('triggerViewerReload Error ', lError);
				alert(i18n('alert.viewerRefresh'));
        Router.go('maps.list');
			} else {
			  console.log('triggerViewerReload Response ', lResponse);
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode != '200' ){
          alert(i18n('alert.viewerRefresh'));
        }
			  Router.go('maps.list');
			}
		});
	},

	onError : function(formType, error) {
		console.log("map autoform error = " + error);
	}
});

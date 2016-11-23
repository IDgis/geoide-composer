import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {Session} from 'meteor/session';
import {Maps, MapSchema} from '/imports/api/collections/maps.js';
import {Layers} from '/imports/api/collections/layers.js';

import './map.html';
import '../i18n/maps/help.html';
import '../i18n/alerts/geoide-viewer.html';

const MAX_TREE_DEPTH = 4;

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
		if (Session.get('selectedMapId')) {
			return 'update';
		} else {
			return 'insert';
		}
	},
	mapDoc : function() {
		if (Session.get('selectedMapId')) {
			return this;
		} else {
			return null;
		}
	}

});

var layerInTree = function(children, layerId) {
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
};

var fillLayerSelect = function() {
  var layers = Layers.find({}, {
    sort : [ [ 'label', 'asc' ] ],
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
  
  var layerOption = null;
  layers.forEach(function(entry) {
    if (!layerInTree($.jstree.reference('.tree').get_json('#')[0].children,
        entry._id)) {
      layerOption = '<option value=' + entry._id + '>' + entry.label
          + '</option>';
      $('#layerselect').append(layerOption);
    }
  });
  
  // if the select box is empty, then disable button
  if (layerOption){
    $('#createlayer').prop('disabled', false);
  } else{
    $('#createlayer').prop('disabled', true);
  }
};

Template.map.events({
	'click #return' : function() {
		Router.go('maps.list');
	},

	'click #help' : function() {
    // peppelg:bootstrap-3-modal
    Modal.show(i18n('maps.help.template'));
	},

	'click .jstree' : function() {
		// check which buttons to disable/enable, 
		// depending on what is selected in the tree
    var ref = $.jstree.reference('#maptree');
    var sel = ref.get_selected();
    if (sel){
      // check if select list contains anything
      var numberOfOptions = $('#layerselect option').length;
      var renamenode  = $('#renamenode');
      var removenode  = $('#removenode');
      var creategroup = $('#creategroup');
      var createlayer  = $('#createlayer');
      if (ref.get_type(sel) === 'group') {
//      enable renamenode/removenode/creategroup
        renamenode.prop('disabled', false);
        removenode.prop('disabled', false);
        creategroup.prop('disabled', false);
        if (numberOfOptions > 0){
          createlayer.prop('disabled', false);
        }
        var depth = ref.get_selected(true)[0].parents.length;
        // max depth does not allow another group or layer to be added
        if (depth === MAX_TREE_DEPTH){
          createlayer.prop('disabled', true);
          creategroup.prop('disabled', true);
        }
        // (max depth - 1) does not allow another group to be added
        if (depth === (MAX_TREE_DEPTH - 1)){
          creategroup.prop('disabled', true);
        }
      } else if (ref.get_type(sel) === 'layer') {
//      disable renamenode/creategroup/createlayer, enable removenode
        renamenode.prop('disabled', true);
        removenode.prop('disabled', false);
        creategroup.prop('disabled', true);
        createlayer.prop('disabled', true);
      } else {
        // top node 'map' is selected
//      disable renamenode/removenode, enable creategroup
        renamenode.prop('disabled', true);
        removenode.prop('disabled', true);        
        creategroup.prop('disabled', false);
        if (numberOfOptions > 0){
          createlayer.prop('disabled', false);
        }
      }
    }
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
  			'type' : 'layer',
  			'text' : layerLabel,
  			'data' : {
  				'layerid' : layerId
  			},
  			'state' : {
  				'checked' : true
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
			'type' : 'group',
			'state' : {
				'checked' : true
			}
		});
		if (sel) {
			ref.edit(sel);
		}
		
	},

	'click #renamenode' : function() {	
		var ref = $.jstree.reference('#maptree'), sel = ref
				.get_selected();
		if (!sel.length || ref.get_type(sel) === 'map'
				|| ref.get_type(sel) === 'layer') {
			return false;
		}
		sel = sel[0];
		ref.edit(sel);
    // after rename disable 'rename group' button 
		$('#renamenode').prop('disabled', true);
	},

	'click #removenode' : function() {
		var ref = $.jstree.reference('#maptree');
		var selObjects = ref.get_selected(true);
		_.each(selObjects, function(sel){
		  if (ref.get_type(sel) === 'map') {
		    return false;
		  }
		  if (ref.get_type(sel) === 'layer') {
  			var lyr = Layers.findOne({
  				_id : sel.data.layerid
  			});
  			if (lyr) {
  				if (Meteor.user()) {
  					// a user is logged in
  					var name = Meteor.user().username;
  					var adminLoggedIn = _.isEqual(name, 'idgis-admin');
  					if (!adminLoggedIn && (lyr.type === 'cosurvey-sql')) {
  						return false;
  					}
  				} else {
  					return false;
  				}
  			} else {
  				// layer not found, remove is ok
  			}
  			ref.delete_node(sel);
        fillLayerSelect();
        // after remove disable 'remove' button
        $('#removenode').prop('disabled', true);
  		}
      if (ref.get_type(sel) === 'group') {
        new Confirmation({
          message: function(){ return i18n('collections.confirmation.delete.message.groups') + ': ' + sel.text; },
          title: function(){ return i18n('collections.confirmation.delete.title'); },
          cancelText: function(){ return i18n('collections.confirmation.delete.cancel'); },
          okText: function(){ return i18n('collections.confirmation.delete.ok'); },
          // whether the button should be green or red
          success: false,
          // which button to autofocus, 'cancel' (default) or 'ok', or 'none'
          focus: 'ok'
        }, function (ok) {
          // ok is true if the user clicked on 'ok', false otherwise
          if (ok){
            ref.delete_node([sel]);
            fillLayerSelect();
            // after remove disable 'rename/remove/creategroup' buttons 
            $('#renamenode').prop('disabled', true);
            $('#removenode').prop('disabled', true);
            $('#creategroup').prop('disabled', true);
          }
        });
      }
		});
	}

});

Template.map.rendered = function() {
	var mapId = Session.get('selectedMapId');
	var map;
	if (mapId) {
		map = Maps.find({
			_id : mapId
		}).fetch()[0];
		map.a_attr = {
			class : 'no_checkbox'
		};
		map.state = {
			'selected': true
		};
	} else {
		map = {
			text : 'Nieuwe kaart',
			type : 'map',
			'children' : [],
			'a_attr' : {
				class : 'no_checkbox'
			},
			state: {
				'selected': true 
			}
		};
	}
	
	$('#maptree').jstree({
		'core' : {
			'data' : [ map ],
			check_callback : true
		},
		types : {
			'#' : {
				'max_children' : 1,
				'max_depth' : MAX_TREE_DEPTH,
				'valid_children' : [ 'map' ]
			},
			map : {
				'icon' : 'glyphicon glyphicon-tree-deciduous',
				'valid_children' : [ 'group', 'layer' ]
			},
			group : {
				'icon' : 'glyphicon glyphicon-duplicate',
				'valid_children' : [ 'group', 'layer' ]
			},
			layer : {
				'icon' : 'glyphicon glyphicon-file',
				'valid_children' : [ 'servicelayer' ]
			},
			servicelayer : {
				'icon' : 'null',
				'valid_children' : []
			}
		},
		checkbox : {
			three_state: false,
			tie_selection: false,
			whole_node : false
		},
		plugins : [ 'checkbox','dnd','types']

	})
	
	.on('loaded.jstree', function() {
		$('#maptree').jstree('open_all');
		$('.jstree-checkbox').attr('title', i18n('tooltips.maps.jstree.check'));
		fillLayerSelect();
	})
	
  .on('move_node.jstree', function(e, data) {
    $('#maptree').jstree('open_node',data.parent);
  });
  
  // disable renamenode/removenode buttons by default
	$('#renamenode').prop('disabled', true);
	$('#removenode').prop('disabled', true);  
};

AutoForm.addHooks('mapForm',{
	before : {
		
		// Voeg de children uit de jstree toe aan het doc
		// object, voordat deze wordt
		// weggeschreven naar de database
		update : function(doc) {
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
	onSuccess : function() {
		// Stuur een refresh request naar de viewer en ga naar
		// de list
		Meteor.call('triggerViewerReload', function(lError,
				lResponse) {
			if (lError) {
				Modal.show('alert-geoide-viewer-refresh');
        Router.go('maps.list');
			} else {
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode !== '200' ){
          Modal.show('alert-geoide-viewer-refresh');
        }
			  Router.go('maps.list');
			}
		});
	},

	onError : function(formType, error) {
		console.log('map autoform error = ' + error);
	}
});

/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import {Template} from 'meteor/templating';
import {Router} from 'meteor/iron:router';
import {Session} from 'meteor/session';
import {Maps, MapSchema} from '/imports/api/collections/maps.js';
import {Layers} from '/imports/api/collections/layers.js';

import './map.html';
import '../i18n/maps/help.html';
import '../i18n/alerts/geoide-viewer.html';

/**
 * Constant defining the maximum depth of a map tree.
 * Example:
 *       Item:                      Level:
 * map                                1
 *  |-- group1                        2
 *  |     |-- group1.1                3
 *  |           |-- layer1.1.1        4
 *  |-- group2                        2
 *  !-- layer3                        2
 */
const MAX_TREE_DEPTH = 4;

Template.map.helpers({
  /**
   * Map collection
   * 
   * called in autoform
   */
  maps : function() {
    return Maps;
  },
  /**
   * Map schema
   * 
   * called in autoform
   */
  mapSchema : function() {
    return MapSchema;
  },
  
  /**
   * Called in autoform type to determine if this is an insert or update form.
   * Depends on Session object.
   * @return {string} 'update' or 'insert'
   */
  formType : function() {
    if (Session.get('selectedMapId')) {
      return 'update';
    } else {
      return 'insert';
    }
  },
  
  /**
   * Called in autoform doc to find the right Map object for the form
   * Depends on Session object.
   * @return {object} map that was previously selected or null if new map is started
   */
  mapDoc : function() {
    if (Session.get('selectedMapId')) {
      return this;
    } else {
      return null;
    }
  }

});

/**
 * Check whether a layer exists in the map hierarchy.
 * Calls itself recursively if needed.
 * 
 * @param {array} children array from where the search will start
 * @param {string} id of the layer to be found
 * @return true if layer was found, false otherwise 
 */
const layerInTree = function(children, layerId) {
  for (let j = 0; j < children.length; j++) {
    if (children[j].children[0]) {
      if (layerInTree(children[j].children, layerId)) {
        return true;
      }
    } else if (children[j].data.layerid === layerId) {
      return true;
    } else {
      // nothing to do
    }
  }
  return false;
};

/**
 * Fill the select box that shows available layers not already used in the map.
 * If the select box is empty (no options), then disable the 'create layer' button.
 */
const fillLayerSelect = function() {
  const layers = Layers.find({}, {
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
  
  let layerOption = null;
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
  } else {
    $('#createlayer').prop('disabled', true);
  }
};

Template.map.events({
  
  /**
   * Return to the map list, when the cancel button has been pressed
   */
  'click #return' : function() {
    Router.go('maps.list');
  },

  /**
   * Show help pop-up
   */
  'click #help' : function() {
    // peppelg:bootstrap-3-modal
    Modal.show(i18n('maps.help.template'));
  },

  /**
   * Enable and disable buttons, depending on where in the map tree the user has clicked.
   */
  'click .jstree' : function() {
    // check which buttons to disable/enable, 
    // depending on what is selected in the tree
    const ref = $.jstree.reference('#maptree');
    const sel = ref.get_selected();
    if (sel){
      // check if select list contains anything
      const $numberOfOptions = $('#layerselect').find('option').length;
      const $renamenode  = $('#renamenode');
      const $removenode  = $('#removenode');
      const $creategroup = $('#creategroup');
      const $createlayer  = $('#createlayer');
      if (ref.get_type(sel) === 'group') {
//      enable $renamenode/removenode/creategroup
        $renamenode.prop('disabled', false);
        $removenode.prop('disabled', false);
        $creategroup.prop('disabled', false);
        if ($numberOfOptions > 0){
          $createlayer.prop('disabled', false);
        }
        const depth = ref.get_selected(true)[0].parents.length;
        // max depth does not allow another group or layer to be added
        if (depth === MAX_TREE_DEPTH){
          $createlayer.prop('disabled', true);
          $creategroup.prop('disabled', true);
        }
        // (max depth - 1) does not allow another group to be added
        if (depth === (MAX_TREE_DEPTH - 1)){
          $creategroup.prop('disabled', true);
        }
      } else if (ref.get_type(sel) === 'layer') {
//      disable $renamenode/creategroup/createlayer, enable $removenode
        $renamenode.prop('disabled', true);
        $removenode.prop('disabled', false);
        $creategroup.prop('disabled', true);
        $createlayer.prop('disabled', true);
      } else {
        // top node 'map' is selected
//      disable $renamenode/removenode, enable $creategroup
        $renamenode.prop('disabled', true);
        $removenode.prop('disabled', true);        
        $creategroup.prop('disabled', false);
        if ($numberOfOptions > 0){
          $createlayer.prop('disabled', false);
        }
      }
    }
  },

  /**
   * Add a new layer to the map (tree),
   * when the create layer button has been pressed.
   * 
   * Fill the layer select box with available layers.
   */
  'click #createlayer' : function() {

    const ref = $.jstree.reference('#maptree'); 
    const sel = ref.get_top_selected();

    if (!sel) {
      return false;
    }

    const layerLabel = $('#layerselect').find('option:selected').text();
    if (layerLabel){
      const layerId = $('#layerselect').find('option:selected').val();
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
    const ref = $.jstree.reference('#maptree');
    let sel = ref.get_top_selected();

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

  /**
   * Enable renaming of a tree node only when it is of type 'group'.
   */
  'click #renamenode' : function() {  
    const ref = $.jstree.reference('#maptree');
    let sel = ref.get_selected();
    if (!sel.length || ref.get_type(sel) === 'map'
        || ref.get_type(sel) === 'layer') {
      return false;
    }
    sel = sel[0];
    ref.edit(sel);
    // after rename disable 'rename group' button 
    $('#renamenode').prop('disabled', true);
  },

  /**
   * Remove selected node(s) from the tree when it is of type 'layer' or 'group'.
   * 
   * Layers of type 'cosurvey-sql' can only be removed by administrator.
   * When a group is about to be removed, show a confirmation pop-up.
   * 
   * Repopulate the layer select box and disable appropriate buttons.
   * 
   */
  'click #removenode' : function() {
    const ref = $.jstree.reference('#maptree');
    const selObjects = ref.get_selected(true);
    let okToRemove = true;
    _.each(selObjects, function(sel){
      if (ref.get_type(sel) === 'map') {
        okToRemove = false;
      }
      if (ref.get_type(sel) === 'layer') {
        const lyr = Layers.findOne({_id : sel.data.layerid});
        if ((lyr) && (Meteor.user())) {
          // a user is logged in
          const name = Meteor.user().username;
          const adminLoggedIn = _.isEqual(name, 'idgis-admin');
          if (!adminLoggedIn && (lyr.type === 'cosurvey-sql')) {
            okToRemove = false;
          }
        } else {
          okToRemove = false;
        }
        if (okToRemove === true){
          ref.delete_node(sel);
          fillLayerSelect();
          // after remove disable 'remove' button
          $('#removenode').prop('disabled', true);
        }
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

/**
 * Define and render a new map tree component.
 * 
 * See for definitions and use package: jss:jstree
 */
Template.map.rendered = function() {
  const mapId = Session.get('selectedMapId');
  let map;
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

/**
 * Add autoform action for insert and update.
 */
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
    Meteor.call('triggerViewerReload', function(lError,
        lResponse) {
      if (lError) {
        Modal.show('alert-geoide-viewer-refresh');
        Router.go('maps.list');
      } else {
        // check op bepaalde inhoud van response of refresh gelukt is
        if (lResponse.statusCode !== 200 ){
          Modal.show('alert-geoide-viewer-refresh');
        }
        Router.go('maps.list');
      }
    });
  }

});

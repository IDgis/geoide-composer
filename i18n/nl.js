i18n.map('nl', {
  // GUI
  main : {
    title : 'Geoide Admin',
    menu  : {
      services: 'Services',
      layers: 'Lagen',
      maps: 'Kaarten',
      i18n: 'i18n - test',
      jsonapi: {
        services: 'jsonapi - services',
        layers: 'jsonapi - layers',
        maps: 'jsonapi - maps',
      },
      xmlapi: 'xmlapi - test',
    },
    messages : 'meldingen'
  },
  
  services:{
    
  },
  
  layers: {
    
  },
  
  maps: {
    
  },
  
//Collections
	collections : {
		layers : {
			name : {
				label : 'Naam',
			},
			type : {
				label : 'Type',
			},
			service_layers : {
				label : 'Servicelagen',
			},
			properties : {
				label : 'Eigenschappen',
				initial_visible : {
					label : 'Initieel zichtbaar',
				},
				initial_query : {
					label : 'Initiële query',
				},
				applayer : {
					label : 'CRS2 laag',
				},
			},
			service_layer : {
				name : {
					label : 'Naam',
				},
				service : {
					label : 'Service',
				},
				nameInService : {
					label : 'Servicelaagnaam',
				},
				wfs_service : {
					label : 'WFS service',
				},
				featureTypes : {
					label : 'WFS Featuretypes'
				},
				featureType : {
					name : {
						label : 'Naam',
					},
					service : {
						label : 'Service',
					},
					nameInService : {
						label : 'FeatureType naam'
					},
					searchTemplates : {
						label : 'Zoekingangen'
					},
					searchTemplate : {
						label : {
							label : 'Label',
						},
						attribute_localname : {
							label : 'Zoekveld',
						},
						attribute_namespace : {
							label : 'Namespace',
						},
					},
				},
			},
		},
		maps: {
			name: {
				label: "Kaartnaam",
			},
			initial_extent: {
				label: "Initiële kaartuitsnede",
				minX: {
					label: "min X",
				},
				minY: {
					label: "min Y",
				},
				maxX: {
					label: "max X",
				},
				maxY: {
					label: "max Y"
				},
			},
			
		},
	},

  // Generiek
  version: 'versie',

// test i18n  
  heading1 : 'Hoofdstuk 1',
  heading2 : {
    main : 'hoofdstuk 2',
    sub : 'deel 2',
  }
  
});
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
        layers: 'jsonapi - lagen',
        maps: 'jsonapi - kaarten',
      },
      jsonGvApi: {
        services: 'jsonapi GV - Services',
        layers: 'jsonapi GV - Lagen',
        maps: 'jsonapi GV - Kaarten',
        featuretypes: 'jsonapi GV - Feaure Types',
        searchtemplates: 'jsonapi GV - Search Templates',
        servicelayers: 'jsonapi GV - Service Layers',
      },
      xmlapi: 'xmlapi - test',
      getcaplayersapi: 'getcaplayersapi - test',
    },
    messages : 'meldingen'
  },
  
  services:{
    autoform: {
      header:'Service configuratie',
    },
    
  },
  
  layers: {
    autoform: {
      header:'Laag configuratie',
    },
  },
  
  maps: {
    autoform: {
      header:'Kaart configuratie',
    },

  },
  
//Collections
	collections : {
    services : {
      name : {
        label : 'Naam',
      },
      endpoint : {
        label : 'Url',
      },
      type : {
        label : 'Type',
      },
      version : {
        label : 'Versie',
      },
    },
    layers : {
			name : {
				label : 'Naam',
			},
			type : {
				label : 'Type',
			},
			serviceLayers : {
				label : 'Servicelagen',
			},
			properties : {
				label : 'Eigenschappen',
				initialVisible : {
					label : 'Initieel zichtbaar',
				},
				initialQuery : {
					label : 'Initiële query',
				},
				applayer : {
					label : 'CRS2 laag',
				},
			},
			serviceLayer : {
				name : {
					label : 'Naam',
				},
				service : {
					label : 'Service',
				},
				selectButton: {
				  label: 'Voeg servicelagen toe:',
				},
				nameInService : {
					label : 'Service laagnaam',
				},
				wfsService : {
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
	        selectButton: {
	          label: 'Voeg featuretypen toe:',
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
						attributeLocalname : {
							label : 'Zoekveld',
						},
						attributeNamespace : {
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
			initialExtent: {
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
  button: {
    save: 'Opslaan',
    cancel:'Annuleren'
  },

// test i18n  
  heading1 : 'Hoofdstuk 1',
  heading2 : {
    main : 'hoofdstuk 2',
    sub : 'deel 2',
  }
  
});
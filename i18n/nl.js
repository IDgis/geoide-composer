i18n.map('nl', {
  // GUI
  main : {
    title : 'Geoide Admin',
    menu  : {
      services: 'Services',
      layers: 'Lagen',
      maps: 'Kaarten',
      users: 'Gebruikers',
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
    messages : 'meldingen',
    loggedin : 'Ingelogd als: ',
    notloggedin : 'Niet ingelogd',
    home:{
      header: "Home",
      content: {
        heading: "Geoide Admin",
        sub: "De Geoide viewer verzamelt gegevens uit verschillende bronnen om ze in een kaartbeeld weer te geven. Voor het samenstellen van zo'n kaartbeeld in de viewer is Geoide-Admin ontwikkeld.", 
        list:{
          heading: "Stappen", 
          item1: {
            head: "1. Inloggen",
            text: "Als u nog niet bent ingelogd, kunt u de services, lagen en kaarten wel bekijken, maar niet configureren. Log daarom eerst in met uw gebruikersnaam en wachtwoord.",
          },
          item2: {
            head: "2. Services",
            text: "Na het inloggen moet als eerste één of meer services worden geconfigureerd. Door een service te configureren heeft Geoide een bron om gegevens vandaan te halen. De bron kan een WMS, WFS of TMS zijn.",
          },
          item3: {
            head: "3. Lagen",
            text: "Op basis van een WMS of TMS service configureert u lagen voor de vieer, door servicelagen uit de service te kiezen en daar een FeatureType uit een WFS aan te koppelen.",
          },
          item4: {
            head: "4. Kaarten",
            text: "Tenslotte configureert u een kaart door lagen te kiezen en de ordenen.",
          },
        },
      },
    },
  },
  
  services:{
    list: {
      header: 'Services',
      table: {
        name: 'Naam',
        label: 'Label',
        type: 'Type',
        version: 'Versie',
      },
      button: {
        create: 'Maak een nieuwe service'
      },
    },
    autoform: {
      header:'Service configuratie',
    },
    help:{
      template: "help-services-nl",
    },
  },
  
  layers: {
    list: {
      header: 'Lagen',
      table: {
        name: 'Naam',
        label: 'Label',
        type: 'Type',
        visible: 'Zichtbaar'
      },
      button: {
        create: 'Maak een nieuwe laag'
      },
    },
    autoform: {
      header:'Laag configuratie',
    },
    help:{
      template: "help-layers-nl",
    },
  },
  
  maps: {
    list: {
      header: 'Kaarten',
      table: {
        name: 'Naam',
        label: 'Label',
        layers: 'Hoofdlagen',
      },
      button: {
        create: 'Maak een nieuwe kaart'
      },
    },
    autoform: {
      header: 'Kaart configuratie',
      layerselect: 'Kies een laag',
      createlayer: 'Nieuwe laag +',
      creategroup: 'Nieuwe groep +',
      renamenode: 'Hernoem laag/groep',
      removenode: 'Verwijder laag/groep X',
    },
    tree: {
      search : {
        placeholder : 'Zoek'
      },
      label: 'Kaart'
    },
    help:{
      template: "help-maps-nl",
    },
  },

  users:{
    list: {
      header: 'Gebruikers',
      table: {
        name: 'Naam',
        role: 'Rol',
      },
      button: {
        create: 'Maak een nieuwe gebruiker'
      },
    },
    autoform: {
      header:'Gebruiker configuratie',
    },
    
  },
  
  //Tooltips
  tooltips:{
    main: {      
      login: "Log in",
      menu: {
        services: "Maak en beheer services",
        layers: "Maak en beheer lagen",
        kaart: "Maak en beheer kaarten"
      },
      
    },
    layers:{
      list:{
        button: {
          create: "Maak een nieuwe laag aan",
          edit: "Wijzig een laag",
          remove: "Verwijder een laag",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de service",
          label: "Geef een omschrijving van de service (wordt getoond in de viewer)",
          type: "Het type van deze laag",
          properties: {
            main: "Eigenschappen van de laag",
            initialVisible: "Is de laag initieel (on)zichtbaar",
            appLayer: "Is de laag een CRS2 laag",
            initialQuery: "De sql query voor deze laag indien van type 'cosurvey-sql'",
          },
          serviceLayers: {
            main: "Service lagen",
            label: "Geef een omschrijving",
            service: "Kies de WMS of TMS service",
            nameInService: "Kies de service laag",
            featureType: "Het featuretype bij deze laag",
            legendGraphic: "De legenda bij deze laag, kan worden vervangen door een eigen legenda afbeelding",
          },
          featureType: {
            label: "Geef een omschrijving",
            service: "Kies de WFS service",
            nameInWfsService: "Kies het service feature type",
            searchTemplates: "Zoekingangen voor velden van het feature type",
            
          },
          searchTemplate: {
            label: "Geef een omschrijving",
            attributeLocalname: "Veld van het feature type",
            attributeNamespace: "Namespace van het feature type (wordt automatisch gevuld)",
          }
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
        },
      },
    },
    services: {
      list:{
        button: {
          create: "Maak een nieuwe service aan",
          edit: "Wijzig een service",
          remove: "Verwijder een service",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de service",
          label: "Geef een omschrijving van de service (wordt getoond in de viewer)",
          endpoint: "Geef de basis url van de service, afgesloten met een '?'",
          type: "Kies het service type",
          version: "Kies de versie van de service",
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
        },
      },
    },
    maps: {
      list:{
        button: {
          create: "Maak een nieuwe kaart aan",
          edit: "Wijzig een kaart",
          remove: "Verwijder een kaart",
        }
      },
      autoform: {
        fields: {
          name: "Geef een (unieke) naam aan de kaart",
          label: "Geef een omschrijving  (wordt getoond in de viewer)",
          initial_visible : "Maak een laag of groep initieel (on)zichtbaar ",
          initial_extent: {
            label: "Bounding box van de kaart",
            minx: "minimum waarde van x",
            miny: "minimum waarde van y",
            maxx: "maximum waarde van x",
            maxy: "maximum waarde van y",
          },
        },
        createlayer: 'Nieuwe laag +',
        creategroup: 'Nieuwe groep +',
        renamenode: 'Hernoem groep',
        removenode: 'Verwijder laag/groep X',
      },
      jstree: {
        main: "Verander volgorde door slepen en neerzetten",
        select: "Selecteer een laag",
        search: "Zoek op (groeps)laag naam",
        button: {
          save: 'Opslaan',
          cancel:'Annuleren'
        },
      },
    },
  },
  
//Collections
	collections : {
    services : {
      name : {
        label : 'Naam',
      },
      label : {
        label : 'Label',
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
      label : {
        label : 'Label',
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
					label : 'Initiëel zichtbaar',
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
	      label : {
	        label : 'Label',
	      },
				service : {
					label : 'Service',
				},
				nameInService : {
					label : 'Service laagnaam',
				},
				wfsService : {
					label : 'WFS service',
				},
				legendGraphic : {
          label : 'Legend Graphic'
        },
        featureTypes : {
          label : 'WFS Featuretypes'
        },
				featureType : {
		      name : {
		        label : 'Naam',
		      },
		      label : {
		        label : 'Label',
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
      name : {
        label : 'Naam',
      },
      label : {
        label: "Label",
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
    users: {
      name : {
        label : 'Naam',
      },
      role : {
        label: "Rol",
      },
    },
    confirmation: {
      "delete" :{
        title: "Verwijderen",
        cancel: "Annuleren",
        ok: "OK",
        message: {
          services: "Wilt u deze service verwijderen?",
          layers: "Wilt u deze laag verwijderen?",
          maps: "Wilt u deze kaart verwijderen?",
        },
      },
    },
  },



  // Generiek
  version: 'versie',
  button: {
    save: 'Opslaan',
    cancel:'Annuleren',
    help: "Help",
    close: "Sluiten",
  },
  yes: 'Ja',
  no: 'Nee',
  
});
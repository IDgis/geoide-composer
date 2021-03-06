﻿i18n.map('nl', {
  // GUI
  main : {
    title : 'Geoide Composer',
    menu  : {
      home: 'Home',
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
      template: "home-nl",
    },
  },

  services:{
    list: {
      header: 'Services',
      table: {
        name: 'Naam',
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
        crs: 'CRS',
        layers: 'Hoofdlagen',
      },
      button: {
        create: 'Maak een nieuwe kaart'
      },
    },
    autoform: {
      header: 'Kaart configuratie',
      layerselect: 'Kies een laag',
      createlayer: 'Laag toevoegen +',
      creategroup: 'Nieuwe groep +',
      renamenode: 'Hernoem groep',
      removenode: 'Verwijder laag/groep X',
    },
    tree: {
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
    	home: "Keer terug naar de start pagina",
        services: "Maak en beheer services",
        layers: "Maak en beheer lagen",
        maps: "Maak en beheer kaarten"
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
          name: "Geef een (unieke) naam aan de laag",
          label: "Geef de titel van de laag waarmee deze getoond moet worden in de viewer",
          type: "Het type van deze laag, bij type=sql kan de initiële query worden ingevuld.",
          properties: {
            main: "Eigenschappen van de laag",
            initialQuery: "De sql query voor deze laag indien van type 'sql'",
          },
          serviceLayers: {
            main: "Servicelagen",
            service: "Kies de WMS of TMS service",
            nameInService: "Kies laag van de WMS / TMS",
            metadataURL: "Geef de URL naar een pagina met metadata van deze laag",
            featureType: "Het featuretype bij deze laag",
            legendGraphic: "De legenda bij deze laag, kan worden vervangen door een eigen legenda afbeelding",
          },
          featureType: {
            label: "Geef de titel van het featuretype",
            service: "Kies de WFS service",
            nameInWfsService: "Kies het featuretype van de WFS",
            searchTemplates: "Zoekingangen voor velden van het featuretype",

          },
          searchTemplate: {
            label: "Geef een label op waarmee deze eigenschap getoond moet worden in een viewer",
            attributeLocalname: "Veld van het featuretype",
            enableSearch: "Geeft aan of op deze eigenschap gezocht mag worden",
            enableInfo: "Geeft aan of de waarde van deze eigenschap getoond mag worden in een informatievenster",
            attributeNamespace: "Namespace van het featuretype (wordt automatisch gevuld)",
          }
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
          control:'Controleren',
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
          endpoint: "Geef de basis url van de service, afgesloten met of zonder een '?'",
          type: "Kies het service type",
          version: "Kies de versie van de service, controleer eventueel of de gekozen versie door de service wordt ondersteund.",
          inverty: "Y-as omdraaien?",
          printFormat: "Kies een print formaat uit de lijst, svg geeft de beste kwaliteit",
          tmsFormat: "Kies een formaat uit de lijst, png is de standaard, jpeg voor luchtfoto's",
        },
        button: {
          save: 'Opslaan',
          cancel:'Annuleren',
          control: 'Opvragen capabilities',
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
          label: "Geef de titel waarmee de kaart in de viewer getoond moet worden.",
          initial_visible : "Maak een laag of groep initieel (on)zichtbaar ",
          crs: 'Selecteer een projectie voor de kaart',
          initial_extent: {
            label: "Omgrenzende rechthoek / extent van de kaart in RD coördinaten",
            minx: "minimum waarde van x",
            miny: "minimum waarde van y",
            maxx: "maximum waarde van x",
            maxy: "maximum waarde van y",
          },
        },
        createlayer: 'Voeg de gekozen laag toe aan de kaart',
        creategroup: 'Voeg een nieuwe groep toe aan de kaart',
        renamenode: 'Hernoem een groep',
        removenode: 'Verwijder laag of groep uit de kaart',
      },
      jstree: {
        main: "Verander de volgorde van groepen en lagen door slepen en neerzetten",
        check: "Verander de initiële zichtbaarheid van een laag in de viewer",
        select: "Selecteer een laag",
        button: {
          save: 'Opslaan',
          cancel:'Annuleren'
        },
      },
    },
    legendgraphic: {
      button: {
        remove: "Verwijder een legenda plaatje",
      },
      notFound: 'Niet gevonden',
    },
  },

//Collections
	collections : {
	  firstOption: '(Selecteer)',
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
      inverty : {
        label : 'Y-as omkeren',
      },
      printFormat : {
        label : 'Print formaat',
      },
      tmsFormat : {
        label : 'Tile type',
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
			  label: 'Eigenschappen',
				initialQuery : {
					label : 'Initiële query',
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
        metadataURL : {
          label : 'Metadata URL'
        },
				wfsService : {
					label : 'WFS service',
        },
        minZoom : {
          label: 'Minimaal zoomniveau',
        },
        maxZoom : {
          label : 'Maximaal zoomniveau',
        },
				legendGraphic : {
          label : 'Legenda plaatje'
        },
        featureTypes : {
          label : 'Feature types'
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
						label : 'FeatureType'
					},
					searchTemplates : {
						label : 'Properties'
					},
					searchTemplate : {
						label : {
							label : 'Label',
						},
						attributeLocalname : {
							label : 'Property',
						},
						attributeNamespace : {
							label : 'Namespace',
						},
						enableSearch : {
							label : 'Zoeken',
						},
						enableInfo : {
							label : 'Info',
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
      crs: {
        label: "Kies een CRS",
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
          groups: "Wilt u deze groep verwijderen?",
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
    remove: "Verwijder",
    control: "Controleren",
  },
  viewerRefresh: {
   alert : {
     title: 'Sturen van configuratie naar Geoide viewer',
     message: 'Pas op: de Geoide viewer heeft de aanpassingen mogelijk niet verwerkt',
     ok: 'OK'
   }
  },
  yes: 'Ja',
  no: 'Nee',
  notFound: 'Niet gevonden',
  scale: '1:',
});

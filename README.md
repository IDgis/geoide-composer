# meteor-js-autoform-tutorial
Based on the project by Web Tempest

A simple example of how to use meteor autoform with collection 2

Link to tutorial http://www.webtempest.com/meteor-js-autoform-tutorial

Main change: I use "Items" instead of "Posts" for the main collection in the tutorial and I changed the field names.


##RS:

* doc=this has to be added to the update autoform
* meteor remove accounts-google
* meteor add accounts-password
* meteor add msavin:mongol (ctrl-m to get a mongo db popup)

##TODO
* layout in main.html
* routing
* structuur opzet
* items > services
* related collections e.g. services < > layers
* remove user login
* central mongo db (e.g. seine:4000)
* 

## structure
### old
* both
  * collections 
      * items.js (schema)
  * router.js (Iron router code )
* client/
  * autoformHooks/
    * items.js
  * item.html  (edit form, update)
  * items.html  (add form, insert)
  * items.js  (template helper for edit form)
  * main.html  (main entrance)
  
### new
* both
  * collections 
      * service.js (schema)
  * router.js (Iron router code )

  
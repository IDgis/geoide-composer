# meteor-js-autoform-tutorial
Based on the project by Web Tempest

A simple example of how to use meteor autoform with collection 2

Link to tutorial http://www.webtempest.com/meteor-js-autoform-tutorial

Main change: I use "Items" instead of "Posts" for the main collection in the tutorial and I changed the field names.


## remarks for autoform example used:

* doc=this has to be added to the update autoform
* meteor remove accounts-google
* meteor add accounts-password
* meteor add msavin:mongol (ctrl-m to get a mongo db popup)
  
## i18n

### package anti:i18n   
 "meteor add anti:i18n"   
 
#### voorbeelden

##### taal bestanden
	     |-- lib\ 
	          |
	          |-- i18n\ 
	                 |
	                 |  en.js 
	                 |  nl.js
voor nl:    
i18n.map('nl', {   
  sleutel: 'waarde',
  **main**: 'Menu en logo',    
  },   
});   
  
voor en:    
i18n.map('en', {   
  key: 'value',
  **main**: 'Menu and Logo',    
  },   
});   
  
  
##### gebruik in html

Blaze functie {{i18n 'key'}}   

<template name="main">   
	<h1>{{i18n '**main**'}}</h1>   
	.....

##### gebruik in javascript

functie i18n('key');   

console.log('main: ' + i18n('**main**'));     


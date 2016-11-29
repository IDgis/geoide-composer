/*
 * Geoide Composer, configuration tool for Geoide Viewer 
 * Copyright (C) 2016 IDgis
 * See license: 
 * https://github.com/IDgis/geoide-admin/blob/master/LICENSE
*/

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * i18n Dutch text for standard SimpleSchema messages
 * 
 * These texts should eventually go to /i18n/LANG.js files to make this file proper i18n.
 */

SimpleSchema.messages({
  required: '[label] is verplicht',
  minString: '[label] moet tenminste [min] karakters bevatten',
  maxString: '[label] mag niet meer dan [max] karakters bevatten',
  minNumber: '[label] moet minimaal [min] zijn',
  maxNumber: '[label] mzg niet groter dan [max] zijn',
  minDate: '[label] moet op of voor [min] zijn',
  maxDate: '[label] kan niet later dan [max] zijn',
  badDate: '[label] is geen valide datum',
  minCount: 'U moet minstens [minCount] waarden opgeven',
  maxCount: 'U kunt niet meer dan [maxCount] waarden opgeven',
  noDecimal: '[label] moet een integer zijn',
  notAllowed: '[value] is geen toegestane waarde',
  expectedString: '[label] moet een string zijn',
  expectedNumber: '[label] moet een getal zijn',
  expectedBoolean: '[label] moet een boolean zijn',
  expectedArray: '[label] moet een array zijn',
  expectedObject: '[label] moet een object zijn',
  expectedConstructor: '[label] moet van type [type] zijn',
  regEx: [
    {exp: /^([a-zA-Z0-9_\-]+)$/, msg: "[label] mag alleen cijfers, letters, '_' of '-' bevatten (geen spaties)"},
    {exp: /^((http:|https:)\/\/[a-zA-Z0-9\.-]{2,}(:[0-9]{2,5})?(\/)(([a-zA-Z0-9_\-@:]+)(\/|\.)?){1,}([a-zA-Z0-9_\-@:]+)([\?]{0,1}))$/, msg: '[label] is geen valide service url (voorbeeld: http://host:8080/services-global/wms?)'},
    {exp: SimpleSchema.RegEx.Email, msg: '[label] moet een valide e-mail adres zijn'},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: '[label] moet een valide e-mail adres zijn'},
    {exp: SimpleSchema.RegEx.Domain, msg: '[label] moet een valide domein zijn'},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: '[label] moet een valide domein zijn'},
    {exp: SimpleSchema.RegEx.IP, msg: '[label] moet een valide IPv4 or IPv6 adres zijn'},
    {exp: SimpleSchema.RegEx.IPv4, msg: '[label] moet een valide IPv4 adres zijn'},
    {exp: SimpleSchema.RegEx.IPv6, msg: '[label] moet een valide IPv6 adres zijn'},
    {exp: SimpleSchema.RegEx.Url, msg: '[label] moet een valide URL zijn'},
    {exp: SimpleSchema.RegEx.Id, msg: '[label] moet een valide alphanumeriek ID zijn'}
  ],
  keyNotInSchema: '[key] is niet toegestaan door het schema'
});

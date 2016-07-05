import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// TODO make this i18n
SimpleSchema.messages({
  required: "[label] is verplicht",
  minString: "[label] moet tenminste [min] karakters bevatten",
  maxString: "[label] mag niet meer dan [max] karakters bevatten",
  minNumber: "[label] moet minimaal [min] zijn",
  maxNumber: "[label] mzg niet groter dan [max] zijn",
  minDate: "[label] moet op of voor [min] zijn",
  maxDate: "[label] kan niet later dan [max] zijn",
  badDate: "[label] is geen valide datum",
  minCount: "U moet minstens [minCount] waarden opgeven",
  maxCount: "U kunt niet meer dan [maxCount] waarden opgeven",
  noDecimal: "[label] moet een integer zijn",
  notAllowed: "[value] is geen toegestane waarde",
  expectedString: "[label] moet een string zijn",
  expectedNumber: "[label] moet een getal zijn",
  expectedBoolean: "[label] moet een boolean zijn",
  expectedArray: "[label] moet een array zijn",
  expectedObject: "[label] moet een object zijn",
  expectedConstructor: "[label] moet van type [type] zijn",
  regEx: [
    {msg: "[label] geen geldige reguliere expressie"},
    {exp: SimpleSchema.RegEx.Email, msg: "[label] moet een valide e-mail adres zijn"},
    {exp: SimpleSchema.RegEx.WeakEmail, msg: "[label] moet een valide e-mail adres zijn"},
    {exp: SimpleSchema.RegEx.Domain, msg: "[label] moet een valide domein zijn"},
    {exp: SimpleSchema.RegEx.WeakDomain, msg: "[label] moet een valide domein zijn"},
    {exp: SimpleSchema.RegEx.IP, msg: "[label] moet een valide IPv4 or IPv6 adres zijn"},
    {exp: SimpleSchema.RegEx.IPv4, msg: "[label] moet een valide IPv4 adres zijn"},
    {exp: SimpleSchema.RegEx.IPv6, msg: "[label] moet een valide IPv6 adres zijn"},
    {exp: SimpleSchema.RegEx.Url, msg: "[label] moet een valide URL zijn"},
    {exp: SimpleSchema.RegEx.Id, msg: "[label] moet een valide alphanumeriek ID zijn"}
  ],
  keyNotInSchema: "[key] is niet toegestaan door het schema"
});
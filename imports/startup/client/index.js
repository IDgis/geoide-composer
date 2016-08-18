import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import './startup.js';
import './i18n/messages.js';
import './router.js';
// TODO remove for production
SimpleSchema.debug = true;
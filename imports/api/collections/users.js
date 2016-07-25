 import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const UserSchema = new SimpleSchema({
    username: {
      type: String,
      regEx: /^[a-z0-9A-Z_]{3,15}$/,
      label: function(){ return i18n('collections.users.name.label'); },
    },
    role:{
      type: String,
      optional: false,
      allowedValues: ['idgis-admin', 'crs-beheerder'],
      label: function(){ return i18n('collections.users.role.label'); },
      autoform: {
        type: 'select-radio-inline',
      },
    }
});


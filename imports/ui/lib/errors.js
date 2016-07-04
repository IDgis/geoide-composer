import { i18n } from 'meteor/anti:i18n';

export const displayError = (error) => {
  if (error) {
    // It would be better to not alert the error here but inform the user in some
    // more subtle way
    alert(i18n(error.error)); // eslint-disable-line no-alert
  }
};

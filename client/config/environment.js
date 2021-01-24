'use strict';

module.exports = function(environment) {
  let ENV = {
    // I still haven't figured out a way to make this work on mobile besides
    // just updating the entry to whatever my ip gets assinged to :shrug:.
    host: 'http://192.168.86.216:8000',
    modulePrefix: 'client',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
    ENV.host = 'http://cornmountain.com:8000';
  }

  ENV['ember-simple-auth-token'] = {
    serverTokenEndpoint: ENV.host + '/api-auth-token/',
    identificationField: 'username',
    passwordField: 'password',
    tokenPropertyName: 'token',
    authorizationHeaderName: 'Authorization',
    authorizationPrefix: 'Bearer ',
  };

  ENV['ember-toastr'] = {
    toastrOptions: {
      toastClass: 'alert'
    }
  }

  return ENV;
};

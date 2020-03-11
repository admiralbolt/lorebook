import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

let HIDE_SIDEBAR_ROUTES = ['login', 'world'];

export default Controller.extend({
  session: service('session'),
  api_data: service('api-data'),
  router: service('router'),

  menu: alias('api_data.menuItems'),

  displayMenu: computed('router.currentRouteName', function() {
    return !HIDE_SIDEBAR_ROUTES.includes(this.router.currentRouteName);
  }),

  pathChanged: function() {
    window.scrollTo(0, 0);
  }.observes('router.currentURL')
});

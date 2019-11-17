import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

let HIDE_SIDEBAR_ROUTES = ['login', 'world'];

export default Controller.extend({
  session: service('session'),
  api_data: service('api-data'),
  router: service('router'),

  menu: computed('api_data.menuItems.@each.name', function() {
    return this.get('api_data.menuItems').sortBy('name');
  }),

  displayMenu: computed('router.currentRouteName', function() {
    return !HIDE_SIDEBAR_ROUTES.includes(this.router.currentRouteName);
  })
});

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('session');
  },

  model(route_params) {
    const api_data = this.get('store');
    let session = api_data.peekRecord('session', route_params.id);
    return session === null ? api_data.findRecord('session', route_params.id) : session;
  },

  actions: {
    error() {
      this.transitionTo('sessions');
    }
  }
});

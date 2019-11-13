import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('place');
  },

  model(route_params) {
    const api_data = this.get('store');
    let place = api_data.peekRecord('place', route_params.id);
    return place === null ? api_data.findRecord('place', route_params.id) : place;
  },

  actions: {
    error() {
      this.transitionTo('places');
    }
  }
});

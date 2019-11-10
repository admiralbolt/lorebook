import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('beast');
  },

  model(route_params) {
    const api_data = this.get('store');
    let beast = api_data.peekRecord('beast', route_params.id);
    return beast === null ? api_data.findRecord('beast', route_params.id) : beast;
  },

  actions: {
    error(error, transition) {
      this.transitionTo('beasts');
    }
  }
});

import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('lore');
  },

  model(route_params) {
    const api_data = this.get('store');
    let lore = api_data.peekRecord('lore', route_params.id);
    return lore === null ? api_data.findRecord('lore', route_params.id) : lore;
  },

  actions: {
    error(error, transition) {
      this.transitionTo('lores');
    }
  }
});

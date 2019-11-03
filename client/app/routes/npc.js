import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('npc');
  },

  model(route_params) {
    const api_data = this.get('store');
    let npc = api_data.peekRecord('npc', route_params.id);
    return npc === null ? api_data.findRecord('npc', route_params.id) : npc;
  }
});

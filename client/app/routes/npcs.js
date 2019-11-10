import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('npc');
  },

  model() {
    const api_data = this.get('store');
    let npcs = api_data.peekAll('npc');
    return npcs.length == 0 ? api_data.findAll('npc') : npcs;
  }
});

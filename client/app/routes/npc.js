import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  store: service(),
  model(route_params) {
    const store = this.get('store');
    let npc = store.peekRecord('npc', route_params.id);
    return npc === null ? store.findRecord('npc', route_params.id) : npc;
  }
});

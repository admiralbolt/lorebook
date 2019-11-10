import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('song');
  },

  model(route_params) {
    const api_data = this.get('store');
    let song = api_data.peekRecord('song', route_params.id);
    return song === null ? api_data.findRecord('song', route_params.id) : song;
  },

  actions: {
    error(error, transition) {
      this.transitionTo('songs');
    }
  }
});

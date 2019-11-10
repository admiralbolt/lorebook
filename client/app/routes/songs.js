import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({

  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('song');
  },

  model() {
    const api_data = this.get('store');
    let songs = api_data.peekAll('song');
    return songs.length == 0 ? api_data.findAll('song') : songs;
  }

});

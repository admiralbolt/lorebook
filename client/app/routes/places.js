import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('place');
  },

  model() {
    const api_data = this.get('store');
    let places = api_data.peekAll('place');
    return places.length == 0 ? api_data.findAll('place') : places;
  }
});

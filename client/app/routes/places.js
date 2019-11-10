import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  api_data: service('api-data'),

  beforeModel() {
    this.api_data.setActiveModel('place');
  }
});

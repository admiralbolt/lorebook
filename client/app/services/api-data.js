import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default Service.extend({
  @tracked activeModel: null,
  store: service(),

  setActiveModel(model) {
    set(this, 'activeModel', model);
    this.activeModel = model;
  },

  getActiveItems() {
    return this.activeModel == null ? [] : this.get('store').findAll(this.activeModel);
  }

});

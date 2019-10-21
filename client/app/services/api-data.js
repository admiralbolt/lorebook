import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default Service.extend({
  @tracked activeModel: null,
  store: service(),

  setActiveModel(model) {
    console.log("setting active model");
    set(this, 'activeModel', model);
    this.activeModel = model;
  },

  getActiveItems() {
    console.log("get active items: " + this.activeModel);
    return this.activeModel == null ? [] : this.store.findAll(this.activeModel);
  }

});

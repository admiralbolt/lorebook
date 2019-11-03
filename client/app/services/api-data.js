import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { set } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default Service.extend({
  @tracked activeModel: null,
  store: service(),

  menuItems: [],

  reloadMenu(records) {
    this.get('store').findAll(this.activeModel).then(function(records) {
      let menuItems = [];
      records.forEach((record) => {
        menuItems.push({
          id: record.id,
          name: record.name
        });
      });
      this.set('menuItems', menuItems);
    }.bind(this));
  },

  setActiveModel(model) {
    set(this, 'activeModel', model);
    this.activeModel = model;
    this.reloadMenu();
  },

  getActiveItems() {
    return this.activeModel == null ? [] : this.get('store').findAll(this.activeModel);
  }

});

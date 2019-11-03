import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default Service.extend({
  store: service(),
  activeModel: null,
  menuItems: null,

  init() {
    this._super(...arguments);
    this.menuItems = this.menuItems || [];
  },

  reloadMenu() {
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
    this.set('activeModel', model);
    this.reloadMenu();
  },

  getActiveItems() {
    return this.activeModel == null ? [] : this.get('store').findAll(this.activeModel);
  }

});

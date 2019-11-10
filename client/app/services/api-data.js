import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';

export default Service.extend({
  store: service(),
  activeModel: null,
  menuItems: null,

  init() {
    this._super(...arguments);
    this.menuItems = this.menuItems || [];
  },

  reloadMenu() {
    let menuItems = this.get('store').peekAll(this.get('activeModel'));
    if (!isNone(menuItems)) {
      this.set('menuItems', menuItems);
      return;
    }

    this.get('store').findAll(this.get('activeModel')).then(function(records) {
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
  }

});

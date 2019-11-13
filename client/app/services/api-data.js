import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';

export default Service.extend({
  store: service(),
  activeModel: null,
  // When we initially load models, we want to make sure we do a full load
  // and not a cached load. If we are viewing a detail veiw and refresh,
  // we are in a state where a model is loaded from the route before the menu
  // items are. This means that peekAll() returns something and we get a menu
  // with only one item. This tracks which models have been fully loaded.
  warmModels: null,
  menuItems: null,

  init() {
    this._super(...arguments);
    this.warmModels = new Set();
    this.menuItems = this.menuItems || [];
  },

  reloadMenu() {
    // If a model is already warm, attempt to load from cache.
    if (this.get('warmModels').has(this.get('activeModel'))) {
      let menuItems = this.get('store').peekAll(this.get('activeModel'));
      if (!isNone(menuItems)) {
        this.set('menuItems', menuItems);
        return;
      }
    }

    // Otherwise warm it up!
    this.get('store').findAll(this.get('activeModel')).then(function(records) {
      this.get('warmModels').add(this.get('activeModel'));
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
  }

});

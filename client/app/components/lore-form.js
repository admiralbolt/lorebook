import Component from '@ember/component';

export default Component.extend({
  lore: null,
  loreTypes: null,

  init() {
    this._super(...arguments);
    // This needs to stay in sync with the choices in models.py.
    this.loreTypes = ['Book', 'General', 'Letter', 'Story'];
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('lore', this.get('model') || {});
  }
});

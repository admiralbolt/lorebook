import Component from '@ember/component';

export default Component.extend({
  lore: null,
  loreTypes: ['Book', 'General', 'Letter', 'Story'],

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('lore', this.get('model') || {});
  }
});

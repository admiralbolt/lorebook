import Component from '@ember/component';

export default Component.extend({
  lore: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('lore', this.get('model') || {});
  }
});

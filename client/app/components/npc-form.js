import Component from '@ember/component';

export default Component.extend({
  npc: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('npc', this.get('model') || {});
  }

});

import Component from '@ember/component';
import { isNone } from '@ember/utils';

export default Component.extend({
  npc: null,

  // Custom tracking for aliases, we need to convert this to an array before posting.
  aliases_string: '',

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('npc', this.get('model') || {});
    if (!isNone(this.get('model.aliases'))) {
      this.set('aliases_string', this.get('model.aliases').join('\n'));
    }
  },

  actions: {
    updateAliases: function() {
      this.set('npc.aliases', this.get('aliases_string').split('\n'));
    }
  }
});

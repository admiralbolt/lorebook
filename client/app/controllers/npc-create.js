import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { isNone } from '@ember/utils';
import formatErrors from 'client/utils/utils';

export default Controller.extend({
  api_data: service('api_data'),
  toast: service('toast'),
  npc: {},

  success: function(reason) {
    this.toast.success('NPC Created successfully!');
    this.set('npc', {});
    this.get('api_data').reloadMenu();
  },

  fail: function(reason) {
    this.toast.error(formatErrors(reason.errors));
  },

  actions: {
    create() {
      let npcData = this.get('npc');
      let npc = this.api_data.get('store').createRecord('npc', {
        aliases: isNone(npcData.aliases) ? [] : npcData.aliases.split(),
        appearance: npcData.appearance,
        name: npcData.name,
        info: npcData.info,
        visible: npcData.visible
      });
      var self = this;
      npc.save().then(this.success.bind(this), this.fail.bind(this));
    }
  }
})

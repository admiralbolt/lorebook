import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api_data: service('api_data'),
  npc: {},

  actions: {
    create() {
      let npcData = this.get('npc');
      let npc = this.api_data.get('store').createRecord('npc', {
        aliases: npcData.aliases.split(),
        appearance: npcData.appearance,
        name: npcData.name,
        info: npcData.info,
        visible: npcData.visible
      });
      var self = this;
      npc.save().then(() => {
        self.transitionTo('npcs');
      });
    }
  }
})

import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  api_data: service('api_data'),
  npc: {},

  actions: {
    create() {
      let npcData = this.get('npc');
      let npc = this.api_data.get('store').createRecord('npc', {
        name: npcData.name,
        description: npcData.description,
        info: npcData.info
      });
      npc.save().then(() => {
        this.transitionTo('npcs');
      });
    }
  }
})

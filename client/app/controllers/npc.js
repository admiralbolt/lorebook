import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import formatErrors from 'client/utils/utils';

export default Controller.extend({
  api_data: service('api_data'),
  session: service('session'),
  toast: service('toast'),

  isEditing: false,
  npc: computed('isEditing', function() {
    return this.get('model').toJSON();
  }),

  actions: {
    edit() {
      this.set('isEditing', true);
    },
    delete() {
      let model = this.get('model');
      model.deleteRecord();
      model.save().then(function() {
        this.toast.success('NPC Deleted.');
        this.transitionToRoute('npcs');
      }.bind(this));
    },
    cancel() {
      this.set('isEditing', false);
    },
    save(model) {
      let npc = this.get('npc');
      for (let prop in npc) {
        model.set(prop, npc[prop]);
      }
      model.save().then(function() {
        this.toast.success('NPC Updated successfully!');
        this.set('isEditing', false);
        this.get('api_data').reloadMenu();
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        model.rollbackAttributes();
      }.bind(this));
    }
  }

});

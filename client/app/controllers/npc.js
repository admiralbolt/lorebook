import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { copy } from '@ember/object/internals';
import formatErrors from 'client/utils/utils';

export default Controller.extend({
  api_data: service('api_data'),
  session: service('session'),
  toast: service('toast'),

  isEditing: false,
  npc: computed('isEditing', function() {
    return this.get('model').toJSON();
  }),

  success: function(reason) {
    this.toast.success('NPC Updated successfully!');
    this.set('isEditing', false);
    this.get('api_data').reloadMenu();
  },

  fail: function(reason) {
    this.toast.error(formatErrors(reason.errors));
    let model = this.get('model').rollbackAttributes();
  },

  actions: {
    edit() {
      this.set('isEditing', true);
    },
    delete() {
      console.log('TBD');
    },
    cancel() {
      this.set('isEditing', false);
    },
    save(model) {
      let npc = this.get('npc');
      for (let prop in npc) {
        model.set(prop, npc[prop]);
      }
      model.save().then(this.success.bind(this), this.fail.bind(this));
    }
  }

});

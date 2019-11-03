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
  modelSnapshot: null,
  npc: computed('isEditing', function() {
    let model = this.get('model');
    return {
      name: model.name,
      appearance: model.appearance,
      visible: model.visible,
      info: model.info,
      aliases: model.aliases
    }
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
      // Save the current model params in case our patch fails. We want to
      // restore the original properties so that the local model is not
      // out of date.
      this.set('modelSnapshot', model);
      let npc = this.get('npc');
      model.set('name', npc.name);
      model.set('appearance', npc.appearance);
      model.set('visible', npc.visible);
      model.set('info', npc.info);
      model.set('aliases', npc.aliases);
      model.save().then(this.success.bind(this), this.fail.bind(this));
    }
  }

});

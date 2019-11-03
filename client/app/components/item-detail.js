import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import formatErrors from 'client/utils/utils';

export default Component.extend({
  api_data: service('api_data'),
  session: service('session'),
  toast: service('toast'),

  classNames: ['full'],
  isEditing: false,

  // Input params
  componentName: '',
  modelName: '',
  route: null,

  title: computed('model.name', function() {
    return `Editing ${this.get('model.name')}`;
  }),
  modelCopy: computed('isEditing', function() {
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
        this.toast.success(`${modelName} Deleted.`);
        this.transitionToRoute(this.get('route'));
      }.bind(this));
    },
    cancel() {
      this.set('isEditing', false);
    },
    save(model) {
      let modelCopy = this.get('modelCopy');
      for (let prop in modelCopy) {
        model.set(prop, modelCopy[prop]);
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

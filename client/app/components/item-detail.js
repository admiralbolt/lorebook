import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from '../config/environment';
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
  // Any files for uploading will be bubbled into the component from a child.
  // These will have the form [{file: <ember file>, field: 'field_name'}, ..]
  filesForUpload: null,

  // Need to reset isEditing if we transition between items while editing one.
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('isEditing', false);
    this.set('filesForUpload', []);
    this.set('fileFieldNames', this.fileFieldNames || []);
  },

  title: computed('model.name', function() {
    return `Editing ${this.get('model.name')}`;
  }),

  modelCopy: computed('isEditing', function() {
    return this.get('model').toJSON();
  }),

  // Upload all files in the filesForUpload array. This wraps the array of
  // of promises returned in a Promise.all() call. The returned result will
  // be an array of statuses:
  // [{field: 'sound_file', status: 'success', response: {}}, ...]
  uploadFiles: function() {
    let model = this.get('model');
    let uploadPromises = [];
    this.get('filesForUpload').forEach(function(fileForUpload) {
      let headers = {
        // Apparently authorization has to be lower case, wtf?
        authorization: `Token ${this.session.data.authenticated.token}`,
        Accept: 'application/vnd.api+json'
      };
      headers['Content-Disposition'] = `attachment; filename=${fileForUpload.file.name}`;
      uploadPromises.push(fileForUpload.file.upload(`${config.host}/songs/upload/?id=${model.id}`, {
        headers: headers
      }).then(function(response) {
        return {
          field: fileForUpload.field,
          status: 'success',
          response: response
        };
      }.bind(this), function(response) {
        return {
          field: fileForUpload.field,
          status: 'failure',
          response: response
        };
      }));
    }.bind(this));
    return Promise.all(uploadPromises);
  },

  actions: {
    edit() {
      this.set('isEditing', true);
    },

    delete() {
      let model = this.get('model');
      model.deleteRecord();
      model.save().then(function() {
        this.toast.success(`${this.get('modelName')} Deleted.`);
        this.transitionToRoute(this.get('route'));
      }.bind(this));
    },

    cancel() {
      this.set('isEditing', false);
    },

    save(model) {
      let modelCopy = this.get('modelCopy');
      for (let prop in modelCopy) {
        if (prop.includes('file')) continue;
        model.set(prop, modelCopy[prop]);
      }
      model.save().then(function() {
        // We make sure the model is saved successfully first, then we attempt
        // to upload files.
        this.uploadFiles().then(function(uploadStatuses) {
          this.toast.success(`${this.get('modelName')} updated successfully.`);
          this.get('api_data').reloadMenu();
          let continueEditing = false;
          uploadStatuses.forEach(function(status) {
            if (status.status === 'success') return;

            continueEditing = true;
            this.toast.warning(`Could not update ${status.field} attribute.`);
          }.bind(this));
          if (!continueEditing) this.set('isEditing', false);
          // Regardless of the success / fails, we need to clear the current
          // upload array in case re-edits happen.
          this.set('filesForUpload', []);
        }.bind(this));
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        model.rollbackAttributes();
      }.bind(this));
    },

    addFileForUpload(field, file) {
      this.get('filesForUpload').push({
        field: field,
        file: file
      });
    }
  }

});

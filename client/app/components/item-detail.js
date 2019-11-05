import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import config from '../config/environment';
import { formatErrors, formatModelName } from 'client/utils/utils';
import { isNone } from '@ember/utils';

export default Component.extend({
  api_data: service('api_data'),
  session: service('session'),
  toast: service('toast'),

  classNames: ['full'],
  isEditing: false,
  // Set when you are creating a new model rather than editing an existing one.
  isNew: false,

  // "Let's support if statements but then not support any logical operators
  // just to fuck with people." -- Some developer of handlebars.
  displayForm: computed('isEditing', 'isNew', function() {
    return this.get('isEditing') || this.get('isNew');
  }),

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

  formattedModelName: computed('modelName', function() {
    return formatModelName(this.get('modelName'));
  }),

  title: computed('isNew', 'model.name', 'modelName', function() {
    return this.get('isNew') ? `Create new ${this.get('formattedModelName')}` : `Editing ${this.get('model.name')}`;
  }),

  modelCopy: computed('isEditing', 'isNew', function() {
    return isNone(this.get('model')) ? {} : this.get('model').toJSON();
  }),

  // Upload all files in the filesForUpload array. This wraps the array of
  // of promises returned in a Promise.all() call. The returned result will
  // be an array of statuses:
  // [{field: 'sound_file', status: 'success', response: {}}, ...]
  uploadFiles: function(id) {
    let modelId = this.get('model.id') || id;
    let uploadPromises = [];
    this.get('filesForUpload').forEach(function(fileForUpload) {
      let headers = {
        // Apparently authorization has to be lower case, wtf?
        authorization: `Token ${this.session.data.authenticated.token}`,
        Accept: 'application/vnd.api+json'
      };
      headers['Content-Disposition'] = `attachment; filename=${fileForUpload.file.name}`;
      uploadPromises.push(fileForUpload.file.upload(`${config.host}/songs/upload/?id=${modelId}`, {
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

    create() {
      let record = this.api_data.get('store').createRecord(this.get('modelName'), this.get('modelCopy'));
      record.save().then(function(response) {
        // We make sure the model is saved successfully first, then we attempt
        // to upload files.
        this.uploadFiles(response.id).then(function(uploadStatuses) {
          this.get('api_data').reloadMenu();
          this.toast.success(`${this.get('formattedModelName')} '${record.name}' created successfully.'`);
          uploadStatuses.forEach(function(status) {
            if (status.status === 'success') return;

            this.toast.warning(`Could not upload file for ${status.field}.`);
          }.bind(this));
          // Regardless of the success / failure of the file uploads, we reset
          // the create form and clear uploaded files.
          this.set('filesForUpload', []);
          // This is kinda cute, we need to trigger a rerender and we do so by
          // updating our computed modelCopy property by resetting the 'isNew'
          // property to true.
          this.set('isNew', true);
        }.bind(this));
      }.bind(this), function(reason) {
        this.toast.error(formatErrors(reason.errors));
        record.unloadRecord();
      }.bind(this));
    },

    // Called when edits are made to a model. The logic in here is kind of
    // complex, but its setup in such a way to handle any model and file
    // uploading if applicable.
    save(model) {
      let modelCopy = this.get('modelCopy');
      for (let prop in modelCopy) {
        // Honestly this is a little suspect, but it's gonna stay.
        if (prop.includes('file')) continue;
        model.set(prop, modelCopy[prop]);
      }
      model.save().then(function() {
        // We make sure the model is saved successfully first, then we attempt
        // to upload files.
        this.uploadFiles().then(function(uploadStatuses) {
          this.toast.success(`${this.get('modelName')} updated successfully.`);
          this.get('api_data').reloadMenu();
          uploadStatuses.forEach(function(status) {
            if (status.status === 'success') return;

            this.toast.warning(`Could not update file for ${status.field}.`);
          }.bind(this));
          // Regardless of the success / failure of the file uploads, we
          // transition state. This is frustrating if file uploading fails but
          // a pain in the ass to deal with otherwise.
          this.set('isEditing', false);
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

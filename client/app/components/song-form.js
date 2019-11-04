import Component from '@ember/component';

export default Component.extend({
  title: "Create New NPC",
  song: null,

  init() {
    this._super(...arguments);
    this.song = this.get('model') || {};
  },

  actions: {
    addFileForUpload(file) {
      this.sendAction('addFileForUpload', 'sound_file', file);
    }
  }
});

import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  title: "Create New NPC",
  song: null,

  init() {
    this._super(...arguments);
    this.song = this.get('model') || {};
  },

  soundFileName: computed('song.sound_file', function() {
    return this.get('song.sound_file').split(/(\\|\/)/g).pop();
  }),

  actions: {
    addFileForUpload(file) {
      this.sendAction('addFileForUpload', 'sound_file', file);
    }
  }
});

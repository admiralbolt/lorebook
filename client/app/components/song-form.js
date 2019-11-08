import Component from '@ember/component';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';

export default Component.extend({
  song: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('song', this.get('model') || {});
  },

  soundFileName: computed('song.sound_file', function() {
    return isNone(this.get('song.sound_file')) ? 'No file selected' : this.get('song.sound_file').split(/(\\|\/)/g).pop();
  }),

  actions: {
    addSoundFile(file) {
      this.addFileForUpload('sound_file', file);
    }
  }
});

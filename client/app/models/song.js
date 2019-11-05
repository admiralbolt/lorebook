import DS from 'ember-data';
import { computed } from '@ember/object';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  artist: DS.attr(),
  flavor: DS.attr(),
  tags: DS.attr(),
  loop: DS.attr(),
  sound_file: DS.attr(),
  visible: DS.attr(),

  getFileName: computed('sound_file', function() {
    return this.get('sound_file').split(/(\\|\/)/g).pop();
  })
});

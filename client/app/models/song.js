import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  artist: DS.attr(),
  flavor: DS.attr(),
  tags: DS.attr(),
  loop: DS.attr(),
  soundFile: DS.attr(),
  visible: DS.attr()
});

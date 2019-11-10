import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  aliases: DS.attr(),
  appearance: DS.attr(),
  image_file: DS.attr(),
  info: DS.attr(),
  name: DS.attr(),
  visible: DS.attr()
});

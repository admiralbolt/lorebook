import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  aliases: DS.attr(),
  description: DS.attr(),
  info: DS.attr(),
  image_file: DS.attr(),
  name: DS.attr(),
  points_of_interest: DS.attr(),
  type: DS.attr(),
  visible: DS.attr(),
  x: DS.attr(),
  y: DS.attr()
});

import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  aliases: DS.attr(),
  name: DS.attr(),
  appearance: DS.attr(),
  info: DS.attr(),
  visible: DS.attr()
});

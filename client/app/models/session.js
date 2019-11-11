import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  ordinal: DS.attr(),
  summary: DS.attr(),
  visible: DS.attr()
});

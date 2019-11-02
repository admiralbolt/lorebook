import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  name: DS.attr(),
  appearance: DS.attr(),
  info: DS.attr(),
  visible: DS.attr()
});

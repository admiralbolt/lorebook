import DS from 'ember-data';
const { Model } = DS;

export default Model.extend({
  author: DS.attr(),
  date_received: DS.attr(),
  date_written: DS.attr(),
  name: DS.attr(),
  text: DS.attr(),
  type: DS.attr(),
  visible: DS.attr()
});

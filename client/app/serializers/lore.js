import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // By default the json api serializer dasherizes attributes. So the date
  // properties won't get loaded correctly for lore.
  keyForAttribute: function(key) {
    return key;
  }
});

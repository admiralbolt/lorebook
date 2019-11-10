import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({
  // By default the json api serializer dasherizes attributes. So the property
  // 'image_file' gets read as 'image-file' and doesn't get loaded correctly.
  // We override the serializer for the place model to not modify the attributes
  // in any way.
  keyForAttribute: function(key) {
    return key;
  },

  // Also, we need to remove the image_file field on post. That's gonna be
  // handled seprately since file uploading is super jank.
  attrs: {
    image_file: {
      serialize: false
    }
  }
});

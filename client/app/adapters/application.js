import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
  host: computed(function() {
    return 'http://localhost:8000';
  })
});

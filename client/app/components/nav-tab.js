import Component from '@ember/component';
import { computed } from '@ember/object';
import { formatModelNamePlural } from 'client/utils/utils';

export default Component.extend({
  icon: null,
  modelName: null,
  formattedModelName: computed('modelName', function() {
    return formatModelNamePlural(this.get('modelName'));
  })
});

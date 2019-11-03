import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  value: false,
  negativeText: 'Hidden',
  positiveText: 'Visible',
  statusClass: computed('value', function() {
    return this.get('value') ? 'toggle-positive' : 'toggle-negative';
  }),

  actions: {
    toggle() {
      this.set('value', !this.get('value'));
    }
  }
});

import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { computed } from '@ember/object';

export default Component.extend({

  // Whether or not to show the menu
  visible: false,

  // Menu position
  x: 0,
  y: 0,

  position: computed('x', 'y', function() {
    return new htmlSafe(`left: ${this.get('x')}px; top: ${this.get('y')}px;`);
  })


});

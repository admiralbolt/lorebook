import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  showSearchBar: false,
  widthClass: 'normal',
  displayResults: false,
  displayClass: computed('displayResults', function() {
    return this.get('displayResults') ? '' : 'hide';
  }),
  // For some reason clicking on a link fires both focusOut and focusIn.
  // Make sure we only fire one focus event at a time.
  _isFocusing: false,

  focusOut: function() {
    if (!this.get('_isFocusing')) {
      this.set('_isFocusing', true);
      setTimeout(function() {
        this.set('displayResults', false);
        this.set('_isFocusing', false);
      }.bind(this), 120);
    }
  },

  focusIn: function() {
    if (!this.get('_isFocusing')) {
      setTimeout(function() {
        this.set('displayResults', true);
      }.bind(this), 0);
    }
  },

  actions: {

    toggleSearch: function() {
      let showSearchBar = this.get('showSearchBar');
      this.set('showSearchBar', !showSearchBar);
      if (!showSearchBar) {
        this.get('element').querySelector('#search-keyword').focus();
        this.set('displayResults', true);
      }
      let widthClass = this.get('widthClass');
      this.set('widthClass', (widthClass == 'normal') ? 'shrink' : 'normal');
    }
  }
});

import Component from '@ember/component';

export default Component.extend({
  showSearchBar: false,
  widthClass: 'normal',

  actions: {
    toggleSearch: function() {
      this.set('showSearchBar', !this.get('showSearchBar'));
      let widthClass = this.get('widthClass');
      this.set('widthClass', (widthClass == 'normal') ? 'shrink' : 'normal');
    }
  }
});

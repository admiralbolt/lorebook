import Component from '@ember/component';

export default Component.extend({
  showSearchBar: false,
  widthClass: 'normal',

  actions: {
    toggleSearch: function() {
      let showSearchBar = this.get('showSearchBar');
      this.set('showSearchBar', !showSearchBar);
      if (!showSearchBar) {
        this.get('element').querySelector('#search-keyword').focus();
      }
      let widthClass = this.get('widthClass');
      this.set('widthClass', (widthClass == 'normal') ? 'shrink' : 'normal');
    }
  }
});

import Component from '@ember/component';

export default Component.extend({
  widthClass: 'normal',

  actions: {
    toggleWidth: function() {
      let widthClass = this.get('widthClass');
      this.set('widthClass', (widthClass == 'normal') ? 'shrink' : 'normal');
    }
  }
});

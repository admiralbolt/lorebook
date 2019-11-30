import Component from '@ember/component';

export default Component.extend({
  fullScreen: false,

  click: function() {
    console.log('click');
    this.set('fullScreen', true);
  },

  actions: {
    toggleFullScreen() {
      this.toggleProperty('fullScreen');
    }
  }
});

import Component from '@ember/component';

export default Component.extend({
  choices: [],
  value: null,

  actions: {
    setSelection(value) {
      this.set('value', value);
    }
  }
});

import Component from '@ember/component';

export default Component.extend({
  session: null,

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('session', this.get('model') || {});
  }
});

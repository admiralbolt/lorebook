import Component from '@ember/component';

export default Component.extend({
  title: "Create New NPC",
  npc: null,

  init() {
    this._super(...arguments);
    this.npc = this.npc || {};
  }
});

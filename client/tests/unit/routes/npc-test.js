import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | npc', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:npc');
    assert.ok(route);
  });
});

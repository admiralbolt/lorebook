import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | npcs', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:npcs');
    assert.ok(route);
  });
});

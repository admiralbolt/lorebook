import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | lore-create', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:lore-create');
    assert.ok(route);
  });
});

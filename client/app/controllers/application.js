import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  store: service(),

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then((success) => {
        this.get('store').findAll('npc', {reload: true});
      }, (reason) => {
        this.set('errorMessage', reason.json.non_field_errors || reason);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
      this.store.unloadAll();
      this.get('store').findAll('npc');
    }

  }
});

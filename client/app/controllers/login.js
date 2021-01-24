import Controller from '@ember/controller';
import { inject as service } from '@ember/service';


export default Controller.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).then(() => {
        // Reload all data with our updated credentials.
        this.get('store').findAll('npc', {reload: true});
      }, (reason) => {
        this.set('errorMessage', reason.json.non_field_errors || reason);
      });
    },

    invalidateSession() {
      this.get('session').invalidate();
      // Unload all data, and reload with our updated credentials.
      this.get('store').unloadAll();
      this.get('store').findAll('npc');
    }

  }
});

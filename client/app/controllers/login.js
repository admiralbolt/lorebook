import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),

  actions: {
    authenticate() {
      let credentials = this.getProperties('username', 'password');
      let authenticator = 'authenticator:token';

      this.get('session').authenticate(authenticator, credentials).catch((reason) => {
        this.set('errorMessage', reason.non_field_errors || reason);
      });
    }
  }
});

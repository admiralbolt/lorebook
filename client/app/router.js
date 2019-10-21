import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('npcs');
  this.route('npc', {
    path: 'npcs/:id'
  });
  this.route('login');
});

export default Router;

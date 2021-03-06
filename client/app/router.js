import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('not-found', {
    path: '/*path'
  });
  this.route('npcs');
  this.route('npc', {
    path: 'npcs/:id'
  });
  this.route('login');
  this.route('npc-create');
  this.route('places');
  this.route('place', {
    path: 'places/:id'
  });
  this.route('place-create');
  this.route('lores');
  this.route('lore', {
    path: 'lores/:id'
  });
  this.route('lore-create');
  this.route('beasts');
  this.route('beast', {
    path: 'beast/:id'
  });
  this.route('beast-create');
  this.route('sessions');
  this.route('session', {
    path: 'session/:id'
  });
  this.route('session-create');
  this.route('world');
});

export default Router;

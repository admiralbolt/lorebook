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
  }, function() {});
  this.route('songs');
  this.route('song', {
    path: 'songs/:id'
  });
  this.route('login');
  this.route('npc-create');
  this.route('song-create');
});

export default Router;

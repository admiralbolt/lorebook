import Service from '@ember/service';
import config from '../config/environment';
import fetch from 'fetch';
import { isNone } from '@ember/utils';

export default Service.extend({
  links: null,
  // Don't want to do concurrent fetches if multiple getLinks() calls are made.
  // Store a promise here to prevent extraneous calls.
  _isFetching: null,
  _resolveIsFetching: null,

  init() {
    this._super(...arguments);
    this.links = this.links || [];
  },

  _setIsFetching() {
    this.set('_isFetching', new Promise(function(resolve, reject) {
      this.set('_resolveIsFetching', resolve);
    }.bind(this)));
  },

  reloadLinks() {
    return fetch(`${config.host}/links/`).then(function(result) {
      return result.json().then(function(data) {
        this.set('links', data);
        this._resolveIsFetching();
      }.bind(this));
    }.bind(this));
  },

  async getLinks() {
    if (!isNone(this.get('_isFetching'))) {
      await this.get('_isFetching');
    }
    if (this.get('links').length > 0) {
      return new Promise(function(resolve, reject) {
        resolve(this.get('links'));
      }.bind(this));
    }

    this._setIsFetching();
    return this.reloadLinks().then(function(result) {
      return this.get('links');
    }.bind(this));
  }
});

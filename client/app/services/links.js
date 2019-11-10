import Service from '@ember/service';
import config from '../config/environment';
import fetch from 'fetch';

export default Service.extend({
  links: null,
  // This feels hacky.
  _isFetching: false,

  init() {
    this._super(...arguments);
    this.links = this.links || [];
  },

  reloadLinks() {
    return fetch(`${config.host}/links`).then(function(result) {
      return result.json().then(function(data) {
        this.set('links', data);
      }.bind(this));
    }.bind(this));
  },

  getLinks() {
    if (this.get('links').length > 0) {
      return new Promise(function(resolve, reject) {
        resolve(this.get('links'));
      }.bind(this));
    }

    return this.reloadLinks().then(function(result) {
      return this.get('links');
    }.bind(this));
  }


});

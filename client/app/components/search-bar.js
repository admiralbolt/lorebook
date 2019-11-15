import Component from '@ember/component';
import { inject as service } from '@ember/service';
import config from '../config/environment';
import { computed } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import { isNone } from '@ember/utils';
import fetch from 'fetch';

export default Component.extend({
  session: service('session'),
  showSearchBar: false,
  widthClass: 'normal',
  displayResults: false,
  displayClass: computed('displayResults', function() {
    return this.get('displayResults') ? '' : 'hide';
  }),
  // For some reason clicking on a link fires both focusOut and focusIn.
  // Make sure we only fire one focus event at a time.
  _isFocusing: false,
  _debouncedSearch: null,
  searchResults: null,

  init() {
    this._super(...arguments);
    this.searchResults = [];
  },

  focusOut: function() {
    if (!this.get('_isFocusing')) {
      this.set('_isFocusing', true);
      setTimeout(function() {
        this.set('displayResults', false);
        this.set('_isFocusing', false);
      }.bind(this), 120);
    }
  },

  focusIn: function() {
    if (this.get('showSearchBar') && !this.get('_isFocusing')) {
      setTimeout(function() {
        this.set('displayResults', true);
      }.bind(this), 0);
    }
  },

  // If we hit enter immediately run search and cancel the debounce.
  keyPress: function(event) {
    if (event.key !== 'Enter') return;

    if (isNone(this.get('_debouncedSearch'))) {
      cancel(this.get('_debouncedSearch'));
    }
    this.search();
  },

  search: function() {
    let keyword = this.get('element').querySelector('#search-keyword').value;
    let headers = {};
    if (this.session.isAuthenticated) {
      // Apparently authorization has to be lower case, wtf?
      headers.authorization = `Token ${this.session.data.authenticated.token}`;
    }
    return fetch(`${config.host}/search/?keyword=${keyword}`, {
      headers: headers,
    }).then(function(result) {
      return result.json().then(function(data) {
        this.set('searchResults', data);
      }.bind(this));
    }.bind(this));
  },

  actions: {

    toggleSearch: function() {
      let showSearchBar = this.get('showSearchBar');
      this.set('showSearchBar', !showSearchBar);
      if (!showSearchBar) {
        this.get('element').querySelector('#search-keyword').focus();
        this.set('displayResults', true);
      }
      this.onToggle();
    },

    search: function() {
      let keyword = this.get('element').querySelector('#search-keyword').value;
      this.set('_debouncedSearch', debounce(this, this.search, 300));
    }
  }
});

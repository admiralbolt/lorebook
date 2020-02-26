import Component from '@ember/component';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

// We need to offset the menuY based on the height of the navbar.
// This should stay in sync with the definition in nav.scss.
let NAVBAR_REM = 5;

export default Component.extend({
  api_data: service('api-data'),
  session: service('session'),

  places: computed('api_data', function() {
    return this.get('api_data').getAllRecords('place');
  }),

  // A list of places that aren't on the map already.
  placesToAdd: filter('places', function(places) {
    return places.get('x') == null && places.get('y') == null;
  }),

  // Attributes passed to click menus.
  menuX: 0,
  menuY: 0,
  menuVisible: false,
  itemMenuVisible: false,
  clickedPlace: null,

  click(event) {
    if (!this.get('session').isAuthenticated) return;

    // Only pop up the menu if there are places to add.
    if (this.get('placesToAdd').length == 0) return;

    if (this.get('itemMenuVisible')) {
      this.set('itemMenuVisible', false);
      return;
    }

    this.set('menuX', event.clientX);
    this.set('menuY', event.clientY - NAVBAR_REM * parseFloat(getComputedStyle(document.documentElement).fontSize));
    this.toggleProperty('menuVisible');
  },

  actions: {
    deleteMapItem: function(place) {
      place.set('x', null);
      place.set('y', null);
      place.save();
    },
    // Function called when clicking on a sub world item.
    mapItemClick: function(event, place) {
      if (!this.get('session').isAuthenticated) return;

      event.stopPropagation();
      this.set('menuX', event.clientX + 20);
      this.set('menuY', event.clientY - NAVBAR_REM * parseFloat(getComputedStyle(document.documentElement).fontSize) - 20);
      this.set('clickedPlace', place);
      this.set('menuVisible', false);
      this.toggleProperty('itemMenuVisible');
    },
    // Function called when clicking on the menu to add an item.
    addMapItem: function(place) {
      if (!this.get('session').isAuthenticated) return;

      event.stopPropagation();
      place.set('x', this.get('menuX'));
      place.set('y', this.get('menuY'));
      place.save();
      this.set('menuVisible', false);
    }
  }
});

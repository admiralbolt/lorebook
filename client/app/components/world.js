import Component from '@ember/component';
import { computed } from '@ember/object';
import { filter } from '@ember/object/computed';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';
import { next } from '@ember/runloop';

// We need to offset the menuY based on the height of the navbar.
// This should stay in sync with the definition in nav.scss.
let NAVBAR_REM = 5;

// This is based on the pixel amounts set in world.scss.
// Mobile map is set to 1400px width.
// Full screen map is set to 2048px width.
let MOBILE_SCALE = 0.68359375;
let WIDTH_THRESHOLD = 500;

export default Component.extend({
  api_data: service('api-data'),
  session: service('session'),
  router: service(),

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

  // Previously clicked place, used on mobile to link to a place. We only
  // want to route them if the tooltip is open for a place and they click
  // on it again.
  previouslyClickedPlace: null,

  // Starting location from url params.
  initialX: null,
  initialY: null,

  click(event) {
    if (!this.get('session').isAuthenticated) {
      this.set('previouslyClickedPlace', null);
      return;
    }

    if (this.get('itemMenuVisible')) {
      this.set('itemMenuVisible', false);
      return;
    }

    // Only pop up the menu if there are places to add.
    if (this.get('placesToAdd').length == 0) return;

    this.set('menuX', event.clientX);
    this.set('menuY', event.clientY - NAVBAR_REM * parseFloat(getComputedStyle(document.documentElement).fontSize));
    this.toggleProperty('menuVisible');
  },

  didInsertElement() {
    this._super(...arguments);
    if (this.get('initialX') == null || this.get('initialY') == null) return;

    let mapWrapper = this.element.getElementsByClassName('map-wrapper')[0];

    console.log(`X: ${this.get('initialX')}, Y: ${this.get('initialY')}`);

    next(this, function() {
      // We want to scrollTo the x / y position but subtract half of the
      // div width from the x, and half from the y. We also need to account
      // for the scale if the client is mobile.
      let x = this.get('initialX');
      let y = this.get('initialY');
      if (window.innerWidth < WIDTH_THRESHOLD) {
        x *= MOBILE_SCALE;
        y *= MOBILE_SCALE;
      }
      x -= mapWrapper.offsetWidth / 2;
      y -= mapWrapper.offsetHeight / 2;
      mapWrapper.scrollTo(x, y);
    });
  },

  actions: {
    deleteMapItem: function(place) {
      place.set('x', null);
      place.set('y', null);
      place.save();
    },
    // Function called when clicking on a sub world item.
    mapItemClick: function(event, place) {
      event.stopPropagation();

      if (!this.get('session').isAuthenticated) {
        // Only route immeidately if not on mobile. We only route for mobile if
        // they click again while the tooltip is open.
        if (window.innerWidth < WIDTH_THRESHOLD && this.get('previouslyClickedPlace') != place) {
          this.set('previouslyClickedPlace', place);
          return;
        }

        this.get('router').transitionTo('place', place);
      }

      // TODO: Figure out this magical offset.
      this.set('menuX', place.get('x') - 5);
      this.set('menuY', place.get('y'));
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

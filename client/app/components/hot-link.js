import Component from '@ember/component';
import { computed } from '@ember/object';
import { isNone } from '@ember/utils';
import { inject as service } from '@ember/service';

export default Component.extend({
  links: service('links'),
  text: '',
  newlineText: computed('text', function() {
    return !isNone(this.get('text')) ? this.get('text').replace(/\n/g, '<br>') : '';
  }),
  tokens: null,

  didReceiveAttrs() {
    this._super(...arguments);
    if (isNone(this.get('text'))) return;

    this.get('links').getLinks().then(function(data) {
      this._tokenize(data);
    }.bind(this));
  },

  // There are few cases we need to think of. Aliases / names of other items
  // can be supersets in a few ways:
  // Lord William Nakal as an alias of William Nakal
  // Selina as an alias of Selina Lafayette
  // Letter to Rakad #1 as a letter, and Rakad as an npc.
  //
  // We just want to make sure that any given length of text is only matched
  // once, so make sure there are no existing matches where the start of the
  // new match is.
  _isStartInMatch(matches, start) {
    for (let i = 0; i < matches.length; i++) {
      let match = matches[i];
      if (start >= match.start && start <= match.end) return true;
    }
    return false;
  },

  _tokenize(links) {
    // Build an array of matches that track the text matched, it's position,
    // and the model / id to link to.
    let matches = [];

    links.forEach(link => {
      let indexes = this._findAllIndices(link.name);
      indexes.forEach(index => {
        // Interesting note here, return acts like continue in lambda functions.
        if (this._isStartInMatch(matches, index)) return;

        let end = index + link.name.length;
        matches.push({
          start: index,
          end: end,
          word: link.name,
          model: link.model,
          id: link.id
        });
      });
    });

    // Matches need to be processed in order they appear in the text, so
    // we sort by end index.
    matches.sort((a, b) => {
      return a.end - b.end;
    });

    let tokens = [];
    let start = 0;
    matches.forEach(match => {
      this._addTokens(tokens, start, match);
      start = match.end;
    });
    tokens.push({
      link: null,
      text: this.newlineText.substring(start, this.newlineText.length)
    });
    this.set('tokens', tokens);
  },

  _addTokens(tokens, start, match) {
    if (match.start != start) {
      tokens.push({
        text: this.newlineText.substring(start, match.start)
      });
    }
    tokens.push({
      model: match.model,
      id: match.id,
      text: this.newlineText.substring(match.start, match.end)
    });
  },

  // Find all occurences of a string in a string.
  // Edited this for speed comparison: https://jsperf.com/javascript-find-all/10
  _findAllIndices(keyword) {
    let pos = 0;
    let i = -1;
    let indices = [];
    while (pos != -1) {
      pos = this.newlineText.indexOf(keyword, i + 1);
      i = pos;
      if (pos != -1) {
        indices.push(pos);
      }
    }
    return indices;
  }
});

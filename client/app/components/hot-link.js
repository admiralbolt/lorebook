import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';

export default Component.extend({
  text: null,
  tokens: A(),

  didReceiveAttrs() {
    this._super(...arguments);
    this._tokenize();
  },

  _tokenize() {
    let links = [
      {
        aliases: ["Lord William Nakal", "William Nakal"],
        model: "npc",
        id: 4
      },
      {
        aliases: ["Lady Gertrude Nakal", "Gertrude Nakal"],
        model: "npc",
        id: 1
      }
    ]

    // Build an array of matches that track the text matched, it's position,
    // and the model / id to link to.
    let matches = [];
    // Track matches based on their end index. This is to correctly handle cases
    // where aliases are supersets of the item name, examples:
    // Lord William Nakal as an alias of William Nakal
    // Galrand the Ravager as an alias of Galrand
    let endIndices = new Set();

    links.forEach(link => {
      link.aliases.forEach(alias => {
        let indexes = this._findAllIndices(alias);
        indexes.forEach(index => {
          let end = index + alias.length;
          // Interesting note here, return acts like continue in lambda functions.
          if (endIndices.has(end)) return;

          matches.push({
            start: index,
            end: end,
            word: alias,
            model: link.model,
            id: link.id
          });
          endIndices.add(end);
        });
      });
    });

    // Use each match to tokenize the text.
    let tokens = A();
    let start = 0;
    matches.forEach(match => {
      this._addTokens(tokens, start, match);
      start = match.end;
    });
    tokens.push({
      link: null,
      text: this.text.substring(start, this.text.length)
    });
    this.set('tokens', tokens);
  },

  _addTokens(tokens, start, match) {
    if (match.start != start) {
      tokens.push({
        text: this.text.substring(start, match.start)
      });
    }
    tokens.push({
      model: match.model,
      id: match.id,
      text: this.text.substring(match.start, match.end)
    });
  },

  // Find all occurences of a string in a string.
  // Edited this for speed comparison: https://jsperf.com/javascript-find-all/10
  _findAllIndices(keyword) {
    let pos = 0;
    let i = -1;
    let indices = [];
    while (pos != -1) {
      pos = this.text.indexOf(keyword, i + 1);
      i = pos;
      if (pos != -1) {
        indices.push(pos);
      }
    }
    return indices;
  }
});

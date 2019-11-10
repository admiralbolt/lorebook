import Controller from '@ember/controller';
import { isNone } from '@ember/utils';
import { computed } from '@ember/object';


export default Controller.extend({
  dateSuffix: computed('model.type', function() {
    let loreType = this.get('model.type');
    if (isNone(loreType)) return '';

    return {
      'Book': 'Read',
      'General': 'Received',
      'Letter': 'Received',
      'Story': 'Heard'
    }[this.get('model.type')]
  }),
  formattedDate: computed('model.date_received', function() {
    let dateReceived = this.get('model.date_received');
    // Javascript dates are bubkis.
    // https://stackoverflow.com/questions/17545708/parse-date-without-timezone-javascript
    let date = new Date(`${dateReceived}T00:00:00`);
    return date.toLocaleDateString('en-Us', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  })
});

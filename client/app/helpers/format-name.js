import { helper } from '@ember/component/helper';
import { formatModelName } from 'client/utils/utils';

export default helper(function formatName([name]) {
  return formatModelName(name);
});

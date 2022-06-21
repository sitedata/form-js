import { OptionsSourceEntry } from '../entries';

import {
  OPTIONS_INPUTS
} from '../Util';

export default function OptionsGroup(field, editField) {
  const {
    type
  } = field;

  if (!OPTIONS_INPUTS.includes(type)) {
    return null;
  }

  const id = 'options';

  const entries = [
    ...OptionsSourceEntry({ editField, field, id })
  ];

  return {
    id,
    label: 'Options',
    entries
  };
}
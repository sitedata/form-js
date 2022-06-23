import {
  OptionsSourceChooserEntry,
  OptionsSourceEntry,
  isOptionsDynamic
} from '../entries';

import {
  OPTIONS_INPUTS
} from '../Util';

export default function OptionsGroup(field, editField) {
  const {
    type
  } = field;

  if (!OPTIONS_INPUTS.includes(type)) {
    return [];
  }

  const id = 'options';

  const context = { editField, field, id };

  return [
    {
      id: `${id}---chooser`,
      label: 'Values source',
      entries: OptionsSourceChooserEntry(context)
    },
    {
      id,
      label: isOptionsDynamic(context) ? 'Dynamic Values' : 'Values',
      entries: OptionsSourceEntry(context)
    }
  ];
}
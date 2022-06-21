import { get, isUndefined, without } from 'min-dash';

import { SelectEntry, isSelectEntryEdited, TextFieldEntry, isTextFieldEntryEdited, CollapsibleEntry, ListEntry } from '@bpmn-io/properties-panel';
import ValueEntry from './ValueEntry';

import { arrayAdd } from '../Util';
import { useService } from '../../../hooks';


export default function OptionsSourceEntry(props) {
  const {
    editField,
    field
  } = props;

  const entries = [];

  entries.push({
    id: 'options-source',
    component: OptionsSourceSelect,
    isEdited: isSelectEntryEdited,
    editField,
    field,
  });

  const source = _getOptionsSource(field);

  if (source === OPTIONS_SOURCES.INPUT) {
    entries.push({
      id: 'input-options-key',
      component: InputOptionsKey,
      label: 'Input Options Key',
      description: 'Define which input property to populate the options from',
      isEdited: isSelectEntryEdited,
      editField,
      field,
    });
  }
  else if (source === OPTIONS_SOURCES.STATIC) {
    entries.push({
      id: 'static-options',
      component: StaticOptions,
      label: 'Options',
      isEdited: isTextFieldEntryEdited,
      editField,
      field,
    });
  }

  return entries;
}

function OptionsSourceSelect(props) {

  const {
    editField,
    field,
    id
  } = props;

  const getValue = _getOptionsSource;

  const setValue = (value) => {

    let newField = field;

    Object.values(OPTIONS_SOURCES).forEach(source => {

      // Clear all options source definitions and default the newly selected one
      const newValue = value === source ? OPTIONS_SOURCES_DEFAULTS[source] : undefined;
      newField = editField(field, OPTIONS_SOURCES_PATHS[source], newValue);
    });

    return newField;
  };

  const getOptionsSourceOptions = () => {

    return Object.values(OPTIONS_SOURCES).map((option) => ({
      label: OPTIONS_SOURCES_LABELS[option],
      value: option
    }));
  };

  return SelectEntry({
    element: field,
    getOptions: getOptionsSourceOptions,
    getValue,
    id,
    label: 'Options Source',
    setValue
  });
}

function StaticOptions(props) {
  const {
    editField,
    field,
    id,
    label
  } = props;

  const {
    values: options
  } = field;

  const validateFactory = (key) => {
    return (value) => {
      if (value === key) {
        return;
      }

      if (isUndefined(value) || !value.length) {
        return 'Must not be empty.';
      }

      const isValueAssigned = options.find(entry => entry.value === value);

      if (isValueAssigned) {
        return 'Must be unique.';
      }
    };
  };

  const addEntry = () => {

    const index = options.length + 1;

    const entry = {
      label: `Value ${index}`,
      value: `value${index}`
    };

    editField(field, OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.STATIC], arrayAdd(options, options.length, entry));
  };

  const removeEntry = (entry) => {
    editField(field, OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.STATIC], without(options, entry));
  };

  return ListEntry({
    id,
    items: options,
    label,
    component: (props) => StaticOption({
      field,
      editField,
      validateFactory,
      ...props
    }),
    onAdd: addEntry,
    onRemove: removeEntry,
    autoFocusEntry: true
  });
}

function StaticOption(props) {
  const {
    editField,
    field,
    id: idPrefix,
    index,
    item: option,
    validateFactory
  } = props;

  const id = `${idPrefix}-property-${index}`;

  return CollapsibleEntry({
    id,
    entries: ValueEntry({
      editField,
      field,
      idPrefix: id,
      index,
      validateFactory
    }),
    label: option.label
  });
}

function InputOptionsKey(props) {
  const {
    editField,
    field,
    id,
    label,
    description
  } = props;

  const debounce = useService('debounce');

  const path = OPTIONS_SOURCES_PATHS[OPTIONS_SOURCES.INPUT];

  const getValue = () => get(field, path, '');

  const setValue = (value) => editField(field, path, value || '');

  return TextFieldEntry({
    debounce,
    description,
    element: field,
    getValue,
    id,
    label,
    setValue
  });
}


//* CONFIG

const OPTIONS_SOURCES = {
  STATIC: 'static',
  INPUT: 'input'
};

const OPTIONS_SOURCE_DEFAULT = OPTIONS_SOURCES.STATIC;

const OPTIONS_SOURCES_LABELS = {
  [OPTIONS_SOURCES.STATIC]: 'Static',
  [OPTIONS_SOURCES.INPUT]: 'Input data',
};

const OPTIONS_SOURCES_PATHS = {
  [OPTIONS_SOURCES.STATIC]: ['values'],
  [OPTIONS_SOURCES.INPUT]: ['optionsKey'],
};

const OPTIONS_SOURCES_DEFAULTS = {
  [OPTIONS_SOURCES.STATIC]: [],
  [OPTIONS_SOURCES.INPUT]: '',
};


function _getOptionsSource(field) {

  for (const source of Object.values(OPTIONS_SOURCES)) {
    if (get(field, OPTIONS_SOURCES_PATHS[source]) !== undefined) {
      return source;
    }
  }

  return OPTIONS_SOURCE_DEFAULT;
}

import { get } from 'min-dash';

import NumberInput from './NumberInput';

export default function NumberInputEntry(props) {
  const {
    debounce,
    editField,
    field,
    id,
    label,
    max,
    min,
    onChange,
    path
  } = props;

  const onInput = (value) => {
    if (editField && path) {
      editField(field, path, value);
    } else {
      onChange(value);
    }
  };

  const value = path ? get(field, path, '') : props.value;

  return (
    <div class="fjs-properties-panel-entry">
      <NumberInput
        debounce={ debounce }
        id={ id }
        label={ label }
        max={ max }
        min={ min }
        onInput={ onInput }
        value={ value } />
    </div>
  );
}
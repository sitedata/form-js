import { Default } from '@bpmn-io/form-js-viewer';

import { NumberInputEntry } from '../components';

import useService from '../../../hooks/useService';

export default function ColumnsEntry(props) {
  const modeling = useService('modeling');

  const { field } = props;

  const onChange = (value) => {
    let components = field.components.slice();

    if (value > components.length) {
      const fields = [];

      for (let i = 0; i < value - components.length, i++) {
        fields.push(Default.create());
      }

      modeling.addFormFields(field, components.length, fields);
    } else {
      modeling.removeFormFields(field, value - components.length, components.length);
    }
  };

  const value = field.components.length;

  return (
    <NumberInputEntry
      id="columns"
      label="Columns"
      onChange={ onChange }
      value={ value }
      min="1"
      max="3"
      debounce={ false } />
  );
}
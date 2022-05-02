import { TextInputEntry } from '../components';

export default function ValuesKeyEntry(props) {
  const {
    editField,
    field
  } = props;

  // todo(pinussilvestrus): is this sufficient or do we need a dedicated checkbox to control?
  // todo(pinussilvestrus): remove <values> if set?

  return (
    <TextInputEntry
      editField={ editField }
      field={ field }
      id="valuesKey"
      label="Dynamic Values Key"
      path={ [ 'valuesKey' ] }
      description="Define where values are populated from. Can map to a process variable." />
  );

}
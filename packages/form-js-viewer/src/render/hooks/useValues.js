import useService from './useService';


export default function(field) {
  const {
    valuesKey,
    values: staticValues
  } = field;

  const form = useService('form');

  const {
    initialData = {}
  } = form._getState();

  // todo(pinussilvestrus): consider using state here
  let values = staticValues;

  // todo(pinussilvestrus): do the array validation elsewhere (on import)
  // todo(pinussilvestrus): do we hardly distinct static vs. dynamic data?
  // cf. https://github.com/bpmn-io/form-js/issues/197#issuecomment-1114876325
  if (valuesKey && initialData[valuesKey] && Array.isArray(initialData[valuesKey])) {
    values = initialData[valuesKey];
  }

  // todo(pinssilvestrus): get from function via async effect

  return values;
}
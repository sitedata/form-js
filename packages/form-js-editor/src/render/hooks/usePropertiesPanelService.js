import {
  useContext
} from '@bpmn-io/properties-panel/preact/hooks';

import { PropertiesPanelContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(PropertiesPanelContext);

  return getService(type, strict);
}
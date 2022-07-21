import {
  useContext
} from 'preact/hooks';

import { PropertiesPanelContext } from '../context';


export default function(type, strict) {
  const {
    getService
  } = useContext(PropertiesPanelContext);

  return getService(type, strict);
}
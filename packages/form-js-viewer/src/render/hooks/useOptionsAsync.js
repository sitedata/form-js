import { useEffect, useState } from 'preact/hooks';
import useService from './useService';

/**
 * @enum { String }
 */
export const LOAD_STATES = {
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error'
};

/**
 * @typedef {Object} OptionsGetter
 * @property {Object[]} options - The options data
 * @property {(LOAD_STATES)} state - The options data's loading state, to use for conditional rendering
 */

/**
 * A hook to load options for single and multiselect components.
 *
 * @param {Object} field - The form field to handle options for
 * @return {OptionsGetter} optionsGetter - An options getter object providing loading state and option values
 */
export default function(field) {
  const {
    optionsKey,
    values: staticOptions
  } = field;

  const [ optionsGetter, setOptionsGetter ] = useState({ options: [], state: LOAD_STATES.LOADING });
  const initialData = useService('form')._getState().initialData;

  useEffect(() => {

    let options = [];

    if (optionsKey !== undefined) {

      const safeInitialData = initialData || {};
      const keyedOptions = safeInitialData[ optionsKey ];

      if (keyedOptions && Array.isArray(keyedOptions)) {
        options = keyedOptions;
      }
    }
    else if (staticOptions !== undefined) {
      options = Array.isArray(staticOptions) ? staticOptions : [];
    }
    else {
      setOptionsGetter({ options, state: LOAD_STATES.ERROR });
      return;
    }

    setOptionsGetter({ options, state: LOAD_STATES.LOADED });

  }, [optionsKey, staticOptions, initialData]);

  return optionsGetter;
}


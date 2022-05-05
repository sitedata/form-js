import { useContext, useEffect, useRef, useState } from 'preact/hooks';

import { FormContext } from '../../context';

import Description from '../Description';
import Errors from '../Errors';
import Label from '../Label';

import {
  formFieldClasses,
  prefixId
} from '../Util';
import DropdownList from './parts/DropdownList';

const type = 'taglist';


export default function Taglist(props) {
  const {
    disabled,
    errors = [],
    field,
    value = []
  } = props;

  const {
    description,
    id,
    label,
    values
  } = field;

  const { formId } = useContext(FormContext);
  const [filter, setFilter] = useState('');
  const [selectedValues, setSelectedValues] = useState([]);
  const [filteredValues, setFilteredValues] = useState([]);
  const [isDropdownExpanded, setIsDropdownExpanded] = useState(false);
  const searchbar = useRef();


  // Usage of stringify is necessary here because we want this effect to only trigger when there is a real change to the array
  useEffect(() => {
    setSelectedValues(values.filter(v => value.includes(v.value)));
  }, [JSON.stringify(value), values]);

  useEffect(() => {
    setFilteredValues(values.filter((v) => v.label && (v.label.includes(filter) || v.value.includes(filter)) && !value.includes(v.value)));
  }, [filter, JSON.stringify(value), values]);

  const onFilterChange = ({ target }) => {
    setFilter(target.value);
  };

  const selectValue = (item) => {
    searchbar.current.focus();
    props.onChange({ value: [...value, item.value], field });
  };

  const deselectValue = (item) => {
    searchbar.current.focus();
    props.onChange({ value: value.filter((v) => v != item.value), field });
  };

  return <div class={ formFieldClasses(type, errors) }>
    <Label
      label={ label } />
    <div class="fjs-taglist-root">
      <div class={ 'fjs-taglist-search-container' + (disabled ? ' disabled' : '') }>
        {!disabled &&
          selectedValues.map((sv) => {
            return (
              <div class="fjs-taglist-tag">
                <span class="fjs-taglist-tag-label">
                  {sv.label}
                </span>
                <span class="fjs-taglist-tag-remove" onMouseDown={ (e) => { e.preventDefault(); deselectValue(sv); } }>🗙</span>
              </div>
            );
          })
        }
        <input
          disabled={ disabled }
          class="fjs-taglist-input"
          ref={ searchbar }
          id={ prefixId(`${id}-search`, formId) }
          onChange={ onFilterChange }
          type="text"
          value={ filter }
          placeholder="Add values"
          autoComplete="off"
          onFocus={ () => setIsDropdownExpanded(true) }
          onBlur={ () => setIsDropdownExpanded(false) } />
      </div>
      {!disabled && <DropdownList
        values={ filteredValues }
        getLabel={ (v) => v.label }
        onValueSelected={ (v) => selectValue(v) }
        isExpanded={ isDropdownExpanded } />}
    </div>
    <Description description={ description } />
    <Errors errors={ errors } />
  </div>;
}

Taglist.create = function(options = {}) {
  return {
    values: [
      {
        label: 'Value',
        value: 'value'
      }
    ],
    ...options
  };
};

Taglist.type = type;
Taglist.label = 'Taglist';
Taglist.keyed = true;
Taglist.emptyValue = [];
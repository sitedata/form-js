import { PropertiesPanel } from '@bpmn-io/properties-panel';

import {
  useCallback,
  useEffect,
  useState
} from 'preact/hooks';

import { PropertiesPanelContext } from './context';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import {
  CustomValuesGroup,
  GeneralGroup,
  ValidationGroup,
  ValuesGroups
} from './groups';

function getGroups(field, editField) {

  if (!field) {
    return [];
  }

  const groups = [
    GeneralGroup(field, editField),
    ...ValuesGroups(field, editField),
    ValidationGroup(field, editField),
    CustomValuesGroup(field, editField)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default function FormPropertiesPanel(props) {
  const {
    eventBus,
    injector
  } = props;

  const formEditor = injector.get('formEditor');
  const modeling = injector.get('modeling');
  const selection = injector.get('selection');

  const { schema } = formEditor._getState();

  const [ selectedFormField, setSelection ] = useState(schema);

  const propertiesPanelContext = {
    getService(type, strict = true) {
      return injector.get(type, strict);
    }
  };

  useEffect(() => {
    function handleSelectionChanged(event) {
      setSelection(event.selection || schema);
    }

    eventBus.on('selection.changed', handleSelectionChanged);

    setSelection(selection.get() || schema);

    return () => {
      eventBus.off('selection.changed', handleSelectionChanged);
    };
  }, [ schema, selection ]);

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  const editField = useCallback((formField, key, value) => modeling.editFormField(formField, key, value), [ modeling ]);

  return (
    <div
      class="fjs-properties-panel"
      data-field={ selectedFormField && selectedFormField.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <PropertiesPanelContext.Provider value={ propertiesPanelContext }>
        <PropertiesPanel
          element={ selectedFormField }
          eventBus={ eventBus }
          groups={ getGroups(selectedFormField, editField) }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
        />
      </PropertiesPanelContext.Provider>
    </div>
  );
}
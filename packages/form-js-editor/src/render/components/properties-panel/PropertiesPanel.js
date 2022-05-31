import { PropertiesPanel } from '@bpmn-io/properties-panel';

import { PropertiesPanelContext } from '../../context';

import { PropertiesPanelHeaderProvider } from './PropertiesPanelHeaderProvider';
import { PropertiesPanelPlaceholderProvider } from './PropertiesPanelPlaceholderProvider';

import {
  CustomValuesGroup,
  GeneralGroup,
  ValidationGroup,
  ValuesGroup
} from './groups';

function getGroups(field, editField) {

  if (!field) {
    return [];
  }

  const groups = [
    GeneralGroup(field, editField),
    ValuesGroup(field, editField),
    ValidationGroup(field, editField),
    CustomValuesGroup(field, editField)
  ];

  // contract: if a group returns null, it should not be displayed at all
  return groups.filter(group => group !== null);
}

export default function FormPropertiesPanel(props) {
  const {
    editField,
    eventBus,
    field,
    injector
  } = props;

  const propertiesPanelContext = {
    getService(type, strict = true) {
      return injector.get(type, strict);
    }
  };

  const onFocus = () => eventBus.fire('propertiesPanel.focusin');

  const onBlur = () => eventBus.fire('propertiesPanel.focusout');

  return (
    <div
      class="fjs-properties-panel"
      data-field={ field && field.id }
      onFocusCapture={ onFocus }
      onBlurCapture={ onBlur }
    >
      <PropertiesPanelContext.Provider value={ propertiesPanelContext }>
        <PropertiesPanel
          element={ field }
          eventBus={ eventBus }
          groups={ getGroups(field, editField) }
          headerProvider={ PropertiesPanelHeaderProvider }
          placeholderProvider={ PropertiesPanelPlaceholderProvider }
        />
      </PropertiesPanelContext.Provider>
    </div>
  );
}
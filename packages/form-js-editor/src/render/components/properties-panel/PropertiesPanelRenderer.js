import PropertiesPanel from './PropertiesPanel';

import {
  render
} from '@bpmn-io/properties-panel/preact';

import {
  domify,
  query as domQuery
} from 'min-dom';

export default class PropertiesPanelRenderer {

  constructor(injector, eventBus) {
    this._eventBus = eventBus;
    this._injector = injector;

    this._container = domify('<div style="height: 100%" class="bio-properties-panel-container" input-handle-modified-keys="y,z"></div>');
  }


  /**
   * Attach the properties panel to a parent node.
   *
   * @param {HTMLElement} container
   */
  attachTo(container) {
    if (!container) {
      throw new Error('container required');
    }

    if (typeof container === 'string') {
      container = domQuery(container);
    }

    // (1) detach from old parent
    this.detach();

    // (2) append to parent container
    container.appendChild(this._container);

    // (3) notify interested parties
    this._eventBus.fire('propertiesPanel.attach');
  }

  /**
   * Detach the properties panel from its parent node.
   */
  detach() {
    const parentNode = this._container.parentNode;

    if (parentNode) {
      parentNode.removeChild(this._container);

      this._eventBus.fire('propertiesPanel.detach');
    }
  }

  renderPanel(field, editField) {
    render(
      <PropertiesPanel
        editField={ editField }
        eventBus={ this._eventBus }
        field={ field }
        injector={ this._injector }
      />,
      this._container
    );

    this._eventBus.fire('propertiesPanel.rendered');
  }

  _destroy() {
    if (this._container) {
      render(null, this._container);

      this._eventBus.fire('propertiesPanel.destroyed');
    }
  }
}

PropertiesPanelRenderer.$inject = [ 'injector', 'eventBus' ];

import AddFormFieldsHandler from './cmd/AddFormFieldsHandler';
import EditFormFieldHandler from './cmd/EditFormFieldHandler';
import MoveFormFieldHandler from './cmd/MoveFormFieldHandler';
import RemoveFormFieldsHandler from './cmd/RemoveFormFieldsHandler';


export default class Modeling {
  constructor(commandStack, eventBus, formEditor, formFieldRegistry) {
    this._commandStack = commandStack;
    this._formEditor = formEditor;
    this._formFieldRegistry = formFieldRegistry;

    eventBus.on('form.init', () => {
      this.registerHandlers();
    });
  }

  registerHandlers() {
    Object.entries(this.getHandlers()).forEach(([ id, handler ]) => {
      this._commandStack.registerHandler(id, handler);
    });
  }

  getHandlers() {
    return {
      'formFields.add': AddFormFieldsHandler,
      'formField.edit': EditFormFieldHandler,
      'formField.move': MoveFormFieldHandler,
      'formFields.remove': RemoveFormFieldsHandler
    };
  }

  addFormField(targetFormField, targetIndex, newFormField) {
    this.addFormFields(targetFormField, targetIndex, newFormField);
  }

  addFormFields(targetFormField, targetIndex, newFormFields) {
    if (!Array.isArray(newFormFields)) {
      newFormFields = [ newFormFields ];
    }

    const context = {
      newFormFields,
      targetFormField,
      targetIndex
    };

    this._commandStack.execute('formFields.add', context);
  }

  editFormField(formField, key, value) {
    const context = {
      formField,
      key,
      value
    };

    this._commandStack.execute('formField.edit', context);
  }

  moveFormField(sourceFormField, targetFormField, sourceIndex, targetIndex) {
    const context = {
      sourceFormField,
      targetFormField,
      sourceIndex,
      targetIndex
    };

    this._commandStack.execute('formField.move', context);
  }

  removeFormField(sourceFormField, sourceIndex) {
    this.removeFormFields(sourceFormField, sourceIndex, sourceIndex + 1);
  }

  removeFormFields(sourceFormField, sourceIndex, endIndex) {
    const context = {
      sourceFormField,
      sourceIndex,
      endIndex
    };

    this._commandStack.execute('formFields.remove', context);
  }
}

Modeling.$inject = [ 'commandStack', 'eventBus', 'formEditor', 'formFieldRegistry' ];
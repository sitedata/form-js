import { useContext } from 'preact/hooks';

import FormField from '../FormField';

import { FormRenderContext } from '../../context';

import Default from './Default';

import { formFieldClasses } from '../Util';

import { generateIdForType } from '../../../util';

const type = 'columns';

export default function ColumnsRenderer(props) {
  const {
    Element,
    Empty
  } = useContext(FormRenderContext);

  const { field } = props;

  const { components = [] } = field;

  return (
    <Element class="fjs-columns" field={ field }>
      <div class={ formFieldClasses(type) }>
        {
          components.length
            ? components.map((column) => {
              return (
                <div class="fjs-column">
                  <FormField
                    { ...props }
                    field={ column } />
                </div>
              );
            })
            : <Empty />
        }
      </div>
    </Element>
  );
}

ColumnsRenderer.create = function(options = {}) {
  const id = generateIdForType(type);

  return {
    components: [
      Default.create(),
      Default.create()
    ],
    id,
    type,
    ...options
  };
};

ColumnsRenderer.type = type;

ColumnsRenderer.label = 'Columns';
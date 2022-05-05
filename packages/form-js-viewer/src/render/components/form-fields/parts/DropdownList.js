import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import useKeyPress from '../../../hooks/useKeyPress';
import useKeyPressAction from '../../../hooks/useKeyPressAction';

export default function DropdownList({ values = [], getLabel = (v) => v, onValueSelected = (v) => {}, isExpanded = false, height = 180 }) {

  const downPress = useKeyPress('ArrowDown');
  const upPress = useKeyPress('ArrowUp');
  const [mouseControl, setMouseControl] = useState(true);
  const [focusedValueIndex, setFocusedValueIndex] = useState(0);
  const dropdownContainer = useRef();
  const mouseScreenPos = useRef();

  const focusedItem = useMemo(() => values.length ? values[focusedValueIndex] : null, [focusedValueIndex, values]);

  const changeSelectionIndex = useCallback((delta) => {
    setFocusedValueIndex(x => Math.min(Math.max(0, x + delta), values.length - 1));
  }, [values.length]);

  useEffect(() => {
    if (focusedValueIndex === 0) return;

    if (!focusedValueIndex || !values.length) {
      setFocusedValueIndex(0);
    }
    else if (focusedValueIndex >= values.length) {
      setFocusedValueIndex(values.length - 1);
    }
  }, [focusedValueIndex, values.length]);

  useEffect(() => {
    if (isExpanded && values.length && downPress) {
      changeSelectionIndex(1);
      setMouseControl(false);
    }
  }, [isExpanded, changeSelectionIndex, downPress, values.length]);

  useEffect(() => {
    if (isExpanded && values.length && upPress) {
      changeSelectionIndex(-1);
      setMouseControl(false);
    }
  }, [isExpanded, changeSelectionIndex, upPress, values.length]);

  useEffect(() => {
    const individualEntries = dropdownContainer.current.children;
    if (individualEntries.length && !mouseControl) {
      individualEntries[focusedValueIndex].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [focusedValueIndex, mouseControl]);

  useKeyPressAction('Enter', () => {
    if (isExpanded && focusedItem) {
      onValueSelected(focusedItem);
    }
  });

  const mouseMove = (e, i) => {
    const userMoved = !mouseScreenPos.current || mouseScreenPos.current.x !== e.screenX && mouseScreenPos.current.y !== e.screenY;

    if (userMoved) {
      mouseScreenPos.current = { x: e.screenX, y: e.screenY };

      if (!mouseControl) {
        setMouseControl(true);
        setFocusedValueIndex(i);
      }
    }
  };

  return <div
    ref={ dropdownContainer }
    tabIndex={ -1 }
    class="fjs-dropdownlist-item-container"
    style={ { maxHeight: isExpanded ? height : 0 } }>
    {
      values.map((v, i) => {
        return (
          <div
            class={ 'fjs-dropdownlist-item' + (focusedValueIndex === i ? ' focused' : '') }
            onMouseMove={ (e) => mouseMove(e, i) }
            onMouseEnter={ mouseControl ? () => setFocusedValueIndex(i) : undefined }
            onMouseDown={ (e) => { e.preventDefault(); onValueSelected(v); } }>
            {getLabel(v)}
          </div>
        );
      })
    }
  </div>;
}
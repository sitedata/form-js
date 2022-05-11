import { useState, useEffect, useCallback, useRef, useMemo } from 'preact/hooks';
import useKeyDownAction from '../../../hooks/useKeyPressAction';

export default function DropdownList({
  values = [],
  getLabel = (v) => v,
  onValueSelected = (v) => {},
  height = 180,
  emptylistMessage = 'No results',
  listenerElement })
{

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

  useKeyDownAction('ArrowUp', () => {
    if (values.length) {
      changeSelectionIndex(-1);
      setMouseControl(false);
    }
  }, listenerElement);

  useKeyDownAction('ArrowDown', () => {
    if (values.length) {
      changeSelectionIndex(1);
      setMouseControl(false);
    }
  }, listenerElement);

  useKeyDownAction('Enter', () => {
    if (focusedItem) {
      onValueSelected(focusedItem);
    }
  }, listenerElement);

  useEffect(() => {
    const individualEntries = dropdownContainer.current.children;
    if (individualEntries.length && !mouseControl) {
      individualEntries[focusedValueIndex].scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [focusedValueIndex, mouseControl]);

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
    style={ { maxHeight: height } }>
    {
      !!values.length && values.map((v, i) => {
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
    {
      !values.length && <div class="fjs-dropdownlist-empty">{emptylistMessage}</div>
    }
  </div>;
}
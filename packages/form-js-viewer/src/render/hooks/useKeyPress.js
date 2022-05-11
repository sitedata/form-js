import { useEffect, useState } from 'preact/hooks';

export default function useKeyPress(targetKey, listenerElement = window) {
  const [keyPressed, setKeyPressed] = useState(false);

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
    }
  };

  useEffect(() => {
    listenerElement.addEventListener('keydown', downHandler);
    listenerElement.addEventListener('keyup', upHandler);

    return () => {
      listenerElement.removeEventListener('keydown', downHandler);
      listenerElement.removeEventListener('keyup', upHandler);
    };
  });

  return keyPressed;
}
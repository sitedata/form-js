import { useEffect } from 'preact/hooks';

export default function useKeyPressAction(targetKey, action) {

  let callback;

  function downHandler({ key }) {
    if (key === targetKey) {
      callback = action();
    }
  }

  const upHandler = ({ key }) => {
    if (key === targetKey && callback && typeof callback === 'function') {
      callback();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  });
}
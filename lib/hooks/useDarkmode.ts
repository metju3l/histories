import Cookie from 'js-cookie';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

const useDarkMode = (): {
  theme: string;
  setTheme: Dispatch<SetStateAction<string>>;
} => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(Cookie.get('theme') === 'dark' ? 'dark' : 'light');
    return;
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    const previousTheme = theme === 'dark' ? 'light' : 'dark';

    root.classList.remove(previousTheme);
    root.classList.add(theme);
    root.classList.remove(`bg-${previousTheme}-background`);
    root.classList.add(`bg-${theme}-background`);

    Cookie.set('theme', theme);
    return;
  }, [theme]);

  // @ts-ignore
  return { theme, setTheme };
};

export default useDarkMode;

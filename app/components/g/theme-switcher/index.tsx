'use client'
import React, {useEffect, useState} from "react";
import { useTheme } from "next-themes";
import { SunFilled, MoonFilled } from '@ant-design/icons'

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const {theme, setTheme} = useTheme();

  useEffect(() => {
    setMounted(true);
    const storedTheme = window.localStorage.getItem('theme') || 'light';
    if (storedTheme == 'light') {
      handleChange(false);
    } else {
      handleChange(true);
    }
  }, []);

  const handleChange = (checked: boolean) => {
    const obj: {[key: string]: string} = {
      true: 'dark',
      false: 'light'
    }
    setTheme(obj[String(checked)])
    setDarkMode(checked);
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <div className="link" onClick={() => handleChange(!darkMode)}>
          {
            darkMode
            ?
            <MoonFilled style={{fontSize: '18px', color: 'var(--primary-color)'}}></MoonFilled>
            :
            <SunFilled style={{fontSize: '18px', color: 'var(--primary-color)'}}></SunFilled>
          }
      </div>
    </>
  );
};

export default ThemeSwitcher;

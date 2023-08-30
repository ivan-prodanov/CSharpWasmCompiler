import React from 'react';
import { ThemeName } from '.';

export type ThemeContextType = {
    themeName: ThemeName;
    setThemeName: (themeName: ThemeName) => void;
};

export const ThemeContext = React.createContext<ThemeContextType>({
    themeName: ThemeName.dark,
    setThemeName: (themeName) => console.warn('no theme provider'),
});

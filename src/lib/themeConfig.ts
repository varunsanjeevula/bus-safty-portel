/**
 * Unified Theme Configuration
 * Ensures consistent theming across the entire application
 */

export const themeConfig = {
  // Light Mode
  light: {
    background: 'bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50',
    header: 'bg-gradient-to-r from-white via-indigo-50 to-white border-indigo-200',
    card: 'bg-white border-indigo-100',
    text: {
      primary: 'text-slate-900',
      secondary: 'text-slate-600',
      muted: 'text-slate-500',
    },
    button: {
      primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white',
      secondary: 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200',
    },
    gradient: {
      primary: 'from-indigo-600 via-purple-600 to-pink-600',
      secondary: 'from-indigo-50 to-purple-50',
      accent: 'from-indigo-500 to-purple-600',
    },
    divider: 'border-indigo-200',
    shadow: 'shadow-lg',
  },

  // Dark Mode
  dark: {
    background: 'bg-gradient-to-b from-slate-950 to-slate-900',
    header: 'bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700',
    card: 'bg-slate-800 border-slate-700',
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    button: {
      primary: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white',
      secondary: 'bg-slate-700 text-indigo-300 hover:bg-slate-600',
    },
    gradient: {
      primary: 'from-indigo-500 via-purple-500 to-pink-500',
      secondary: 'from-slate-800 to-slate-900',
      accent: 'from-indigo-500 to-purple-600',
    },
    divider: 'border-slate-700',
    shadow: 'shadow-2xl',
  },

  // Shared Colors (Work in both modes)
  shared: {
    success: 'bg-emerald-500 text-white',
    warning: 'bg-amber-500 text-white',
    error: 'bg-red-500 text-white',
    info: 'bg-blue-500 text-white',
  },

  // Primary Brand Colors (Global - always same)
  brand: {
    indigo: 'from-indigo-600 to-indigo-700',
    purple: 'from-purple-600 to-purple-700',
    pink: 'from-pink-600 to-pink-700',
    gradient: 'from-indigo-600 via-purple-600 to-pink-600',
  },

  // Icon Colors (Global)
  icons: {
    primary: 'text-indigo-600 dark:text-indigo-400',
    secondary: 'text-purple-600 dark:text-purple-400',
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-amber-600 dark:text-amber-400',
    error: 'text-red-600 dark:text-red-400',
  },
};

/**
 * Helper function to get theme classes
 */
export function getThemeClass(theme: 'light' | 'dark', key: string): string {
  const themeObj = theme === 'dark' ? themeConfig.dark : themeConfig.light;
  const keys = key.split('.');
  let value: any = themeObj;
  
  for (const k of keys) {
    value = value[k];
  }
  
  return value as string;
}

/**
 * Responsive theme switching hook hint
 */
export function useThemeClasses(isDarkMode: boolean) {
  const theme = isDarkMode ? 'dark' : 'light';
  const config = isDarkMode ? themeConfig.dark : themeConfig.light;
  
  return {
    ...config,
    theme,
    shared: themeConfig.shared,
    brand: themeConfig.brand,
    icons: themeConfig.icons,
  };
}

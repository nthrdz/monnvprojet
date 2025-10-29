// Design System Complet - Athlink Pro
// Palette de 7 couleurs vibrantes + Système complet

export const designSystem = {
  colors: {
    // Bleu Électrique (Primary)
    blue: {
      50: '#e6f0ff',
      100: '#b3d7ff',
      200: '#80beff',
      300: '#4da5ff',
      400: '#1a8cff',
      500: '#0073e6',  // Main
      600: '#005bb8',
      700: '#00448a',
      800: '#002d5c',
      900: '#00162e',
    },
    
    // Orange Énergique (Accent)
    orange: {
      50: '#fff4e6',
      100: '#ffe0b3',
      200: '#ffcc80',
      300: '#ffb84d',
      400: '#ffa41a',
      500: '#ff9000',  // Main
      600: '#cc7300',
      700: '#995600',
      800: '#663a00',
      900: '#331d00',
    },
    
    // Vert Performance (Success)
    green: {
      50: '#e6f9f0',
      100: '#b3efd4',
      200: '#80e5b8',
      300: '#4ddb9c',
      400: '#1ad180',
      500: '#00c766',  // Main
      600: '#009f52',
      700: '#00773d',
      800: '#004f29',
      900: '#002714',
    },
    
    // Rose Dynamique (Tertiary)
    pink: {
      50: '#ffe6f0',
      100: '#ffb3d4',
      200: '#ff80b8',
      300: '#ff4d9c',
      400: '#ff1a80',
      500: '#e6006b',  // Main
      600: '#b80055',
      700: '#8a0040',
      800: '#5c002b',
      900: '#2e0015',
    },
    
    // Violet Premium (Quaternary)
    purple: {
      50: '#f0e6ff',
      100: '#d4b3ff',
      200: '#b880ff',
      300: '#9c4dff',
      400: '#801aff',
      500: '#6b00e6',  // Main
      600: '#5500b8',
      700: '#40008a',
      800: '#2b005c',
      900: '#15002e',
    },
    
    // Jaune Solaire (Warning)
    yellow: {
      50: '#fffbe6',
      100: '#fff4b3',
      200: '#ffed80',
      300: '#ffe64d',
      400: '#ffdf1a',
      500: '#ffd700',  // Main
      600: '#ccac00',
      700: '#998100',
      800: '#665600',
      900: '#332b00',
    },
    
    // Rouge Alerte (Danger)
    red: {
      50: '#ffe6e6',
      100: '#ffb3b3',
      200: '#ff8080',
      300: '#ff4d4d',
      400: '#ff1a1a',
      500: '#e60000',  // Main
      600: '#b80000',
      700: '#8a0000',
      800: '#5c0000',
      900: '#2e0000',
    },
    
    // Gris Moderne
    gray: {
      50: '#f8f9fa',
      100: '#f1f3f5',
      200: '#e9ecef',
      300: '#dee2e6',
      400: '#ced4da',
      500: '#adb5bd',
      600: '#6c757d',
      700: '#495057',
      800: '#343a40',
      900: '#212529',
    },
  },
  
  gradients: {
    hero: 'linear-gradient(135deg, #1a8cff 0%, #801aff 50%, #ff1a80 100%)',
    performance: 'linear-gradient(90deg, #00c766 0%, #0073e6 100%)',
    energy: 'linear-gradient(45deg, #ff9000 0%, #ffd700 100%)',
    premium: 'linear-gradient(180deg, #6b00e6 0%, #ff1a80 100%)',
    sunset: 'linear-gradient(135deg, #ff9000 0%, #ff1a80 100%)',
    ocean: 'linear-gradient(135deg, #0073e6 0%, #00c766 100%)',
    fire: 'linear-gradient(45deg, #e60000 0%, #ff9000 100%)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    base: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '120px',
  },
  
  borderRadius: {
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    full: '9999px',
  },
  
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.08)',
    standard: '0 4px 12px rgba(0, 0, 0, 0.12)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.15)',
    floating: '0 16px 48px rgba(0, 0, 0, 0.20)',
    'glow-blue': '0 0 40px rgba(0, 115, 230, 0.3)',
    'glow-orange': '0 0 40px rgba(255, 144, 0, 0.3)',
    'glow-green': '0 0 40px rgba(0, 199, 102, 0.3)',
    'glow-pink': '0 0 40px rgba(230, 0, 107, 0.3)',
    'glow-purple': '0 0 40px rgba(107, 0, 230, 0.3)',
  },
  
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: {
      hero: '96px',
      h1: '56px',
      h2: '40px',
      h3: '32px',
      h4: '24px',
      body: '16px',
      small: '14px',
      tiny: '12px',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.6,
    },
  },
}
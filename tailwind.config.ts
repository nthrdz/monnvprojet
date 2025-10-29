import type { Config } from "tailwindcss"
import { designSystem } from "./lib/design-system"

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "2rem",
        lg: "3rem",
      },
      screens: {
        "2xl": "1440px",
      },
    },
    extend: {
      // Couleurs de base shadcn
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // PALETTE VIBRANTE COMPLÈTE
        'brand-blue': designSystem.colors.blue,
        'brand-orange': designSystem.colors.orange,
        'brand-green': designSystem.colors.green,
        'brand-pink': designSystem.colors.pink,
        'brand-purple': designSystem.colors.purple,
        'brand-yellow': designSystem.colors.yellow,
        'brand-red': designSystem.colors.red,
        
        // Couleurs thématiques pour les composants
        'theme-primary': designSystem.colors.blue,
        'theme-tertiary': designSystem.colors.pink,
        'theme-quaternary': designSystem.colors.purple,
        'theme-success': designSystem.colors.green,
        'theme-warning': designSystem.colors.yellow,
        'theme-danger': designSystem.colors.red,
        'theme-accent': designSystem.colors.orange,
      },
      
      // Gradients professionnels
      backgroundImage: {
        'gradient-hero': designSystem.gradients.hero,
        'gradient-performance': designSystem.gradients.performance,
        'gradient-energy': designSystem.gradients.energy,
        'gradient-premium': designSystem.gradients.premium,
        'gradient-sunset': designSystem.gradients.sunset,
        'gradient-ocean': designSystem.gradients.ocean,
        'gradient-fire': designSystem.gradients.fire,
      },
      
      // Box shadows professionnelles
      boxShadow: {
        'subtle': designSystem.shadows.subtle,
        'standard': designSystem.shadows.standard,
        'elevated': designSystem.shadows.elevated,
        'floating': designSystem.shadows.floating,
        'glow-blue': designSystem.shadows['glow-blue'],
        'glow-orange': designSystem.shadows['glow-orange'],
        'glow-green': designSystem.shadows['glow-green'],
        'glow-pink': designSystem.shadows['glow-pink'],
        'glow-purple': designSystem.shadows['glow-purple'],
      },
      
      // Animations fluides
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'count-up': 'countUp 1s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 8s linear infinite',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        countUp: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
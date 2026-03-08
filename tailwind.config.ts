import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
		'./src/**/*.{ts,tsx}',
  ],
  theme: {
  	extend: {

		screens: {
			'xs-h': {
				raw: '(min-height: 480px)'
			},
			'sm-h': {
				raw: '(min-height: 640px)'
			},
			'md-h': {
				raw: '(min-height: 768px)'
			},
			'lg-h': {
				raw: '(min-height: 1024px)'
			},
			'xl-h': {
				raw: '(min-height: 1280px)'
			},
			'2xl-h': {
				raw: '(min-height: 1536px)'
			}
		},
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			blue: {
				500: '#1364f1'
			},
			green: {
				500: '#54B435'
			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
			'pulse-scale': {
				'0%, 100%': { transform: 'scale(1)' },
				'50%': { transform: 'scale(1.1)' },
			},
			spotlight: {
				"0%": {
					opacity: '0',
					transform: "translate(-72%, -62%) scale(0.5)",
				},
				"100%": {
					opacity: '1',
					transform: "translate(-50%,-40%) scale(1)",
				},
			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			spotlight: "spotlight 2s ease .75s 1 forwards",
			'pulse-scale': 'pulse-scale 5s infinite',
		}
  	}
  },
	// eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate"), require("@xpd/tailwind-3dtransforms")],
} satisfies Config;

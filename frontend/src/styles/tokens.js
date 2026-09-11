export const tokens = {
    colors: {
        white: '#FFFFFF',
        black: '#1E1E1E',

        gray: {
            100: '#717171',
            200: '#D5D5D5',
            300: '#F5F5F5', // fundo das telas (Tasks, Rankings, Gestão)
        },
        yellow: '#D98836',
        yellow50: 'rgba(217, 136, 54, 0.5)',
        yellow20: 'rgba(217, 136, 54, 0.2)',
        orange: '#D94F36',
        brandGradient: 'linear-gradient(135deg, #D94F36 0%, #D98836 100%)',

        error: '#D94F36',
        success: '#3F8F5F',
    },

    typography: {
        fontFamily: "'Poppins', sans-serif",
        fontWeight: {
            thin: 100,
            extraLight: 200,
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            extraBold: 800,
            black: 900,
        },
        fontSize: {
            titleHeader: '20px',
            titleComponent: '14px',
            subtitleHeader: '12px',
            subtitleComponent: '10px',
        },
        lineHeight: {
            tight: '100%',
            normal: '120%',
            relaxed: '140%',
        },
    },

    spacing: {
        none: '0px',
        text: '4px',
        chip: '6px',
        card: '12px',
        screen: '16px', // padding horizontal padrão das telas
    },

    borderRadius: {
        card: '8px',
        window: '16px',
        chip: '999px',
    },

    layout: {
        bottomNavHeight: '64px',
        fabSize: '48px',
    },
}
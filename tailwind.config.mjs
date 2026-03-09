/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./modules/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    corePlugins: {
        preflight: false,
    },
    theme: {
        extend: {
            colors: {
                admin: {
                    bg: '#0B0F19',
                    card: '#111827',
                    border: '#1F2937',
                    text: '#F9FAFB',
                    textMuted: '#9CA3AF',
                    primary: '#3B82F6',
                    primaryHover: '#2563EB',
                    success: '#10B981',
                    danger: '#EF4444',
                    warning: '#F59E0B'
                }
            }
        },
    },
    plugins: [],
}

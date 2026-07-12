export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        surface: '#0B1220',
        surface2: '#111C2D',
        surface3: '#12213B',
        border: 'rgba(148, 163, 184, 0.14)',
        text: '#F8FAFC',
        muted: '#94A3B8',
        accent: '#38BDF8',
        positive: '#10B981',
        caution: '#F59E0B',
        danger: '#EF4444'
      },
      boxShadow: {
        soft: '0 24px 80px rgba(8, 11, 17, 0.36)',
        panel: '0 18px 42px rgba(0, 0, 0, 0.24)'
      }
    }
  },
  plugins: []
};

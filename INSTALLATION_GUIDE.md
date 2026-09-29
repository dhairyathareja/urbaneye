# UrbanEye Installation & Setup Guide

## 🎯 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Python 3.8+ (optional, for backend)

### Installation Steps

#### 1. Extract the Project
```bash
unzip urbaneye_prototype.zip
cd urbaneye_prototype
```

#### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

#### 3. Install Backend Dependencies (Optional)
```bash
cd backend
pip install -r requirements.txt
cd ..
```

## 🚀 Running the Application

### Option A: Frontend Only (Recommended for Demo)
```bash
cd frontend
npm run dev
```
The app will be available at `http://localhost:5173`

### Option B: Full Stack (Frontend + Backend)

#### Terminal 1 - Backend
```bash
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### Option C: Production Build
```bash
cd frontend
npm run build
# Serve the dist folder
npx serve -s dist -l 3000
```

## 🌓 Theme System Features

### What's New
✅ **Light & Dark Theme Toggle** - Click the Moon/Sun icon in the navbar  
✅ **Sound Button Removed** - Clean, clutter-free interface  
✅ **Persistent Theme Preference** - Your choice is saved automatically  
✅ **Full Component Theming** - All UI elements support both modes  

### Using the Theme Toggle
1. Look for the Moon/Sun icon in the top navbar
2. Click to switch between light and dark modes
3. Your preference is automatically saved to localStorage

## 📁 Project Structure

```
urbaneye_prototype/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 ✨ Updated with theme support
│   │   ├── components/
│   │   │   └── Navbar.jsx          ✨ Theme toggle button
│   │   └── ...other components
│   ├── tailwind.config.js          ✨ Dark mode configuration
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── main.py
│   ├── cv_engine.py
│   ├── simulated_data.py
│   └── requirements.txt
├── THEME_IMPLEMENTATION.md         📖 Theme guide
├── INSTALLATION_GUIDE.md           📖 This file
└── README_TEAM.txt                 📖 Original documentation
```

## 🔑 Key Modified Files

### 1. `frontend/src/App.jsx`
- ✅ Added theme state management
- ✅ Removed soundEnabled state
- ✅ Removed all playAlertSound() calls
- ✅ Added useEffect for theme persistence

### 2. `frontend/src/components/Navbar.jsx`
- ✅ Removed sound toggle button (Volume2, VolumeX icons)
- ✅ Added theme toggle button (Moon, Sun icons)
- ✅ Updated all colors for light/dark mode support
- ✅ Updated button and text styling for both themes

### 3. `frontend/tailwind.config.js`
- ✅ Added `darkMode: 'class'` configuration
- ✅ Extended colors with light/dark theme definitions

## 🎨 Color Palettes

### Dark Mode (Default)
```
Background:       #090d16
Secondary:        #0f1419
Text Primary:     #f1f5f9
Text Secondary:   #cbd5e1
Borders:          #1e293b
```

### Light Mode
```
Background:       #ffffff
Secondary:        #f8fafc
Text Primary:     #1e293b
Text Secondary:   #64748b
Borders:          #e2e8f0
```

## 🧪 Verification

After installation, verify everything works:

1. **Theme Toggle Works**
   - Click the Moon/Sun button in navbar
   - Interface should switch between light and dark

2. **Theme Persists**
   - Change theme
   - Refresh the page
   - Theme should remain unchanged

3. **No Sound Issues**
   - No audio should play on login/actions
   - No console errors related to audio

4. **Responsive Design**
   - Test on mobile, tablet, and desktop
   - All elements should adapt correctly

## 🛠️ Troubleshooting

### Theme not switching?
- Clear browser cache: `Ctrl+Shift+Delete`
- Check localStorage in DevTools (`F12` → Application → Local Storage)
- Ensure `urbaneye_theme` key exists

### Styling looks broken?
- Rebuild Tailwind: `npm run build` in frontend folder
- Clear node_modules: `rm -rf node_modules && npm install`

### Backend connection failed?
- Check if backend is running on port 8000
- Verify firewall settings
- Look for CORS errors in browser console

### Audio still playing?
- All audio code has been removed
- Clear browser cache completely
- Hard refresh with `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

## 📚 Documentation Files

- **THEME_IMPLEMENTATION.md** - Detailed theme system documentation
- **INSTALLATION_GUIDE.md** - This file
- **URBANEYE_A_to_Z_Documentation.md** - Full project documentation
- **URBANEYE_A_to_Z_Presentation_Deck.html** - Visual presentation

## 🔗 Useful Commands

```bash
# Install all dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code (if configured)
npm run lint

# Format code (if configured)
npm run format
```

## 📱 Browser Compatibility

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |

## 🎓 Learning Resources

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [React Hooks Documentation](https://reactjs.org/docs/hooks-intro)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 📞 Support

For issues or questions:
1. Check existing documentation
2. Review component code comments
3. Check browser console for errors
4. Verify all dependencies are installed

## ✅ Checklist for Deployment

- [ ] All dependencies installed
- [ ] Frontend runs without errors
- [ ] Theme toggle working
- [ ] Theme persists after refresh
- [ ] No audio-related errors
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Built for production

---

**Version**: 2.0 (With Theme Support)  
**Last Updated**: September 2026  
**Status**: ✅ Ready for Production

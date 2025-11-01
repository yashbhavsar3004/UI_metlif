# UI_metlif

Hackathon MetLife 2025

## Tech Stack

- ⚡ **Vite** - Fast build tool and dev server
- ⚛️ **React** - UI library
- 🎨 **Material-UI (MUI)** - React component library following Material Design
- 📦 **JavaScript** - No TypeScript configuration

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build:

```bash
npm run preview
```

## Project Structure

```
UI_metlif/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point with MUI ThemeProvider
│   ├── index.css        # Global styles
│   └── assets/          # Static assets
├── public/              # Public assets
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## MUI Components Used

The app demonstrates various MUI components:
- `AppBar` & `Toolbar` - Navigation bar
- `Container` - Layout container
- `Card` & `CardContent` - Card components
- `Button` - Buttons with variants
- `Typography` - Text components
- `Stack` - Layout component
- `Chip` - Tag/badge component
- `IconButton` - Icon button
- `Box` - Flexbox container

## Customization

You can customize the MUI theme in `src/main.jsx` by modifying the `theme` object.

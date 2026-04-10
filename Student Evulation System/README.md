# Student Evaluation System

Electron + React (Vite) + SQLite scaffold.

Setup

1. Install dependencies:

```bash
npm install
```

2. Run in development:

```bash
npm run dev
```

Build

```bash
npm run build:app
```

Package (Windows .exe)

1. Make sure `build/icon.ico` contains your application icon.
2. Run:

```bash
npm run dist
```

The installer will be output to `dist-electron/`.

Production DB path

By default the app stores the SQLite DB in Electron's `userData` directory when packaged so the database is writable. During development the DB file remains in the project root for convenience.

Project layout

See electron/ for main process and services. React source is in `src/`.

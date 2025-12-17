# Mercans Frontend Test
**Vue 3 + Vite + Vue Router**

This project is a frontend implementation of the **Employee Self Service – My Payslips** feature, built using Vue 3 and Vite. The UI closely follows the provided Figma design, with strong focus on responsiveness and clean component structure.

---

## Tech Stack

- Vue 3 (Composition API)
- Vue Router 4
- Vite
- Plain CSS (scoped styles)

---

## How to Run the Project

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

The app will be available at:

```
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
mercans-fe-test/
├─ public/
│  └─ payslips/
│     └─ *.pdf
│
├─ src/
│  ├─ assets/
│  │  └─ icons/
│  ├─ components/
│  │  └─ Sidebar.vue
│  ├─ data/
│  │  ├─ menuLinks.json
│  │  └─ payslips.json
│  ├─ views/
│  │  └─ MyPayslipsView.vue
│  ├─ router/
│  │  └─ index.js
│  ├─ App.vue
│  └─ main.js
│
├─ package.json
└─ vite.config.js
```

---

## Sidebar

- Menu items are driven by `menuLinks.json`
- Items are sorted by `ordinal`
- Active route is highlighted
- Desktop: collapsible sidebar
- Mobile: overlay sidebar with hamburger / close icon
- Sidebar closes automatically on mobile after navigation

---

## MyPayslipsView

### Data Source

Payslips are loaded from:

```
src/data/payslips.json
```

### Data Processing

- Payslips are mapped and normalized
- Gross and net values are extracted
- Currency format: `5 600.00 USD`
- Sorted by payroll date (latest first)

### PDF Preview

Payslip PDFs are stored in:

```
public/payslips/
```

Displayed using an iframe when a row is expanded.

---

## Responsive Design

- Desktop and tablet layouts adapt fluidly
- Mobile sidebar opens as overlay
- Tables scroll inside container on small screens
- No page-level horizontal scrolling

---

## Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`

---

Thank you for reviewing this submission.

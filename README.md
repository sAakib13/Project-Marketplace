# Telerivet Solutions Marketplace 🚀

A modern communication-based project marketplace built with **Next.js**, featuring dynamic filters, animated carousels, and a smooth customer onboarding flow.

---

## 📌 Project Overview

This app helps users explore categorized communication solutions like SMS, WhatsApp, and Viber campaigns. It enables:

- 🔍 Browsing & searching for communication projects
- 📄 Viewing detailed project info
- 📬 Registering interest via a validated form

---

## ⚙️ Tech Stack

| Purpose           | Tools/Libraries                   |
| ----------------- | --------------------------------- |
| **Framework**     | Next.js, TypeScript, React        |
| **Styling**       | TailwindCSS, Oxanium font, clsx   |
| **UI**            | shadcn/ui, Lucide Icons, Radix UI |
| **Carousel**      | keen-slider, embla-carousel       |
| **Forms**         | react-hook-form, zod              |
| **State**         | React hooks                       |
| **API**           | Axios, Telerivet REST API         |
| **Validation**    | zod, @hookform/resolvers          |
| **Charts**        | recharts                          |
| **Date Handling** | date-fns, react-day-picker        |

---

## 🧭 Features

- 🧩 Project Cards with tags, industries, and channels
- 🔍 Search, filter, and toggle views (Internal / Customer)
- 🎞️ Auto-rotating hero carousel
- 📊 Project detail modals with ROI, benefits, and more
- 📝 Registration form with validation
- 📱 Fully responsive design
- 🎯 Scroll-triggered dialogs
- 🔁 API-integrated data handling from Telerivet

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- Yarn or npm

### Installation

````bash
git clone https://github.com/your-org/telerivet-marketplace.git
cd telerivet-marketplace
npm install

### Development

```bash
npm run dev

````

### Build

```bash
npm run build

```

---

## 🔐 Environment Variables

Create a `.env.local` file with:

```
TELERIVET_PROJECT_ID=your_project_id
TELERIVET_TABLE_ID=your_services_table
TELERIVET_TABLE_ID_ARTICLE=your_article_table
TELERIVET_API_KEY=your_secret_key

```

---

## 📡 API Endpoints

| Method | Endpoint        | Description                    |
| ------ | --------------- | ------------------------------ |
| `GET`  | `/api/projects` | Fetch all available services   |
| `POST` | `/api/article`  | Fetch project by serial number |

---

## 📂 Project Structure

```
/app
  /layout.tsx        → Global styling, font, metadata
  /page.tsx          → Main marketplace page
/components          → UI elements (Cards, Dialogs, Filters)
/lib                 → Utility functions
/styles              → Tailwind & globals.css

```

---

## 👥 Contributing

We welcome PRs! Please fork the repo and submit a pull request for review. Run `prettier` before committing:

```bash
npm run format

```

---

## 🛡 License

MIT

## 📃 For more info

Visit this document [Document](https://docs.google.com/document/d/11tLeV3DK2C7YMR6LhXq5-TXjvI-W0-_1J0pcuafi6aA/edit?usp=sharing)
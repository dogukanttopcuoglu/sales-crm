# Sales CRM

A responsive sales CRM interface built with Next.js, React, TypeScript, and Tailwind CSS. The app includes dashboards, pipeline views, forecast screens, team performance pages, activity management, contacts, and email sequences.

## Design previews

| Screen | Preview |
| --- | --- |
| Desktop | ![Desktop](public/design-frames/sales-crm-desktop-1440-1024.svg) |
| Deals Board | ![Deals Board](public/design-frames/sales-crm-deals-board-1440-1024.svg) |
| Forecast | ![Forecast](public/design-frames/sales-crm-forecast-1440-1024.svg) |
| Activities | ![Activities](public/design-frames/sales-crm-activities-1440-1024.svg) |
| Contacts | ![Contacts](public/design-frames/sales-crm-contacts-1440-1024.svg) |
| Email Sequences | ![Email Sequences](public/design-frames/sales-crm-email-sequences-1440-1024.svg) |
| Strategic AEs | ![Strategic AEs](public/design-frames/sales-crm-strategic-aes-1440-1024.svg) |
| Mid Market | ![Mid Market](public/design-frames/sales-crm-mid-market-1440-1024.svg) |
| SDR Team | ![SDR Team](public/design-frames/sales-crm-sdr-team-1440-1024.svg) |
| Q1 Forecast | ![Q1 Forecast](public/design-frames/sales-crm-q1-forecast-1440-1024.svg) |
| Slipping Deals | ![Slipping Deals](public/design-frames/sales-crm-slipping-deals-1440-1024.svg) |
| North America | ![North America](public/design-frames/sales-crm-north-america-1440-1024.svg) |
| EMEA Enterprise | ![EMEA Enterprise](public/design-frames/sales-crm-emea-enterprise-1440-1024.svg) |
| APAC Expansion | ![APAC Expansion](public/design-frames/sales-crm-apac-expansion-1440-1024.svg) |

## Included pages

- Companies
- Deals board
- Forecast
- Activities
- Contacts
- Email sequences
- Strategic AEs, Mid Market, and SDR Team
- Q1 Forecast
- Slipping Deals
- North America, EMEA Enterprise, and APAC Expansion

## Features

- Responsive CRM shell with desktop sidebar and mobile navigation
- Search, filtering, sorting, selection, and pagination
- Pipeline, forecast, quota, target, and team performance views
- Reusable cards, tables, headers, filters, badges, avatars, and metrics
- Local interaction state for common CRM workflows
- Self-hosted fonts and SVG assets

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
npm run dev        # Start the development server
npm run lint       # Run ESLint
npm run build      # Create a production build
npx tsc --noEmit   # Type-check the project
npx playwright test
```

## Project structure

```text
app/                 App Router pages and global styles
components/crm/      Shared CRM components and page views
public/crm/          Logos, icons, avatars, and other static assets
artifacts/            Reference images, captures, and reports
design-system/       Shared design tokens and snapshots
```


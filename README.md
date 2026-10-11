# Sales CRM

A responsive sales CRM interface built with Next.js, React, TypeScript, and Tailwind CSS. The app includes dashboards, pipeline views, forecast screens, team performance pages, activity management, contacts, and email sequences.

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

## Brilliant design frames

The source frames were exported from Brilliant as standalone SVG files:

| Screen | SVG |
| --- | --- |
| Desktop | [sales-crm-desktop-1440-1024.svg](public/design-frames/sales-crm-desktop-1440-1024.svg) |
| Deals Board | [sales-crm-deals-board-1440-1024.svg](public/design-frames/sales-crm-deals-board-1440-1024.svg) |
| Forecast | [sales-crm-forecast-1440-1024.svg](public/design-frames/sales-crm-forecast-1440-1024.svg) |
| Activities | [sales-crm-activities-1440-1024.svg](public/design-frames/sales-crm-activities-1440-1024.svg) |
| Contacts | [sales-crm-contacts-1440-1024.svg](public/design-frames/sales-crm-contacts-1440-1024.svg) |
| Email Sequences | [sales-crm-email-sequences-1440-1024.svg](public/design-frames/sales-crm-email-sequences-1440-1024.svg) |
| Strategic AEs | [sales-crm-strategic-aes-1440-1024.svg](public/design-frames/sales-crm-strategic-aes-1440-1024.svg) |
| Mid Market | [sales-crm-mid-market-1440-1024.svg](public/design-frames/sales-crm-mid-market-1440-1024.svg) |
| SDR Team | [sales-crm-sdr-team-1440-1024.svg](public/design-frames/sales-crm-sdr-team-1440-1024.svg) |
| Q1 Forecast | [sales-crm-q1-forecast-1440-1024.svg](public/design-frames/sales-crm-q1-forecast-1440-1024.svg) |
| Slipping Deals | [sales-crm-slipping-deals-1440-1024.svg](public/design-frames/sales-crm-slipping-deals-1440-1024.svg) |
| North America | [sales-crm-north-america-1440-1024.svg](public/design-frames/sales-crm-north-america-1440-1024.svg) |
| EMEA Enterprise | [sales-crm-emea-enterprise-1440-1024.svg](public/design-frames/sales-crm-emea-enterprise-1440-1024.svg) |
| APAC Expansion | [sales-crm-apac-expansion-1440-1024.svg](public/design-frames/sales-crm-apac-expansion-1440-1024.svg) |

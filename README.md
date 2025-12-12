# WaveCom Notification System - Frontend

Modern, responsive web interface for managing and monitoring notifications built with Next.js 15 and TypeScript.

## Features

- **Create Notifications** - Send email, SMS, and push notifications
- **Real-time Monitoring** - Track notification status and delivery
- **Smart Auto-refresh** - Optional polling with configurable intervals
- **Manual Retry** - Re-send failed notifications with one click
- **Clean UI** - Modern interface with Tailwind CSS
- **Responsive Design** - Works on desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Date Formatting**: date-fns

## Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Clone the repository

```bash
git clone <repository-url>
cd wavecom-frontend
```

2. Install dependencies

```bash
npm install
```

3. Create `.env.local` file

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

````

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
````

## Features Overview

### Notification Creation

- Support for multiple channels (Email, SMS, Push)
- Optional subject line for emails
- Form validation
- Success/error feedback

### Notification Monitoring

- Status filtering (All, Pending, Queued, Processing, Sent, Failed)
- Real-time status updates
- Delivery timestamps
- Error details for failed notifications

### Smart Refresh

- Auto-refresh toggle (off by default)
- Configurable intervals (10s, 30s, 1min)
- Pauses when browser tab is hidden
- Manual refresh button

### Retry Mechanism

- Retry button on failed/pending notifications
- Re-creates notification with same data
- Console logging for debugging

## Environment Variables

| Variable              | Description     | Default                 |
| --------------------- | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:3000` |

## API Integration

The frontend communicates with the backend via REST API:

- `POST /api/notifications` - Create notification
- `GET /api/notifications` - List notifications
- `GET /api/notifications/:id` - Get single notification

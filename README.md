# Mousepad Production Management System

A comprehensive production management system for handling mousepad orders from Shopify through printing, labeling, packing, and shipping.

## Architecture

- **Backend**: NestJS (TypeScript) REST API
- **Frontend**: React with TypeScript
- **Database**: PostgreSQL (Railway)
- **Authentication**: JWT-based with role-based access (Admin, Team Member)

## Project Structure

```
mpco-ui/
├── backend/          # NestJS application
├── frontend/         # React application
├── .env.example      # Environment variable template
└── README.md
```

## Features

### Modules

1. **Order Processing** - Handles Shopify webhooks and creates print jobs
2. **Print Queue** - Manages pending print jobs and batch printing
3. **Printing** - Controls printer hardware integration
4. **Label Printing** - Generates shipping labels via ShipStation
5. **Packing Station** - Supports order packing with barcode scanning
6. **Points System** - Gamification system for packers
7. **Customer Service** - Error logging and issue management
8. **Missing Item Support** - Handles reprints for missing items
9. **Admin Panel** - System configuration and reporting

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (local or Railway)
- Git

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp ../.env.example .env
```

4. Update `.env` with your database credentials and API keys

5. Start the development server:
```bash
npm run start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
echo "REACT_APP_API_URL=http://localhost:3001" > .env
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## Database Setup

The application uses TypeORM with automatic schema synchronization in development. For production, use migrations:

```bash
cd backend
npm run migration:generate -- -n InitialMigration
npm run migration:run
```

## Initial User Setup

To create your first admin user, you can use the registration endpoint:

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "yourpassword", "role": "admin"}'
```

Or create a seed script to initialize default users.

## API Integration Setup

### Shopify

1. Set up webhook in Shopify admin pointing to: `https://your-domain.com/webhooks/shopify`
2. Add your Shopify API credentials to `.env`

### ShipStation

1. Get API credentials from ShipStation account
2. Add credentials to `.env`

### Printer API

1. Configure printer endpoints in Admin Panel
2. Add printer API settings as needed

## Railway Deployment

### Database

1. Create a new PostgreSQL service in Railway
2. Copy the connection details to your environment variables

### Backend

1. Connect your GitHub repository to Railway
2. Add environment variables from `.env.example`
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm run start:prod`

### Frontend

1. Create a new static site service in Railway
2. Set build command: `cd frontend && npm install && npm run build`
3. Set output directory: `frontend/build`

## Environment Variables

### Backend

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` - Database name
- `JWT_SECRET` - Secret key for JWT tokens
- `FRONTEND_URL` - Frontend URL for CORS
- `PORT` - Backend server port
- `SHOPIFY_API_KEY` - Shopify API key
- `SHOPIFY_API_SECRET` - Shopify API secret
- `SHOPIFY_SHOP_DOMAIN` - Shopify shop domain
- `SHIPSTATION_API_KEY` - ShipStation API key
- `SHIPSTATION_API_SECRET` - ShipStation API secret
- `NODE_ENV` - Environment (development/production)

### Frontend

- `REACT_APP_API_URL` - Backend API URL

## Development

### Backend Scripts

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run test` - Run tests

### Frontend Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## API Endpoints

### Authentication
- `POST /auth/login` - Login
- `POST /auth/register` - Register new user
- `GET /auth/profile` - Get current user profile

### Order Processing
- `POST /webhooks/shopify` - Shopify webhook handler
- `GET /webhooks/orders` - List all orders
- `GET /webhooks/orders/:id` - Get order by ID

### Print Queue
- `GET /print-queue` - Get pending print jobs
- `POST /print-queue/batch` - Create batch from selected jobs

### Printing
- `POST /printing/batch/:batchId` - Print batch
- `POST /printing/job/:printQueueId` - Print single job

### Packing Station
- `GET /packing/orders` - Get orders ready to pack
- `POST /packing/scan` - Scan order barcode
- `POST /packing/complete` - Mark order as packed

### Customer Service
- `POST /customer-service/log-error` - Log order error
- `GET /customer-service/errors` - List errors
- `POST /customer-service/errors/:id/resolve` - Resolve error

### Missing Items
- `POST /missing-items/reprint` - Create reprint job
- `POST /missing-items/scan` - Scan order for reprint

### Points System
- `GET /points/packer/:packerId` - Get packer points
- `GET /points/leaderboard` - Get leaderboard

### Admin Panel
- `GET /admin/dashboard/stats` - Dashboard statistics
- `GET /admin/printers` - List printers
- `POST /admin/printers` - Create printer
- `GET /admin/users` - List users
- `GET /admin/config` - List system configs
- `POST /admin/config` - Set system config

## License

ISC


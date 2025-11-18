# Quick Setup Guide

## Initial Setup

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `backend/.env` and fill in your values
   - Create `frontend/.env` with: `REACT_APP_API_URL=http://localhost:3001`

3. **Set up PostgreSQL database:**
   - Create a database named `mpco` (or update DB_NAME in .env)
   - The app will auto-create tables on first run (development mode)

4. **Create your first admin user:**
   ```bash
   curl -X POST http://localhost:3001/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@example.com", "password": "yourpassword", "role": "admin"}'
   ```

## Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
npm run backend:dev
```

**Terminal 2 - Frontend:**
```bash
npm run frontend:dev
```

### Production Build

**Backend:**
```bash
npm run backend:build
npm run backend:start
```

**Frontend:**
```bash
npm run frontend:build
# Serve the build folder with a static server
```

## Default Users

After creating your admin user, you can create team members:
```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "packer@example.com", "password": "password", "role": "team_member"}'
```

## API Keys Setup

All API integrations use placeholder values. Update these in your `.env`:

- **Shopify**: Get from Shopify Admin → Apps → Private apps
- **ShipStation**: Get from ShipStation Account Settings → API Settings
- **Printer API**: Configure in Admin Panel after deployment

## Next Steps

1. Configure your Shopify webhook to point to: `https://your-domain.com/webhooks/shopify`
2. Add printers in the Admin Panel
3. Configure system settings (points per order, penalties, etc.) in Admin Panel
4. Test the workflow with a sample order


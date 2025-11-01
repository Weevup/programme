# Changelog

All notable changes to this project will be documented in this file.

## [0.2.0] - 2024-01-XX

### Added - Frontend Interfaces

**Authentication:**
- Login page with JWT authentication
- Register page with form validation
- Session management with localStorage

**Dashboard:**
- Main dashboard layout with sidebar navigation
- Responsive design (mobile and desktop)
- User profile display
- Statistics cards (events, participants, venues, check-ins)

**Events Management:**
- Events listing page with filters
- Event creation form
- Event detail page with tabs (overview, participants, sessions, venues)
- Event statistics
- Event deletion

**Venue Finder:**
- Venue search with multiple filters (city, type, capacity, RSE score)
- Venue listing with cards
- Venue creation form with contact details
- RSE scoring display

**Check-in:**
- QR code scanner interface
- Manual QR code input
- Participant information display
- Check-in validation
- Recent check-ins list

**Participants:**
- Participants page (base structure)
- CSV import button

**Reporting:**
- Statistics dashboard (base structure)
- Metrics cards

**UI Components:**
- shadcn/ui integration
- Input, Label, Button, Card components
- Table component
- Toast notifications
- Tabs component
- Responsive layout

### Improved

- API client with axios interceptors
- Error handling with toast notifications
- Loading states on all forms
- Date formatting with date-fns (French locale)
- Type safety with TypeScript throughout

## [0.1.0] - 2024-01-XX

### Added - Initial Setup

**Infrastructure:**
- Turborepo monorepo setup
- pnpm workspaces
- Docker Compose (PostgreSQL 16 + Redis 7)
- TypeScript configuration

**Backend API (NestJS):**
- Authentication module (JWT, Passport strategies, RBAC)
- Events module (CRUD, stats, filters)
- Venues module (CRUD, rooms, search)
- Sessions module (CRUD, speakers, conflicts, feedback)
- Participants module (CRUD, CSV import, segments, QR check-in)
- Prisma ORM integration
- Swagger API documentation

**Database:**
- Complete Prisma schema
- Users & Authentication
- Events & Venues (rooms, media)
- Sessions & Speakers
- Participants & Segments
- Check-ins (multiple types)
- Interactions (Q&A, polls, quiz)
- Feedback & Surveys
- Audit logs

**Documentation:**
- README with architecture
- QUICKSTART guide
- API documentation (Swagger)

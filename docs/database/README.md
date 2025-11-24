# Database Documentation

## 📊 Database Schema & Documentation

This directory contains all database-related documentation for the Dracarys trading education platform.

## 📁 Database Documentation Structure

```
database/
├── README.md (This file)
├── schema.md (Complete database schema)
├── migrations.md (Database migrations)
├── seed-data.md (Sample data)
├── relationships.md (Table relationships)
├── indexes.md (Performance indexes)
└── backup-recovery.md (Data backup strategies)
```

## 🗃️ Database Overview

### Technology Stack
- **Database**: PostgreSQL via Supabase
- **ORM**: Supabase client libraries (no traditional ORM needed)
- **Migration Tool**: Supabase CLI
- **Connection**: Server-side via environment variables

### Database Design Principles
- **Normalized Design**: Third Normal Form (3NF) for data integrity
- **Security**: Row Level Security (RLS) on all tables
- **Performance**: Optimized indexes and query patterns
- **Scalability**: Partitioning ready for large datasets
- **Backup**: Automated daily backups with point-in-time recovery

### Core Design Patterns
- **UUID Primary Keys**: For global uniqueness
- **Timestamps**: created_at, updated_at columns
- **Soft Deletes**: deleted_at instead of hard deletes
- **JSONB Columns**: Flexible metadata storage

---

## 📋 Key Database Documents

| Document | Description | Purpose |
|----------|-------------|---------|
| [Schema](./schema.md) | Complete table schemas | Reference for all data models |
| [Migrations](./migrations.md) | Database change management | Version control for schema changes |
| [Relationships](./relationships.md) | Entity relationships | Understanding data connections |
| [Indexes](./indexes.md) | Performance optimization | Query optimization guide |
| [Backup](./backup-recovery.md) | Data safety | Disaster recovery procedures |

## 🚀 Quick Database Setup

### Local Development
```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase (if not done)
supabase init

# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

### Environment Setup
```env
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
DATABASE_URL=postgresql://postgres:[password]@db.localhost:54322/postgres
```

---

## 🔐 Security Considerations

### Row Level Security (RLS)
All tables implement RLS policies:
- Users can only access their own data
- Public data accessible to authenticated users
- Admin-only tables restricted appropriately

### Example RLS Policy
```sql
-- Enable RLS
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

-- Users can read/write their own progress
CREATE POLICY "Users can view own progress"
ON user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
ON user_progress FOR UPDATE
USING (auth.uid() = user_id);
```

### Data Encryption
- **In Transit**: TLS 1.3 encryption
- **At Rest**: AES-256 encryption (Supabase managed)
- **Sensitive Data**: Additional field-level encryption where needed

---

## 📈 Performance Optimization

### Indexing Strategy
- Primary keys: Automatically indexed
- Foreign keys: Auto-indexed for joins
- High-cardinality: Custom indexes for common queries
- Text search: Full-text search indexes where searchable

### Query Optimization
- Use EXPLAIN ANALYZE for complex queries
- Avoid SELECT * in production
- Implement proper pagination
- Use database functions for complex calculations

### Caching Strategy
- Application-level caching for static data
- Database-level caching for frequently accessed data
- Redis integration ready for high-volume operations

---

## 🧪 Testing & Development

### Test Data Creation
```bash
# Create test users
supabase seed --file test-users.sql

# Reset database with test data
supabase db reset --local
```

### Performance Monitoring
- Supabase dashboard for query performance
- Custom metrics for application-specific needs
- Alert setup for slow queries (>500ms)

---

## 📞 Support & Maintenance

- **Database Issues**: Check [Troubleshooting](../../development/troubleshooting.md)
- **Schema Changes**: Follow [Migration Guide](./migrations.md)
- **Performance Issues**: Review [Index Guide](./indexes.md)
- **Backup/Restore**: See [Backup Guide](./backup-recovery.md)

---

*Database documentation maintained by development team. Last updated: November 24, 2025*

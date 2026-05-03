# Supabase Setup — Deep Reference

> **Part of Step 3 in the [master guide](COMPLETE_SETUP.md).** Go there first if you haven't completed Steps 1–2.

This guide covers the Supabase database used by OYUNS ALL-IN-ONE. The website reads from two tables that are already connected to your apps: `bot_rates` (individual rates) and `business_rates` (business rates).

## Creating a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click **New Project**
4. Choose organization and fill in:
   - Project name: `oyuns-finance`
   - Database password: (generate strong password)
   - Region: Choose closest to your users
   - Pricing plan: Start with Free tier
5. Click **Create new project**

## Database Schema (Required Tables Only)

### 1. Bot Rates Table (Individuals)

```sql
create table public.bot_rates (
  id serial not null,
  buy_rate numeric(10, 4) not null,
  sell_rate numeric(10, 4) not null,
  updated_at timestamp without time zone null,
  created_at timestamp without time zone null,
  constraint student_rates_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_bot_rates_updated_at on public.bot_rates using btree (updated_at desc) TABLESPACE pg_default;

create trigger trig_bot_rates
after INSERT
or
update on bot_rates for EACH row
execute FUNCTION trigger_bot_update ();
```

### 2. Business Rates Table

```sql
create table public.business_rates (
  id serial not null,
  b2c_rate numeric(10, 4) not null,
  b2b_rate numeric(10, 4) not null,
  updated_at timestamp without time zone null default (now() AT TIME ZONE 'Europe/Moscow'::text),
  created_at timestamp without time zone null default now(),
  constraint business_rates_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_business_rates_updated_at on public.business_rates using btree (updated_at desc) TABLESPACE pg_default;

create trigger trig_business_rates
after INSERT
or
update on business_rates for EACH row
execute FUNCTION trigger_business_update ();
```

## Setting Up Environment Variables

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - Project URL
   - `anon` public key
   - `service_role` secret key (keep this secure!)

3. Add to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Backup and Maintenance

1. **Automated Backups**: Supabase Pro tier includes daily backups
2. **Manual Backup**: 
   ```sql
  COPY bot_rates TO '/tmp/bot_rates_backup.csv' CSV HEADER;
  COPY business_rates TO '/tmp/business_rates_backup.csv' CSV HEADER;
   ```

## API Usage Examples

### Fetching Latest Bot (Individual) Rate
```typescript
const { data, error } = await supabase
  .from('bot_rates')
  .select('*')
  .order('updated_at', { ascending: false })
  .limit(1)
  .single();
```

### Fetching Latest Business Rate
```typescript
const { data, error } = await supabase
  .from('business_rates')
  .select('*')
  .order('updated_at', { ascending: false })
  .limit(1)
  .single();
```

### Fetching Historical Bot Rates (for charts)
```typescript
const startDate = new Date();
startDate.setDate(startDate.getDate() - 30); // last 30 days

const { data, error } = await supabase
  .from('bot_rates')
  .select('*')
  .gte('updated_at', startDate.toISOString())
  .order('updated_at', { ascending: true });
```

## Security Best Practices

1. **Never expose service_role key** in client-side code
2. Use Row Level Security (RLS) for all tables
3. Regularly rotate API keys
4. Monitor usage in Supabase dashboard
5. Set up rate limiting for API calls

## Next Steps

1. Run the SQL in Supabase SQL Editor
2. Insert a test row to verify
3. Copy your API keys into `.env.local`
4. **→ Continue to [Step 4 — Directus](COMPLETE_SETUP.md#step-4--set-up-directus-cms) in the master guide**

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

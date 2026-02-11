# Directus Setup — Deep Reference

> **Part of Step 4 in the [master guide](COMPLETE_SETUP.md).** Go there first if you haven't completed Steps 1–3.

This guide covers setting up Directus as the headless CMS for Oyuns Finance.

## Installation Options

### Option 1: Directus Cloud (Recommended for Production)
1. Go to [https://directus.cloud](https://directus.cloud)
2. Create a new project
3. Copy your project URL and create an API token

### Option 2: Self-Hosted with Docker
```bash
docker run -d \
  -p 8055:8055 \
  -e KEY=your-random-key \
  -e SECRET=your-random-secret \
  -e DB_CLIENT=postgres \
  -e DB_HOST=your-db-host \
  -e DB_PORT=5432 \
  -e DB_DATABASE=directus \
  -e DB_USER=directus \
  -e DB_PASSWORD=directus \
  directus/directus
```

### Option 3: Local Development
```bash
npm init directus-project@latest oyuns-directus
cd oyuns-directus
npm start
```

## Collections to Create

### 1. Services Collection

**Collection Name:** `services`

Fields:
- `id` (Integer, Primary Key, Auto Increment)
- `status` (Dropdown: published, draft, archived)
- `title` (String, required)
- `slug` (String, required, unique)
- `description` (Text)
- `features` (JSON)
- `icon` (String)
- `telegram_link` (String)
- `category` (Dropdown: client, business)
- `sort` (Integer)
- `created_at` (DateTime, auto)
- `updated_at` (DateTime, auto)

### 2. Blog Posts Collection

**Collection Name:** `blog_posts`

Fields:
- `id` (Integer, Primary Key, Auto Increment)
- `status` (Dropdown: published, draft, archived)
- `title` (String, required)
- `slug` (String, required, unique)
- `excerpt` (Text)
- `content` (WYSIWYG, required)
- `featured_image` (Image)
- `author` (String)
- `published_date` (DateTime)
- `category` (String)
- `tags` (Tags/JSON)
- `created_at` (DateTime, auto)
- `updated_at` (DateTime, auto)

### 3. Testimonials Collection

**Collection Name:** `testimonials`

Fields:
- `id` (Integer, Primary Key, Auto Increment)
- `status` (Dropdown: published, draft, archived)
- `author` (String, required)
- `content` (Text, required)
- `rating` (Integer, 1-5)
- `created_at` (DateTime, auto)

### 4. Partners Collection

**Collection Name:** `partners`

Fields:
- `id` (Integer, Primary Key, Auto Increment)
- `status` (Dropdown: published, draft, archived)
- `name` (String, required)
- `logo` (Image, required)
- `url` (String)
- `sort` (Integer)

### 5. Site Settings Collection

**Collection Name:** `site_settings`

Fields:
- `id` (Integer, Primary Key, Auto Increment)
- `key` (String, required, unique)
- `value` (JSON, required)
- `updated_at` (DateTime, auto)

## Setting Up Collections

1. Log in to your Directus admin panel
2. Go to **Settings** → **Data Model**
3. Click **Create Collection** for each collection above
4. Add the fields as specified
5. Set appropriate permissions under **Settings** → **Roles & Permissions**

## Public Permissions

For the public role, grant **Read** access to:
- `services` (status = published)
- `blog_posts` (status = published)
- `testimonials` (status = published)
- `partners` (status = published)
- `site_settings` (all)

## Getting Your API Token

1. Go to **User Directory**
2. Select your admin user
3. Scroll to **Admin Options**
4. Generate a **Static Token**
5. Copy this token to your `.env.local` file

## Environment Variables

Add to your `.env.local`:
```env
NEXT_PUBLIC_DIRECTUS_URL=https://your-project.directus.app
DIRECTUS_STATIC_TOKEN=your-static-token-here
```

## Sample Data

### Services Example
```json
[
  {
    "title": "Student Pay",
    "slug": "student-pay",
    "description": "Гадаадад суралцаж буй оюутнуудад зориулсан хялбар, найдвартай мөнгөн шилжүүлэг",
    "features": ["Сургалтын төлбөр", "Байрны түрээс", "Хувийн хэрэглээний зардал", "Шатахуун, замын төлбөр", "Засвар, үйлчилгээний төлбөр", "Aжилчдын цалин"],
    "icon": "book",
    "telegram_link": "https://t.me/oyunsaio_bot",
    "category": "client",
    "sort": 1,
    "status": "published"
  }
]
```

### Blog Post Example
```json
[
  {
    "title": "FinTech гэж юу вэ?",
    "slug": "what-is-fintech",
    "excerpt": "FinTech буюу санхүүгийн технологийн тухай ойлголт",
    "content": "<p>Full article content here...</p>",
    "author": "Oyuns Finance Team",
    "published_date": "2025-06-04T00:00:00Z",
    "category": "OYUNShot",
    "tags": ["fintech", "technology", "finance"],
    "status": "published"
  }
]
```

## Next Steps

1. Create all collections
2. Add sample data
3. Test API endpoints
4. **→ Continue to [Step 5 — Local Testing](COMPLETE_SETUP.md#step-5--run-locally--test) in the master guide**

## Useful Links

- [Directus Documentation](https://docs.directus.io/)
- [Directus SDK Reference](https://docs.directus.io/reference/sdk.html)
- [REST API Documentation](https://docs.directus.io/reference/api.html)

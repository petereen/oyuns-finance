import { createDirectus, staticToken, rest, createCollection, createField } from '@directus/sdk';

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL || !TOKEN) {
  throw new Error('Set DIRECTUS_URL and DIRECTUS_TOKEN before running this script.');
}

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(TOKEN))
  .with(rest());

const collections = [
  {
    collection: 'services',
    meta: { note: 'Services offered', display_template: '{{title}}', icon: 'room_service' },
    schema: { name: 'services' },
    fields: [
      { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half' } },
      { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'title', type: 'string', meta: { interface: 'input', required: true, width: 'full' } },
      { field: 'slug', type: 'string', schema: { is_unique: true }, meta: { interface: 'input', required: true, width: 'half' } },
      { field: 'category', type: 'string', meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Client', value: 'client' }, { text: 'Business', value: 'business' }] }, width: 'half' } },
      { field: 'description', type: 'text', meta: { interface: 'input-multiline', width: 'full' } },
      { field: 'features', type: 'json', meta: { interface: 'list', special: ['cast-json'], width: 'full' } },
      { field: 'icon', type: 'string', meta: { interface: 'input', width: 'half', note: 'Material Icon name (e.g. "school")' } },
      { field: 'telegram_link', type: 'string', meta: { interface: 'input', width: 'half' } },
      { field: 'created_at', type: 'timestamp', meta: { special: ['date-created'], interface: 'datetime', readonly: true, width: 'half' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  },
  {
    collection: 'blog_posts',
    meta: { note: 'Blog Posts', display_template: '{{title}}', icon: 'article' },
    schema: { name: 'blog_posts' },
    fields: [
      { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half' } },
      { field: 'published_date', type: 'timestamp', meta: { interface: 'datetime', width: 'half' } },
      { field: 'title', type: 'string', meta: { interface: 'input', required: true, width: 'full' } },
      { field: 'slug', type: 'string', schema: { is_unique: true }, meta: { interface: 'input', required: true, width: 'half' } },
      { field: 'author', type: 'string', meta: { interface: 'input', width: 'half' } },
      { field: 'category', type: 'string', meta: { interface: 'input', width: 'half' } },
      { field: 'featured_image', type: 'uuid', schema: { foreign_key_table: 'directus_files' }, meta: { interface: 'file-image', special: ['file'], width: 'half' } },
      { field: 'excerpt', type: 'text', meta: { interface: 'input-multiline', width: 'full' } },
      { field: 'content', type: 'text', meta: { interface: 'input-rich-text-html', width: 'full' } },
      { field: 'tags', type: 'json', meta: { interface: 'tags', special: ['cast-json'], width: 'full' } },
      { field: 'created_at', type: 'timestamp', meta: { special: ['date-created'], interface: 'datetime', readonly: true, width: 'half' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  },
  {
    collection: 'testimonials',
    meta: { note: 'Client Testimonials', display_template: '{{author}}', icon: 'reviews' },
    schema: { name: 'testimonials' },
    fields: [
      { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half' } },
      { field: 'rating', type: 'integer', meta: { interface: 'input', options: { min: 1, max: 5 }, width: 'half' } },
      { field: 'author', type: 'string', meta: { interface: 'input', required: true, width: 'full' } },
      { field: 'content', type: 'text', meta: { interface: 'input-multiline', required: true, width: 'full' } },
      { field: 'created_at', type: 'timestamp', meta: { special: ['date-created'], interface: 'datetime', readonly: true, width: 'half' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  },
  {
    collection: 'partners',
    meta: { note: 'Partners', display_template: '{{name}}', icon: 'handshake' },
    schema: { name: 'partners' },
    fields: [
      { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half' } },
      { field: 'sort', type: 'integer', meta: { interface: 'input', width: 'half' } },
      { field: 'name', type: 'string', meta: { interface: 'input', required: true, width: 'full' } },
      { field: 'url', type: 'string', meta: { interface: 'input', width: 'half' } },
      { field: 'logo', type: 'uuid', schema: { foreign_key_table: 'directus_files' }, meta: { interface: 'file-image', special: ['file'], width: 'half' } },
      { field: 'created_at', type: 'timestamp', meta: { special: ['date-created'], interface: 'datetime', readonly: true, width: 'half' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  },
  {
    collection: 'site_settings',
    meta: { note: 'Site Settings', display_template: '{{key}}', icon: 'settings', singleton: false }, // singleton option exists but for now regular collection
    schema: { name: 'site_settings' },
    fields: [
      { field: 'key', type: 'string', schema: { is_unique: true }, meta: { interface: 'input', required: true, width: 'half' } },
      { field: 'value', type: 'json', meta: { interface: 'code', options: { language: 'json' }, special: ['cast-json'], width: 'full' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  },
  {
    collection: 'site_content',
    meta: { note: 'Multilingual website copy. One item per content key and language.', display_template: '{{key}} — {{language}}', icon: 'translate' },
    schema: { name: 'site_content' },
    fields: [
      { field: 'status', type: 'string', schema: { default_value: 'draft' }, meta: { interface: 'select-dropdown', options: { choices: [{ text: 'Published', value: 'published' }, { text: 'Draft', value: 'draft' }, { text: 'Archived', value: 'archived' }] }, width: 'half' } },
      { field: 'key', type: 'string', meta: { interface: 'input', required: true, width: 'half', note: 'Stable key, for example home or contact' } },
      { field: 'language', type: 'string', meta: { interface: 'select-dropdown', required: true, options: { choices: [{ text: 'Mongolian', value: 'mn' }, { text: 'Russian', value: 'ru' }] }, width: 'half' } },
      { field: 'value', type: 'json', meta: { interface: 'code', required: true, options: { language: 'json' }, special: ['cast-json'], width: 'full', note: 'The translated content object used by the matching page.' } },
      { field: 'updated_at', type: 'timestamp', meta: { special: ['date-updated'], interface: 'datetime', readonly: true, width: 'half' } }
    ]
  }
];

async function init() {
  console.log('🔌 Connecting to Directus at ' + DIRECTUS_URL);

  for (const col of collections) {
    try {
      console.log(`\n📦 Creating collection: ${col.collection}...`);
      await client.request(createCollection({
        collection: col.collection,
        meta: col.meta,
        schema: col.schema,
      }));
      console.log(`   ✅ Collection created.`);
    } catch (error) {
      if (error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log(`   ⚠️ Collection ${col.collection} already exists. Skipping creation, checking fields...`);
      } else {
        console.error(`   ❌ Failed to create collection ${col.collection}:`, error.message);
        continue; // Skip fields if collection failed weirdly
      }
    }

    // Create Fields
    for (const f of col.fields) {
      try {
        await client.request(createField(col.collection, {
          field: f.field,
          type: f.type,
          meta: f.meta,
          schema: f.schema,
        }));
        console.log(`      + Field '${f.field}' created.`);
      } catch (error) {
       // Ignore if field already exists
       if (error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE' || error?.message?.includes('already exists')) {
         // console.log(`      . Field '${f.field}' exists.`);
       } else {
         console.error(`      ❌ Failed field '${f.field}':`, error.message);
       }
      }
    }
  }

  console.log('\n✨ Directus schema initialization complete.');
}

init().catch(err => {
  console.error('Fatal error:', err);
});

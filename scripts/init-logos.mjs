import { createDirectus, staticToken, rest, createCollection, createField } from '@directus/sdk';

const DIRECTUS_URL = 'http://localhost:8055';
const TOKEN = 'qf2MjhlatMAW1-VPhrWBDS-Ice1dVuMu';

const client = createDirectus(DIRECTUS_URL)
  .with(staticToken(TOKEN))
  .with(rest());

async function init() {
  console.log('🔌 Connecting to Directus at ' + DIRECTUS_URL);

  // Create logos collection
  try {
    console.log('\n🎨 Creating logos collection...');
    await client.request(createCollection({
      collection: 'logos',
      meta: {
        note: 'Logo variations for the website (dark, light, icon, full)',
        display_template: '{{variant}}',
        icon: 'branding_watermark',
        singleton: false,
      },
      schema: { name: 'logos' },
    }));
    console.log('   ✅ Collection created.');
  } catch (error) {
    if (error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
      console.log('   ⚠️  Collection already exists, skipping.');
    } else {
      console.error('   ❌ Error:', error?.errors?.[0]?.message || error.message);
    }
  }

  // Add fields
  const fields = [
    {
      field: 'status',
      type: 'string',
      schema: { default_value: 'published' },
      meta: {
        interface: 'select-dropdown',
        options: {
          choices: [
            { text: 'Published', value: 'published' },
            { text: 'Draft', value: 'draft' },
          ],
        },
        width: 'half',
      },
    },
    {
      field: 'variant',
      type: 'string',
      schema: { is_unique: true },
      meta: {
        interface: 'select-dropdown',
        required: true,
        options: {
          choices: [
            { text: 'Logo Dark (dark background)', value: 'logo_dark' },
            { text: 'Logo Light (light background)', value: 'logo_light' },
            { text: 'Icon Only', value: 'logo_icon' },
            { text: 'Full Logo (horizontal)', value: 'logo_full' },
            { text: 'Favicon', value: 'favicon' },
          ],
        },
        width: 'half',
        note: 'Which logo variation this is',
      },
    },
    {
      field: 'image',
      type: 'uuid',
      schema: { foreign_key_table: 'directus_files' },
      meta: {
        interface: 'file-image',
        special: ['file'],
        width: 'full',
        note: 'Upload SVG, PNG, or WebP logo file',
      },
    },
    {
      field: 'alt_text',
      type: 'string',
      meta: {
        interface: 'input',
        width: 'half',
        note: 'Alt text for accessibility',
      },
    },
    {
      field: 'sort',
      type: 'integer',
      meta: { interface: 'input', width: 'half' },
    },
    {
      field: 'created_at',
      type: 'timestamp',
      meta: {
        special: ['date-created'],
        interface: 'datetime',
        readonly: true,
        width: 'half',
      },
    },
    {
      field: 'updated_at',
      type: 'timestamp',
      meta: {
        special: ['date-updated'],
        interface: 'datetime',
        readonly: true,
        width: 'half',
      },
    },
  ];

  for (const field of fields) {
    try {
      console.log(`   ➕ Adding field: ${field.field}...`);
      await client.request(createField('logos', field));
      console.log(`      ✅ Done.`);
    } catch (error) {
      if (error?.errors?.[0]?.extensions?.code === 'RECORD_NOT_UNIQUE') {
        console.log(`      ⚠️  Field already exists, skipping.`);
      } else {
        console.error(`      ❌ Error:`, error?.errors?.[0]?.message || error.message);
      }
    }
  }

  console.log('\n✅ Logos collection ready!');
  console.log('\n📝 Next steps:');
  console.log('   1. Go to http://localhost:8055/admin/content/logos');
  console.log('   2. Upload your logo variations (dark, light, icon, full, favicon)');
  console.log('   3. Set status to "published"');
}

init().catch(console.error);

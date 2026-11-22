/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const { Client } = require('pg');

const dotenv = fs.readFileSync('.env', 'utf-8');
const env = {};
dotenv.split(/\r?\n/).forEach(line => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    env[key] = val;
  }
});

// Mock categories definition
const categoriesData = [
  { slug: 'skincare', name: 'Skincare', description: 'Gentle, radiant skincare crafted for all skin types.' },
  { slug: 'makeup', name: 'Makeup', description: 'Soft-focus beauty essentials and radiant lip tints.' },
  { slug: 'lenses', name: 'Lenses', description: 'Natural colored contact lenses for captivating eyes.' },
  { slug: 'electrical', name: 'Electrical & Beauty Tech', description: 'Curling wands, beauty devices, and styling tools.' },
  { slug: 'lifestyle', name: 'Lifestyle & Living', description: 'Cozy drinkware, room scents, and daily wellness items.' },
  { slug: 'more', name: 'More & Accessories', description: 'Beauty pouches, hair clips, and daily vanity favorites.' }
];

// Read mock products from mockData.ts
const mockContent = fs.readFileSync('src/lib/mockData.ts', 'utf-8');

// Parse products array roughly or via TS evaluation
const ts = require('typescript');
const result = ts.transpileModule(mockContent, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
});

const m = { exports: {} };
const fn = new Function('module', 'exports', 'require', result.outputText);
try {
  fn(m, m.exports, (mod) => {
    if (mod === './types') return {};
    return require(mod);
  });
} catch (e) {
  console.log('Error executing transpiled mockData:', e.message);
}

const mockProducts = m.exports.MOCK_PRODUCTS || [];
console.log(`Loaded ${mockProducts.length} products from mockData.ts`);

async function seed() {
  const client = new Client({
    connectionString: env.DIRECT_URL || env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();

  console.log('Inserting / Upserting categories...');
  const catMap = {}; // slug -> uuid
  for (const cat of categoriesData) {
    const res = await client.query(`
      INSERT INTO categories (slug, name, description, is_active)
      VALUES ($1, $2, $3, true)
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name, description = EXCLUDED.description
      RETURNING id, slug;
    `, [cat.slug, cat.name, cat.description]);
    catMap[res.rows[0].slug] = res.rows[0].id;
  }
  console.log('Categories ready:', catMap);

  console.log('Inserting / Upserting products...');
  for (const prod of mockProducts) {
    // Determine category_id
    let catId = catMap[prod.category];
    if (!catId) {
      catId = catMap['skincare'];
    }

    const price = typeof prod.price === 'number' ? prod.price : (prod.sizes?.[0]?.price || 25000);
    const stockQty = prod.inStock !== false ? 50 : 0;
    const benefitsJson = JSON.stringify(prod.benefits || []);
    const galleryJson = JSON.stringify(prod.gallery || [prod.image]);

    await client.query(`
      INSERT INTO products (
        slug, name, badge, price, stock_quantity, description, benefits, usage, main_image, gallery, is_active, category_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      ON CONFLICT (slug) DO UPDATE
      SET name = EXCLUDED.name,
          badge = EXCLUDED.badge,
          price = EXCLUDED.price,
          stock_quantity = EXCLUDED.stock_quantity,
          description = EXCLUDED.description,
          benefits = EXCLUDED.benefits,
          usage = EXCLUDED.usage,
          main_image = EXCLUDED.main_image,
          gallery = EXCLUDED.gallery,
          category_id = EXCLUDED.category_id,
          updated_at = now();
    `, [
      prod.slug,
      prod.name,
      prod.badge || null,
      price,
      stockQty,
      prod.description || '',
      benefitsJson,
      prod.usage || '',
      prod.image,
      galleryJson,
      prod.inStock !== false,
      catId
    ]);
  }

  console.log(`Successfully seeded ${mockProducts.length} products!`);

  // Count total products
  const countRes = await client.query(`SELECT count(*) FROM products;`);
  console.log('Total products currently in Supabase:', countRes.rows[0].count);

  await client.end();
}

seed().then(() => {
  console.log('Seed completed successfully!');
  process.exit(0);
}).catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

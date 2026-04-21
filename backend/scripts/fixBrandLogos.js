/**
 * Run once: node backend/scripts/fixBrandLogos.js
 * Updates brand logos with working Google/Wikipedia/direct CDN URLs.
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '../.env') });
const Brand = require('../models/Brand');

// Google's t3 favicon service — always works, no CORS issues
const gf = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

// Reliable direct image URLs per brand
const LOGOS = {
  'al maha ceramics':     gf('almahaceramics.com'),
  'natural pearls':       gf('naturalpearls.sk'),
  'gym99':                gf('gym99.in'),
  'himalaya  opticals':   gf('himalayaoptical.com'),
  'himalaya opticals':    gf('himalayaoptical.com'),
  'nani ke chole kulche': gf('instagram.com'),
  'mivi':                 'https://www.mivi.in/images/mivi-logo.png',
  'odoo':                 'https://odoocdn.com/openerp_website/static/src/img/2023/odoo_logo.svg',
  'happn':                'https://www.happn.com/wp-content/themes/happn/img/happn-logo.svg',
  'rooter':               gf('rooter.gg'),
  'fevicol':              gf('fevicol.in'),
  'winzo':                gf('winzoapp.com.in'),
  'agoan electronics':    gf('agoanelectronics.in'),
  'wefrnd':               gf('wefriend.ai'),
  'prorewards':           gf('prorewards.io'),
  'gutargoo+':            gf('play.google.com'),
  'khiladi adda':         gf('khiladiadda.com'),
};

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected\n');

  const brands = await Brand.find();
  let updated = 0;

  for (const brand of brands) {
    const key = brand.name.toLowerCase().trim();
    const url = LOGOS[key];
    if (url) {
      brand.logoUrl = url;
      await brand.save();
      console.log(`✓ "${brand.name}" → ${url}`);
      updated++;
    } else {
      console.log(`⚠ "${brand.name}" — no mapping`);
    }
  }

  console.log(`\n✅ ${updated}/${brands.length} updated`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });

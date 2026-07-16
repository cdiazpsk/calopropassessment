CALIBER PROPERTY ASSESSMENT V2 CORE

Replace:
app/assessment/page.jsx
app/api/ai-assessment/[id]/route.js
lib/serviceConfig.js
lib/scoring.js

Run:
supabase/schema-sync.sql

Keep:
components/MobilePhotoUpload.jsx
components/Header.jsx
lib/brands.js
lib/supabase.js

Then deploy Netlify without cache.

Included fixes:
- Step 7 does not auto-submit
- Category-specific slider details display correctly
- Service-specific rating categories and photos
- 1 lead + 2 technicians for smaller/basic projects
- $175/room basic PM floor
- Better AI crew, score, room-release, pricing, and margin rules

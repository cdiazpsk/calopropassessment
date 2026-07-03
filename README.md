FULL SERVICE TYPES + ARCHIVE/DELETE FIX

Replace or add all files in this package.

Files included:
- lib/serviceConfig.js
- components/PipelineCardActions.jsx
- app/api/archive-assessment/route.js
- app/api/delete-assessment/route.js
- app/admin/page.jsx
- app/assessment/page.jsx
- supabase/schema-sync.sql

Then run:
supabase/schema-sync.sql

Then deploy Netlify without cache.

Important:
This package now includes the full app/assessment/page.jsx file. No manual steps needed for the assessment form.

For the compact health score on assessment-review, use the small text file:
app/assessment-review/COMPACT_HEALTHSCORES_REPLACEMENT.txt

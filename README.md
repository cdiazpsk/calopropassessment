# CaliberOS v4 Phases 1-4

Includes:
- Phase 1 customer assessment MVP
- Secure admin login
- Multi-step wizard with progress
- Inline rating guidance
- Camera-first photo/video uploads
- Autosave draft via localStorage
- Thank-you page
- Admin card dashboard
- Detail page with signed media preview
- AI assessment engine
- Proposal draft generator

Deploy:
1. Upload to GitHub.
2. Run supabase/schema-sync.sql in Supabase.
3. Add Netlify env vars:
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   OPENAI_API_KEY
   ADMIN_PASSWORD
4. Deploy.

Routes:
/assessment
/thank-you
/admin/login
/admin
/admin/[id]
/admin/[id]/proposal

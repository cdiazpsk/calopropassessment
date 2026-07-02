PATCH CONTENTS

Replace:
components/Header.jsx
app/page.jsx
app/admin/page.jsx
app/admin/[id]/page.jsx

Add:
public/caliber-logo.jpg

Changes:
1. Removes Internal Dashboard button from the homepage.
2. Adds Caliber logo to homepage, header, admin list, and detail page.
3. Assessment list properties are clickable.
4. Detail page now shows submitted details, condition scores, AI section, uploaded photos/videos, and a Back to Assessment List button.

Note:
Uploaded media uses signed Supabase URLs valid for 1 hour.

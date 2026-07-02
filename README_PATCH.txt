PATCH CONTENTS

Replace:
components/Header.jsx

Add:
app/thank-you/page.jsx
app/admin/login/page.jsx
app/api/login/route.js
app/api/logout/route.js
middleware.js

Also update app/assessment/page.jsx manually:
1. Add the Rating Guide below.
2. Replace successful submit behavior with: window.location.href = '/thank-you';

Netlify environment variable required:
ADMIN_PASSWORD=your chosen admin password

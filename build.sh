#!/bin/bash
# Vercel build script — generates config.js and admin-config.js from environment variables

cat > config.js << EOF
const SUPABASE_URL  = '${SUPABASE_URL}';
const SUPABASE_ANON = '${SUPABASE_ANON}';
EOF

cat > admin-config.js << EOF
const SUPABASE_SERVICE_KEY = '${SUPABASE_SERVICE_KEY}';
const ANTHROPIC_API_KEY    = '${ANTHROPIC_API_KEY}';
EOF

echo "config.js and admin-config.js generated from environment variables"

#!/bin/bash
# Vercel build script — generates config.js and admin-config.js from environment variables

python3 - <<'PYEOF'
import os

def clean(val):
    return val.strip().replace("'", "\\'")

url  = clean(os.environ.get('SUPABASE_URL', ''))
anon = clean(os.environ.get('SUPABASE_ANON', ''))
svc  = clean(os.environ.get('SUPABASE_SERVICE_KEY', ''))
ai   = clean(os.environ.get('ANTHROPIC_API_KEY', ''))

with open('config.js', 'w') as f:
    f.write(f"const SUPABASE_URL  = '{url}';\n")
    f.write(f"const SUPABASE_ANON = '{anon}';\n")

with open('admin-config.js', 'w') as f:
    f.write(f"const SUPABASE_SERVICE_KEY = '{svc}';\n")
    f.write(f"const ANTHROPIC_API_KEY    = '{ai}';\n")

print('config.js and admin-config.js generated from environment variables')
PYEOF

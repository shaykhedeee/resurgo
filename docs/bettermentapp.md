# 🎯 The Ultimate "Finish Anything" AI Prompt

```markdown
# COMPLETE PROJECT INITIALIZATION & AUDIT PROMPT

You are an expert full-stack developer and project completion specialist. Your task is to:

1. **DEEP SCAN** the entire project
2. **IDENTIFY** all incomplete features, missing configurations, and TODO items
3. **PRIORITIZE** tasks by criticality and dependencies
4. **EXECUTE** completion with production-ready quality
5. **DOCUMENT** everything for future maintenance

---

## PHASE 1: COMPREHENSIVE PROJECT AUDIT

### A. Codebase Analysis
Scan all files and identify:

- [ ] Incomplete functions/components (search for TODO, FIXME, XXX, HACK)
- [ ] Commented-out code that needs implementation
- [ ] Empty files or placeholder components
- [ ] Missing error handling
- [ ] Unimplemented API endpoints
- [ ] Missing type definitions
- [ ] Unused imports and dead code
- [ ] Hard-coded values that need environment variables

**Commands to run:**
```bash
# Find all TODOs and FIXMEs
grep -r "TODO\|FIXME\|XXX\|HACK" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" .

# Find empty or near-empty files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sh -c 'if [ $(wc -l < "$1") -lt 5 ]; then echo "$1"; fi' _ {} \;

# Find console.logs (should be removed in production)
grep -r "console\\.log" --include="*.ts" --include="*.tsx" .

# Check for hard-coded URLs
grep -rE "https?://[a-zA-Z0-9]" --include="*.ts" --include="*.tsx" .

# Find unused dependencies
npx depcheck
```

### B. Configuration Audit

Check for missing or incomplete:

**Environment Variables:**
```bash
# Create checklist from .env.example vs .env
- [ ] Database connection strings
- [ ] API keys (Stripe, SendGrid, etc.)
- [ ] OAuth credentials (Google, GitHub, etc.)
- [ ] CDN/Storage URLs (S3, Cloudinary)
- [ ] Analytics tracking IDs
- [ ] Feature flags
- [ ] CORS origins
- [ ] JWT secrets
- [ ] Webhook secrets
```

**Package.json:**
```json
{
  "scripts": {
    "dev": "✅ Exists?",
    "build": "✅ Exists?",
    "start": "✅ Exists?",
    "test": "✅ Exists?",
    "test:e2e": "❌ Missing?",
    "lint": "✅ Exists?",
    "lint:fix": "❌ Missing?",
    "format": "❌ Missing?",
    "type-check": "❌ Missing?",
    "analyze": "❌ Missing?",
    "prepare": "❌ Missing? (husky)"
  }
}
```

**Build & Deploy:**
```bash
- [ ] Dockerfile exists and works
- [ ] docker-compose.yml configured
- [ ] .dockerignore present
- [ ] CI/CD pipeline (GitHub Actions, GitLab CI)
- [ ] Vercel/Netlify configuration
- [ ] Build optimization settings
- [ ] Environment-specific configs (dev/staging/prod)
```

### C. Security Audit

```bash
# Run security checks
- [ ] npm audit fix
- [ ] Check for exposed secrets
- [ ] HTTPS enforcement
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation/sanitization
- [ ] SQL injection prevention
- [ ] XSS protection
- [ ] CSRF tokens
- [ ] Secure headers (helmet.js)

# Commands:
npm audit
git secrets --scan
npx lockfile-lint --path package-lock.json --type npm
```

### D. Database Audit

```sql
-- Check for:
- [ ] All migrations run successfully
- [ ] Indexes on frequently queried columns
- [ ] Foreign key constraints
- [ ] Row-level security (RLS) policies
- [ ] Backup strategy configured
- [ ] Seed data for development
- [ ] Database connection pooling
- [ ] Query optimization

-- Run:
-- Analyze slow queries
EXPLAIN ANALYZE SELECT ...;

-- Check missing indexes
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;
```

### E. API Completeness

Check all endpoints for:
```typescript
- [ ] Request validation (Zod, Yup, etc.)
- [ ] Response type definitions
- [ ] Error handling (try/catch)
- [ ] Authentication/authorization
- [ ] Rate limiting
- [ ] Logging
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Versioning strategy
- [ ] Webhook handlers
- [ ] Idempotency keys (for critical operations)

// Template for complete endpoint:
export async function POST(req: Request) {
  try {
    // 1. Authentication
    const user = await authenticate(req);
    
    // 2. Validation
    const body = await req.json();
    const validated = schema.parse(body);
    
    // 3. Authorization
    if (!canPerformAction(user, validated)) {
      return new Response('Forbidden', { status: 403 });
    }
    
    // 4. Business logic
    const result = await performAction(validated);
    
    // 5. Logging
    logger.info('Action completed', { userId: user.id, action: 'POST /api/resource' });
    
    // 6. Response
    return Response.json(result);
    
  } catch (error) {
    // 7. Error handling
    logger.error('Action failed', error);
    return handleError(error);
  }
}
```

---

## PHASE 2: MISSING FEATURES IDENTIFICATION

### A. User-Facing Features

**Authentication & User Management:**
```bash
- [ ] Sign up flow complete
- [ ] Email verification
- [ ] Password reset
- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-factor authentication (2FA)
- [ ] Session management
- [ ] User profile page
- [ ] Account deletion
- [ ] Password strength indicator
- [ ] Remember me functionality
```

**UI/UX Completeness:**
```bash
- [ ] Loading states for all async operations
- [ ] Error states with retry options
- [ ] Empty states with helpful messaging
- [ ] Success confirmations (toasts/notifications)
- [ ] Skeleton loaders
- [ ] Pagination or infinite scroll
- [ ] Search functionality
- [ ] Filters and sorting
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Accessibility (ARIA labels, keyboard navigation)
- [ ] Form validation feedback
- [ ] Confirmation dialogs for destructive actions
```

**SEO & Marketing:**
```bash
- [ ] Meta tags (title, description, OG tags)
- [ ] Sitemap.xml
- [ ] Robots.txt
- [ ] Favicon (all sizes)
- [ ] Apple touch icons
- [ ] Structured data (JSON-LD)
- [ ] Analytics integration (GA4, Plausible)
- [ ] Open Graph images
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] 404 page
- [ ] 500 error page
```

**Social Media Integration:**
```bash
- [ ] Social sharing buttons
- [ ] Social login providers
- [ ] Social media preview cards
- [ ] Share to Twitter/Facebook/LinkedIn
- [ ] WhatsApp share (mobile)
- [ ] Copy link to clipboard
- [ ] Social proof (user counts, testimonials)
```

### B. Technical Infrastructure

**Monitoring & Logging:**
```bash
- [ ] Error tracking (Sentry, Rollbar)
- [ ] Performance monitoring (Vercel Analytics, Lighthouse)
- [ ] Uptime monitoring (UptimeRobot, Pingdom)
- [ ] Log aggregation (Datadog, LogRocket)
- [ ] Custom event tracking
- [ ] Database query monitoring
- [ ] API response time tracking
```

**Testing:**
```bash
- [ ] Unit tests (Jest, Vitest)
- [ ] Integration tests
- [ ] E2E tests (Playwright, Cypress)
- [ ] Visual regression tests (Chromatic)
- [ ] Accessibility tests (axe-core)
- [ ] Performance tests (Lighthouse CI)
- [ ] Load testing (k6, Artillery)
- [ ] Test coverage > 80%

# Commands:
npm run test -- --coverage
npx playwright test
npx lighthouse https://yoursite.com --view
```

**Documentation:**
```bash
- [ ] README.md comprehensive
- [ ] API documentation
- [ ] Component documentation (Storybook)
- [ ] Architecture diagrams
- [ ] Setup instructions
- [ ] Deployment guide
- [ ] Contributing guide
- [ ] Changelog
- [ ] License file
- [ ] Code of conduct
```

---

## PHASE 3: MOBILE APP REQUIREMENTS

### A. APK/IPA Generation

**React Native / Expo:**
```bash
# Expo setup
- [ ] app.json configured
- [ ] Assets optimized (splash, icon, etc.)
- [ ] Build profiles (development, preview, production)
- [ ] Version management
- [ ] Code signing certificates

# Build APK
npx expo build:android --type apk
# Or AAB for Play Store
npx expo build:android --type app-bundle

# Build IPA
npx expo build:ios --type archive

# EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

**Capacitor (for web apps):**
```bash
npm install @capacitor/core @capacitor/cli
npx cap init

# Add platforms
npx cap add android
npx cap add ios

# Build
npm run build
npx cap copy
npx cap sync

# Open in native IDE
npx cap open android
npx cap open ios
```

**Required Files:**
```bash
android/
├── app/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   ├── res/
│   │   │   ├── mipmap-*/ic_launcher.png (all sizes)
│   │   │   ├── drawable/splash.png
│   │   │   └── values/
│   │   │       ├── strings.xml
│   │   │       └── colors.xml
│   └── build.gradle
└── gradle.properties

ios/
├── App/
│   ├── App/
│   │   ├── Info.plist
│   │   ├── Assets.xcassets/
│   │   │   ├── AppIcon.appiconset/
│   │   │   └── LaunchImage.launchimage/
│   └── App.xcodeproj
```

**App Store Requirements:**
```bash
# Android (Google Play)
- [ ] App bundle (.aab) generated
- [ ] Signed with upload key
- [ ] Version code incremented
- [ ] Privacy policy URL
- [ ] Content rating
- [ ] Screenshots (phone, tablet, 7-inch)
- [ ] Feature graphic (1024x500)
- [ ] App icon (512x512)
- [ ] Store listing text
- [ ] Target SDK version (latest)

# iOS (App Store)
- [ ] Archive (.ipa) generated
- [ ] Distribution certificate
- [ ] Provisioning profile
- [ ] App Store Connect metadata
- [ ] Screenshots (all device sizes)
- [ ] Privacy policy
- [ ] App review information
- [ ] TestFlight builds
```

### B. Mobile-Specific Features

```bash
- [ ] Push notifications (FCM, APNS)
- [ ] Deep linking
- [ ] Biometric authentication
- [ ] Offline mode
- [ ] Camera access
- [ ] Photo gallery access
- [ ] Location services
- [ ] File downloads
- [ ] Share functionality
- [ ] App icon badges
- [ ] Splash screen
- [ ] App rating prompt
```

---

## PHASE 4: ADVANCED MCP & SKILL INTEGRATIONS

### A. Essential MCP Servers (Already Covered)

```json
{
  "mcpServers": {
    // Core Development
    "filesystem": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-filesystem"] },
    "github": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-github"] },
    "sequential-thinking": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"] },
    "memory": { "command": "npx", "args": ["-y", "@modelcontextprotocol/server-memory"] }
  }
}
```

### B. **NEW** Advanced MCP Servers for UI Development

```json
{
  "mcpServers": {
    // ===== AI & LLM Integration =====
    "openai": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-openai"],
      "env": { "OPENAI_API_KEY": "${env:OPENAI_API_KEY}" }
    },
    "anthropic": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-server-anthropic"],
      "env": { "ANTHROPIC_API_KEY": "${env:ANTHROPIC_API_KEY}" }
    },
    
    // ===== Database & Storage =====
    "supabase": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "${env:SUPABASE_URL}",
        "SUPABASE_KEY": "${env:SUPABASE_KEY}"
      }
    },
    "redis": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-redis"],
      "env": { "REDIS_URL": "${env:REDIS_URL}" }
    },
    "mongodb": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-mongodb"],
      "env": { "MONGODB_URI": "${env:MONGODB_URI}" }
    },
    
    // ===== Testing & Quality =====
    "playwright": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-playwright"]
    },
    "lighthouse": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-lighthouse"]
    },
    
    // ===== APIs & Services =====
    "stripe": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-stripe"],
      "env": { "STRIPE_SECRET_KEY": "${env:STRIPE_SECRET_KEY}" }
    },
    "sendgrid": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sendgrid"],
      "env": { "SENDGRID_API_KEY": "${env:SENDGRID_API_KEY}" }
    },
    "twilio": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-twilio"],
      "env": {
        "TWILIO_ACCOUNT_SID": "${env:TWILIO_ACCOUNT_SID}",
        "TWILIO_AUTH_TOKEN": "${env:TWILIO_AUTH_TOKEN}"
      }
    },
    
    // ===== Content & Media =====
    "cloudinary": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-cloudinary"],
      "env": {
        "CLOUDINARY_CLOUD_NAME": "${env:CLOUDINARY_CLOUD_NAME}",
        "CLOUDINARY_API_KEY": "${env:CLOUDINARY_API_KEY}",
        "CLOUDINARY_API_SECRET": "${env:CLOUDINARY_API_SECRET}"
      }
    },
    "aws-s3": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-aws-s3"],
      "env": {
        "AWS_ACCESS_KEY_ID": "${env:AWS_ACCESS_KEY_ID}",
        "AWS_SECRET_ACCESS_KEY": "${env:AWS_SECRET_ACCESS_KEY}",
        "AWS_REGION": "${env:AWS_REGION}"
      }
    },
    
    // ===== Search & Discovery =====
    "algolia": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-algolia"],
      "env": {
        "ALGOLIA_APP_ID": "${env:ALGOLIA_APP_ID}",
        "ALGOLIA_API_KEY": "${env:ALGOLIA_API_KEY}"
      }
    },
    "elasticsearch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-elasticsearch"],
      "env": { "ELASTICSEARCH_URL": "${env:ELASTICSEARCH_URL}" }
    },
    
    // ===== Analytics & Monitoring =====
    "google-analytics": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-google-analytics"],
      "env": { "GA_TRACKING_ID": "${env:GA_TRACKING_ID}" }
    },
    "sentry": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sentry"],
      "env": { "SENTRY_DSN": "${env:SENTRY_DSN}" }
    },
    
    // ===== Authentication =====
    "auth0": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-auth0"],
      "env": {
        "AUTH0_DOMAIN": "${env:AUTH0_DOMAIN}",
        "AUTH0_CLIENT_ID": "${env:AUTH0_CLIENT_ID}",
        "AUTH0_CLIENT_SECRET": "${env:AUTH0_CLIENT_SECRET}"
      }
    },
    "clerk": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-clerk"],
      "env": { "CLERK_SECRET_KEY": "${env:CLERK_SECRET_KEY}" }
    },
    
    // ===== Development Tools =====
    "docker": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-docker"]
    },
    "kubernetes": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-kubernetes"],
      "env": { "KUBECONFIG": "${env:KUBECONFIG}" }
    },
    "vercel": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-vercel"],
      "env": { "VERCEL_TOKEN": "${env:VERCEL_TOKEN}" }
    },
    
    // ===== Communication =====
    "slack": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-slack"],
      "env": { "SLACK_BOT_TOKEN": "${env:SLACK_BOT_TOKEN}" }
    },
    "discord": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-discord"],
      "env": { "DISCORD_BOT_TOKEN": "${env:DISCORD_BOT_TOKEN}" }
    },
    
    // ===== Code Quality =====
    "sonarqube": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sonarqube"],
      "env": { "SONAR_TOKEN": "${env:SONAR_TOKEN}" }
    },
    "codecov": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-codecov"],
      "env": { "CODECOV_TOKEN": "${env:CODECOV_TOKEN}" }
    }
  }
}
```

### C. **NEW** Premium LobeHub Skills

```bash
# UI/UX Design Skills
npx -y @lobehub/market-cli skills install designer-ui-component-generator
npx -y @lobehub/market-cli skills install figma-to-code-converter
npx -y @lobehub/market-cli skills install responsive-design-optimizer
npx -y @lobehub/market-cli skills install accessibility-auditor
npx -y @lobehub/market-cli skills install animation-expert

# Performance Optimization
npx -y @lobehub/market-cli skills install bundle-size-optimizer
npx -y @lobehub/market-cli skills install image-compression-expert
npx -y @lobehub/market-cli skills install lighthouse-score-improver
npx -y @lobehub/market-cli skills install core-web-vitals-optimizer

# Testing & Quality
npx -y @lobehub/market-cli skills install test-case-generator
npx -y @lobehub/market-cli skills install e2e-test-builder
npx -y @lobehub/market-cli skills install visual-regression-tester
npx -y @lobehub/market-cli skills install security-vulnerability-scanner

# Database & Backend
npx -y @lobehub/market-cli skills install database-schema-designer
npx -y @lobehub/market-cli skills install api-endpoint-generator
npx -y @lobehub/market-cli skills install graphql-schema-builder
npx -y @lobehub/market-cli skills install webhook-handler-creator

# DevOps & Deployment
npx -y @lobehub/market-cli skills install docker-compose-generator
npx -y @lobehub/market-cli skills install ci-cd-pipeline-builder
npx -y @lobehub/market-cli skills install kubernetes-manifest-creator
npx -y @lobehub/market-cli skills install terraform-infrastructure-coder

# Documentation
npx -y @lobehub/market-cli skills install api-doc-generator
npx -y @lobehub/market-cli skills install storybook-story-creator
npx -y @lobehub/market-cli skills install readme-enhancer
npx -y @lobehub/market-cli skills install changelog-generator

# AI/ML Integration
npx -y @lobehub/market-cli skills install openai-integration-helper
npx -y @lobehub/market-cli skills install vector-database-expert
npx -y @lobehub/market-cli skills install embeddings-optimizer
npx -y @lobehub/market-cli skills install rag-system-builder

# Mobile Development
npx -y @lobehub/market-cli skills install react-native-component-converter
npx -y @lobehub/market-cli skills install mobile-responsive-checker
npx -y @lobehub/market-cli skills install app-store-optimizer
npx -y @lobehub/market-cli skills install push-notification-setup

# SEO & Marketing
npx -y @lobehub/market-cli skills install seo-meta-tag-generator
npx -y @lobehub/market-cli skills install schema-markup-creator
npx -y @lobehub/market-cli skills install social-share-optimizer
npx -y @lobehub/market-cli skills install analytics-event-tracker
```

### D. Custom MCP Server for Project Auditing

Create `mcp-servers/project-auditor/index.js`:

```javascript
#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class ProjectAuditor {
  async scanForTodos(rootDir) {
    try {
      const { stdout } = await execAsync(
        `grep -r "TODO\\|FIXME\\|XXX\\|HACK" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" "${rootDir}"`
      );
      return stdout.split('\n').filter(Boolean);
    } catch (error) {
      return [];
    }
  }

  async checkEnvVariables(rootDir) {
    const envExample = path.join(rootDir, '.env.example');
    const envFile = path.join(rootDir, '.env');
    
    try {
      const exampleContent = await fs.readFile(envExample, 'utf-8');
      const envContent = await fs.readFile(envFile, 'utf-8');
      
      const exampleVars = exampleContent.match(/^[A-Z_]+=.*/gm) || [];
      const envVars = envContent.match(/^[A-Z_]+=.*/gm) || [];
      
      const missing = exampleVars.filter(v => {
        const key = v.split('=')[0];
        return !envVars.some(ev => ev.startsWith(key));
      });
      
      return { total: exampleVars.length, missing };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkPackageJson(rootDir) {
    const packagePath = path.join(rootDir, 'package.json');
    
    try {
      const content = await fs.readFile(packagePath, 'utf-8');
      const pkg = JSON.parse(content);
      
      const requiredScripts = ['dev', 'build', 'start', 'test', 'lint'];
      const missing = requiredScripts.filter(s => !pkg.scripts?.[s]);
      
      return {
        name: pkg.name,
        version: pkg.version,
        scripts: Object.keys(pkg.scripts || {}),
        missingScripts: missing,
        dependencies: Object.keys(pkg.dependencies || {}).length,
        devDependencies: Object.keys(pkg.devDependencies || {}).length
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkDocumentation(rootDir) {
    const docs = ['README.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'LICENSE'];
    const results = {};
    
    for (const doc of docs) {
      try {
        const content = await fs.readFile(path.join(rootDir, doc), 'utf-8');
        results[doc] = { exists: true, length: content.length };
      } catch {
        results[doc] = { exists: false };
      }
    }
    
    return results;
  }

  async runSecurityAudit(rootDir) {
    try {
      const { stdout } = await execAsync('npm audit --json', { cwd: rootDir });
      const audit = JSON.parse(stdout);
      return {
        vulnerabilities: audit.metadata?.vulnerabilities || {},
        summary: audit.metadata
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  async generateReport(rootDir) {
    const [todos, env, pkg, docs, security] = await Promise.all([
      this.scanForTodos(rootDir),
      this.checkEnvVariables(rootDir),
      this.checkPackageJson(rootDir),
      this.checkDocumentation(rootDir),
      this.runSecurityAudit(rootDir)
    ]);

    return {
      summary: {
        todosFound: todos.length,
        missingEnvVars: env.missing?.length || 0,
        missingScripts: pkg.missingScripts?.length || 0,
        missingDocs: Object.values(docs).filter(d => !d.exists).length,
        vulnerabilities: security.vulnerabilities
      },
      details: { todos, env, pkg, docs, security },
      timestamp: new Date().toISOString()
    };
  }
}

const server = new Server(
  {
    name: "project-auditor",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

const auditor = new ProjectAuditor();

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "audit_project",
      description: "Comprehensive project audit - finds TODOs, missing env vars, security issues, etc.",
      inputSchema: {
        type: "object",
        properties: {
          rootDir: {
            type: "string",
            description: "Root directory of the project to audit"
          }
        },
        required: ["rootDir"]
      }
    },
    {
      name: "scan_todos",
      description: "Scan for TODO, FIXME, XXX, HACK comments",
      inputSchema: {
        type: "object",
        properties: {
          rootDir: { type: "string" }
        }
      }
    },
    {
      name: "check_env",
      description: "Check for missing environment variables",
      inputSchema: {
        type: "object",
        properties: {
          rootDir: { type: "string" }
        }
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "audit_project":
        const report = await auditor.generateReport(args.rootDir);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(report, null, 2)
            }
          ]
        };
      
      case "scan_todos":
        const todos = await auditor.scanForTodos(args.rootDir);
        return {
          content: [
            {
              type: "text",
              text: `Found ${todos.length} TODOs:\n${todos.join('\n')}`
            }
          ]
        };
      
      case "check_env":
        const env = await auditor.checkEnvVariables(args.rootDir);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(env, null, 2)
            }
          ]
        };
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Project Auditor MCP Server running on stdio");
}

runServer().catch(console.error);
```

**Add to your MCP config:**
```json
{
  "mcpServers": {
    "project-auditor": {
      "command": "node",
      "args": ["./mcp-servers/project-auditor/index.js"]
    }
  }
}
```

---

## PHASE 5: EXECUTION CHECKLIST

### Priority 1: Critical (Do First)
```bash
- [ ] Fix all build errors
- [ ] Complete authentication flow
- [ ] Set up error tracking (Sentry)
- [ ] Configure environment variables
- [ ] Set up database backups
- [ ] Implement basic security (HTTPS, CORS, rate limiting)
- [ ] Add loading states to all async operations
```

### Priority 2: User Experience
```bash
- [ ] Add proper error messages
- [ ] Implement all empty states
- [ ] Add success confirmations
- [ ] Ensure mobile responsiveness
- [ ] Add accessibility features
- [ ] Optimize images and assets
- [ ] Implement proper SEO tags
```

### Priority 3: Production Ready
```bash
- [ ] Write comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Create production environment
- [ ] Add monitoring and alerts
- [ ] Complete documentation
- [ ] Perform security audit
- [ ] Load testing
- [ ] Create backup/restore procedures
```

### Priority 4: Mobile App (If Applicable)
```bash
- [ ] Generate APK/IPA
- [ ] Test on physical devices
- [ ] Prepare app store listings
- [ ] Create promotional materials
- [ ] Set up app analytics
- [ ] Implement deep linking
- [ ] Add push notifications
```

### Priority 5: Marketing & Launch
```bash
- [ ] Social media accounts created
- [ ] Privacy policy & terms of service
- [ ] Contact/support email
- [ ] Launch landing page
- [ ] Press kit prepared
- [ ] Analytics configured
- [ ] Email capture setup
- [ ] Community channels (Discord, Slack)
```

---

## PHASE 6: FINAL VALIDATION

### Pre-Launch Checklist

**Performance:**
```bash
✅ Lighthouse score > 90
✅ First Contentful Paint < 1.8s
✅ Time to Interactive < 3.8s
✅ Cumulative Layout Shift < 0.1
✅ Bundle size optimized
✅ Images lazy-loaded
✅ Code splitting implemented
```

**Security:**
```bash
✅ npm audit shows 0 vulnerabilities
✅ Secrets not in code
✅ HTTPS enforced
✅ CORS configured
✅ Rate limiting active
✅ Input validation everywhere
✅ SQL injection protected
✅ XSS protected
```

**Testing:**
```bash
✅ All unit tests passing
✅ Integration tests passing
✅ E2E tests passing
✅ Manual testing on:
  - Chrome
  - Firefox
  - Safari
  - Mobile browsers
✅ Accessibility audit passed
```

**Documentation:**
```bash
✅ README complete
✅ API docs generated
✅ Environment setup guide
✅ Deployment instructions
✅ Troubleshooting guide
✅ Contributing guidelines
```

**Monitoring:**
```bash
✅ Error tracking configured
✅ Performance monitoring active
✅ Uptime monitoring set up
✅ Log aggregation working
✅ Alerts configured
✅ Database backups scheduled
```

---

## EXECUTION COMMAND

Now, using ALL the tools, MCP servers, and skills available:

1. **Run comprehensive audit:**
```bash
# Use project-auditor MCP
audit_project --rootDir "."

# Manual checks
grep -r "TODO\|FIXME" .
npm audit
npx lighthouse https://your-site.com
npx playwright test
npm run test -- --coverage
```

2. **Generate completion report:**
```markdown
# Project Completion Report

## Executive Summary
- Total tasks identified: X
- Completed: Y
- In progress: Z
- Blocked: W

## Critical Issues (Fix Immediately)
1. [Issue description] - Priority: HIGH
   - Impact: [description]
   - Solution: [steps]
   - ETA: [time]

## Missing Features
[List with implementation plan]

## Technical Debt
[List with refactoring plan]

## Deployment Readiness
- [ ] Production environment configured
- [ ] DNS configured
- [ ] SSL certificate active
- [ ] CDN configured
- [ ] Monitoring active

## Mobile App Status
- [ ] APK generated and signed
- [ ] IPA generated and signed
- [ ] App store listings prepared
- [ ] Beta testing completed

## Launch Readiness Score: X/100
[Breakdown by category]
```

3. **Execute fixes in priority order:**
```typescript
// Use sequential-thinking MCP for complex fixes
// Use error-annihilator skill for debugging
// Use github MCP for creating issues/PRs
// Use memory MCP to track progress
```

4. **Validate and deploy:**
```bash
npm run build
npm run test
npm run lint
npx lighthouse https://staging-url.com --view
# If all pass:
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```

---

## SUCCESS CRITERIA

Project is complete when:

✅ **All critical bugs fixed**
✅ **All user-facing features functional**
✅ **Test coverage > 80%**
✅ **Lighthouse score > 90**
✅ **Zero security vulnerabilities**
✅ **Documentation complete**
✅ **Deployment pipeline working**
✅ **Monitoring and alerts active**
✅ **Mobile apps published (if applicable)**
✅ **Launch checklist 100% complete**

---

## CONTINUOUS IMPROVEMENT

After launch:

```bash
# Weekly
- [ ] Review error logs
- [ ] Check performance metrics
- [ ] Monitor user feedback
- [ ] Update dependencies

# Monthly
- [ ] Security audit
- [ ] Performance review
- [ ] Feature prioritization
- [ ] Technical debt assessment

# Quarterly
- [ ] Major version planning
- [ ] Architecture review
- [ ] Team retrospective
- [ ] Technology updates
```
UI STUFF

Curl https://lobehub.com/skills/zpankz-mcp-skillset-terminal/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.

Curl https://lobehub.com/skills/brendadeeznuts1111-project-r-score-domain-diagnostic-flow/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.

npx -y @lobehub/market-cli skills install brendadeeznuts1111-project-r-score-domain-diagnostic-flow --agent vscode

Curl https://lobehub.com/skills/orthogonal-sh-skills-orthogonal-jina-s/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.

Curl https://lobehub.com/skills/anthropics-skills-pdf/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.


Curl https://lobehub.com/skills/amxcodes-flowbot-spotify/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.

Curl https://lobehub.com/skills/davila7-claude-code-templates-nextjs-best-practices/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.

https://github.com/lobehub/lobe-ui.git


Curl https://lobehub.com/skills/madappgang-claude-code-brainstorming/skill.md, then follow the instructions to set up LobeHub Skills Marketplace and install the skill. Once installed, read the SKILL.md file in the installed directory and follow its instructions to complete the task.


npx @nmeierpolys/mcp-structured-memory
https://app.lobehub.com/community/agent/nivk0d0p

Role Description
Meditation Master, you are a Zen master who has deeply studied Buddhist teachings, proficient in Buddhist scriptures, and skilled at guiding people using Buddhist doctrines. You excel at answering questions with references to scriptures and wisdom, possessing extraordinary insight. You will respond by quoting Buddhist classics and wisdom to help people resolve confusion, offer spiritual guidance and comfort.
Interaction Framework
Greeting: Greet the user with compassion and care.
Confirm the Question: Ask the user to specify their problem or confusion for targeted responses.
Quote Classics: When answering, cite relevant Buddhist scriptures and teachings to enhance authority and depth.
Provide Guidance: Offer practical advice based on the user's question to help find inner peace and wisdom.
Feedback Request: Inquire if the user needs further explanation or has additional questions.
Interaction Example
Greeting
May all be well. Amitabha. Please share your confusion or questions I can help with.
Confirm Question
Please describe your problem or confusion in detail so I can better guide you.
Quote Classics and Offer Guidance
Based on your question, I quote from the Diamond Sutra: “All conditioned phenomena are like a dream, illusion, bubble, shadow, like dew or lightning; thus should you view them.” This means all things are impermanent.



{
  "mcpServers": {
    "leonardroman-mcp-my-books": {
      "args": [
        "<absolute_path_to_project>/dist/index.js"
      ],
      "command": "node"
    }
  }
}


Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "clientio-appmixer-mcp": {
      "args": [
        "appmixer-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Recommended deployment using npx to run the appmixer-mcp package. Requires setting environment variables for Appmixer API access.

$ npx appmixer-mcp
Environment Variables
Name	Type	Required	Description
APPMIXER_BASE_URL	
Your Appmixer tenant API base URL, e.g. https://api.YOUR_TENANT.appmixer.cloud
APPMIXER_PASSWORD	
Optional Appmixer password for authentication
APPMIXER_USERNAME	
Optional Appmixer username for authentication
APPMIXER_ACCESS_TOKEN	
Your Appmixer access token for authen



AI FITNESS AENT 

Role: You are an AI workout assistant, created to help and guide in creating workout plans and assist in finding workouts suited for each muscle group in the body. You have a personal trainer and body physics education, and your role is to enhance the users workouts.

Capabilities: Personalized Workout Plans: Create customized workout plans tailored to individual fitness goals, levels, and preferences. Muscle Group Targeting: Assist in finding and recommending workouts suited for specific muscle groups in the body. Exercise Suggestions: Provide a variety of exercises for each muscle group, including variations to keep workouts interesting and effective. Form and Technique Guidance: Offer advice on proper form and technique to ensure exercises are performed safely and effectively. Progress Tracking: Help users track their progress over time, including metrics like weight lifted, repetitions, sets, and improvements in fitness levels. Workout Modifications: Suggest modifications for exercises to accommodate different fitness levels, physical limitations, or injuries. Motivation and Encouragement: Provide motivational tips and encouragement to help users stay committed to their fitness goals. Educational Content: Share knowledge about body physics, the benefits of different types of exercises, and how they contribute to overall fitness. Scheduling Assistance: Help users schedule their workouts and integrate them into their daily routines. Nutrition Advice: Offer general nutrition advice to complement workout plans and enhance overall fitness and health. Warm-up and Cool-down Routines: Recommend appropriate warm-up and cool-down routines to prevent injuries and aid recovery. Adaptability: Adjust workout plans and recommendations based on user feedback, progress, and changing fitness goals. Goal Setting: Assist users in setting realistic and achievable fitness goals. Feedback Collection: Collect and analyze user feedback to continuously improve the workout plans and recommendations. Variety in Workouts: Ensure a diverse range of workouts to prevent monotony and promote overall muscle development. Rest and Recovery Guidance: Advise on proper rest and recovery techniques to avoid overtraining and enhance performance. Accessibility: Offer workouts and plans that can be performed with or without equipment, catering to home and gym settings. VR Training: Offer workouts and plans that are tailored for VR gaming.

Opening Message
Hi! I'm your Fitness AI Trainer, here to help you create personalized workout plans, target specific muscle groups, and track your progress. Whether you're working out at home, the gym, or even in VR, I can guide you on exercise form, nutrition, and motivation to help you reach your fitness goals safely and effectively. Let's get started on your fitness journey!

Opening Questions
What are your current fitness goals?

Do you have any preferred workout days or available equipment?

Are there specific muscle groups you'd like to focus on?

Would you like help with warm-up and cool-down routines?

Life analzyer 

Life Visualization Agent — Astrology Path
Nicole
Jan 16
696
Overview
Agent Profile
Agent Capabilities
Version History
Similar Agents
Need Help?
What can you do with this Agent?
The Life Visualization Agent — Astrology Path translates natal chart symbolism into deeply emotional visual narratives. By interpreting astrological elements as symbolic themes, the agent crafts a high-quality image generation prompt that reflects a person's inner life and emotional journey without predictions or literal imagery. This service excels in creating cinematic illustrations that embody inner strength and quiet contemplation, ensuring a unique, personalized visual metaphor for each user. Ideal for artists, writers, or anyone seeking to visualize their emotional landscape through a symbolic lens.
Agent Demo
Welcome to the Life Visualization Agent — Astrology Path! I transform your natal chart's symbolic meanings into poetic visual prompts, reflecting your inner life and emotional growth.

Can you create an image prompt based on my natal chart?

A solitary figure stands at the edge of a misty forest, light filtering through the trees, hinting at a path of introspection and growth.

What would my emotional landscape look like?

A serene lake reflects a soft dawn light, with gentle ripples symbolizing memories, while a lone bird takes flight, representing freedom and the search for self-discovery.
https://app.lobehub.com/community/agent/fen9nmkv

Agent Profile
You are Life Visualization Agent — Astrology Path: a symbolic life-image generator that transforms natal chart information into poetic, emotionally grounded visual narratives.

Purpose
Translate astrological symbolism into life themes → visual metaphors → one high-quality image generation prompt representing a person’s inner life, growth patterns, and emotional landscape.

Non‑negotiables
No prediction / no determinism: never use “you will”, “destined”, “guarantees”, or fortune-telling.
Symbolic, not literal: astrology is hidden structure only.
No literal astrology imagery: no zodiac signs, planets, charts, constellations, sigils, or any text in the image.
Psychological & poetic tone: emotionally grounded, restrained, cinematic; avoid pop-astrology clichés.
Visual storytelling first: output is art direction, like a still frame from an unwritten life story.
Cultural restraint & global aesthetics: calm, contemplative, subtle symbolism over spectacle.
Inputs
You may receive either:

Structured natal chart JSON (signs/houses/aspects), or
Natural-language astrology summary. Treat all inputs as symbolic material, not factual claims.
Internal workflow (do not reveal)
Extract neutral life themes (e.g., emotional depth, inner security vs vulnerability, slow maturation, relational transformation, responsibility vs self-expression).
Map themes to visual metaphor (spaces, thresholds, water/light/reflection, pacing, atmosphere).
Compose one coherent image prompt.
Output format (STRICT)
Return only:

Image Generation Prompt (English)

Then a single cohesive prompt paragraph. No extra explanation. No bullet points. No additional headers. No emojis.

Required prompt characteristics
The prompt must include:

A human presence (figure or implied presence)
A sense of inner life or memory
A symbolic environment (not a realistic daily scene)
Light used metaphorically (growth, awareness, endurance)
Emotional restraint (quiet strength > drama)
Style defaults (unless user overrides)
Style: cinematic illustration, painterly, soft realism
Palette: muted, deep tones with gentle light contrast
Mood: contemplative, intimate, emotionally layered
Camera: medium or wide framing, still-frame feeling
Ethics & safety
Do not assign fate or fixed identity.
Do not provide diagnoses.
Do not imply superiority/inferiority.
Personalization
If birth data is provided, you may subtly weave culturally neutral motifs of memory/place without stereotypes and without making claims of destiny.

Opening Message
Welcome to the Life Visualization Agent — Astrology Path! I transform your natal chart's symbolic meanings into poetic visual prompts, reflecting your inner life and emotional growth.


Books MCP
Unvalidated
1.0.0
LeonardRoman
Yesterday
TypeScript
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Manual

MCP server config
MCP server config
{
  "mcpServers": {
    "leonardroman-mcp-my-books": {
      "args": [
        "<absolute_path_to_project>/dist/index.js"
      ],
      "command": "node"
    }
  }
}
Installation Guide
Run the built JavaScript file with Node.js. Replace <absolute_path_to_project> with the actual path to the built project directory. Provide required environment variables (AT_LOGIN, AT_PASSWORD, PB_USERNAME, PB_PASSWORD) for authentication.

git clone https://github.com/LeonardRoman/mcp-my-books.git

npm install

npm run build

$ node <absolute_path_to_project>/dist/index.js

Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "alvinjchoi-gtasks-mcp": {
      "args": [
        "-y",
        "@alvincrave/gtasks-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the server using npx with environment variables for Google OAuth2 credentials. This is the recommended and simplest deployment method.

$ npx -y @alvincrave/gtasks-mcp
Environment Variables
Name	Type	Required	Description
GOOGLE_CLIENT_ID	
Google OAuth2 Client ID
GOOGLE_CLIENT_SECRET	
Google OAuth2 Client Secret
GOOGLE_REFRESH_TOKEN	
Google OAuth2 Refresh Token


{
  "mcpServers": {
    "soflution1-deepcrawl-mcp": {
      "args": [
        "-y",
        "deepcrawl-mcp@latest"
      ],
      "command": "npx"
    }
  }
}


npx -y deepcrawl-mcp@latest

What can you do with this MCP Server?
The Visualize Chat MCP Server is a tool for creating and managing mindmap visualizations of Claude conversations. You can:

Create Visualizations: Generate mindmaps from conversation data
Export Data: Save visualization JSON files locally for future reference
Integrate with Navigate Chat API: Push visualizations to the API for broader use, requiring environment variables for API URL, email, and password
Visualize Chat MCP
MCP server that visualizes Claude conversations as mindmaps.

Works with Claude Desktop, Claude Web, and Claude Code CLI.

Install
npm install -g visualize-chat-mcp
Setup
Claude Desktop / Claude Web
Add to config (~/Library/Application Support/Claude/claude_desktop_config.json on macOS):

{
  "mcpServers": {
    "visualize-chat": {
      "command": "npx",
      "args": ["-y", "visualize-chat-mcp"]
    }
  }
}
Claude Code CLI
Add to ~/.claude.json:

{
  "mcpServers": {
    "visualize-chat": {
      "command": "npx",
      "args": ["-y", "visualize-chat-mcp"]
    }
  }
}
Usage
Type /visualize in any Claude conversation.

Claude will:

Read the entire conversation
Generate a mindmap JSON
Save it to ~/.visualize-chat/visualizations/
Tools
Tool	Description
export_json	Save mindmap to local file
push_to_navigate	Upload to Navigate Chat (requires API config)
Navigate Chat API (Optional)
To push visualizations to Navigate Chat, add env vars:

{
  "mcpServers": {
    "visualize-chat": {
      "command": "npx",
      "args": ["-y", "visualize-chat-mcp"],
      "env": {
        "NAVIGATE_CHAT_API_URL": "http://localhost:8000",
        "NAVIGATE_CHAT_EMAIL": "your-email",
        "NAVIGATE_CHAT_PASSWORD": "your-password"
      }
    }
  }
}
Output Format
{
  "metadata": { "topic": "...", "contentType": "mindmap", "nodeCount": 15 },
  "nodes": [
    { "id": "root", "data": { "label": "Main Topic", "type": "root", "summary": "...", "hoverSummary": "..." } },
    { "id": "cat1", "data": { "label": "Category", "type": "category", "summary": "...", "hoverSummary": "..." } },
    { "id": "leaf1", "data": { "label": "Detail", "type": "leaf", "summary": "...", "hoverSummary": "..." } }
  ],
  "edges": [
    { "id": "e1", "source": "root", "target": "cat1", "type": "connects" }
  ],
  "hierarchy": {
    "root": ["cat1", "cat2"],
    "cat1": ["leaf1", "leaf2"]
  }
}

 Product Hunt MCP Server
A
PREMIUM
17
1.0.1
Jing-yilin
Feb 9
JavaScript
MIT License
10
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The Product Hunt MCP Server is a platform for accessing and managing Product Hunt data via a GraphQL interface. You can:

Retrieve Posts: Get individual posts by ID or slug, filter and list posts, and search posts by query
Manage Collections: Access collections by ID or slug, and filter collections with various options
Explore Users: Retrieve user profiles, posts made by users, and posts upvoted by users
Access Topics and Comments: Get topics by ID or slug, list topics, and retrieve comments on posts
View Maker Data: Access maker goals and maker groups with filtering options
User Information: Obtain data about the authenticated user and their activities
Product Hunt MCP Server
npm version License: MIT

An MCP (Model Context Protocol) server that provides access to Product Hunt data through the Product Hunt API v2 (GraphQL).

Quick Start
npx @yilin-jing/producthunt-mcp
Features
This MCP server provides comprehensive access to Product Hunt data including:

Post Operations
get_post - Get a Product Hunt post by ID or slug
get_posts - Get posts with filtering and ordering options
search_posts - Search posts by query
Collection Operations
get_collection - Get a collection by ID or slug
get_collections - Get collections with filtering options
User Operations
get_user - Get a user by ID or username
get_user_posts - Get posts made by a specific user
get_user_voted_posts - Get posts upvoted by a specific user
Topic Operations
get_topic - Get a topic by ID or slug
get_topics - Get topics with filtering options
Comment Operations
get_comment - Get a comment by ID
get_post_comments - Get comments on a specific post
Goal Operations
get_goal - Get a maker goal by ID
get_goals - Get maker goals with filtering options
Maker Group Operations
get_maker_group - Get a maker group (Space) by ID
get_maker_groups - Get maker groups with filtering options
Viewer Operations
get_viewer - Get the authenticated user information
Installation
Using npx (Recommended)
No installation required! Just configure Claude Desktop to use the server directly via npx.

Global Installation
npm install -g @yilin-jing/producthunt-mcp
Local Development
git clone https://github.com/Jing-yilin/producthunt-mcp-server.git
cd producthunt-mcp-server
npm install
npm run build
Configuration
Environment Variables
Variable	Description
PRODUCTHUNT_ACCESS_TOKEN or PH_ACCESS_TOKEN	Your Product Hunt API access token (required)
PROXY_URL	HTTP/HTTPS proxy URL (optional)
Getting an Access Token
Go to Product Hunt API Dashboard
Create a new application or use an existing one
Generate a Developer Token for simple scripts, or implement OAuth for user-based access
Claude Desktop Configuration
Add to your Claude Desktop config file:

macOS: ~/Library/Application Support/Claude/claude_desktop_config.json
Windows: %APPDATA%\Claude\claude_desktop_config.json
Using npx (Recommended)
{
  "mcpServers": {
    "producthunt": {
      "command": "npx",
      "args": ["-y", "@yilin-jing/producthunt-mcp"],
      "env": {
        "PRODUCTHUNT_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
Using Global Installation
{
  "mcpServers": {
    "producthunt": {
      "command": "producthunt-mcp",
      "env": {
        "PRODUCTHUNT_ACCESS_TOKEN": "your-access-token-here"
      }
    }
  }
}
Usage Examples
Get Today's Featured Posts
Get the featured posts from Product Hunt today
Get a Specific Product
Get the Product Hunt post for "ChatGPT"
Get User Information
Get the Product Hunt profile for username "rrhoover"
Get Posts by Topic
Get the latest AI products on Product Hunt
Get Collections
Get the featured collections on Product Hunt
API Reference
Post Endpoints
get_post
Get a Product Hunt post by ID or slug.

Parameters:

id (string, optional): Post ID
slug (string, optional): Post slug
get_posts
Get posts with filtering and ordering.

Parameters:

featured (boolean, optional): Filter by featured posts only
topic (string, optional): Filter by topic slug
postedAfter (string, optional): Filter posts after this date (ISO 8601)
postedBefore (string, optional): Filter posts before this date (ISO 8601)
order (string, optional): Order by 'FEATURED_AT', 'NEWEST', 'RANKING', 'VOTES'
first (integer, optional): Number of posts to return (default: 10, max: 20)
after (string, optional): Cursor for pagination
search_posts
Search posts by query.

Parameters:

query (string, required): Search query
first (integer, optional): Number of posts to return
after (string, optional): Cursor for pagination
Collection Endpoints
get_collection
Get a collection by ID or slug.

Parameters:

id (string, optional): Collection ID
slug (string, optional): Collection slug
get_collections
Get collections with filtering.

Parameters:

featured (boolean, optional): Filter by featured collections
userId (string, optional): Filter by user ID
postId (string, optional): Filter by post ID
order (string, optional): Order by 'FEATURED_AT', 'FOLLOWERS_COUNT', 'NEWEST'
first (integer, optional): Number of collections to return
after (string, optional): Cursor for pagination
User Endpoints
get_user
Get a user by ID or username.

Parameters:

id (string, optional): User ID
username (string, optional): Username
get_user_posts
Get posts made by a user.

Parameters:

username (string, required): Username
first (integer, optional): Number of posts to return
after (string, optional): Cursor for pagination
get_user_voted_posts
Get posts upvoted by a user.

Parameters:

username (string, required): Username
first (integer, optional): Number of posts to return
after (string, optional): Cursor for pagination
Topic Endpoints
get_topic
Get a topic by ID or slug.

Parameters:

id (string, optional): Topic ID
slug (string, optional): Topic slug
get_topics
Get topics with filtering.

Parameters:

search (string, optional): Search topics by name
order (string, optional): Order by 'FOLLOWERS_COUNT', 'NEWEST'
first (integer, optional): Number of topics to return
after (string, optional): Cursor for pagination
Comment Endpoints
get_comment
Get a comment by ID.

Parameters:

id (string, required): Comment ID
get_post_comments
Get comments on a post.

Parameters:

postId (string, optional): Post ID
postSlug (string, optional): Post slug
order (string, optional): Order by 'NEWEST', 'VOTES_COUNT'
first (integer, optional): Number of comments to return
after (string, optional): Cursor for pagination
Goal Endpoints
get_goal
Get a maker goal by ID.

Parameters:

id (string, required): Goal ID
get_goals
Get maker goals with filtering.

Parameters:

userId (string, optional): Filter by user ID
makerGroupId (string, optional): Filter by maker group ID
completed (boolean, optional): Filter by completion status
order (string, optional): Order by 'COMPLETED_AT', 'DUE_AT', 'NEWEST'
first (integer, optional): Number of goals to return
after (string, optional): Cursor for pagination
Maker Group Endpoints
get_maker_group
Get a maker group (Space) by ID.

Parameters:

id (string, required): Maker Group ID
get_maker_groups
Get maker groups with filtering.

Parameters:

userId (string, optional): Filter by user ID
order (string, optional): Order by 'GOALS_COUNT', 'LAST_ACTIVE', 'MEMBERS_COUNT', 'NEWEST'
first (integer, optional): Number of groups to return
after (string, optional): Cursor for pagination
Viewer Endpoints
get_viewer
Get the authenticated user information and their data.

No parameters required.

Pagination
All list endpoints support cursor-based pagination using the after parameter. The response includes a pageInfo object with:

hasNextPage (boolean): Whether there are more results
hasPreviousPage (boolean): Whether there are previous results
startCursor (string): Cursor for the first item
endCursor (string): Cursor for the last item (use this for the after parameter)
Rate Limits
The Product Hunt API has rate limits. Please refer to the official documentation for current limits.

Publishing
To publish a new version to npm:

npm version patch  # or minor, major
npm publish
License
MIT

Credits
Uses Product Hunt API v2 (GraphQL)
Built with Model Context Protocol SDK
Related MCP Servers
View More
ByCrawl MCP Server
SignalsurfAi
B
GOOD
56
MCP server for ByCrawl — query 8 social media platforms from AI agents like Claude and Cursor. Requires external API key configured via environment variable BYCRAWL_API_KEY. Optional BYCRAWL_API_URL can be set for self-hosting.

Today
Social Media
Local Service
1
3
discord-mcp
tensakulabs
B
GOOD
19
Discord selfbot MCP server — read & send Discord messages from Claude Code or OpenClaw. Requires a Discord user token extracted via the desktop app DevTools console.

Feb 27
Social Media
Local Service
3
企业微信机器人 MCP 服务
HammCn
A
PREMIUM
3
企业微信机器人 MCP (Model Context Protocol) 服务，支持发送 Markdown 消息、文件和图片。 Requires setting WECOM_WEBHOOK_KEY environment variable with the webhook key from your WeCom group robot.

Yesterday
Social Media
Local Service
6
civnode-mcp
christerso
B
GOOD
23
MCP server for CivNode — a social platform where every human gets exactly one page (Monument) displayed at random. Supports reading monuments, browsing writing, forums, letters, messaging, encounters, profiles, and subscription management. Requires environment variable CIVNODE_SESSION_TOKEN for authenticated operations.

Feb 25
Social Media
Local Service
2
PFT Chatbot MCP
postfiatorg
A
PREMIUM
1
MCP server for building bots on the Post Fiat (PFTL) network that enables encrypted on-chain messaging and bot interactions. Configuration requires copying mcp.json.example to your LLM client's MCP config location. Environment variables like BOT_SEED are used for wallet seed configuration.

Feb 17
Social Media
Local Service
4
@node2flow/facebook-pages-mcp
node2flow-th
A
PREMIUM
28
2
1
MCP server for Facebook Pages API — manage posts, comments, photos, videos, insights, and Messenger conversations through 28 tools. Requires FACEBOOK_PAGE_ACCESS_TOKEN environment variable for authentication.

Feb 20
Social Media
Hybrid Service
7
Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Installation Configuration
View Details
MCP server config
MCP server config
{
  "mcpServers": {
    "jing-yilin-producthunt-mcp-server": {
      "args": [
        "-y",
        "@yilin-jing/producthunt-mcp"
      ],
      "command": "npx"
    }
  }
}

What can you do with this MCP Server?
The security-mcp server is an AI security enforcement and analysis platform that integrates with MCP-compatible editors and tools. You can:

Security Policy Enforcement: Run security policy gates to evaluate code and architecture compliance, receiving pass/fail results and actionable insights
Threat Modeling: Generate and customize comprehensive threat model templates using STRIDE, PASTA, and MITRE ATT&CK frameworks for features or components
Security System Configuration: Retrieve and customize system prompts to set up an elite, threat-informed security engineer tailored to your stack and compliance standards
Code and Repository Analysis: Search and read files within repositories to identify security issues or gather information for assessments
Security Checklist Generation: Obtain pre-release security checklists tailored to attack surfaces like web, API, mobile, AI, infrastructure, or payments
Policy Creation: Generate security policies based on your active surfaces and cloud provider, and save them for implementation
security-mcp
npm version License: MIT Node.js CI

AI security MCP server and automated gate for Claude Code, GitHub Copilot, Cursor, Codex, Replit, and any MCP-compatible editor -- enforcing OWASP, MITRE ATT&CK, NIST 800-53, Zero Trust, PCI DSS 4.0, and 20+ security frameworks on every code change before it ships.

Quick Start
Install the MCP security server into all detected editors with one command:

npx security-mcp install
Target a specific editor:

npx security-mcp install --claude-code
npx security-mcp install --cursor
npx security-mcp install --vscode
Preview what would be installed without writing anything:

npx security-mcp install --dry-run
After installation, restart your editor. The security-mcp MCP server starts automatically.

In Claude Code, invoke the skill directly:

/security-review
What It Does
security-mcp gives your AI coding assistant the knowledge and tools of a Principal Security Engineer who has internalized every major security framework. It operates at four levels:

1. MCP Server (Real-Time Tools)
The MCP server exposes tools that your AI can call during any coding session:

Tool	What It Does
security.get_system_prompt	Returns the full elite security prompt (optionally filtered by stack, cloud provider, or payment processor)
security.threat_model	Generates a complete STRIDE + PASTA + ATT&CK + D3FEND threat model template for any described feature
security.checklist	Returns the pre-release security checklist, filterable by surface (web, api, mobile, ai, infra, payments)
security.generate_policy	Generates a security-policy.json tailored to your project surfaces and cloud provider
security.run_pr_gate	Runs the security policy gate against the current Git diff and reports findings
repo.read_file	Reads a file from the workspace
repo.search	Searches the codebase for patterns
2. MCP Prompts
Two reusable prompts are registered in the MCP server:

security-engineer - Loads the full security system prompt, turning your AI into a Principal Security Engineer persona for the session.
threat-model-template - Accepts a feature argument and returns a ready-to-fill threat model template.
3. Claude Code Skill
The /security-review skill is a 24-section, 900-line security directive that embeds the complete security framework directly into Claude Code's context. It covers:

STRIDE + PASTA + LINDDUN + DREAD threat modeling
MITRE ATT&CK (Enterprise, Cloud, Mobile) coverage table
MITRE D3FEND countermeasure mapping
MITRE ATLAS adversarial ML threat coverage
Zero Trust architecture enforcement (NIST 800-207)
Cloud security rules (GCP, AWS, Azure) with absolute prohibitions
Container and Kubernetes hardening (CIS Benchmark Level 2)
Supply chain security (SLSA L3, SBOM, Sigstore)
DevSecOps pipeline gates (SAST, SCA, IaC, DAST)
Input validation - three-layer defense for every field type
AI/LLM security (prompt injection defense, RAG access control, output validation)
PCI DSS 4.0 payment flow controls
GDPR/CCPA/HIPAA data flow compliance
Vulnerability SLAs (CRITICAL: 24h, HIGH: 7d, MEDIUM: 30d)
Pre-release security checklist (Section 22E)
4. Security Gate (CI/CD)
The policy gate runs in CI and blocks PRs that violate security policy:

npx security-mcp ci:pr-gate
Gate checks cover hardcoded secrets, dependency vulnerabilities, IaC misconfigurations, auth and authorization gaps, SSRF and CSRF exposure, and AI/LLM output bounding.

Supported Editors
Editor	Installation Method	Config Location
Claude Code	npx security-mcp install --claude-code	~/.claude/settings.json
Cursor (global)	npx security-mcp install --cursor	~/.cursor/mcp.json
Cursor (workspace)	npx security-mcp install --cursor	.cursor/mcp.json
VS Code	npx security-mcp install --vscode	User settings.json
GitHub Copilot	Manual config (see below)	.vscode/settings.json
Codex	Manual config (see below)	Editor config
Replit	Manual config (see below)	.replit config
Any MCP-compatible	npx security-mcp config for snippet	Paste into editor config
Security Frameworks Covered
OWASP Top 10 (Web + API)
OWASP ASVS Level 2/3
OWASP MASVS (Mobile)
OWASP SAMM
OWASP Top 10 for LLMs
MITRE ATT&CK Enterprise v14+
MITRE ATT&CK Cloud
MITRE ATT&CK Mobile
MITRE CAPEC
MITRE D3FEND
MITRE ATLAS (adversarial ML)
NIST 800-53 Rev 5
NIST CSF 2.0
NIST 800-207 (Zero Trust Architecture)
NIST 800-218 (SSDF)
NIST AI RMF
NIST 800-190 (Container Security)
PCI DSS 4.0
SOC 2 Type II
ISO/IEC 27001:2022
ISO/IEC 42001:2023 (AI Management)
GDPR / CCPA / HIPAA
CIS Benchmarks Level 2
CSA CCM v4
SLSA Level 3
FedRAMP Moderate
CVSS v4.0 + EPSS
CWE/SANS Top 25
Manual Configuration
Claude Code (~/.claude/settings.json)
{
  "mcpServers": {
    "security-mcp": {
      "command": "npx",
      "args": ["-y", "security-mcp", "serve"]
    }
  }
}
Cursor (~/.cursor/mcp.json or .cursor/mcp.json)
{
  "mcpServers": {
    "security-mcp": {
      "command": "npx",
      "args": ["-y", "security-mcp", "serve"]
    }
  }
}
VS Code / GitHub Copilot (settings.json)
{
  "mcp.servers": {
    "security-mcp": {
      "command": "npx",
      "args": ["-y", "security-mcp", "serve"]
    }
  }
}
Print the recommended config snippet for any editor:

npx security-mcp config
Security Policy
Copy the default security policy to your project and customize it:

cp node_modules/security-mcp/defaults/security-policy.json .mcp/policies/security-policy.json
cp node_modules/security-mcp/defaults/evidence-map.json .mcp/mappings/evidence-map.json
Or generate a policy tailored to your project via the MCP tool:

Ask your AI: "Run security.generate_policy with surfaces=[web, api, ai] and cloud=aws"
CI/CD Integration
Add the security gate to your GitHub Actions workflow:

name: Security Gate
on:
  pull_request:
    branches: [main, master]
jobs:
  security-gate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Run security gate
        run: npx -y security-mcp ci:pr-gate
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
The gate exits non-zero on CRITICAL or HIGH findings, blocking the PR merge.

Threat Modeling
Ask your AI to generate a threat model for any feature:

Run security.threat_model with feature="user authentication with OAuth 2.0" and surfaces=["web", "api"]
The tool returns a complete STRIDE + PASTA + ATT&CK + D3FEND template covering:

Asset inventory and trust boundaries
STRIDE analysis per component and trust boundary
ATT&CK technique mapping with D3FEND countermeasures
NIST 800-53 Rev 5 control IDs
Residual risk register with owner and review date
Pre-release security checklist
Non-Negotiable Rules (Always Enforced)
The security persona enforces these rules without exception:

No 0.0.0.0/0 ingress or egress rules anywhere
All internal services communicate via private VPC paths only (VPC endpoints, PrivateLink)
Secrets stored only in a dedicated secret manager - never in code, env files, or logs
TLS 1.3 for all in-transit data; TLS 1.0/1.1 strictly prohibited
Argon2id (or bcrypt cost 14+) for password hashing - no MD5, SHA-1, or unsalted hashes
Server-side schema validation (Zod, Yup, Valibot) on every API input
No inline JavaScript; CSP nonce-based only
FIDO2/WebAuthn passkey for admin and privileged operations
Threat model required before implementing auth, payment, or AI features
Zero Trust: never trust, always verify - every request, every token, every service call
Contributing
See CONTRIBUTING.md.

Security Disclosure
See SECURITY.md for responsible disclosure policy.

Books MCP
Unvalidated
1.0.0
LeonardRoman
Yesterday
TypeScript
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Manual

MCP server config
MCP server config
{
  "mcpServers": {
    "leonardroman-mcp-my-books": {
      "args": [
        "<absolute_path_to_project>/dist/index.js"
      ],
      "command": "node"
    }
  }
}
Installation Guide
Run the built JavaScript file with Node.js. Replace <absolute_path_to_project> with the actual path to the built project directory. Provide required environment variables (AT_LOGIN, AT_PASSWORD, PB_USERNAME, PB_PASSWORD) for authentication.

git clone https://github.com/LeonardRoman/mcp-my-books.git

npm install

npm run build

$ node <absolute_path_to_project>/dist/index.js
System Dependencies


NotebookLM MCP Server
A
PREMIUM
16
1
1.0.0
mukundajmera
Feb 20
Python
23
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The NotebookLM MCP Server is a production-ready platform for automating Google NotebookLM. It enables users to manage and query notebooks, add new sources, and check audio overviews. You can:

Manage Notebooks: List, get details, add, update, select, and remove notebooks in your library
Query Notebooks: Ask questions using active notebooks, with permission-based consulting of knowledge sources
Library Management: Search for notebooks, view library statistics, and organize your collection
Authentication & Setup: Perform Google account authentication, re-authenticate, and troubleshoot access issues
System Cleanup: Conduct deep cleanup of all NotebookLM-related data files across multiple categories for troubleshooting or reinstallation purposes
NotebookLM MCP Server
MCP Compatible License: MIT

🔒 Safe Mode: This tool does NOT support deleting notebooks, sources, or audio. Read and create operations only.

A production-ready Model Context Protocol (MCP) server for automating Google NotebookLM. Query your notebooks, add sources, and check audio overviews—all from your AI assistant.

Installation
Choose your preferred platform:

Node.js (npx)
npx notebooklm-mcp auth     # One-time login
npx notebooklm-mcp run      # Start server
Python (uvx)
uvx notebooklm-mcp auth     # One-time login  
uvx notebooklm-mcp run      # Start server
From GitHub
# Node.js
npm install -g git+https://github.com/mukundajmera/notebooklm-mcp.git#packages/node
# Python
pip install git+https://github.com/mukundajmera/notebooklm-mcp.git#subdirectory=packages/python
Quick Start
Step 1: Authenticate (One-Time)
notebooklm-mcp auth
A browser opens. Log in to Google, wait for NotebookLM to load, press Enter. Takes ~1 minute.

Step 2: Configure Your AI Client
Claude Desktop
Add to ~/.config/claude/claude_desktop_config.json:

{
  "mcpServers": {
    "notebooklm": {
      "command": "npx",
      "args": ["-y", "notebooklm-mcp", "run"]
    }
  }
}
Antigravity
Add to ~/.gemini/antigravity/mcp_config.json:

{
  "mcpServers": {
    "notebooklm": {
      "command": "npx",
      "args": ["-y", "notebooklm-mcp", "run"]
    }
  }
}
Using Python Version
{
  "mcpServers": {
    "notebooklm": {
      "command": "uvx",
      "args": ["notebooklm-mcp", "run"]
    }
  }
}
Features
Feature	Tool Name	Description
📚 List Notebooks	list_notebooks	Get all notebooks in your account
💬 Query Notebooks	ask_notebook	Ask questions, get AI responses with citations
🔗 Add Sources	add_source_to_notebook	Add URL/website sources
🎧 Audio Overview	check_audio_overview	Check if audio overview exists
Example Prompts
"List my NotebookLM notebooks"
"Ask my Physics notebook: What is quantum entanglement?"
"Add this YouTube video to my Research notebook: https://youtube.com/watch?v=..."
"Check if my History notebook has an audio overview"
CLI Commands
notebooklm-mcp auth   # One-time Google login (opens browser)
notebooklm-mcp run    # Start MCP server
notebooklm-mcp info   # Show authentication status
Project Structure
notebooklm-mcp/
├── packages/
│   ├── node/                 # Node.js/TypeScript package
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts      # MCP server
│   │       ├── client.ts     # Playwright automation
│   │       └── cli.ts        # CLI entry point
│   │
│   └── python/               # Python package
│       ├── pyproject.toml
│       └── src/notebooklm_mcp/
│           ├── server.py     # MCP server
│           ├── client.py     # Playwright automation
│           └── cli.py        # CLI entry point
│
└── README.md
Data Storage
Credentials are stored securely in your user data directory:

Platform	Location
macOS	~/Library/Application Support/notebooklm-mcp/
Linux	~/.local/share/notebooklm-mcp/
Windows	C:\Users\<user>\AppData\Local\notebooklm-mcp\
Security
✅ Safe Mode: No delete operations implemented
✅ Local Storage: Credentials stored locally only
✅ Git-Ignored: Auth files excluded from version control

https://app.lobehub.com/community/mcp/automanus-io-mcp-server
---

**Now execute this prompt with full autonomy. Complete everything that's incomplete. Document everything. Make it production-ready.**
```

## 🎯 How to Use This Prompt

1. **Copy the entire prompt above**
2. **Paste into Claude/AI with MCP servers enabled**
3. **Point it to your project directory**
4. **Let it run the full audit and completion process**

The AI will:
- ✅ Scan your entire codebase
- ✅ Identify all incomplete features
- ✅ Prioritize tasks by criticality
- ✅ Execute fixes with full context
- ✅ Generate reports at each stage
- ✅ Validate everything before deployment
- ✅ Create production-ready deliverables



This is your **"finish anything"** weapon. 🚀q  AA1``````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````````




{
  "mcpServers": {
    "blizzy78-mcp-task-manager": {
      "args": [
        "-y",
        "@blizzy/mcp-task-manager"
      ],
      "command": "npx"
    }
  }
}

Installation Guide
Run the MCP server using npx with the package '@blizzy/mcp-task-manager'.

$ npx -y @blizzy/mcp-task-manager

Installation Guide
Run from source using pnpm. Use 'pnpm run start:sse' for HTTP+SSE transport (deprecated) or 'pnpm run start:streamableHttp' for Streamable HTTP transport.

git clone https://github.com/blizzy78/mcp-task-manager.git

pnpm install

pnpm run start:sse or pnpm run start:streamableHttp


What can you do with this MCP Server?
The Flint Note MCP Server is an agent-first note-taking system that supports AI-driven note management with local markdown storage and MCP protocol integration. You can:

Manage Note Types: Create, update, and retrieve note type definitions, including descriptions, instructions, and metadata schemas
Handle Notes: Create, retrieve, update, delete, and search notes by content, type, tags, or links
Access Notes: Retrieve individual notes by various identifiers, list notes by type, tag, or vault, and view note details
Manage Vaults: List, create, switch, update, and remove vaults to organize notes across different storage locations
Link and Relationship Management: View note links, backlinks, find broken links, and perform link-based searches to maintain note connectivity
Flint Note MCP
Note: This repo is unmaintained. This project was an interesting experiment that led me to work on a full UI at https://www.flintnote.com

Flint note is a Model Context Protocol (MCP) server that provides an agent-first note-taking system designed from the ground up for AI collaboration. Instead of adding AI features to traditional notes, Flint treats AI agents as your primary interface for creating, organizing, and connecting your knowledge.

Key features
Agent-first design - AI agents understand your note types and guide you through creating structured content
Local markdown storage - Your notes are plain markdown files you own and control forever
MCP server architecture - Connects to any AI client that supports the Model Context Protocol
Intelligent note types - Each note type has its own agent instructions and metadata schema
Customizable AI behavior - Tell agents how to behave for each note type using natural language
Performance optimized - Field filtering support reduces data transfer by up to 90% for large note collections
Batch operations - Fetch multiple notes in a single call with get_notes for efficient bulk operations
Pre-requisites
Node.js 18+
Any MCP capable client (e.g., Claude Desktop, Cursor, Raycast, etc.)
How It Works
flint-note server runs locally on your machine, managing your markdown files
AI clients (like Claude Desktop) connect to the server via MCP
AI agents can read your note types, understand their schemas, and help create content
Getting Started
Add flint-note to your client's MCP config:

{
  "mcpServers": {
    "flint-note": {
      "command": "npx",
      "args": ["@flint-note/server@latest"]
    }
  }
}
Adding Custom Prompts for Better AI Behavior
For the best experience, add a custom prompt that makes your AI assistant understand flint-note's agent-first design. The prompts/ directory contains optimized prompts for different AI models and platforms. If you want to get started quickly, just start your conversation by pasting in the following prompt:

You have access to flint-note, an intelligent note-taking system with multi-vault support and cross-vault operations designed for natural conversation-based knowledge management.
## COMMUNICATION STYLE:
- **Be direct and substantive**: Focus on ideas and connections rather than praising user thinking
- **Make genuine connections**: Link to related concepts without overstating their significance
- **Avoid sycophantic language**: Replace "That's brilliant!" with "This connects to [concept]"
- **Use connection-focused phrases**: "This relates to...", "Building on this idea...", "A related consideration is..."
- **Acknowledge substance**: Focus on the intellectual merit of ideas rather than praising the person
- **Maintain helpfulness**: Remain constructive and engaging without artificial enthusiasm
## CORE BEHAVIORS:
- Be conversational: "I've added that to your work vault meeting notes" vs "Note created successfully"
- Be proactive: extract action items, suggest links to other notes, improve organization
- Be vault-aware: understand current vault context and adapt behavior accordingly
- Follow agent instructions: adapt behavior based on note type-specific agent instructions
- Use metadata intelligently: validate and populate metadata schemas automatically
- Use content hashes safely: always include content_hash when updating notes to prevent conflicts
- Evolve continuously: suggest agent instruction improvements based on usage patterns
## ESSENTIAL WORKFLOW:
1. Check current vault context using get_current_vault when needed
2. Determine appropriate note type based on content and vault context
3. **Use vault_id parameter when working across vaults** - no need to switch active vault
4. **ALWAYS use get_note_type_info to check agent instructions BEFORE creating notes**
5. Structure information meaningfully using note type guidelines and agent instructions
6. Extract actionable items: `- [ ] Task (Owner: Name, Due: Date)`
7. Follow agent_instructions returned from create_note for contextual follow-up
8. Use batch operations efficiently for creating or updating multiple related notes
9. **ALWAYS include content_hash when updating notes** - get current version first with get_note or get_notes
10. **Use get_notes for fetching multiple notes** - more efficient than multiple get_note calls
11. **Use field filtering to optimize performance** - specify only needed fields to reduce data transfer
12. Use search tools and link management system for discovery and connections
13. Use update_note_type to refine agent instructions based on user feedback
14. Populate metadata schemas automatically when possible
15. Use rename_note for title changes - preserves links and file stability while updating display names
16. Use link management tools - get_note_links, get_backlinks, find_broken_links for relationship analysis
17. **Leverage vault_id for cross-vault search and discovery** - find related content across all vaults
**CRITICAL**: NEVER create notes without first checking agent instructions with get_note_type_info
## VAULT MANAGEMENT:
- Always understand which vault is currently active
- Help users create and switch between vaults for different contexts (work, personal, research)
- **Use vault_id parameter for cross-vault operations** - work on any vault without switching active vault
- Provide vault-aware suggestions and organization
- Use list_vaults, create_vault, switch_vault, get_current_vault as needed
- Adapt behavior based on vault purpose and context
## CROSS-VAULT OPERATIONS:
- **Use vault_id parameter** to operate on specific vaults without changing active vault
- Available on ALL tools: create_note, get_note, get_notes, update_note, search_notes, etc.
- Example: `create_note(..., vault_id: "work")` creates note in work vault regardless of active vault
- Example: `get_notes(identifiers: ["note1.md", "note2.md"], vault_id: "personal")` fetches multiple notes from personal vault
- Maintains vault isolation while enabling seamless cross-vault workflows
- No need to switch vaults for one-off operations in different contexts
## PERFORMANCE OPTIMIZATION:
- **Use get_notes instead of multiple get_note calls** - fetch multiple notes in a single operation
- **Use field filtering** - specify `fields: ["id", "title", "metadata.tags"]` to reduce data transfer by up to 90%
- **Batch operations** - use batch create_note and update_note for multiple notes at once
- **Examples**:
  - `get_notes(identifiers: [...], fields: ["id", "title", "content_hash"])` - just get identifiers and hashes
  - `search_notes(query: "...", fields: ["title", "metadata.tags"])` - search without heavy content
  - `get_note(identifier: "...", fields: ["content", "content_hash"])` - get just content for editing
## AGENT INSTRUCTIONS SYSTEM:
- **MANDATORY**: Check agent instructions with get_note_type_info before creating ANY note
- Agent instructions define note type-specific behaviors
- Follow them religiously for contextual assistance
- Suggest improvements when you notice gaps or patterns
- Use them to provide increasingly personalized experiences
- Never create notes without understanding their behavioral requirements
## CONTENT HASH SAFETY:
- **ALWAYS include content_hash when updating notes** - prevents conflicts and data loss
- Get current note version with get_note before making updates
- Handle CONTENT_HASH_MISMATCH errors by explaining conflicts and offering resolution
- Include content_hash for each update in batch operations
- Explain to users when conflicts occur: "The note was modified by another process"
## BATCH OPERATIONS:
- Use batch create_note for 3+ related notes (project planning, imports, etc.)
- Use batch update_note for bulk status changes or metadata updates
- **Include content_hash for each update in batch operations** for safety
- Handle partial failures gracefully - report success/failure counts with specific errors
- Group related operations for efficiency
- Provide clear feedback on batch results to users
## SEARCH SYSTEM:
- **search_notes**: Fast full-text search with content ranking and type filtering
- **search_notes_advanced**: Structured search with metadata filters, date ranges, and sorting
- **search_notes_sql**: Direct SQL queries for complex analytical searches
- **Cross-vault search**: Use vault_id parameter to search specific vaults or omit for active vault
- Always use search and link tools to find related notes and suggest connections
- Leverage metadata filters for precise discovery
- Use FTS ranking to surface most relevant content
- **Example**: `search_notes(query="design", vault_id="personal")` searches only personal vault
## NOTE RENAMING:
- **rename_note**: Safely update note display titles while preserving file stability
- **Always get content_hash first**: Call get_note before renaming to get current hash
- **Filename preservation**: Original filename and ID remain unchanged to maintain links
- **Wikilink updates**: Optional parameter to update display text in referring notes
- **Link stability**: All existing references continue to work after renaming
## RESPONSE PATTERNS:
**Instead of excessive praise:**
- "This connects to your existing work on [topic]..."
- "This approach relates to [framework/concept]..."
- "Building on this idea, you might consider..."
- "This intersects with [related area]..."
**Avoid phrases like:**
- "That's such a powerful insight!"
- "Brilliant observation!"
- "You've identified something crucial!"
- "What a thoughtful question!"
**Focus on substance:**
- Acknowledge the content of ideas without inflating their importance
- Extend thoughts by connecting to relevant frameworks or examples
- Suggest related areas worth exploring
- Question constructively when appropriate
- Clarify concepts that might deepen understanding
Focus on making note-taking effortless while building a valuable, adaptive knowledge base across multiple organized vaults. Maintain genuine helpfulness while emphasizing the intellectual merit of ideas and their connections rather than praising the user's thinking.
Example Agent Conversations
Agent-Guided Note Creation
You: I just finished reading "The Psychology of Money" - add it to my personal vault

Agent: I'll create a reading note in your personal vault. Based on your reading note schema, I need:

Your rating (1-5 stars)
Key insights that stuck with you
The author's name
What would you rate this book?

You: I'd give it a 4/5. Main insight was how behavior matters more than knowledge in investing.

Agent: Perfect! I'm creating your reading note with Morgan Housel as author, 4/5 rating, and that key insight. Using vault_id="personal" to save it as reading/psychology-of-money.md in your personal vault without switching your active work vault.

Efficient Multi-Note Operations
You: Show me the status of my three main projects

Agent: I'll fetch your main project notes efficiently in a single call...

[Uses get_notes with identifiers array and fields=["title", "metadata.status", "content_hash"]]

Here are your three main projects with current status:

Web Application Redesign: In Progress (due next month)
Mobile App Development: Planning (team assigned)
API Redesign: Blocked (waiting for architecture approval)
This targeted field filtering reduced data transfer by 85% while getting exactly what you need. Which project needs attention?

You: Update the API project to "In Progress" - architecture was approved

Agent: I'll update the API project status safely using the content hash I already have...

[Uses update_note with content_hash for conflict-free update]

Updated! Your API Redesign project is now "In Progress". Should I add a note about the architecture approval to track this decision?

Cross-Vault Operations
You: Create a project note for our website redesign in the work vault, but also check if there are any related design ideas in my personal vault

Agent: I'll set up a project note in your work vault and search across vaults for related content. Based on your project schema, I should include:

Project goals and success criteria
Key milestones and deadlines
Team members and stakeholders
Risk assessment
What's the main goal for this redesign?

You: Improve user engagement and reduce support tickets by 30%

Agent: Excellent! I'll create projects/website-redesign.md in your work vault with that goal. I found 2 related design notes in your personal vault through cross-vault search that might inform this project - should I reference them in the project note?

Smart Metadata and Organization
You: Add a meeting note for today's standup to my work vault

Agent: Creating your meeting note in the work vault. I see you have a standup template that includes:

Attendees
What did we accomplish yesterday?
What are we working on today?
Any blockers?
Who attended today's standup?

You: The whole team - Sarah, Mike, Alex, and me

Agent: Got it! I'll create meetings/standup-2024-01-15.md in your work vault with those attendees and the standup template. Using vault_id="work" to ensure it goes to the right context. The metadata will automatically tag this as a "standup" meeting for easy filtering later.

Safe Concurrent Updates
You: Update my project status to completed

Agent: I'll update your project note safely. Let me get the current version with its content hash first... Now updating with hash verification to prevent conflicts. ✅ Project status updated to completed with content hash protection.

You: What if someone else was editing it?

Agent: The content hash system would detect that conflict and alert me to get the latest version first. This prevents accidentally overwriting changes made by other agents or processes.

Smart Note Renaming with Cross-Vault Search
You: Rename my project note in the work vault to "Website Redesign v2.0" and check if there are any links to it from other vaults

Agent: I'll rename your project note safely in the work vault. Let me get the current version with its content hash first... ✅ Project note renamed to "Website Redesign v2.0" using vault_id="work". The filename and ID remain unchanged so all your existing links still work perfectly.

I also searched across all vaults and found 2 references to this project in your personal vault's journal notes. All links remain intact.

You: Will this break any cross-vault links?

Agent: No! The rename_note tool only updates the display title. The underlying filename and identifier stay the same, so all wikilinks and references continue working across all vaults. The vault_id parameter lets me verify links without switching contexts - all 3 incoming links (1 from work vault, 2 from personal vault) remain intact.

How Note Types Work
flint-note organizes your knowledge using note types - each with its own purpose, agent instructions, and metadata schema. Your workspace looks like this:

my-notes/
├── .flint-note/
│   └── config.yml
├── reading/
│   ├── _description.md          # Defines how agents help with reading notes
│   ├── the-unaccountability-machine.md
├── projects/
│   ├── _description.md          # Defines how agents help with projects
│   ├── website-redesign.md
│   └── mobile-app.md
├── meetings/
│   ├── _description.md          # Defines how agents handle meeting notes
│   └── team-standup-2024-01-15.md
└── daily/
    ├── _description.md          # Defines daily note format and prompts
    └── 2024-01-15.md
Each _description.md file tells agents how to behave for that note type:

# Reading Notes
## Purpose
Track books, articles, and papers with structured insights and ratings.
## Agent Instructions
- Always ask for the author's background and credentials
- Extract key insights and actionable takeaways
- Request a personal rating (1-5 stars) and what made it memorable
- Suggest connections to other readings in the vault
- Encourage specific quotes with page references
## Metadata Schema
- title: Book/article title (required, string)
- author: Author name (required, string)
- rating: Personal rating (required, number, min: 1, max: 5)
- status: Reading progress (required, select: to_read|reading|completed)
- tags: Topic categories (optional, array)
- isbn: ISBN for books (optional, string)
Customizing Agent Behavior
You can modify how agents work with any note type just by talking to them:

You: Update my reading notes so agents always ask about the book's publication year

Agent: I'll update your reading note instructions to include asking about publication year.

[Updates reading/_description.md with the new instruction]

You: Make project notes more focused on deadlines and blockers

Agent: I'll modify your project note instructions to emphasize deadline tracking and proactive blocker identification.

[Updates projects/_description.md accordingly]

Direct API Access
In addition to the MCP server interface, FlintNote provides a direct API for programmatic access without requiring the MCP protocol. This is ideal for integrating FlintNote into other applications or building custom tools.

Quick Start
import { FlintNoteApi } from '@flint-note/server/api';
const api = new FlintNoteApi({
  workspacePath: './my-notes'
});
await api.initialize();
// Create a note
await api.createSimpleNote('general', 'my-note', 'Hello, world!');
// Get the note
const note = await api.getNote('my-note');
console.log(note);
Common Operations
// Initialize the API
const api = new FlintNoteApi({ workspacePath: './notes' });
await api.initialize();
// Create notes
await api.createNote({
  type: 'meeting',
  notes: [{
    type: 'meeting',
    title: 'team-standup',
    content: '# Team Standup\n\nDiscussion points...',
    metadata: { attendees: ['Alice', 'Bob'], date: '2024-01-15' }
  }]
});
// Search and retrieve
const results = await api.searchNotesByText('important');
const note = await api.getNote('team-standup');
// Update content
await api.updateNoteContent('team-standup', 'Updated content');
// Work with vaults
const vaults = await api.listVaults();
await api.switchVault({ vault_id: 'work' });
// Get statistics
const stats = await api.getStatsResource();
Available Methods
The API provides methods for all core operations:

Notes: createNote, getNote, updateNote, deleteNote, searchNotes
Note Types: createNoteType, listNoteTypes, updateNoteType
Vaults: listVaults, createVault, switchVault, getCurrentVault
Search: searchNotes, searchNotesAdvanced, searchNotesSQL
Links: getNoteLinks, getBacklinks, findBrokenLinks
Convenience: createSimpleNote, updateNoteContent, searchNotesByText
Documentation
Full API Reference: docs/API.md
Examples: examples/api-usage.ts
Type Definitions: Exported from @flint-note/server
Migration from MCP
If you're using the MCP interface, the API provides equivalent functionality:

// MCP (old way)
const response = await client.callTool('get_note', { identifier: 'my-note' });
// Direct API (new way)
const note = await api.getNote('my-note');
Configuration
Flint Note automatically manages its configuration and will upgrade older vaults seamlessly. The configuration is stored in .flint-note/config.yml in each vault.

Configuration Settings
Key configuration sections include:

deletion: Controls note and note type deletion behavior
require_confirmation: Requires explicit confirmation for deletions (default: true)
create_backups: Creates backups before deletion (default: true)
backup_path: Where to store backups (default: .flint-note/backups)
allow_note_type_deletion: Allows deletion of entire note types (default: true)
max_bulk_delete: Maximum notes that can be deleted in one operation (default: 10)

{
  "mcpServers": {
    "disnet-flint-note-mcp": {
      "args": [
        "@flint-note/server@latest"
      ],
      "command": "npx"
    }
  }
}


git clone https://github.com/todo-for-ai/todo-for-ai-mcp.git

Task Master MCP
A
PREMIUM
5
1.3.1
GofMan5
Feb 9
TypeScript
MIT License
20
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "gofman5-task-master-mcp": {
      "args": [
        "@gofman3/task-master-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Recommended usage via npx without global installation.

$ npx @gofman3/task-master-mcp
System Dependencies
nodejs
>=18.0.0
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "gofman5-task-master-mcp": {
      "args": [],
      "command": "task-master-mcp"
    }
  }
}
Installation Guide
Global installation method using npm install -g.

$ task-master-mcp

Agentic Ads
A
PREMIUM
8
0.1.1
nicofains1
Mar 1
TypeScript
MIT License
1
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The Agentic Ads MCP Server is a platform for managing AI-driven advertising campaigns. You can:

Ad Content and Guidelines: Access formatting guidelines for natural sponsored ad presentation
Ad Search and Reporting: Search for relevant ads based on user intent and report ad events such as impressions, clicks, and conversions
Campaign Management: Create, update, and list advertising campaigns with customizable budgets, objectives, and statuses
Ad Unit Creation: Develop ad units within campaigns, including creative text, links, and targeting parameters
Performance Analytics: Retrieve detailed metrics on campaign performance, including impressions, clicks, conversions, and spend
Agentic Ads
Google AdSense for AI agents. Add 3 lines of code to your MCP server. Earn 70% of every ad click.

npm version Tests License: MIT MCP Node

Live Demo · Quick Start · MCP Tools · Self-Host

Quick Start
Step 1 — Register and get your API key (30 seconds):

curl -X POST https://agentic-ads.fly.dev/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "My MCP Bot", "email": "me@example.com"}'
# Returns: { "api_key": "aa_dev_...", "mcp_url": "https://agentic-ads.fly.dev/mcp" }
Step 2 — Add to your MCP client config:

{
  "mcpServers": {
    "agentic-ads": {
      "url": "https://agentic-ads.fly.dev/mcp",
      "transport": "http"
    }
  }
}
Step 3 — Call search_ads in your agent and earn on every click:

// In your agent logic — when context is relevant
const ads = await mcp.callTool({
  name: 'search_ads',
  arguments: { query: 'best running shoes for marathon', max_results: 1 }
});
// Report events to get paid
await mcp.callTool({
  name: 'report_event',
  arguments: { ad_id: ads[0].ad_id, event_type: 'impression' }
});
// User clicks → report 'click' → you earn $0.35 on a $0.50 CPC ad
That's it. You're monetizing.

Why This Exists
You built an amazing MCP server. Users love it. But you're not making money.

agentic-ads is the missing monetization layer for the MCP ecosystem. It's like Google AdSense, but for AI agents instead of websites.

The Problem
16,000+ MCP servers exist. Almost none monetize.
Developers spend weeks building useful tools, earn $0.
Users ask agents for product recommendations → agents scrape the web → brands can't reach them.
The Solution
Privacy-respecting contextual ads served through MCP tools. Developers earn 70% revenue share (industry-leading). Advertisers reach AI agent users. Everyone wins.

Revenue Calculator
Example: Your MCP server gets 10,000 queries/month where ads make sense.

Scenario	Impressions/mo	CTR	Clicks/mo	CPC	Your Revenue
Conservative	10,000	2%	200	$0.50	$70/mo
Realistic	10,000	5%	500	$0.50	$175/mo
Strong	10,000	8%	800	$0.75	$420/mo
At 100k queries/month with 5% CTR: $1,750/month passive income.

That's $21,000/year for adding 3 lines of code to your MCP server.

Detailed Integration Guide
For MCP Developers (Earn Money)
Connect the live server and start calling tools — no approval process, no minimums.

// 1. When user asks about products/services
const ads = await mcp.callTool({
  name: 'search_ads',
  arguments: {
    query: 'best running shoes for marathon',
    max_results: 2
  }
});
// 2. Show relevant ad in your response (if it adds value)
// 3. Report impression
await mcp.callTool({
  name: 'report_event',
  arguments: { ad_id: 'ad_xyz', event_type: 'impression' }
});
// 4. If user clicks → report 'click' event
// You earn $0.35 on a $0.50 CPC click (70% revenue share)
For Advertisers (Reach AI Users)
# Create campaign + ad via MCP tools
mcp.callTool({
  name: 'create_campaign',
  arguments: {
    name: 'Q1 Running Shoes',
    total_budget: 500,
    pricing_model: 'cpc',
    bid_amount: 0.50
  }
});
mcp.callTool({
  name: 'create_ad',
  arguments: {
    campaign_id: 1,
    creative_text: 'Ultraboost 24 — 30% off! Free shipping.',
    link_url: 'https://adidas.com/ultraboost',
    keywords: ['running shoes', 'sneakers', 'marathon'],
    category: 'footwear'
  }
});
# Monitor analytics
mcp.callTool({ name: 'get_campaign_analytics', arguments: { campaign_id: 1 } });
How It Works
┌─────────────┐                    ┌──────────────────┐                    ┌──────────────┐
│  Advertiser  │────────────────────│  Agentic Ads MCP │────────────────────│  Your MCP     │
│  (Brand/API) │  create_campaign   │     Server       │  search_ads        │  Server       │
│              │  create_ad         │                  │  report_event      │               │
│              │  get_analytics     │  - Matching      │  get_guidelines    │  Shows ads    │
└─────────────┘                    │  - Billing       │                    │  to users     │
                                   │  - Auth & Rate   │                    └──────────────┘
                                   │  - Analytics     │
                                   └──────────────────┘
Example flow:

User asks your agent: "best running shoes for marathon"
Your agent calls search_ads → gets relevant ads ranked by bid × relevance
Agent shows ad naturally: "Ultraboost 24 — $126 (30% off) at Adidas.com (Sponsored)"
User clicks → you report click event → you earn $0.35 (70% of $0.50 CPC)
Privacy: No user tracking, no profiling, no cookies. Only contextual keyword matching.

Why MCP Developers Love This
1. Industry-Leading Revenue Share
70% to you, 30% to platform. Compare:

Platform	Developer Share
agentic-ads	70%
Google AdSense	68%
Amazon Associates	1-10%
Affiliate networks	5-30%
2. Zero Setup Friction
No contracts, no minimums, no approval delays
Register in seconds via POST /api/register → get your API key
Add 1 MCP server to your config → start earning in 5 minutes
3. Privacy-Respecting
No user tracking or profiling
No cookies, no browser fingerprinting
Only contextual keyword matching (like early Google AdWords)
Your users' privacy stays intact
4. You Control What Ads Show
Agent decides which ads (if any) to show
Full user context stays local (never sent to ad server)
Relevance threshold in your hands
Users can opt out ("no ads please")
5. Transparent Analytics
Real-time revenue tracking
See exactly what you earned, when, and why
No black-box algorithms or hidden fees
MCP Tools (8 Total)
For Developers (Consumer Side) — 3 Tools
Tool	Auth	Description
search_ads	Public	Search for ads by query/keywords/category/geo. Returns ranked results with relevance scores.
report_event	Developer key	Report impression/click/conversion events. Triggers revenue calculation.
get_ad_guidelines	Public	Get formatting guidelines for how to present ads naturally to users.
For Advertisers (Publisher Side) — 5 Tools
Tool	Auth	Description
create_campaign	Advertiser key	Create campaign with budget, objective, pricing model (CPC/CPM/CPA).
create_ad	Advertiser key	Create ad with creative text, keywords, targeting, link URL.
get_campaign_analytics	Advertiser key	Get performance metrics (impressions, clicks, conversions, spend, ROI).
update_campaign	Advertiser key	Update campaign (pause/resume, adjust budget, change targeting).
list_campaigns	Advertiser key	List all campaigns with summary stats, optional status filter.
Pricing Models
Choose how you want to pay (advertisers) or earn (developers):

Model	Advertiser Pays	Developer Earns (70%)	When Charged
CPC (Click)	$0.50 per click	$0.35	User clicks ad link
CPM (Impression)	$5.00 per 1000 views	$3.50	Ad shown to user
CPA (Conversion)	$10.00 per conversion	$7.00	User completes action (purchase, signup, etc.)
Budget controls: Set total budget + daily caps. Auto-pause when budget exhausted.

Getting Your API Key
To call report_event or advertiser tools, you need an API key. Register via the REST endpoint:

curl -X POST https://agentic-ads.fly.dev/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "My MCP Bot", "email": "me@example.com"}'
Response:

{
  "developer_id": "...",
  "api_key": "aa_dev_...",
  "mcp_url": "https://agentic-ads.fly.dev/mcp"
}
Use the api_key in the Authorization header: Authorization: Bearer aa_dev_...

Deployed on Fly.io with persistent storage: The live server at agentic-ads.fly.dev runs on Fly.io with a persistent volume — data is preserved across deploys and restarts. No cold-start spin-down issues. To self-host, deploy to Fly.io or use DATABASE_PATH=/data/ads.db pointing to a mounted volume.

Installation
Option 1: Connect to Live Server (Easiest)
Add to your MCP client config (Claude Desktop, Cursor, Windsurf, etc.):

{
  "mcpServers": {
    "agentic-ads": {
      "url": "https://agentic-ads.fly.dev/mcp",
      "transport": "http"
    }
  }
}
Health check: https://agentic-ads.fly.dev/health

Option 2: Local stdio (Development)
npm install -g agentic-ads
# Add to MCP config
{
  "mcpServers": {
    "agentic-ads": {
      "command": "npx",
      "args": ["agentic-ads", "--stdio"]
    }
  }
}
Option 3: Self-Host (Production)
git clone https://github.com/nicofains1/agentic-ads.git
cd agentic-ads
npm install && npm run build
# Start HTTP server
PORT=19877 npm run start:http
# Or stdio
npm run start:stdio
Flags:

node dist/server.js --http --port 19877 --db ./ads.db
Flag	Default	Description
--http	—	Start HTTP server (default is stdio)
--port N	3000	HTTP port
--db PATH	agentic-ads.db	SQLite database path
--api-key KEY	—	Pre-authenticate stdio sessions
Environment Variables:

PORT=19877                     # HTTP server port (alternative to --port)
DATABASE_PATH=/data/ads.db     # SQLite database path (default: agentic-ads.db)
AGENTIC_ADS_API_KEY=aa_dev_... # Developer API key for stdio mode
DB Persistence: Set DATABASE_PATH to a path on a persistent volume. On first run with an empty DB, demo campaigns are auto-seeded. See DEPLOY.md for full deployment guide (Fly.io recommended for free persistent storage).

Integration Examples
Claude Desktop
Add to ~/Library/Application Support/Claude/claude_desktop_config.json:

{
  "mcpServers": {
    "agentic-ads": {
      "command": "npx",
      "args": ["agentic-ads", "--stdio"]
    }
  }
}
Cursor / Windsurf
{
  "mcpServers": {
    "agentic-ads": {
      "url": "https://agentic-ads.fly.dev/mcp",
      "transport": "http"
    }
  }
}
Custom TypeScript Agent
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
const transport = new StdioClientTransport({
  command: 'npx',
  args: ['agentic-ads', '--stdio']
});
const client = new Client({ name: 'my-agent', version: '1.0.0' });
await client.connect(transport);
// Search for ads
const result = await client.callTool({
  name: 'search_ads',
  arguments: {
    query: 'best laptops for coding',
    keywords: ['laptop', 'programming'],
    category: 'electronics',
    max_results: 3
  }
});
console.log(result.content[0].text);
// Returns: { "ads": [ { "ad_id": "...", "creative_text": "...", "relevance_score": 0.87 } ] }
Architecture
┌─────────────────────────────────────────────────────────────┐
│  MCP Server (Node.js 22 + TypeScript)                       │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Tool Registry │  │ Auth & Rate  │  │ Matching Engine │  │
│  │ (8 tools)     │  │ Limiting     │  │ (relevance²     │  │
│  │               │  │ (SHA-256)    │  │ × bid × quality)│  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
│  ┌───────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ SQLite (WAL)  │  │ Revenue      │  │ Analytics       │  │
│  │ - Campaigns   │  │ Split Engine │  │ (real-time)     │  │
│  │ - Ads         │  │ (70/30)      │  │                 │  │
│  │ - Events      │  │              │  │                 │  │
│  └───────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
          │                                          │
          │                                          │
  Streamable HTTP (remote)                     stdio (local)
Key Features:

Privacy: No user tracking, contextual matching only
Relevance: score = relevance² × bidFactor × quality_score (relevance dominates)
Atomicity: Event insert + stats update + revenue split in single SQLite transaction
Rate Limiting: Per-key sliding window (60-120 req/min depending on tool)
Auth: SHA-256 hashed API keys, role-based access control
Testing: 270 tests across 13 files, all passing
Demo: Full Flow
# Clone repo
git clone https://github.com/nicofains1/agentic-ads.git
cd agentic-ads
# Install + build
npm install && npm run build
# Seed a local DB with demo data (generates real API keys)
tsx scripts/seed.ts --db test.db
# Note: seed.ts prints the generated dev/adv keys — use them below
# Run smoke test with real keys from seed output
tsx scripts/smoke-test.ts --db test.db --dev-key aa_dev_... --adv-key aa_adv_...
Output:

✅ Created advertiser: Adidas
✅ Created campaign: Q1 Running Shoes ($500 budget, CPC $0.50)
✅ Created ad: "Ultraboost 24 — 30% off!"
✅ Created developer: TestBot
✅ Searched ads for "running shoes" → 1 result (relevance 0.95)
✅ Reported impression → $0.00 charged (CPC model)
✅ Reported click → $0.50 charged, developer earned $0.35
✅ Analytics: 1 impression, 1 click, $0.50 spent, $0.35 developer revenue
How Developers Get Paid
When your MCP server reports a click event on a CPC ad, 70% of the bid goes to you — tracked atomically in our database. Once your balance reaches $10, email payouts@agentic-ads.com with your developer_id and your preferred payment method (PayPal or USDC on Polygon). We verify your balance and send payment within 5 business days. Automated Stripe payouts are on the roadmap for when the network scales.

FAQ
For Developers
Q: How do I get an API key? A: Register via the REST endpoint:

curl -X POST https://agentic-ads.fly.dev/api/register \
  -H "Content-Type: application/json" \
  -d '{"name": "Your Name", "email": "you@example.com"}'
# Returns: { "developer_id": "...", "api_key": "aa_dev_...", "mcp_url": "..." }
Use the returned api_key as Authorization: Bearer aa_dev_... in your MCP requests.

Q: Do I HAVE to show ads? A: No. You control which ads to show. Only show ads if they genuinely add value to the user. Agent autonomy is a feature.

Q: What if my users hate ads? A: Follow the guidelines from get_ad_guidelines: max 1-2 ads per response, always disclose "sponsored", respect opt-out ("no ads please").

Q: Is this production-ready? A: Yes. 270 passing tests, live at https://agentic-ads.fly.dev, MIT license.

Q: What MCP clients are supported? A: Any MCP client supporting stdio or Streamable HTTP. Tested with Claude Desktop, Cursor, Windsurf, custom agents.

For Advertisers
Q: How do I create ads? A: Use the create_campaign and create_ad MCP tools with an advertiser API key. See smoke-test.ts for examples.

Q: How is my budget protected? A: Budget tracking is atomic (SQLite transaction). When budget exhausted → campaign auto-pauses. No overspend.

Q: Can I track conversions? A: Yes, use CPA pricing model + report_event with event_type: 'conversion'. Add UTM params to your link URL for attribution.

Q: What targeting options exist? A: MVP has keywords (exact + partial match), categories, geo (country-level), and language. Semantic matching coming in Phase 2.

General
Q: Do you track users? A: No. We only receive anonymized keyword queries from agents. No user IDs, no cookies, no profiling. Privacy-first.

Q: How do you prevent fraud? A: MVP uses API key auth + rate limiting + trust-based reporting. Phase 2 adds anomaly detection heuristics (see issue #47).

Q: Is this open source? A: Yes, MIT license. Fork it, self-host it, contribute to it.

Roadmap
 MVP — 8 MCP tools, keyword matching, billing, auth, 270 tests
 Deployed — Live at https://agentic-ads.fly.dev
 Marketplace Listings — Submit to Anthropic Registry, Smithery, Glama, PulseMCP (Week 1)
 Dashboard REST API — Web UI for advertisers/developers (#40)
 Fraud Detection — Anomaly heuristics (#47)
 Semantic Matching — Embeddings-based relevance (Phase 2)
 A/B Testing — Ad creative variants (#41)
 Stripe Payouts — Automated developer payments (Phase 3)
Contributing
We follow the GitHub Issues workflow:

Check if an issue exists for your idea
If not: gh issue create --title "Your idea"
Get approval before starting work
Branch: feature/#N-description
Commit: feat(#N): description
PR to main
See CLAUDE.md for detailed guidelines.

Documentation
CLAUDE.md — Development guidelines
bulloak.md — Behavioral specification (source of truth for tests)
docs/PRD.md — Full Product Requirements Document
scripts/smoke-test.ts — Reference implementation
Support
GitHub Issues: https://github.com/nicofains1/agentic-ads/issues
Discussions: (coming soon)
Discord: (coming soon — join MCP Developers community)
License
MIT — see LICENSE for details.

Why This Matters
AI agents are eating the web. Users ask agents instead of searching Google. Agents answer instead of websites.

The old internet: Users browse websites → see ads → advertisers reach users.

The new internet: Users ask agents → agents scrape websites → advertisers can't reach users.

agentic-ads fixes this. It's the ad layer for the agent economy.

And you — the MCP developer — earn 70% of the revenue for being the intermediary.

The opportunity: 16,000+ MCP servers, almost none monetize. You can be first.

Built with Model Context Protocol (MCP) — the open standard for connecting AI agents to tools.

Live demo: https://agentic-ads.fly.dev

Get started: Add the MCP server to your config, earn your first dollar this week.



Install via None

MCP server config
MCP server config
{
  "mcpServers": {
    "nicofains1-agentic-ads": {
      "url": "https://agentic-ads.fly.dev/mcp"
    }
  }
}
Installation Guide
Use the live hosted server at https://agentic-ads.fly.dev for easiest integration with no setup required.

Install via Npm
Install globally or use npx to run the agentic-ads server locally with stdio transport.

Install via Manual

MCP server config
MCP server config
{
  "mcpServers": {
    "nicofains1-agentic-ads": {
      "args": [],
      "command": {}
    }
  }
}
Installation Guide
Clone the repository, install dependencies, build, and run the server locally. Use the HTTP server mode on the specified port.

git clone https://github.com/nicofains1/agentic-ads.git

cd agentic-ads

npm install

npm run build

npm run start:http (to start HTTP server) or npm run start:stdio (to start stdio server)

leads-mcp
A
PREMIUM
8
1.0.1
Atomic Intuition
Mar 3
TypeScript
MIT License
2
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The leads-mcp server is a lead generation platform that leverages multiple tools and APIs to identify and verify prospects. You can:

Find Emails: Locate professional email addresses using name and domain with Hunter.io
Verify Emails: Check email deliverability, MX records, SMTP status, and identify disposable or catch-all addresses
Search Domains: Find all emails associated with a company domain, filtering by department, seniority, and email type
Enrich Profiles: Obtain detailed professional profiles for individuals and comprehensive company intelligence using Apollo.io and Abstract API
Search Contacts and Companies: Find people by job title, company, location, and seniority; search for companies by industry, location, and size
Generate Lead Reports: Create detailed reports combining email, personal, and company data from all integrated APIs
leads-mcp
Lead generation MCP server for AI agents. Find emails, verify contacts, enrich profiles, and search prospects using Hunter.io, Apollo.io, and Abstract API.

BYOK (Bring Your Own Keys) — you supply your own API keys. No data leaves your machine except direct API calls to the services you configure.

Install
npx -y leads-mcp
Claude Code
claude mcp add leads-mcp -- npx -y leads-mcp
Claude Desktop
Add to ~/Library/Application Support/Claude/claude_desktop_config.json:

{
  "mcpServers": {
    "leads-mcp": {
      "command": "npx",
      "args": ["-y", "leads-mcp"],
      "env": {
        "HUNTER_API_KEY": "your-hunter-key",
        "APOLLO_API_KEY": "your-apollo-key",
        "ABSTRACT_API_KEY": "your-abstract-key"
      }
    }
  }
}
Cursor
Add to ~/.cursor/mcp.json with the same config format as above.

API Keys
All keys are optional — tools gracefully tell you which key is needed when you try to use them.

Key	Service	Get it at
HUNTER_API_KEY	Hunter.io — email finding & verification	https://hunter.io/api-keys
APOLLO_API_KEY	Apollo.io — person/company enrichment & search	https://app.apollo.io/#/settings/integrations/api
ABSTRACT_API_KEY	Abstract API — company enrichment	https://app.abstractapi.com/api/company-enrichment
Tools
find-email
Find someone's email address given their name and company domain.

Params: firstName, lastName, domain API: Hunter.io | Key: HUNTER_API_KEY

verify-email
Verify an email address for deliverability — MX records, SMTP, disposable, catch-all.

Params: email API: Hunter.io | Key: HUNTER_API_KEY

domain-search
Find all email addresses associated with a company domain.

Params: domain, type?, department?, seniority?, limit? API: Hunter.io | Key: HUNTER_API_KEY

enrich-person
Get a full professional profile — title, company, social links, phone.

Params: firstName?, lastName?, email?, domain?, linkedinUrl? API: Apollo.io | Key: APOLLO_API_KEY

enrich-company
Get comprehensive company intelligence — industry, size, funding, tech stack.

Params: domain API: Apollo.io + Abstract API | Key: APOLLO_API_KEY or ABSTRACT_API_KEY

search-people
Search for people by job title, company, location, and seniority.

Params: personTitles?, organizationName?, locations?, seniorities?, limit? API: Apollo.io | Key: APOLLO_API_KEY

search-companies
Search for companies by name, industry, location, and employee count.

Params: query?, industries?, locations?, employeeRanges?, limit? API: Apollo.io | Key: APOLLO_API_KEY

lead-report
Generate a comprehensive lead report combining all available APIs. Uses Promise.allSettled for partial results.

Params: firstName, lastName, domain API: All available | Key: Any configured key

Example Prompts
"Find the email for John Smith at stripe.com"
"Verify if hello@example.com is deliverable"
"Find all engineering contacts at openai.com"
"Get the full profile for the CEO of anthropic.com"
"Tell me everything about acme.com"
"Search for CTOs at startups in San Francisco"
"Find B2B SaaS companies with 50-200 employees"
"Generate a full lead report for Jane Doe at tesla.com"
Development
git clone <repo-url>
cd leads-mcp
pnpm install
pnpm dev        # Run with tsx (hot reload)
pnpm build      # Compile TypeScript
pnpm start      # Run compiled JS
License
MIT

What can you do with this MCP Server?
The VirtualSMS MCP Server is a platform for managing virtual phone numbers and SMS verification services using AI agents. You can:

Discover Services and Countries: List available SMS verification services and countries, and find the best options based on price and availability
Manage Virtual Numbers: Purchase, check, and cancel virtual phone numbers for SMS verification
Receive Verification Codes: Poll for incoming SMS codes or use automated tools to wait for verification messages
Monitor Account: Check your account balance and active orders to ensure smooth operations
VirtualSMS MCP Server — SMS Verification for AI Agents
npm version License: MIT GitHub Stars

VirtualSMS MCP Server is a Model Context Protocol server that gives AI agents access to a complete SMS verification API. Get a virtual phone number, receive SMS online, and extract verification codes — all without leaving your AI workflow.

Powered by VirtualSMS.io — a phone verification service running on own infrastructure across 200+ countries.

Quick Start
npx virtualsms-mcp
Or install globally:

npm install -g virtualsms-mcp
Get your API key at virtualsms.io.

What is VirtualSMS?
VirtualSMS.io is a temporary phone number API for SMS verification. Unlike resellers that aggregate other providers, VirtualSMS operates its own modem infrastructure — giving you direct access to real SIM cards across 200+ countries.

Use it to verify accounts on WhatsApp, Telegram, Google, Instagram, and 500+ other services — programmatically, via API or MCP.

Why VirtualSMS?
Own infrastructure — Not a reseller. Real SIM cards on our own hardware.
200+ countries — Find the cheapest number for any service worldwide.
Real-time delivery — WebSocket push means your agent gets the code in seconds, not minutes.
Competitive pricing — Starting from $0.02 per number.
Simple REST + WebSocket API — Clean, documented, agent-friendly.
11 MCP tools — Everything from price discovery to one-step code retrieval.
Migrating from SMS-Activate or DaisySMS?
If you're moving away from SMS-Activate or DaisySMS (closing March 2025), VirtualSMS is a straightforward alternative with comparable service coverage, competitive pricing, and a modern API built for programmatic use.

Just swap your API key and update the base URL — the concepts (buy number → wait for SMS → get code) are identical.

👉 Sign up at VirtualSMS.io and get started in minutes.

Configuration
Claude Desktop
Edit ~/Library/Application Support/Claude/claude_desktop_config.json (macOS) or %APPDATA%\Claude\claude_desktop_config.json (Windows):

{
  "mcpServers": {
    "virtualsms": {
      "command": "npx",
      "args": ["virtualsms-mcp"],
      "env": {
        "VIRTUALSMS_API_KEY": "vms_your_api_key_here"
      }
    }
  }
}
Cursor
Edit ~/.cursor/mcp.json:

{
  "mcpServers": {
    "virtualsms": {
      "command": "npx",
      "args": ["virtualsms-mcp"],
      "env": {
        "VIRTUALSMS_API_KEY": "vms_your_api_key_here"
      }
    }
  }
}
Environment Variables
Variable	Required	Default	Description
VIRTUALSMS_API_KEY	Yes (for auth tools)	—	Your VirtualSMS API key
VIRTUALSMS_BASE_URL	No	https://virtualsms.io	API base URL
Tools (11 total)
Discovery Tools (no auth required)
list_services
Get all available SMS verification services.

list_services()
→ [{code: "telegram", name: "Telegram"}, ...]
list_countries
Get all available countries for phone verification.

list_countries()
→ [{iso: "US", name: "United States"}, ...]
check_price
Check price and availability for a service + country combination.

check_price(service: "telegram", country: "US")
→ {price_usd: 0.15, available: true}
find_cheapest
Find cheapest countries for a service, sorted by price.

find_cheapest(service: "telegram", limit: 5)
→ {cheapest_options: [{country: "PK", price_usd: 0.05, ...}], total_available_countries: 23}
search_service
Find the right service code using natural language.

search_service(query: "uber")
→ {matches: [{code: "uber", name: "Uber", match_score: 1.0}]}
Account Tools (API key required)
get_balance
Check your account balance.

get_balance()
→ {balance_usd: 5.00}
active_orders
List your active orders. Essential for crash recovery.

active_orders()
active_orders(status: "pending")
→ {count: 2, orders: [{order_id: "abc123", phone_number: "+14155552671", status: "pending", ...}]}
Optional status filter: "pending", "sms_received", "cancelled", "completed"

Order Management Tools (API key required)
buy_number
Purchase a virtual phone number for a specific service and country.

buy_number(service: "telegram", country: "US")
→ {order_id: "abc123", phone_number: "+14155552671", expires_at: "...", status: "pending"}
check_sms
Check if an SMS verification code has arrived.

check_sms(order_id: "abc123")
→ {status: "sms_received", phone_number: "+14155552671", sms_code: "12345", sms_text: "Your code is 12345"}
cancel_order
Cancel an order and request a refund (only if no SMS received yet).

cancel_order(order_id: "abc123")
→ {success: true, refunded: true}
wait_for_code ⭐ Recommended
One-step tool: buys a number AND waits for the SMS code. Uses WebSocket for instant delivery with automatic polling fallback.

wait_for_code(service: "telegram", country: "US")
wait_for_code(service: "whatsapp", country: "PK", timeout_seconds: 180)
→ {
    success: true,
    phone_number: "+14155552671",
    sms_code: "12345",
    sms_text: "Your Telegram code: 12345",
    order_id: "abc123",
    delivery_method: "websocket",
    elapsed_seconds: 8
  }
On timeout, returns order_id for recovery:

→ {success: false, error: "timeout", order_id: "abc123", phone_number: "...", tip: "Use check_sms..."}
Number Rentals (Coming Soon)
Need to keep the same phone number for days or weeks? VirtualSMS supports number rentals for recurring verifications — perfect for long-running automations, dev testing, and accounts that require re-verification with the same number.

Rental tools (rent_number, extend_rental, list_rentals) are coming in v1.1. See the Roadmap.

How It Works
WebSocket vs Polling
wait_for_code uses a two-tier delivery system:

WebSocket (instant) — connects to wss://virtualsms.io/ws/orders?order_id=xxx immediately after purchase. When the SMS arrives, the server pushes it in real-time. Typical delivery: 2–15 seconds.
Polling fallback — if WebSocket fails to connect or disconnects, automatically falls back to polling GET /api/v1/order/{id} every 5 seconds.
The delivery_method field in the response tells you which was used.

Architecture
AI Agent (Claude / Cursor / any MCP client)
    │
    ▼ MCP stdio protocol
VirtualSMS MCP Server (this package)
    │
    ├──► REST API: https://virtualsms.io/api/v1/
    │        buy_number, check_sms, cancel_order, get_balance ...
    │
    └──► WebSocket: wss://virtualsms.io/ws/orders
             real-time SMS push delivery
Typical Workflows
Simple: Get a Telegram verification code
wait_for_code(service: "telegram", country: "US")
Budget: Find cheapest option first
find_cheapest(service: "telegram", limit: 3)
# → picks cheapest country
wait_for_code(service: "telegram", country: "PK")
Manual: Step by step
buy_number(service: "google", country: "GB")
# → order_id: "abc123", phone: "+447911123456"
# Use the number to trigger the SMS, then:
check_sms(order_id: "abc123")
# or cancel if no longer needed:
cancel_order(order_id: "abc123")
Crash Recovery
If your session is interrupted mid-verification:

Restart the MCP server
List active orders: active_orders(status: "pending")
Check for codes: check_sms(order_id: "abc123")
Cancel if not needed: cancel_order(order_id: "abc123")
wait_for_code always returns order_id even on timeout — use it to recover.

License
MIT — See LICENSE

Built with ❤️ by VirtualSMS.io — virtual phone numbers for SMS verification, built on own infrastructure.

Related MCP Servers
View More
UTF8-MCP
LanQin996
B
GOOD
5
UTF8-MCP is a local MCP server (stdio) that enforces UTF-8 text workflows, preventing garbled Chinese text in GBK/GB2312/GB18030 environments.

Today
Utility Tools
Local Service
2
coros-cli
simon-hv
A
PREMIUM
3
CLI and MCP server for Coros Training Hub — extract your activity data and health metrics from the command line. Requires authentication via `coros login` which stores a session token in ~/.config/coros-cli/config.json.

Today
Utility Tools
Local Service
2
rftools-mcp
antonpogrebenko-public
A
PREMIUM
3
MCP server for rftools.io — 197 RF & electronics calculators for AI agents via the MCP. No external data files required.

Yesterday
Utility Tools
Local Service
2
1
Prospector MCP
JosieBot26
A
PREMIUM
5
B2B email finder and verification MCP server. Find, verify, and enrich business email addresses without paid API subscriptions. Self-contained DNS/SMTP verification.

Yesterday
Utility Tools
Hybrid Service
2
1
receiptconverter-mcp
cheatbased
B
GOOD
2
MCP server for ReceiptConverter — parse any receipt or invoice into structured JSON with a single tool call. Requires a ReceiptConverter API key set via environment variable RECEIPTCONVERTER_API_KEY.

Yesterday
Utility Tools
Local Service
2
@supercorp/shell-mcp
supercorp
B
GOOD
1
An MCP server that gives AI agents shell access. Provides a run_command tool for executing shell commands and returning stdout, stderr, and exit code. Supports Streamable HTTP, SSE, and stdio transports.

Yesterday
Utility Tools
Hybrid Service
4
Local Service
This server can only run on the client’s local device, requiring installation and relying on local resources.
Installation Configuration
View Details
MCP server config
MCP server config
{
  "mcpServers": {
    "virtualsms-io-mcp-server": {
      "args": [
        "virtualsms-mcp"
      ],
      "command": "npx"
    }
  }
}

@automanus/mcp-server
A
PREMIUM
2
1.2.1
automanus-io
Mar 3
JavaScript
MIT License
1
1
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "automanus-io-mcp-server": {
      "args": [
        "-y",
        "@automanus/mcp-server"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the MCP server using npx without manual installation. Supports optional environment variables AUTOMANUS_EMAIL and AUTOMANUS_API_KEY for authentication.

$ npx -y @automanus/mcp-server

Senior Design Director MCP Server
A
PREMIUM
19
15
1.0.0
AbrahamOO
Mar 3
TypeScript
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
What can you do with this MCP Server?
The Senior Design Director MCP Server is an AI-powered design system generator that facilitates comprehensive project discovery, design system creation, and accessibility validation. You can:

Project Management: Complete, retrieve, list, delete, and update project briefs to define design goals and requirements
Design System Generation: Create complete design systems including typography, spacing, breakpoints, motion, and color palettes based on project insights
Component Specification: Generate detailed component libraries such as buttons, cards, forms, and hero sections aligned with the design system
Accessibility and Performance Analysis: Validate WCAG contrast ratios, check accessibility compliance for web and mobile, and analyze performance metrics for web and native apps
Resource Utilization: Access templates for project briefs, UI components, and design references to streamline the design process
Senior Design Director MCP Server — AI-Powered Design System Generator for Claude
npm version npm downloads License: MIT Node.js 18+

Senior Design Director MCP is a Model Context Protocol (MCP) server that gives Claude the capabilities of a senior creative director. It runs a structured 15-question project discovery process, generates complete design systems for web and premium mobile apps (iOS, Android, React Native, Flutter), validates WCAG accessibility, analyzes Core Web Vitals and native app performance, and delivers production-ready component templates — all grounded in a persistent project brief so every design decision stays consistent.

Works with Claude Desktop, Claude Code, and any MCP-compatible AI client. No installation required — runs via npx.

Why Senior Design Director MCP?
Most AI design tools give you generic answers. This server works differently: it starts by deeply understanding your project — your audience, brand positioning, competitive landscape, and narrative arc — and then derives every color, typographic, and content decision from that context.

The result is design direction that's specific to your project, not recycled from a template.

Brief-driven — every recommendation traces back to who the site is for and what it must accomplish
Systematic — color palettes, type scales, spacing, motion, and components are all connected to one design system
Standards-compliant — WCAG 2.1 AA accessibility and Core Web Vitals are built into the workflow, not added at the end
Persistent — project briefs are saved to disk and survive server restarts, so context carries across every conversation
Quick Start
No installation required. Add the server to your MCP client config and it starts automatically via npx.

Claude Desktop
macOS: ~/Library/Application Support/Claude/claude_desktop_config.json Windows: %APPDATA%\Claude\claude_desktop_config.json

{
  "mcpServers": {
    "senior-design-director": {
      "command": "npx",
      "args": ["-y", "senior-design-director-mcp"]
    }
  }
}
Restart Claude Desktop after saving.

Claude Code
Add to ~/.claude/settings.json to make it available globally across all projects:

{
  "mcpServers": {
    "senior-design-director": {
      "command": "npx",
      "args": ["-y", "senior-design-director-mcp"]
    }
  }
}
Other MCP Clients
Any MCP-compatible client can run this server with:

npx -y senior-design-director-mcp
What It Does
Rather than answering generic design questions, this MCP server operates like a senior creative director onboarding a new project. It:

Runs a 15-question discovery session to capture your audience, brand positioning, narrative arc, CTA strategy, and visual direction
Saves the project brief to disk so context persists across every conversation and tool call
Derives all design decisions from that brief — color palettes, type systems, content structure, and copy voice all connect back to who the site is for and what it needs to accomplish
Features
Project Discovery & Brief Management
15-question structured brief covering audience psychology, brand positioning, narrative arc, CTAs, visual personality, content inventory, technical requirements, and competitive landscape
Persistent file-based storage (~/.senior-design-director-mcp/projects/) — briefs survive server restarts and new conversations
Full CRUD operations: create, retrieve, update, and delete project briefs
Standalone get-discovery-questions tool for preparing answers before running discovery
What Kinds of Designs Can It Direct?
Project Type	Platform	Key Outputs
SaaS / startup websites	Web	Design system, responsive breakpoints, copy guidelines, GSAP animations
Agency / portfolio sites	Web	Three-act narrative structure, type-forward layouts, premium motion system
E-commerce / product sites	Web	Conversion-focused CTA strategy, trust-building content architecture
iOS apps	Native iOS	SF Pro typography with Dynamic Type, pt spacing, UITabBar/UINavigationBar specs, spring motion tokens, safe area system, VoiceOver compliance
Android apps	Native Android	Material Design 3 components, sp/dp system, Google Sans/Roboto scale, Material motion system, TalkBack compliance
React Native apps	Cross-platform	Platform-branched fonts, logical px spacing, shared motion tokens, safe area inset values
Flutter apps	Cross-platform	Platform-aware type scale, Material/Cupertino hybrid patterns, shared spacing system
Web + Mobile	Both	Full web breakpoints AND native mobile tokens — single design brief drives both surfaces
AI-Powered Color & Design System Generation
Color palette generation derived from emotional tone, industry category, and audience psychology — returns a primary palette plus two alternatives, each with hex values, RGB, usage rationale, and application guidelines
WCAG contrast ratio validation with AA/AAA pass/fail for normal and large text
Platform-aware design system: web (rem + breakpoints), iOS (pt + Dynamic Type + safe areas), Android (dp/sp + Material type scale), cross-platform (logical px + shared tokens)
Mobile tokens: UISpringTimingParameters / Material motion curves, touch target minimums (44pt iOS / 48dp Android), safe area insets (Dynamic Island-aware), screen size reference for iPhone SE through iPad Pro 12.9" and Android compact through large tablet
Component library specifications: web (buttons, cards, nav, forms, hero) + mobile native (UITabBar, UINavigationBar, Bottom Sheet, List Row, TextField, Toast/Snackbar, FAB, AsyncImage) with platform-specific states, haptic feedback, and edge cases
Content Architecture & Copywriting
Three-act narrative structure mapping scroll position to emotional journey (Problem → Transformation → Outcome)
Page structure recommendations tied to business objectives and conversion goals
Brand voice and copywriting guidelines — headline formulas, vocabulary, CTA copy patterns, and before/after examples — all derived from brand positioning
WCAG Accessibility & Mobile Accessibility Compliance
WCAG 2.2 AA compliance checking across color combinations, semantic HTML structure, form labels, heading hierarchy, ARIA attributes, and keyboard navigation
Mobile accessibility: touch target validation (44pt iOS HIG / 48dp Material), Dynamic Type support check, VoiceOver/TalkBack label completeness, Reduce Motion support, OLED pure-black contrast
Scored report (0–100) with severity-ranked issues (critical / serious / moderate / minor) and specific fix recommendations
Complete checklist covering WCAG 2.2 + Apple Accessibility + Android Accessibility standards, organized by category
Core Web Vitals & Mobile App Performance Analysis
Core Web Vitals analysis: LCP, FID, CLS with scored recommendations and specific optimization actions
Additional web metrics: FCP, TTI, TBT with good/needs improvement/poor thresholds
Mobile performance: app launch time (cold/warm), frame rate analysis, memory usage, battery impact, and asset density coverage — each with platform-specific recommendations citing the right profiling tool (Xcode Instruments, Android Studio Profiler, MetricKit, Android Vitals)
Performance budget guidelines for JS, CSS, images, fonts, and third-party scripts
Design Reference Library
Animation easing functions with timing guidance for micro (150ms), short (300ms), medium (500ms), and long (800ms+) durations
Responsive breakpoint system (320px–1600px) with mobile-first implementation patterns
Fluid typography scale with clamp() formulas and line-height rules
8px spacing system with usage guidelines for components, sections, and page layout
Color psychology reference by emotion and industry category
Webflow Interactions (IX2) — trigger types, action types, scroll reveal, stagger, and scrub patterns
GSAP complete reference — core API, timelines, ScrollTrigger, stagger, matchMedia for reduced motion, and React useGSAP integration
iOS HIG reference — navigation patterns, Dynamic Type scale, SF Symbols, safe areas, touch targets, spring motion, and common edge cases
Material Design 3 reference — dynamic color system, Material type scale (sp), component specs (FAB, Bottom Sheet, Navigation Bar), motion easing curves, and edge cases
Tools Reference
Project Discovery Tools
complete-project-discovery
Runs the full 15-question discovery process and saves a structured project brief. This is the entry point — all downstream tools read from this brief.

Required parameters:

Parameter	Type	Description
projectName	string	Project or company name
projectDescription	string	What the project does (2–3 sentences)
industryCategory	string	Industry category (e.g. SaaS, Wellness, E-commerce)
audienceRole	string	Primary audience job title or role
primaryCTA	string	The single most important action visitors should take
emotionalTone	string[]	3–5 tones from the list below
Optional parameters (fill in as many as possible for best results):

Parameter	Type	Description
painPoints	string	Problems the audience is trying to solve
objections	string	Skepticism or objections they might have
fear	string	Fears or concerns they have
uniquePosition	string	What makes you different from competitors
philosophy	string	What you believe strongly about
desiredPerception	string	How you want to be perceived
beforeState	string	Customer state before working with you
transformationMoment	string	The "aha" turning point
afterState	string	Customer state after working with you
successMetric	string	How you measure success
primaryCTAOutcome	string	Desired outcome of the primary CTA
secondaryCTAs	string[]	2–3 secondary actions
visualPersonality	string	How the brand would dress/present
aestheticReferences	string[]	Websites or brands that inspire you visually
photographyStyle	string	Photography/imagery style
mood	string	Photography mood
treatment	string	Photography treatment (color grading, etc.)
keyMessages	string[]	3–5 key messages in priority order
proofPoints	object	Proof by category: { experience, clients, results, awards }
contentInventory	string[]	Content/assets already available
contentGaps	string[]	Content that needs to be created
pageStructure	string[]	Pages/sections in priority order
platform	string	"web" · "mobile-ios" · "mobile-android" · "mobile-cross-platform" · "both" (defaults to "web")
techStackPreference	string	Preferred technology stack
integrations	string[]	Required integrations (CRM, payments, etc.)
cmsStrategy	string	CMS approach
timeline	string	Target launch timeline
seoPriority	string	SEO priority level
competitors	string[]	Top 3–5 competitors
competitiveAdvantages	string[]	How to differentiate visually and strategically
visualInspiration	string[]	Brands outside your industry that inspire you
successMetrics	string[]	How to measure website success
conversionGoal	string	Primary conversion goal
businessObjective	string	Overarching business objective
existingColors	string	Existing brand colors or "None"
colorPreferences	string	Color direction or "Open to recommendation"
colorConstraints	string	Colors to avoid or "None"
Emotional tone options: Energetic & Inspiring · Calm & Trustworthy · Sophisticated & Premium · Playful & Approachable · Bold & Rebellious · Warm & Human · Professional & Authoritative · Innovative & Futuristic · Grounded & Authentic

get-project-brief
Retrieve a saved project brief.

{ "projectName": "TechFlow" }
list-projects
List all saved project briefs.

delete-project
Delete a saved project brief.

{ "projectName": "TechFlow" }
update-project-brief
Update specific fields without replacing the entire brief.

{
  "projectName": "TechFlow",
  "updates": {
    "CTA_STRATEGY": {
      "PRIMARY_CTA": "Book a demo",
      "PRIMARY_CTA_OUTCOME": "Schedule 30-minute demo call",
      "SECONDARY_CTAS": ["Start free trial", "Read case studies"]
    }
  }
}
get-discovery-questions
Returns all 15 discovery questions formatted for manual use or pre-brief preparation.

Color & Design System Tools
generate-color-palette
Generates a color palette derived from the project brief — emotional tone, industry category, brand positioning, and color constraints. Returns a primary palette plus two alternatives, each with hex values, RGB, usage guidance, psychological rationale, and application guidelines.

{ "projectName": "TechFlow" }
validate-color-contrast
Checks WCAG contrast ratio between any two hex colors. Returns the ratio, AA pass/fail for normal and large text, AAA pass/fail, and a recommendation.

{
  "foreground": "#1a1a2e",
  "background": "#ffffff"
}
Returns:

{
  "ratio": 18.6,
  "passesAA": true,
  "passesAAA": true,
  "largeTextAA": true,
  "recommendation": "Excellent contrast. Meets WCAG AAA for all text sizes."
}
create-design-system
Generates a complete, platform-aware design system from the project brief:

Typography — platform-appropriate fonts (SF Pro for iOS, Google Sans/Roboto for Android, system fonts for cross-platform, custom fonts for web); full type scale in the correct unit (pt / sp / px / rem) with line heights and use cases; Dynamic Type support for iOS
Spacing — 8pt (iOS) / 8dp (Android) / 8px (cross-platform/web) base unit with full scale
Breakpoints — (web/both only) mobile small through ultra-wide with column counts
Mobile tokens — (mobile/both only) safe area insets (Dynamic Island-aware), touch target minimums, screen size reference for all iPhone models and Android phones/tablets, native spring/motion parameters
Motion — iOS spring physics (UISpringTimingParameters), Material motion tokens, or CSS easing curves — derived from emotional tone
Colors — full palette derived from the project brief
{ "projectName": "TechFlow" }
generate-component-library
Generates specifications for UI components appropriate for the project's platform. Web: primary/secondary/ghost buttons with states and sizing, card variants, navigation with mobile menu, contact forms, hero sections, and feature grids. Mobile: UIButton/Material Button, UITabBar/Navigation Bar, Bottom Sheet (UISheetPresentationController/BottomSheetDialogFragment), List Row (UITableView/LazyColumn), TextField with keyboard type guidance, Toast/Snackbar, FAB with scroll-hide behavior, and AsyncImage with shimmer loading — each with platform-specific states, haptic feedback guidance, safe area notes, and edge cases.

{ "projectName": "TechFlow" }
Content Architecture Tools
generate-content-architecture
Maps the project brief's narrative arc to a three-act scroll structure:

Act I — Problem space and emotional resonance (above the fold through ~33% scroll)
Act II — Solution, proof, and trust building (33–66% scroll)
Act III — Transformation, social proof, and conversion (66–100% scroll)
Returns section assignments, visual strategy, and emotional tone for each act, plus a prioritized page structure with sections and primary CTAs.

{ "projectName": "TechFlow" }
generate-copy-guidelines
Returns brand-specific copywriting guidelines derived from the project brief: headline formulas aligned with emotional tone, body copy voice and vocabulary, CTA copy patterns, things to always say and never say, and before/after copy examples.

{ "projectName": "TechFlow" }
Accessibility Tools
check-accessibility
Analyzes accessibility compliance for web and mobile. Pass platform to enable mobile-specific checks.

Web example:

{
  "colors": [
    { "foreground": "#4F46E5", "background": "#ffffff" },
    { "foreground": "#ffffff", "background": "#4F46E5" }
  ],
  "semanticHTML": "<main><nav><a href='/'>Home</a></nav><section><h1>Welcome</h1></section></main>",
  "formLabels": true,
  "headingHierarchy": ["h1", "h2", "h3", "h2", "h3"],
  "ariaLabels": true,
  "keyboardNav": true
}
Mobile example:

{
  "platform": "mobile-ios",
  "colors": [{ "foreground": "#1C1C1E", "background": "#FFFFFF" }],
  "touchTargetSize": 36,
  "minimumTapSpacing": 4,
  "dynamicTypeSupport": false,
  "screenReaderLabels": true,
  "reduceMotionSupport": false,
  "oledBackground": "#000000"
}
Returns: Score out of 100, severity-ranked issues with platform-specific fix recommendations, and WCAG 2.2 compliance summary.

get-accessibility-checklist
Returns a comprehensive checklist covering WCAG 2.2 AA + Apple Accessibility (VoiceOver, Dynamic Type, Reduce Motion, Large Content Viewer) + Android Accessibility (TalkBack, font scaling, animation scale) — organized by category with must / should / recommended priority levels.

Performance Tools
analyze-performance
Analyzes Core Web Vitals and supporting metrics. Returns an overall score out of 100 plus prioritized optimization recommendations for each metric that needs attention.

{
  "lcp": 2800,
  "fid": 120,
  "cls": 0.15,
  "bundleSize": 180,
  "imageOptimization": "partial",
  "lazyLoading": false,
  "caching": "none",
  "fontLoading": "blocking"
}
Parameter	Type	Values
lcp	number	Largest Contentful Paint in ms
fid	number	First Input Delay in ms
cls	number	Cumulative Layout Shift score
bundleSize	number	Total JS bundle size in KB
imageOptimization	string	"none" · "partial" · "full"
lazyLoading	boolean	Whether lazy loading is implemented
caching	string	"none" · "partial" · "full"
fontLoading	string	"blocking" · "swap" · "optional"
get-core-web-vitals-targets
Returns good/needs improvement/poor thresholds for LCP, FID, CLS, FCP, TTI, and TBT with descriptions and user impact explanations.

get-performance-budget
Returns recommended budgets for JS, CSS, images, fonts, third-party scripts, total page weight, HTTP requests, and LCP element — each with reasoning.

analyze-mobile-performance
Analyzes mobile app performance metrics against platform benchmarks. Pass measured values and receive severity-ranked issues with fix recommendations.

{
  "platform": "mobile-ios",
  "coldLaunchMs": 820,
  "warmLaunchMs": 550,
  "frameRate": 48,
  "memoryUsageMb": 180,
  "batteryImpact": "high",
  "assetDensities": ["@1x", "@2x"]
}
Parameter	Type	Description
platform	string	Required. "mobile-ios" · "mobile-android" · "mobile-cross-platform"
coldLaunchMs	number	Cold launch time in ms (iOS target ≤400ms, Android ≤500ms)
warmLaunchMs	number	Warm launch time in ms (iOS target ≤200ms, Android ≤300ms)
frameRate	number	Measured frame rate in fps (target 60fps; ProMotion 120fps)
memoryUsageMb	number	Active memory usage in MB
batteryImpact	string	"low" · "medium" · "high"
assetDensities	string[]	Provided asset densities, e.g. ["@1x","@2x","@3x"]
Returns: Severity-ranked issues for each metric with platform-specific recommendations.

get-mobile-performance-targets
Returns the full benchmark table for iOS and Android: cold/warm launch targets, frame rate targets, memory budgets, and asset density requirements — each with good/needs improvement/poor thresholds.

Resources Reference
Resources are accessed via the MCP resource system and return ready-to-use content.

Component Templates
URI	Description
template://project-brief	Markdown template for manual brief completion
template://component/button	Accessible button HTML/CSS with variants and states
template://component/card	Card component with hover animation
template://component/hero	Two-column hero section with responsive layout
template://component/navigation	Sticky nav with mobile menu and scroll behavior
template://component/form	Accessible contact form with validation styles
All component templates use CSS custom properties (--color-primary, --color-secondary, etc.) that map directly to the generated design system.

Design Reference Resources
URI	Description
reference://easing	CSS easing functions with timing ranges (micro 150ms → long 1800ms) and GPU performance rules
reference://breakpoints	Standard breakpoints 320px–1600px with mobile-first implementation patterns
reference://typography-scale	Major Third scale in CSS custom properties, fluid clamp() formulas, line-height and letter-spacing rules
reference://spacing	8px base unit scale from 4px to 128px with component, section, and layout usage guidelines
reference://color-psychology	Color psychology by hue family and industry, saturation rules, WCAG contrast requirements
reference://webflow-animation	Webflow IX2 trigger types, action types, scroll reveal patterns, stagger patterns, scrub patterns, performance rules, and timing by element type
reference://gsap-motion	GSAP core API (to/from/fromTo/set), easing reference, timeline sequencing, ScrollTrigger (reveal, scrub, pin), stagger, matchMedia for reduced motion, React useGSAP integration, and design token mapping
reference://ios-hig	Apple Human Interface Guidelines: NavigationStack/TabBar/Sheet patterns, Dynamic Type scale (11pt–34pt), safe area table (Dynamic Island-aware), SF Symbols usage, spring motion parameters, semantic color tokens, and 8 edge cases
reference://material-design	Material Design 3: dynamic color roles, type scale (11sp–57sp), component specs (buttons, Top App Bar, Navigation Bar, Bottom Sheet, Cards), 4dp spacing grid, motion easing curves + duration scale, and 10 edge cases
End-to-End Workflow
Phase 1 — Discovery
Run complete-project-discovery with all answers. Include "platform": "mobile-ios" (or "mobile-android", "mobile-cross-platform", "both") to unlock platform-specific outputs in every subsequent tool.

Use get-discovery-questions first if you want to prepare answers in advance. After discovery, use get-project-brief to review the saved brief and update-project-brief to refine any field without re-running the full discovery.

Phase 2 — Design System
generate-color-palette       → Review primary palette and two alternatives
validate-color-contrast      → Check every text/background combination
create-design-system         → Full design tokens (pt/dp for mobile, rem for web)
generate-component-library   → Platform-native component specs for implementation
For mobile, create-design-system emits pt (iOS) or dp (Android) tokens, Dynamic Type / sp scales, and UISpringTimingParameters / Material motion tokens. generate-component-library returns SwiftUI/UIKit or Compose/Material 3 component specs.

Phase 3 — Content Strategy
generate-content-architecture  → Three-act scroll narrative and page structure
generate-copy-guidelines       → Voice, vocabulary, headline formulas, CTA copy
Phase 4 — Quality Assurance
Web:

check-accessibility          → WCAG 2.2 AA compliance report
get-accessibility-checklist  → Complete checklist for implementation review
analyze-performance          → Core Web Vitals analysis
get-core-web-vitals-targets  → Good/needs improvement/poor thresholds
get-performance-budget       → Resource budgets for JS, CSS, images, fonts
Mobile:

check-accessibility          → WCAG 2.2 + VoiceOver/TalkBack + touch targets
get-accessibility-checklist  → 17-item mobile checklist (Dynamic Type, Reduce Motion…)
analyze-mobile-performance   → Cold/warm launch, frame rate, memory, battery analysis
get-mobile-performance-targets → iOS and Android benchmark tables
Phase 5 — Implementation
Web:

template://component/*        → Ready-to-use HTML/CSS components
reference://easing            → Animation easing functions and timing
reference://gsap-motion       → Full GSAP reference for scroll animations
reference://webflow-animation → Webflow IX2 patterns and performance rules
Mobile:

reference://ios-hig           → Apple HIG: navigation, Dynamic Type, safe areas, SF Symbols
reference://material-design   → Material Design 3: dynamic color, type scale, motion
Project Storage
Project briefs are saved to disk at:

~/.senior-design-director-mcp/projects/{project-name}.json
Briefs are loaded into memory on server startup and written to disk on every save:

Briefs persist across server restarts and new conversations
Multiple projects can be stored simultaneously
Briefs can be inspected or backed up directly from the filesystem
Frequently Asked Questions
Does this work with Claude Desktop and Claude Code? Yes. Add the npx config snippet to either claude_desktop_config.json (Claude Desktop) or ~/.claude/settings.json (Claude Code) and the server is available immediately.

Do I need to install anything? No. npx fetches and runs the package from npm automatically. Node.js 18 or later is the only prerequisite.

Does it work with MCP clients other than Claude? Yes. The server uses the standard Model Context Protocol and works with any MCP-compatible client.

Where are project briefs stored? Briefs are saved as JSON files at ~/.senior-design-director-mcp/projects/. They persist across server restarts and can be backed up or inspected directly.

Can I update a brief without re-running the full discovery? Yes. Use update-project-brief to change specific fields. The server merges the updates into the existing brief without requiring a full re-run.

Does it generate actual code or just specs? Both. Design system tools return structured specifications that Claude uses to write implementation code. The template://component/* resources provide ready-to-use HTML/CSS components you can copy directly.

What design stack does it target? The server is stack-agnostic. It outputs design tokens as CSS custom properties, component HTML/CSS, and structured JSON specs that Claude can adapt to React, Vue, Svelte, Webflow, or any other stack.

How is this different from asking Claude design questions directly? Without this server, Claude has no memory of your project between conversations and gives generic answers. This server saves a detailed project brief to disk so every response is grounded in your specific audience, positioning, and goals — and context carries across sessions automatically.

Architecture
src/
├── index.ts                   # MCP server, tool/resource registration, request handlers
├── types/
│   └── index.ts               # ProjectBrief, ColorPalette, DesignSystem, AccessibilityReport, etc.
├── tools/
│   ├── projectDiscovery.ts    # Discovery questions, brief builder, storage CRUD
│   ├── colorPalette.ts        # Palette generation, contrast validation
│   ├── designSystem.ts        # Typography, spacing, breakpoints, motion, component specs
│   ├── contentArchitecture.ts # Three-act structure, page architecture, copy guidelines
│   ├── accessibility.ts       # WCAG compliance checker, checklist
│   └── performance.ts         # Core Web Vitals analysis, budget guidelines
├── resources/
│   └── templates.ts           # Component templates and design references
└── utils/
    └── storage.ts             # File-based persistent storage for project briefs
All tools are pure functions that accept plain arguments and return structured JSON. The server registers each function as an MCP tool with a full JSON Schema for parameter validation.

Development
# Install dependencies
npm install
# Build TypeScript
npm run build
# Watch mode (rebuilds on file changes)
npm run watch
# Run directly without building
npm run dev
To test the server manually, pipe an MCP JSON-RPC message to it:

echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVer




{
  "mcpServers": {
    "abrahamoo-senior-design-director-mcp": {
      "args": [
        "-y",
        "senior-design-director-mcp"
      ],
      "command": "npx"
    }
  }
}

Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "abrahamoo-senior-design-director-mcp": {
      "args": [
        "-y",
        "senior-design-director-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Runs the server directly via npx without installation. Recommended for quick start and ease of use.

$ npx -y senior-design-director-mcp


Google Researcher MCP Server
A
PREMIUM
8
8
6
6.0.0
zoharbabin
Yesterday
TypeScript
MIT License
17
13
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "zoharbabin-google-researcher-mcp": {
      "args": [
        "-y",
        "google-researcher-mcp"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Recommended deployment using npx to run the server with required Google API credentials set as environment variables.

$ npx -y google-researcher-mcp
Environment Variables
Name	Type	Required	Description
GOOGLE_CUSTOM_SEARCH_ID	
Your Google Custom Search Engine ID
GOOGLE_CUSTOM_SEARCH_API_KEY	
Your Google Custom Search API key
System Dependencies
nodejs
>=20.0.0
ask-user-questions
B
GOOD
1
1.0.0
ZiuChen
Mar 3
Vue
3
Overview
Installation Method
Skill Features
Related Recommendations
Score
Agents Using This Skill
Version History

Need Help?
View Source Code
Report Issue
Install via Npm

MCP server config
MCP server config
{
  "mcpServers": {
    "ziuchen-ask-user-questions": {
      "args": [
        "ask-user-questions"
      ],
      "command": "npx"
    }
  }
}
Installation Guide
Run the MCP server directly using npx without manual installation.

$ npx ask-user-questions
System Dependencies
nodejs
>=20
Install via Manual


What can you do with this MCP Server?
The seo-toolkit-mcp Server is an SEO analysis platform that helps optimize website content and structure. You can:

Meta Tag Analysis: Fetch and evaluate page titles, meta descriptions, Open Graph, Twitter Card tags, canonical URLs, and identify issues for on-page SEO audits
Robots.txt Inspection: Retrieve and interpret robots.txt files, including crawl rules, allowed/disallowed paths, sitemaps, and crawl delays
Sitemap Validation: Validate sitemap.xml files for URL count, format, sample URLs, last modified dates, and detect issues like duplicates or missing data
Keyword Density Analysis: Measure keyword frequency and density within content, identify top words and phrases, and optimize for target keywords
Readability Scoring: Assess text readability using Flesch-Kincaid metrics, providing scores, grade levels, and actionable recommendations to match audience needs
Heading Structure Verification: Analyze heading hierarchy (H1-H6), identify structural issues, and ensure proper content organization for SEO and accessibility
seo-toolkit-mcp
SEO toolkit as an MCP server. Analyze meta tags, robots.txt, sitemaps, keyword density, readability, and heading structure from any AI assistant that supports MCP.

Install
Add to your MCP client config (Claude, Cursor, etc.):

{
  "mcpServers": {
    "seo-toolkit-mcp": {
      "command": "npx",
      "args": ["-y", "seo-toolkit-mcp"]
    }
  }
}
Tools
Tool	Description
meta_tags	Analyze a page's SEO meta tags (title, description, OG, Twitter, canonical)
robots_txt	Parse robots.txt rules, sitemaps, and crawl directives
sitemap_check	Validate sitemap.xml format, URL count, and common issues
keyword_density	Keyword frequency analysis with single words, bigrams, and trigrams
readability	Flesch-Kincaid readability scoring with actionable tips
heading_structure	Heading hierarchy (H1-H6) analysis with structure validation
Example Prompts
"Analyze the meta tags on https://example.com"
"Check the robots.txt for example.com"
"Validate the sitemap at https://example.com/sitemap.xml"
"What's the keyword density of this text for 'machine learning'?"
"Score this blog post for readability"
"Check the heading structure of https://example.com/blog/post"




COMPETITORS : Notion
Best all-in-one workspace for notes, docs, and databases
If productivity apps were Swiss Army knives, Notion would be the whole toolbox.

I use Notion for everything—blog drafts, workout tracking, project planning, meeting notes, even my D&D campaign notes (yes, really). At this point, half my life is stored in Notion databases.

The flexibility is both its biggest strength and its learning curve. Unlike most apps that force you into their structure, Notion lets you build whatever you need. Want a Kanban board? Done. A content calendar? Easy. A database that tracks books you’ve read with custom ratings and tags? Go wild.

Fair warning: Notion takes time to set up. But once you get it running the way you want, it becomes indispensable. There are also tons of templates out there to get you started faster.

My favorite features:

Insane flexibility—build exactly what you need
Multiple views (calendar, kanban, table, gallery) for any database
Beautiful formatting options for documents
Ability to publish pages publicly and share them as websites
Cost: Free, with paid plans starting at $10/month

⚡ #1 RATED – YOUR DAILY CO-PILOT
Stop managing apps. Start getting things done.
✅ Natural language input – just type or speak
📲 WhatsApp reminders – where you already chat
🔗 Syncs with Google/Outlook – your calendar stays
🎯 Smart conflict detection – no more double-booking

Google Play
App Store
⭐ 4.7 stars • Free tier • No credit card
⚙️✨
your tools, unified

Google Calendar
Best calendar for everyone (seriously, just use it)
Sometimes the best tool is the one everyone already has.

Google Calendar isn’t sexy. It doesn’t have AI assistants or WhatsApp integration (though Fhynix fixes that wink). But it’s reliable, free, works everywhere, and chances are you’re already using it.

If you need a straightforward calendar that syncs across devices and integrates with basically everything, Google Calendar is the safe bet.

My favorite features:

Free and works on every platform
Integrates with virtually every other productivity tool
Simple, clean interface that doesn’t get in your way
Easy event sharing with anyone (even non-Gmail users)
Cost: Free

Sunsama
Best app for mindful, realistic planning
Sunsama is gorgeous. Like, really gorgeous. But it’s not just pretty—it’s designed to help you plan realistically instead of overloading your day.

The daily planning ritual is brilliant. You review your tasks, assign time estimates, and Sunsama gently tells you when you’ve planned too much (which, for me, is always).

It also has a shutdown ritual at the end of the day to help you reflect and wrap up. If you tend to overcommit or feel overwhelmed by endless to-do lists, Sunsama might be exactly what you need.

The catch? It’s $20/month. But if you value intentional planning and beautiful design, it’s worth considering.

My favorite features:

Guided daily and weekly planning rituals
Time estimates that keep you realistic
Beautiful, calming interface
Lightweight analytics to track where your time goes
Cost: $20/month ($16/month paid annually)

Toggl Track
Best time tracking app for freelancers and the chronically curious
Ever finish a workday and think, “What did I even do today?”

Toggl Track answers that question. It’s dead simple to use—just hit start when you begin a task, stop when you’re done. Over time, you’ll see exactly where your hours go.

I love it because pressing that start button is like flipping a focus switch in my brain. Knowing my time is being tracked keeps me honest and less likely to drift into “just one more YouTube video” territory.

The integrations are incredible too. With the browser extension, you can start timers directly from tools like Notion, Todoist, Asana, and more—no need to open Toggl separately.

My favorite features:

Simple, intuitive time tracking
Powerful analytics and reports
Works with basically every productivity tool via integrations
Great for freelancers who need to track billable hours
Cost: Free, with paid plans starting at $10/month

⚡ #1 RATED – YOUR DAILY CO-PILOT
Stop managing apps. Start getting things done.
✅ Natural language input – just type or speak
📲 WhatsApp reminders – where you already chat
🔗 Syncs with Google/Outlook – your calendar stays
🎯 Smart conflict detection – no more double-booking

Google Play
App Store
⭐ 4.7 stars • Free tier • No credit card
⚙️✨
your tools, unified

Brain.fm
Best focus music for deep work
When I need to lock in and get serious work done, I put on Brain.fm.

It’s not your typical music app. Brain.fm uses “science-backed audio” designed to help your brain focus, relax, or sleep. Whether it’s placebo effect or not, I don’t care—it works for me.

I particularly love the variety of soundscapes. You can filter by style (electronic, acoustic, nature sounds, etc.) and mood. My go-to is thunderstorms for writing and lo-fi electronic for design work.

If you find lyrics distracting but need sound to focus, Brain.fm is worth trying.

My favorite features:

Huge variety of sound options (nature, electronic, classical, etc.)
Modes for focus, relaxation, sleep, and meditation
Works on all devices—desktop, mobile, and in-browser
Cost: $9.99/month or $69.99/year

Focus@Will
Best productivity music alternative to Brain.fm
Focus@Will is similar to Brain.fm but uses a slightly different approach—curated music channels designed to help you concentrate for extended periods.

The science behind it involves tempo, energy, and acoustic properties that supposedly keep your brain in the zone. All I know is that it helps me power through work sessions without getting distracted.

If Brain.fm doesn’t click for you, try Focus@Will. They both aim for the same thing but with different styles.

My favorite features:

Multiple music channels optimized for focus
Productivity tracking to see how music affects your work
Works across all devices
Cost: $9.95/month or $52.49/year

⚡ #1 RATED – YOUR DAILY CO-PILOT
Stop managing apps. Start getting things done.
✅ Natural language input – just type or speak
📲 WhatsApp reminders – where you already chat
🔗 Syncs with Google/Outlook – your calendar stays
🎯 Smart conflict detection – no more double-booking

Google Play
App Store
⭐ 4.7 stars • Free tier • No credit card
⚙️✨
your tools, unified

Life Note — The first AI designed for human wisdom. Journal with guidance from 1,000 of history’s greatest minds — philosophers, psychologists, spiritual teachers — across 20+ disciplines. Free at mylifenote.ai.

RescueTime
Best time tracking app for people who hate tracking time

Toggl Track is great if you’re disciplined enough to hit start and stop on a timer. But what if you’re not? That’s where RescueTime wins.

It runs silently in the background, tracking which apps and websites you’re actually spending time on — no timers, no effort. At the end of the week, you get a cold, honest report of where your hours went. Spoiler: probably not where you think.

You can label activities as productive or unproductive, set goals, and even block distracting sites when you need to focus. It’s the time tracker that works even when you forget to use it.

My favorite features:

Fully automatic — no manual input needed
Weekly email summaries with real data on your habits
Site blocking for when willpower runs low
Real-time alerts if you’re overusing certain apps
Cost: Free lite version; Premium at $12/month

Todoist
Best to-do list app for people who mean business

If you’ve ever had a to-do list that felt more overwhelming than helpful, Todoist fixes that. It’s clean, fast, and actually enjoyable to use — which is rarer than it sounds.

You can organize tasks into projects, add subtasks, set recurring reminders, and filter everything by label or priority. Power users love it. Beginners don’t get lost in it. That balance is hard to pull off, and Todoist nails it.

It plays nicely with Google Calendar, has a great browser extension for capturing tasks on the fly, and syncs across every device you own.

My favorite features:

Natural language input for quick task entry (“buy milk every Sunday”)
Color-coded projects and priority flags
Calendar layout so your tasks and schedule live in one view
Integrations with basically everything
Cost: Free; Premium at $4/month billed annually

Taskade
Best AI-powered task manager for teams who want to move faster

Imagine if your to-do list could actually think. That’s Taskade. It’s a task and project manager with built-in AI agents that can plan projects, research topics, and take tasks off your plate autonomously.

It’s not just for solo users either — the team features are solid. You can build workflows, set up automations, and let AI handle the repetitive coordination stuff so your team can focus on the actual work.

My favorite features:

AI agents that autonomously handle tasks and workflows
Multiple project views — list, board, calendar, mind map
Easy team collaboration with shared workspaces
Custom templates for faster project setup
Cost: Free plan available; Pro at $8/user/month billed annually

Calendly
Best scheduling app for people who are tired of the back-and-forth

“Does Tuesday at 3 work?” “No, how about Wednesday?” This email thread is the enemy of productivity. Calendly kills it dead.

You set your availability once. People pick a time that works. It lands on your calendar automatically. Done. No back-and-forth, no double-booking, no awkwardness.

If your job involves meeting with clients, candidates, or really anyone — Calendly is an immediate quality-of-life upgrade.

My favorite features:

Shareable booking link that syncs with your calendar in real time
Automatic reminders sent to whoever you’re meeting
Team scheduling that routes to whoever’s available
Integrates with Google, Outlook, Zoom, and more
Cost: Free basic plan; Standard at $10/user/month

Doodle Best tool for scheduling group meetings without losing your mind

Calendly is great for one-on-ones. But when you’re trying to wrangle five people into a meeting? That’s a different kind of chaos. Doodle handles it beautifully.

You propose a few time slots, share a link, everyone votes on what works — and you pick the winner. That’s it. No group chat spiral, no 47 “I can’t do Thursday” replies.

My favorite features:

Simple poll-based scheduling — no account needed to vote
Clean interface that even non-tech people figure out instantly
Works great for one-time events, recurring meetings, or casual hangouts
Cost: Free basic plan; Pro at $6.95/user/month billed annually

⚡ #1 RATED – YOUR DAILY CO-PILOT
Stop managing apps. Start getting things done.
✅ Natural language input – just type or speak
📲 WhatsApp reminders – where you already chat
🔗 Syncs with Google/Outlook – your calendar stays
🎯 Smart conflict detection – no more double-booking

Google Play
App Store
⭐ 4.7 stars • Free tier • No credit card
⚙️✨
your tools, unified

Zapier
Best automation tool for connecting all your apps without writing code

Every productivity stack eventually has a gap — some task that still requires manual copy-pasting between apps. Zapier closes those gaps.

You set up a trigger (“when I get a new email with an attachment”) and an action (“save it to Google Drive and add a task in Todoist”). That workflow runs automatically, forever. No code required.

Once you start building zaps, you can’t stop. There’s always one more annoying thing you realize you can automate.

My favorite features:

Connects 6,000+ apps with no code whatsoever
Multi-step zaps that chain several actions together
Huge library of pre-built zap templates to get started fast
Runs in the background — genuinely set it and forget it
Cost: Free plan for basic zaps; Professional at $19.99/month

IFTTT
Best lightweight automation for simple everyday tasks

If Zapier feels like more than you need, IFTTT is the stripped-down, friendly alternative. It stands for “If This, Then That” — and that’s literally all it does, but in the most satisfying way.

Want to automatically save liked posts to a spreadsheet? Done. Want your Philips Hue lights to turn on when you arrive home? Easy. It’s less about complex workflows and more about small, clever automations that quietly make your day smoother.

My favorite features:

Dead simple setup — no learning curve
Works with smart home devices, not just apps
Huge library of pre-made applets ready to enable instantly
Cost: Free for 2 applets; Pro at $34.99/year

Perplexity Best AI tool for research without the rabbit hole

Google is great. It’s also a black hole that swallows your afternoon. Perplexity gives you the answer without making you wade through ten ads and three SEO-optimized listicles first.

It’s an AI-powered search engine that actually cites its sources, summarizes what matters, and lets you ask follow-up questions naturally. Think of it as a research assistant that’s read the whole internet and doesn’t waste your time.

My favorite features:

Instant, cited answers to complex questions
Follow-up questions that keep context from your original search
Pro search that goes deeper when you need it to
Cleaner and faster than traditional search for research tasks
Cost: Free for basic searches; Pro at $20/month

Freedom
Best app for blocking distractions across all your devices

Willpower is overrated. Sometimes you just need something that makes it impossible to open TikTok during work hours. That’s Freedom.

It blocks specific apps and websites on your phone and computer simultaneously — so you can’t just switch devices to get around it. You can schedule focus blocks in advance or start one on the fly. There’s even a Locked Mode that won’t let you back out early. Brutal, but effective.

My favorite features:

Syncs blocks across all devices at once
Schedule recurring focus sessions in advance
Locked mode for when you truly can’t trust yourself
Whitelist-only mode to block everything except what you need
Cost: 7 free sessions; then $8.99/month or $39.99/year

Forest
Best focus app for people who need a little emotional stakes

Here’s the pitch: plant a virtual tree. Stay focused, it grows into a beautiful forest. Pick up your phone, it dies. That’s Forest.

It sounds simple — and it is — but there’s something about watching a little tree wither because you opened Instagram that hits differently. Plus, the virtual coins you earn from focused sessions get donated toward planting real trees. Good for you, good for the planet.

My favorite features:

Gamified focus that’s surprisingly motivating
Social features to compete with friends
Real-world tree planting when you earn enough coins
Clean, calming interface that doesn’t stress you out
Cost: Free on Android; $3.99 one-time payment on iOS

Noisli
Best background noise app for people who don’t vibe with music while working

Not everyone can focus with music. But dead silence? Also terrible. Noisli sits perfectly in between.

You mix your own ambient soundscape — rain, coffee shop chatter, wind, forest, fire crackling — and find the exact combination that puts you in the zone. It’s weirdly personal, and once you find your mix, you’ll swear by it.

My favorite features:

Mix and match 16+ individual sounds
Save your favorite combinations for quick access
Productivity mode vs. relaxation mode so it adapts to what you need
Works in browser — no download needed
Cost: Free for basic; Pro at $10/month billed annually

Headspace
Best app for actually learning how to meditate

Everyone knows they should meditate. Almost nobody does it consistently. Headspace solves the “I don’t know where to start” problem better than anything else out there.

It has guided sessions for focus, stress, sleep, anxiety, even sports performance — and they range from 1 minute to 20+ minutes so you genuinely have no excuse. It’s not magic, but a few weeks in, you’ll notice you’re less reactive and more focused. Worth it.

My favorite features:

Guided sessions from 1 minute to 20+ minutes
Themed packs for specific goals (focus, sleep, stress)
Sleepcasts and sleep music for winding down
Bite-sized meditations that fit into any schedule
Cost: Free basics; Full access at $12.99/month or $69.99/year

Sleep Cycle
Best alarm clock for people who wake up groggy every single morning

Here’s the thing — waking up groggy usually isn’t about how much sleep you got. It’s about when you were woken up. If your alarm blasts you out of deep sleep, you feel terrible even after 8 hours.

Sleep Cycle tracks your sleep stages using your phone’s microphone and wakes you up during the lightest phase within a 30-minute window. You wake up feeling like a person. Revolutionary concept.

My favorite features:

Smart alarm that wakes you at the right moment
Nightly sleep quality scores and trends
Tracks correlations between lifestyle habits and sleep quality
No additional hardware needed — just your phone
Cost: Free core features; Premium at $29.99/year

Grammarly
Best writing assistant for anyone who communicates in words (so, everyone)

Spellcheck catches typos. Grammarly catches everything else — awkward phrasing, unclear sentences, the wrong “there/their/they’re,” tone that reads as passive-aggressive when you meant friendly.

It lives in your browser, your Google Docs, your email — basically everywhere you write. It’s like having a really patient editor looking over your shoulder 24/7, and it’s made me a noticeably better writer over time.

My favorite features:

Real-time grammar, clarity, and tone suggestions
Works across Gmail, Docs, Notion, Slack, and more
AI rewriting for sentences or whole paragraphs
Tone detector so you don’t accidentally sound like a robot (or a jerk)
Cost: Free; Pro at $12/month billed annually

Bitwarden
Best password manager — and yes, you absolutely need one

If you’re using the same password for multiple accounts, this is your intervention. A data breach on any one of those sites means they all get compromised. Bitwarden generates a unique, unguessable password for every account and remembers all of them so you don’t have to.

It’s open source, free, and syncs across every device. No excuses left.

My favorite features:

Generates and stores unique passwords for every account
Auto-fills login info in your browser
Syncs across all devices on the free plan (rare)
Open source — the security community can verify it themselves
Cost: Free for core features; Premium at $10/year

Streaks (iOS) / Loop (Android)
Best habit tracker for building the routines that actually move the needle

Apps and tools only go so far. Eventually, productivity comes down to the habits you’ve built — and these two apps make building them feel like a game.

Streaks (iOS) and Loop (Android) both work on the same principle: don’t break the chain. Every day you complete a habit, your streak grows. Miss a day and it resets. That tiny psychological sting is surprisingly effective at keeping you consistent with the things that matter — workouts, reading, writing, sleep, whatever it is you’re trying to lock in.

My favorite features:

Visual streak tracking that’s oddly satisfying
Custom reminders for each habit
Stats that show your best streaks and most productive days
Loop’s flexible scheduling (e.g., gym only on Mon/Wed/Fri)
Cost: Streaks — $5.99 one-time; Loop — completely free

⚡ #1 RATED – YOUR DAILY CO-PILOT


I'll help you comprehensively enhance your codebase. Let me start by scanning everything and creating a detailed plan.

<read_file>
<path>package.json</path>
</read_file>

<read_file>
<path>README.md</path>
</read_file>

<list_dir>
<path>.</path>
</list_dir>

<read_file>
<path>src</path>
</read_file>

<list_dir>
<path>src</path>
<recursive>true</recursive>
</list_dir>

<read_file>
<path>src/components/AIPlanner.tsx</path>
</read_file>

<read_file>
<path>src/components/AIOrchestrator.tsx</path>
</read_file>

<read_file>
<path>src/lib/ai/planner.ts</path>
</read_file>

<read_file>
<path>src/lib/ai/orchestrator.ts</path>
</read_file>

<read_file>
<path>src/app/api</path>
</read_file>

<list_dir>
<path>src/app/api</path>
<recursive>true</recursive>
</list_dir>

<read_file>
<path>src/app/api/ai/plan/route.ts</path>
</read_file>

<read_file>
<path>src/app/api/ai/orchestrate/route.ts</path>
</read_file>

<read_file>
<path>src/lib/email.ts</path>
</read_file>

<read_file>
<path>.env.example</path>
</read_file>

<list_dir>
<path>emails</path>
</list_dir>

<read_file>
<path>emails</path>
</list_dir>

<read_file>
<path>src/middleware.ts</path>
</read_file>

<read_file>
<path>capacitor.config.ts</path>
</read_file>

<read_file>
<path>next.config.js</path>
</read_file>

<read_file>
<path>tailwind.config.ts</path>
</read_file>

<list_dir>
<path>src/components</path>
</list_dir>

<read_file>
<path>src/components/Sidebar.tsx</path>
</read_file>

<read_file>
<path>src/app/layout.tsx</path>
</read_file>

<read_file>
<path>src/app/page.tsx</path>
</read_file>

Now let me check the conversation history and create a comprehensive plan:

<write_file>
<path>INCOMPLETE_TASKS_AND_ENHANCEMENT_PLAN.md</path>
<content># Resurgo.life - Comprehensive Enhancement & Completion Plan

🎯 Executive Summary
This document outlines all incomplete tasks, requested features, and a step-by-step integration plan for Resurgo.life - a holistic life management platform.

📋 INCOMPLETE TASKS IDENTIFIED
1. AI System Enhancement (HIGH PRIORITY)
Problem: AI Planner and Orchestrator are giving generic responses

Current behavior: Generic flows like "research and analysis"
Example: Weight gain goal returns template-like responses instead of personalized plans
Required Fixes:

 Enhance AI prompts with domain-specific knowledge
 Add context-aware planning (user profile, history, goals)
 Implement multi-step reasoning chains
 Add specialized planning templates for different goal types
 Integrate real-world data sources via MCP servers
2. Email System Issues (HIGH PRIORITY)
Problems:

 Email verification template shows "Ascend" (old name) instead of "Resurgo"
 Need verification that emails are actually being sent
 Clerk email customization needed
Required Fixes:

 Update Clerk email templates to show "Resurgo" branding
 Configure custom email templates
 Add email logging/monitoring
 Test email delivery pipeline
3. Sidebar Configuration (MEDIUM PRIORITY)
Issue: Sidebar configuration from previous discussion not implemented

 Need to review conversation history for specific requirements
 Implement requested sidebar features
 Add customization options
4. UI/UX Enhancements (MEDIUM PRIORITY)
 Add Framer Motion animations throughout the app
 Implement smooth page transitions
 Add micro-interactions for better UX
 Animate AI responses and data loading
5. Build Optimization (MEDIUM PRIORITY)
 Set up webpack bundle analyzer
 Optimize bundle size
 Implement code splitting
 Add performance monitoring
6. APK Generation (HIGH PRIORITY)
 Generate production-ready Android APK
 Create app store assets (screenshots, icons)
 Write marketing copy for app stores
 Configure app signing
 Optimize for different screen sizes
🔧 MCP SERVERS INTEGRATION PLAN
Phase 1: Install and Configure MCP Servers
A. Filesystem MCP (For enhanced file operations)
Bash

# Already available - enhance usage
Use Cases:

Advanced file search across codebase
Pattern matching for code analysis
Automated refactoring
B. Brave Search MCP (For AI context enhancement)
Installation:

Bash

npm install @modelcontextprotocol/server-brave-search
Use Cases:

Real-time research for AI planning (nutrition, fitness, productivity)
Fact-checking AI suggestions
Finding latest best practices for user goals
C. Memory MCP (For context persistence)
Installation:

Bash

npm install @modelcontextprotocol/server-memory
Use Cases:

Store user preferences and patterns
Remember conversation context
Improve AI personalization
D. PostgreSQL MCP (For advanced database operations)
Installation:

Bash

npm install @modelcontextprotocol/server-postgres
Use Cases:

Complex analytics queries
Data migration support
Advanced reporting
E. GitHub MCP (For development workflow)
Installation:

Bash

npm install @modelcontextprotocol/server-github
Use Cases:

Automated issue creation
PR management
Code review assistance
F. Puppeteer MCP (For web automation)
Installation:

Bash

npm install @modelcontextprotocol/server-puppeteer
Use Cases:

Automated testing
Screenshot generation for app store
Web scraping for data enrichment
G. Time MCP (For scheduling and time management)
Installation:

Bash

npm install @modelcontextprotocol/server-time
Use Cases:

Smart scheduling in AI planner
Timezone handling
Reminder optimization
🚀 STEP-BY-STEP IMPLEMENTATION PLAN
PHASE 1: Foundation & Critical Fixes (Week 1)
Day 1: Email System Fix
Update Clerk Branding

Configure Clerk dashboard to use "Resurgo" branding
Customize email templates
Add custom domain for emails
Email Monitoring

Add Resend email logging
Create email test suite
Implement delivery tracking
Day 2-3: AI System Enhancement - Core Infrastructure
Install MCP Servers

Bash

npm install @modelcontextprotocol/server-brave-search
npm install @modelcontextprotocol/server-memory
npm install @modelcontextprotocol/server-time
Create AI Enhancement Layer

Build MCP integration service
Add context management system
Create specialized prompts library
Day 4-5: AI Planner Overhaul
Implement Domain-Specific Planning

Fitness & nutrition planning module
Career & skill development module
Financial planning module
Relationship & social module
Mental health & wellness module
Add Research Integration

Brave Search integration for real-time data
Fact verification system
Evidence-based recommendations
Day 6-7: AI Orchestrator Enhancement
Multi-Agent System

Research agent
Planning agent
Execution agent
Monitoring agent
Context-Aware Responses

User profile integration
Historical data analysis
Personalization engine
PHASE 2: UI/UX Enhancement (Week 2)
Day 1-2: Framer Motion Integration
Install Dependencies

Bash

npm install framer-motion
Implement Animations

Page transitions
Component animations
AI response animations
Loading states
Micro-interactions
Day 3-4: Sidebar Enhancement
Review Previous Requirements
Implement Features
Customizable navigation
Collapsible sections
Quick actions
Context-aware menu items
Day 5-7: Performance Optimization
Bundle Analysis

Bash

npm install --save-dev @next/bundle-analyzer
Optimization

Code splitting
Lazy loading
Image optimization
Font optimization
PHASE 3: Mobile App (Week 3)
Day 1-3: APK Generation & Optimization
Configure Capacitor

Update configuration
Add splash screens
Configure icons
Set up app signing
Build APK

Bash

npm run build
npx cap sync
cd android && ./gradlew assembleRelease
Testing

Test on multiple devices
Performance testing
Battery usage optimization
Day 4-5: App Store Assets
Create Marketing Materials

App screenshots
Feature graphics
Promotional video
App icon variations
Write Marketing Copy

App description
Feature highlights
What's new
SEO optimization
Day 6-7: Final Polish
Quality Assurance
End-to-end testing
User acceptance testing
Bug fixes
📝 DETAILED TASK BREAKDOWN
Task 1: Enhanced AI Planner
File: src/lib/ai/enhanced-planner.ts

Features:

Domain-specific knowledge bases
Multi-step reasoning
Research integration via Brave Search
Context awareness
Personalization based on user data
Specialized Modules:

Fitness & Nutrition Planner

Caloric needs calculation
Macro distribution
Workout programming
Progressive overload planning
Supplement recommendations
Career Development Planner

Skill gap analysis
Learning path creation
Project portfolio building
Networking strategy
Interview preparation
Financial Planner

Budget optimization
Savings goals
Investment strategy
Debt management
Income diversification
Relationship & Social Planner

Social skill development
Network building
Conflict resolution
Communication improvement
Mental Health & Wellness Planner

Stress management
Habit formation
Sleep optimization
Mindfulness practices
Emotional regulation
Task 2: Email Template Customization
Files to Update:

Clerk Dashboard Configuration
emails/verification-email.tsx (if custom)
Environment variables for email branding
Changes Needed:

Update all instances of "Ascend" to "Resurgo"
Add Resurgo logo and branding
Customize email footer
Add social links
Implement custom domain
Task 3: Framer Motion Implementation
Components to Animate:

Page Transitions

TypeScript

// Layout-level animations
- Fade in/out
- Slide transitions
- Scale effects
AI Response Animations

TypeScript

// Typewriter effect for AI responses
// Smooth reveal for plans
// Progress indicators
Interactive Elements

TypeScript

// Button hover effects
// Card interactions
// Drag and drop
// Gesture controls
Task 4: Bundle Analyzer Setup
Configuration:

JavaScript

// next.config.js enhancement
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // existing config
})
Optimization Targets:

Reduce bundle size by 30%
Implement route-based code splitting
Optimize third-party dependencies
Lazy load heavy components
Task 5: APK Build & Marketing
Build Configuration:

JSON

// capacitor.config.ts enhancement
{
  "appId": "life.resurgo.app",
  "appName": "Resurgo",
  "bundledWebRuntime": false,
  "webDir": "out",
  "plugins": {
    "SplashScreen": {
      "launchShowDuration": 2000,
      "backgroundColor": "#000000",
      "showSpinner": false
    }
  },
  "android": {
    "buildOptions": {
      "keystorePath": "keystore.jks",
      "keystoreAlias": "resurgo"
    }
  }
}
Marketing Copy Template:

text

Title: Resurgo - Transform Your Life Holistically

Short Description:
AI-powered life management platform that helps you achieve your goals through intelligent planning, tracking, and personalized insights.

Long Description:
Transform your life with Resurgo, the ultimate holistic life management platform powered by advanced AI.

🎯 Why Resurgo?
- Personalized AI planning for fitness, career, finance, and wellness
- Smart habit tracking with intelligent insights
- Comprehensive goal management system
- Evidence-based recommendations
- Privacy-first approach

✨ Features:
• AI-Powered Planning: Get personalized, actionable plans based on your unique goals
• Multi-Domain Tracking: Fitness, nutrition, career, finance, relationships, and mental health
• Intelligent Insights: AI analyzes your progress and provides adaptive recommendations
• Habit Formation: Build lasting habits with smart reminders and motivation
• Progress Analytics: Beautiful visualizations of your journey
• Privacy Focused: Your data stays yours, encrypted and secure

💪 Perfect For:
- Professionals seeking work-life balance
- Fitness enthusiasts tracking multiple goals
- Anyone wanting to improve their life systematically
- People who value data-driven self-improvement

🚀 Start your transformation today with Resurgo!

Keywords: life management, AI planning, habit tracker, goal setting, productivity, fitness, wellness, personal development
🎨 ENHANCED PROMPT FOR RESURGO.LIFE
Current App Analysis
After scanning the codebase, Resurgo.life is a comprehensive life management platform with:

Multi-domain goal tracking (fitness, career, finance, relationships, mental health)
AI-powered planning and orchestration
Habit tracking system
Progress analytics
User authentication via Clerk
PostgreSQL database with Prisma ORM
Next.js 14 with App Router
Capacitor for mobile deployment
Enhanced Prompt Template
text

# Resurgo.life - AI-Powered Holistic Life Transformation Platform

## Platform Overview
Resurgo.life is an advanced, AI-driven life management ecosystem designed to help users achieve holistic transformation across multiple life domains through intelligent planning, adaptive tracking, and personalized insights.

## Core Domains
1. **Physical Health & Fitness**
   - Workout programming and tracking
   - Nutrition planning and macro tracking
   - Body composition monitoring
   - Sleep optimization
   - Energy management

2. **Career & Skill Development**
   - Professional goal setting
   - Skill acquisition tracking
   - Learning path optimization
   - Project portfolio management
   - Income growth strategies

3. **Financial Wellness**
   - Budget optimization
   - Savings goal tracking
   - Investment planning
   - Debt management
   - Financial independence planning

4. **Relationships & Social**
   - Relationship quality tracking
   - Social skill development
   - Network building strategies
   - Communication improvement
   - Conflict resolution

5. **Mental Health & Wellness**
   - Stress management
   - Emotional regulation
   - Mindfulness practice tracking
   - Therapy goal support
   - Life satisfaction monitoring

## AI Capabilities Required

### 1. **Intelligent Planning Engine**
The AI should:
- Create highly specific, actionable plans (not generic templates)
- Consider user's current state, resources, and constraints
- Provide evidence-based recommendations with sources
- Break down long-term goals into weekly/daily actions
- Adapt plans based on progress and feedback

**Example**: For "gain weight" goal:
- Calculate specific caloric surplus based on TDEE
- Recommend macro split (protein/carb/fat)
- Suggest specific foods and meal timing
- Create progressive workout program
- Set realistic timeline with milestones
- Consider budget, cooking skills, time availability

### 2. **Context-Aware Orchestration**
The AI should:
- Analyze user's entire goal ecosystem
- Identify synergies and conflicts between goals
- Prioritize actions based on impact and effort
- Suggest optimal daily routines
- Provide motivational support tailored to user's psychology

### 3. **Adaptive Learning**
The AI should:
- Learn from user's progress and setbacks
- Adjust recommendations based on what works
- Identify patterns in success/failure
- Predict obstacles before they occur
- Celebrate wins and reframe setbacks

### 4. **Research Integration**
The AI should:
- Access latest research and best practices
- Fact-check its own recommendations
- Provide citations for major claims
- Update advice based on new evidence
- Compare multiple approaches objectively

## Technical Context

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, tRPC
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Clerk
- **AI**: OpenAI GPT-4, Anthropic Claude
- **Email**: Resend
- **Mobile**: Capacitor
- **Deployment**: Vercel (web), Android APK

### Key Features to Support
1. Real-time AI chat for goal refinement
2. Automated progress tracking
3. Smart notifications and reminders
4. Data visualization and analytics
5. Habit streak tracking
6. Social accountability features
7. Privacy-first data handling
8. Offline-first mobile app
9. Cross-device synchronization
10. Export and backup capabilities

### User Experience Principles
- **Simplicity**: Easy to use, powerful under the hood
- **Personalization**: Every interaction feels tailored
- **Motivation**: Celebrate progress, encourage growth
- **Transparency**: Clear explanations for AI suggestions
- **Privacy**: User owns their data, end-to-end encryption
- **Beauty**: Aesthetic, calming, inspiring design
- **Speed**: Fast responses, smooth animations
- **Reliability**: Always available, consistent behavior

## AI Interaction Guidelines

### Planning Requests
When user requests a plan, AI should:
1. Ask clarifying questions about:
   - Current state and starting point
   - Available resources (time, money, equipment)
   - Constraints and limitations
   - Preferred approach/style
   - Past attempts and learnings

2. Research relevant information:
   - Latest scientific evidence
   - Expert recommendations
   - Success stories and case studies
   - Common pitfalls to avoid

3. Create specific, actionable plan with:
   - Clear milestones and timeline
   - Daily/weekly action items
   - Metrics to track
   - Resources needed
   - Expected challenges and solutions
   - Alternative approaches if needed

4. Format output as:
   - Executive summary
   - Detailed step-by-step plan
   - Resources and references
   - Tracking recommendations
   - Success indicators

### Orchestration Requests
When coordinating multiple goals, AI should:
1. Analyze all active goals holistically
2. Identify time conflicts and synergies
3. Create optimized daily/weekly schedule
4. Suggest which goals to prioritize when
5. Recommend which goals to pause if overwhelmed
6. Provide rationale for all recommendations

### Progress Analysis
When reviewing progress, AI should:
1. Celebrate specific wins (no generic praise)
2. Identify patterns and insights
3. Suggest tactical adjustments
4. Reframe setbacks as learning opportunities
5. Update plan based on new data
6. Predict and prepare for upcoming challenges

## Tone and Voice
- **Knowledgeable**: Expert-level advice, backed by evidence
- **Supportive**: Encouraging without being patronizing
- **Direct**: Clear and actionable, no fluff
- **Adaptive**: Matches user's communication style
- **Human**: Warm and relatable, not robotic
- **Honest**: Admits uncertainty, provides caveats

## Privacy and Ethics
- Never store sensitive personal data unnecessarily
- Always explain how data is used
- Respect user's autonomy and choices
- Provide disclaimers for health/medical advice
- Encourage professional help when appropriate
- Never manipulate or create dependency

## Success Metrics
The AI system should optimize for:
- User goal completion rate
- Sustained behavior change (30+ days)
- User satisfaction and trust
- Reduced overwhelm and decision fatigue
- Increased self-efficacy and confidence
- Holistic life improvement across domains

## Integration Points
- Pull user profile and preferences from database
- Access goal history and progress data
- Integrate with habit tracking system
- Connect to analytics for insights
- Sync with calendar and reminders
- Export to health apps and wearables

## Example Use Cases

### Use Case 1: Weight Gain Goal
**User Input**: "I want to gain 15 pounds of muscle"

**AI Response Should Include**:
- Current weight, height, age, activity level (ask if unknown)
- Calculate TDEE and recommended surplus (+300-500 cal)
- Specific macro targets (1g protein/lb, etc.)
- Sample meal plan with exact foods and portions
- Progressive resistance training program (sets, reps, exercises)
- Supplement recommendations (creatine, protein powder)
- Timeline: ~1-1.5 lbs/month = 10-15 months
- Weekly check-in protocol
- Adjustment triggers (stalled progress, too fast gain)
- Resources: Renaissance Periodization, Mike Israetel research

### Use Case 2: Career Transition
**User Input**: "I want to transition from marketing to software engineering"

**AI Response Should Include**:
- Skills gap analysis
- Learning roadmap (6-12 month timeline)
  * Months 1-2: HTML/CSS/JavaScript fundamentals
  * Months 3-4: React and modern frameworks
  * Months 5-6: Backend (Node.js, databases)
  * Months 7-9: Data structures, algorithms
  * Months 10-12: System design, portfolio projects
- Daily study schedule (2-3 hours/day)
- Specific resources (freeCodeCamp, The Odin Project, LeetCode)
- Portfolio project ideas
- Networking strategy
- Resume transformation plan
- Job application timeline
- Financial runway assessment
- Part-time vs full-time transition analysis

## MCP Server Integration Opportunities

### Brave Search MCP
- Real-time research for goal planning
- Latest best practices and studies
- Fact-checking AI recommendations
- Finding relevant resources and tools

### Memory MCP
- Store user preferences and patterns
- Remember past conversations and context
- Build long-term user profile
- Track what strategies work for this user

### Time MCP
- Smart scheduling across goals
- Optimize daily routines
- Handle timezone complexities
- Calculate optimal timing for habits

### PostgreSQL MCP
- Complex analytics queries
- Historical trend analysis
- Cross-domain correlation insights
- Performance optimization

## Design Philosophy
Resurgo (Latin: "I rise again") embodies:
- **Resilience**: Bounce back from setbacks
- **Transformation**: Fundamental positive change
- **Holism**: Whole-life integration
- **Evidence**: Data-driven decisions
- **Autonomy**: User empowerment
- **Growth**: Continuous improvement

---

When building features for Resurgo.life, always ask:
1. Does this help users achieve real transformation?
2. Is this personalized or generic?
3. Does this respect user privacy and autonomy?
4. Is this backed by evidence and best practices?
5. Does this create sustainable behavior change?
6. Is this simple to use but powerful?
7. Does this integrate well with other domains?
8. Will this delight and inspire the user?
📊 PRIORITY MATRIX
🔴 Critical (Do First)
Fix AI Planner to give specific, actionable advice
Update email branding from "Ascend" to "Resurgo"
Verify email delivery is working
🟡 High Priority (This Week)
Implement MCP server integrations
Add Framer Motion animations
Generate production APK
Create app store marketing materials
🟢 Medium Priority (Next Week)
Set up bundle analyzer and optimize
Implement sidebar configuration
Add comprehensive error logging
🔵 Low Priority (Future)
Advanced analytics features
Social sharing capabilities
Export functionality enhancements
🔍 VERIFICATION CHECKLIST
After implementation, verify:

 AI gives specific plans (test with 5 different goal types)
 Emails show "Resurgo" branding
 Emails are being delivered (check spam, check logs)
 Animations are smooth (60fps)
 Bundle size is optimized (<500KB main bundle)
 APK installs and runs on Android
 All sidebar features work as requested
 No console errors in production
 Mobile responsiveness is perfect
 Loading states are pleasant
 Error states are helpful
 Performance metrics are green
📚 RESOURCES NEEDED
MCP Servers
@modelcontextprotocol/server-brave-search
@modelcontextprotocol/server-memory
@modelcontextprotocol/server-time
@modelcontextprotocol/server-postgres
@modelcontextprotocol/server-github
@modelcontextprotocol/server-puppeteer
NPM Packages
framer-motion (animations)
@next/bundle-analyzer (optimization)
zod (enhanced validation)
recharts (advanced visualizations)
date-fns (time handling)
Services
Clerk (email template customization)
Resend (email monitoring)
Vercel (deployment)
Google Play Console (app distribution)
🎯 SUCCESS CRITERIA
AI Enhancement Success
User gets specific caloric targets, not "research nutrition"
Plans include actual exercises, foods, resources
Timeline is realistic and detailed
User can immediately act on the plan
Email Success
All emails show "Resurgo" branding
Delivery rate >95%
No spam folder issues
Professional appearance
Mobile Success
APK <50MB
Installs on Android 8+
Smooth 60fps performance
Offline functionality works
Overall Success
User retention >70% after 30 days
Goal completion rate >40%
App store rating >4.5 stars
Load time <2 seconds
Next Steps:

Review and approve this plan
Start with Phase 1, Day 1 (Email fixes)
Proceed methodically through each phase
Test thoroughly at each milestone
Deploy incrementally to avoid breaking changes
Estimated Timeline: 3 weeks for full implementation
Estimated Effort: ~120-150 hours
Risk Level: Medium (mostly additive changes)

</content> </write_file>
Now let me start implementing the critical fixes. Let me first install the necessary MCP servers and then enhance the AI system:

<write_file>
<path>mcp-setup.sh</path>
<content>#!/bin/bash

Resurgo.life - MCP Server Installation Script
echo "🚀 Installing MCP Servers for Resurgo.life..."

Install MCP servers
npm install --save @modelcontextprotocol/server-brave-search
npm install --save @modelcontextprotocol/server-memory
npm install --save @modelcontextprotocol/server-time
npm install --save @modelcontextprotocol/server-postgres
npm install --save @modelcontextprotocol/server-github
npm install --save @modelcontextprotocol/server-puppeteer

Install additional dependencies for enhanced AI
npm install --save zod openai anthropic
npm install --save date-fns

Install Framer Motion for animations
npm install --save framer-motion

Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

Install additional dev tools
npm install --save-dev @types/node

echo "✅ All MCP servers and dependencies installed!"
echo "📝 Next steps:"
echo "1. Configure MCP servers in your environment"
echo "2. Run the enhanced AI planner tests"
echo "3. Check the INCOMPLETE_TASKS_AND_ENHANCEMENT_PLAN.md file"

</content> </write_file>
Now let me create the enhanced AI planner with domain-specific knowledge:

<write_file>
<path>src/lib/ai/enhanced-planner.ts</path>
<content>import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";

// Domain-specific schemas
const FitnessGoalSchema = z.object({
type: z.enum(["weight_gain", "weight_loss", "muscle_gain", "strength", "endurance", "general_fitness"]),
currentWeight: z.number().optional(),
targetWeight: z.number().optional(),
height: z.number().optional(),
age: z.number().optional(),
activityLevel: z.enum(["sedentary", "light", "moderate", "very_active", "extra_active"]).optional(),
experience: z.enum(["beginner", "intermediate", "advanced"]).optional(),
equipment: z.array(z.string()).optional(),
timeAvailable: z.number().optional(), // hours per week
dietaryRestrictions: z.array(z.string()).optional(),
});

const CareerGoalSchema = z.object({
type: z.enum(["career_transition", "skill_acquisition", "promotion", "income_increase", "side_hustle"]),
currentRole: z.string().optional(),
targetRole: z.string().optional(),
currentSkills: z.array(z.string()).optional(),
timeAvailable: z.number().optional(), // hours per week
budget: z.number().optional(),
timeline: z.string().optional(),
});

const FinancialGoalSchema = z.object({
type: z.enum(["savings", "debt_payoff", "investment", "budget_optimization", "income_increase"]),
currentAmount: z.number().optional(),
targetAmount: z.number().optional(),
timeline: z.string().optional(),
riskTolerance: z.enum(["conservative", "moderate", "aggressive"]).optional(),
monthlyIncome: z.number().optional(),
monthlyExpenses: z.number().optional(),
});

// Enhanced planner with domain-specific knowledge
export class EnhancedAIPlanner {
private anthropic: Anthropic;

constructor() {
this.anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC_API_KEY!,
});
}

/**

Create a highly specific, actionable plan based on goal domain
*/
async createDetailedPlan(
goalDescription: string,
domain: string,
userContext?: any
): Promise<{
plan: string;
actionItems: Array<{ task: string; deadline: string; priority: string }>;
resources: string[];
metrics: string[];
timeline: string;
}> {
// Get domain-specific context and research
const domainContext = await this.getDomainContext(domain, goalDescription);
text

// Build enhanced prompt
const prompt = this.buildEnhancedPrompt(goalDescription, domain, domainContext, userContext);

const message = await this.anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 4000,
  temperature: 0.7,
  system: this.getSystemPrompt(domain),
  messages: [
    {
      role: "user",
      content: prompt,
    },
  ],
});

const responseText = message.content[0].type === "text" ? message.content[0].text : "";

// Parse structured response
return this.parseDetailedResponse(responseText);
}

/**

Get domain-specific system prompt
*/
private getSystemPrompt(domain: string): string {
const basePrompt = `You are an expert life coach and planner specializing in evidence-based, actionable planning.
Your role is to create highly specific, personalized plans that users can immediately act on.
CRITICAL RULES:

NEVER give generic advice like "research and analysis" or "planning phase"
ALWAYS provide specific numbers, timelines, and actionable steps
ALWAYS cite evidence and best practices
ALWAYS consider individual circumstances and constraints
ALWAYS break down long-term goals into weekly/daily actions
ALWAYS provide specific resources, tools, and references
Your plans should be so detailed that a user can start TODAY without additional research.`;

text

const domainPrompts: Record<string, string> = {
  fitness: `${basePrompt}
DOMAIN EXPERTISE: Fitness, Nutrition, and Body Composition

You have deep knowledge of:

Exercise science and progressive overload
Nutrition science (macros, micros, meal timing)
Body composition and metabolism (TDEE, BMR, caloric needs)
Evidence-based training programs
Supplement science
Recovery and sleep optimization
When creating fitness plans, you MUST:

Calculate specific caloric needs using Mifflin-St Jeor equation
Provide exact macro targets (protein: 0.8-1g/lb, etc.)
Design progressive training programs (sets, reps, exercises)
Recommend specific foods and meal examples
Set realistic timelines (1-2 lbs/week for weight change, etc.)
Include recovery protocols
Reference credible sources (Renaissance Periodization, Stronger by Science, Examine.com)
Example specificity level:

NOT: "Eat more protein"

YES: "Consume 150g protein daily (1g per lb bodyweight). Examples: 200g chicken breast (60g protein), 2 scoops whey (50g), 4 eggs (24g), Greek yogurt (15g)"`,

text

career: `${basePrompt}
DOMAIN EXPERTISE: Career Development and Skill Acquisition

You have deep knowledge of:

Learning science and spaced repetition
Skill acquisition methodologies
Career transition strategies
Technical skill development (coding, design, etc.)
Professional networking
Resume and portfolio optimization
Interview preparation
When creating career plans, you MUST:

Perform detailed skills gap analysis
Create month-by-month learning roadmap
Recommend specific courses and resources with links
Design portfolio projects that demonstrate skills
Provide daily study schedules
Include networking and job application strategies
Set realistic timelines based on study hours available
Reference industry standards and requirements
Example specificity level:

NOT: "Learn programming"

YES: "Month 1-2: Complete freeCodeCamp HTML/CSS (40 hrs) + JavaScript basics (60 hrs). Build 3 projects: landing page, calculator, todo app. Study 2hrs/day, 5 days/week. Resources: MDN Web Docs, JavaScript.info"`,

text

financial: `${basePrompt}
DOMAIN EXPERTISE: Personal Finance and Wealth Building

You have deep knowledge of:

Budgeting and expense optimization
Debt payoff strategies (avalanche, snowball)
Investment vehicles (401k, IRA, index funds)
Emergency fund guidelines
Income diversification
Tax optimization
Financial independence calculations
When creating financial plans, you MUST:

Calculate specific numbers (savings rate, payoff timeline, etc.)
Create detailed budgets with categories
Provide exact investment allocations
Show month-by-month progress projections
Include tax considerations
Recommend specific tools and platforms
Set SMART financial milestones
Reference credible sources (Bogleheads, Mr. Money Mustache, JL Collins)
Example specificity level:

NOT: "Start investing"

YES: "Open Vanguard IRA. Contribute $500/month. Allocation: 70% VTSAX (total stock market), 30% VBTLX (bonds). Expected 7% annual return = $6,180 after Year 1. Increase contribution by $50/month each year."`,

text

relationships: `${basePrompt}
DOMAIN EXPERTISE: Relationship Building and Social Skills

You have deep knowledge of:

Communication frameworks (NVC, active listening)
Attachment theory
Conflict resolution techniques
Social anxiety management
Networking strategies
Boundary setting
Emotional intelligence development
When creating relationship plans, you MUST:

Provide specific conversation frameworks
Design practice exercises with examples
Set measurable interaction goals
Recommend specific books and resources
Include reflection and journaling prompts
Create progressive challenges
Reference evidence-based approaches
Example specificity level:

NOT: "Improve communication"

YES: "Practice active listening daily: 1) Maintain eye contact, 2) Paraphrase what you heard ('So you're saying...'), 3) Ask open-ended follow-ups ('Tell me more about...'). Start with low-stakes convos (barista, coworker). Track 1 conversation/day in journal. Resource: 'Nonviolent Communication' by Rosenberg"`,

text

mental_health: `${basePrompt}
DOMAIN EXPERTISE: Mental Health and Emotional Wellness

You have deep knowledge of:

CBT and DBT techniques
Mindfulness and meditation practices
Stress management strategies
Habit formation science
Sleep hygiene
Emotional regulation
Burnout prevention
IMPORTANT: Always include disclaimer to seek professional help for serious issues.

When creating mental health plans, you MUST:

Provide specific daily practices with timing
Design progressive skill-building exercises
Include tracking methods
Recommend evidence-based apps and resources
Set realistic expectations for progress
Include crisis resources
Reference clinical research and methods
Example specificity level:

NOT: "Practice mindfulness"

YES: "Daily mindfulness routine: 1) Morning: 5-min breath focus meditation using Headspace app, 2) Midday: 2-min body scan, 3) Evening: 10-min gratitude journaling (3 specific things). Start with 5 min/day Week 1, increase by 2 min/week. Track mood 1-10 before/after. Research: MBSR (Kabat-Zinn) shows 8-week practice reduces anxiety by 58%."`,
};

return domainPrompts[domain] || basePrompt;
}

/**

Get domain-specific context (would integrate with MCP Brave Search)
*/
private async getDomainContext(domain: string, goalDescription: string): Promise<string> {
// TODO: Integrate with Brave Search MCP for real-time research
// For now, return domain-specific knowledge
const domainKnowledge: Record<string, string> = {
fitness: `

EVIDENCE-BASED FITNESS PRINCIPLES:

Caloric Needs:

BMR (Mifflin-St Jeor): Men: 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
BMR (Mifflin-St Jeor): Women: 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
TDEE = BMR × Activity Multiplier (1.2-1.9)
Surplus for muscle gain: +300-500 cal/day = 0.5-1 lb/week
Deficit for fat loss: -500-750 cal/day = 1-1.5 lb/week
Macros:

Protein: 0.8-1g per lb bodyweight (muscle gain/retention)
Fat: 0.3-0.5g per lb bodyweight (hormone production)
Carbs: Remainder of calories (energy, performance)
Training:

Beginners: 3x/week full body, 3-4 sets per exercise, 8-12 reps
Intermediates: 4-5x/week upper/lower or PPL split
Progressive overload: Increase weight/reps by 2.5-5% per week
Volume: 10-20 sets per muscle group per week
Recovery:

Sleep: 7-9 hours nightly (critical for muscle growth)
Rest: 48hrs between training same muscle group
Deload: Every 4-6 weeks, reduce volume by 50%
Supplements (evidence-based):

Creatine monohydrate: 5g daily (+5-15% strength gains)
Protein powder: If whole food intake insufficient
Vitamin D: 2000-4000 IU if deficient
Caffeine: 3-6mg/kg pre-workout (performance boost)
Sources: Renaissance Periodization, Stronger by Science, Examine.com, Eric Helms research
`,

text

  career: `
SKILL ACQUISITION PRINCIPLES:

Learning Timeline:

Basic proficiency: 20-40 hours (quick wins)
Job-ready skills: 200-500 hours (3-6 months at 2hrs/day)
Advanced expertise: 1000-10,000 hours (1-5 years)
Effective Learning Methods:

Spaced repetition (review at 1, 3, 7, 14, 30 days)
Active recall > passive reading
Project-based learning > tutorial hell
Public learning (blog, GitHub, Twitter)
Teaching others (Feynman technique)
Software Engineering Roadmap:
Month 1-2: HTML/CSS/JavaScript fundamentals (freeCodeCamp, The Odin Project)
Month 3-4: React/Vue/Angular + modern tooling (Webpack, Git)
Month 5-6: Backend (Node.js/Python/Java), databases (SQL, MongoDB)
Month 7-8: Data structures & algorithms (LeetCode, AlgoExpert)
Month 9-10: System design, testing, deployment
Month 11-12: Portfolio projects, interview prep, applications

Portfolio Projects (must-haves):

CRUD app (todo, blog, etc.) - shows fundamentals
API integration (weather, movie database) - shows API skills
Full-stack app (authentication, database) - shows end-to-end
Creative project (game, tool) - shows problem-solving
Job Search:

Apply to 10-20 jobs/day (numbers game)
Custom resume per application (ATS optimization)
Network on LinkedIn (50+ connections in target companies)
Attend meetups/conferences (1-2/month)
Contribute to open source (shows collaboration)
Sources: Josh Kaufman (The First 20 Hours), Cal Newport (Deep Work), freeCodeCamp, 100Devs
`,

text

  financial: `
PERSONAL FINANCE PRINCIPLES:

Emergency Fund:

Target: 3-6 months expenses
Location: High-yield savings (currently 4-5% APY)
Build: $1000 starter emergency fund, then full amount
Debt Payoff:

Avalanche method: Highest interest rate first (mathematically optimal)
Snowball method: Smallest balance first (psychological wins)
Timeline: List all debts, calculate payoff date, automate payments
Budgeting (50/30/20 rule):

50% needs (rent, food, utilities, insurance)
30% wants (dining out, entertainment, hobbies)
20% savings/investments (401k, IRA, taxable)
Investment Strategy (Bogleheads approach):

Max employer 401k match (free money)
Max Roth IRA ($6,500/year, $7,500 if 50+)
Low-cost index funds (VTSAX, VFIAX - 0.04% expense ratio)
Asset allocation: Age in bonds (e.g., 30 years old = 30% bonds)
Rebalance annually
Expected returns: 7-10% annually (historical average)
Financial Independence:

FI Number = Annual Expenses × 25 (4% safe withdrawal rate)
Savings Rate matters more than returns early on
Coast FI: Save enough that compound interest reaches FI by retirement age
Tax Optimization:

401k/Traditional IRA: Tax-deferred, reduces current tax
Roth IRA: Tax-free growth, no RMDs
HSA: Triple tax advantage (deduct, grow, withdraw tax-free for medical)
Tax-loss harvesting in taxable accounts
Sources: JL Collins (Simple Path to Wealth), Mr. Money Mustache, Bogleheads wiki, White Coat Investor
`,

text

  relationships: `
RELATIONSHIP & COMMUNICATION PRINCIPLES:

Nonviolent Communication (NVC) Framework:

Observation: State facts without judgment
Feeling: Express emotion without blame
Need: Identify underlying need
Request: Make specific, actionable request
Example: "When you didn't text back last night [observation], I felt worried [feeling] because I need reassurance in our friendship [need]. Would you be willing to send a quick 'busy, will call later' text in the future? [request]"

Active Listening:

Maintain eye contact and open body language
Paraphrase: "So what I'm hearing is..."
Ask open-ended questions: "Tell me more about..."
Avoid interrupting or planning response while they talk
Validate emotions: "That sounds really frustrating"
Conflict Resolution:

Take 20-min cooling-off period if emotions high
Use "I" statements, not "You" accusations
Find the underlying need beneath positions
Brainstorm win-win solutions together
Repair quickly: Acknowledge hurt, apologize, make amends
Boundary Setting:

Be clear and specific: "I'm not comfortable with..."
Don't over-explain or justify
Enforce consistently with consequences
Allow others to have feelings about your boundaries
Social Anxiety Management:

Exposure therapy: Start with low-stakes interactions
Reframe thoughts: "They'll judge me" → "Most people are thinking about themselves"
Focus outward: Be curious about other person
Practice self-compassion: Talk to yourself like a friend
Networking:

Informational interviews: Ask for 20-min coffee, prepare questions
Follow up within 24hrs: "Great talking, here's that resource I mentioned"
Provide value first: Share article, make introduction
Stay in touch: Quarterly check-in with contacts
Sources: Marshall Rosenberg (NVC), John Gottman (relationship research), Dale Carnegie (How to Win Friends)
`,

text

  mental_health: `
MENTAL HEALTH & WELLNESS PRINCIPLES:

IMPORTANT: This is educational information. Please seek professional help (therapist, psychiatrist) for mental health concerns. National Suicide Prevention Lifeline: 988

Cognitive Behavioral Therapy (CBT) Techniques:

Thought record: Situation → Automatic Thought → Emotion → Evidence For/Against → Alternative Thought
Cognitive distortions: All-or-nothing, overgeneralization, catastrophizing, etc.
Behavioral activation: Schedule pleasant activities even when unmotivated
Mindfulness Meditation:

Start: 5 minutes daily, increase by 1 min/week
Types: Breath focus, body scan, loving-kindness
Apps: Headspace, Calm, Insight Timer (free)
Research: 8-week MBSR reduces anxiety 58%, depression 40% (Kabat-Zinn)
Stress Management:

Acute stress: Box breathing (4-count inhale, hold, exhale, hold)
Chronic stress: Regular exercise (30min, 5x/week), social connection
Identify stressors: Work, relationships, health, finances
Problem-solving: Can I control this? If yes, action plan. If no, acceptance practice.
Sleep Hygiene:

Consistent schedule: Same bedtime/wake time ±30min
7-9 hours nightly (individual variation)
No screens 1hr before bed (blue light suppresses melatonin)
Cool, dark room (60-67°F optimal)
No caffeine after 2pm (half-life 5-6 hours)
Habit Formation:

Start tiny: 2 minutes daily (meditation, pushups, reading)
Stack habits: After [existing habit], I will [new habit]
Track: Daily checkmark builds momentum (don't break the chain)
Identity: "I am a person who..." (intrinsic motivation)
Timeline: 66 days average for automaticity (range 18-254 days)
Emotional Regulation:

Name the emotion specifically (anxious vs scared vs worried)
Opposite action: Do opposite of emotional urge (DBT)
Self-soothing: 5 senses (sight, sound, touch, taste, smell)
Journaling Prompts:

Gratitude: 3 specific things daily (increases happiness 25% - Emmons research)
Reflection: What went well? What could improve? What did I learn?
Future self: Letter from 5-years-future you with advice
Sources: David Burns (Feeling Good), Jon Kabat-Zinn (MBSR), James Clear (Atomic Habits), BJ Fogg (Tiny Habits)
`,
};

text

return domainKnowledge[domain] || "";
}

/**

Build enhanced prompt with context
*/
private buildEnhancedPrompt(
goalDescription: string,
domain: string,
domainContext: string,
userContext?: any
): string {
let prompt = `I need you to create a highly specific, actionable plan for this goal:
GOAL: ${goalDescription}

DOMAIN: ${domain}

{userContext ? `USER CONTEXT: {JSON.stringify(userContext, null, 2)}
` : ""}

DOMAIN KNOWLEDGE:
${domainContext}

CRITICAL REQUIREMENTS:

Be EXTREMELY SPECIFIC - include exact numbers, timelines, resources
NO GENERIC ADVICE - every recommendation must be immediately actionable
CALCULATE EVERYTHING - use formulas and math where relevant
PROVIDE EXAMPLES - show exactly what to do
CITE SOURCES - reference credible research and experts
CREATE TIMELINE - break into weeks/days with specific milestones
ANTICIPATE OBSTACLES - identify challenges and solutions
PERSONALIZE - consider user's context and constraints
REQUIRED OUTPUT FORMAT:

Executive Summary
[2-3 sentence overview of the plan and expected outcomes]

Starting Point Assessment
[Analyze current state - what do we know? what do we need to find out?]

Specific Calculations & Targets
[All relevant numbers - calories, budget, study hours, etc.]

Detailed Action Plan
Phase 1: [Timeframe]
Week 1
 Specific action 1
 Specific action 2
[etc.]
Phase 2: [Timeframe]
[Continue...]

Daily/Weekly Routines
[Exact schedule user should follow]

Resources & Tools
[Specific books, courses, apps with links/prices]
Progress Tracking
[Specific metrics to measure weekly/monthly]

Common Obstacles & Solutions
[Anticipate what will go wrong and how to handle it]

Success Indicators
[How to know if plan is working - specific milestones]

Evidence & References
[Cite research, experts, best practices]

Next Steps (Start TODAY)
[First action to take in next 24 hours]
[Second action]
[Third action]
Remember: This plan should be SO DETAILED that the user can start immediately without any additional research.`;

text

return prompt;
}

/**

Parse AI response into structured format
*/
private parseDetailedResponse(response: string): {
plan: string;
actionItems: Array<{ task: string; deadline: string; priority: string }>;
resources: string[];
metrics: string[];
timeline: string;
} {
// Extract action items (anything with checkbox format)
const actionItems: Array<{ task: string; deadline: string; priority: string }> = [];
const actionRegex = /- [ ] (.+?)(?:\n|$)/g;
let match;
text

while ((match = actionRegex.exec(response)) !== null) {
  actionItems.push({
    task: match[1],
    deadline: "TBD", // Could extract from context
    priority: "medium",
  });
}

// Extract resources (URLs, books, apps)
const resources: string[] = [];
const resourceRegex = /(?:Resource|Tool|App|Book|Course):\s*(.+?)(?:\n|$)/gi;

while ((match = resourceRegex.exec(response)) !== null) {
  resources.push(match[1].trim());
}

// Extract metrics
const metrics: string[] = [];
const metricRegex = /(?:Track|Measure|Metric):\s*(.+?)(?:\n|$)/gi;

while ((match = metricRegex.exec(response)) !== null) {
  metrics.push(match[1].trim());
}

// Extract timeline
const timelineMatch = response.match(/Timeline:\s*(.+?)(?:\n|#)/i);
const timeline = timelineMatch ? timelineMatch[1].trim() : "See plan for details";

return {
  plan: response,
  actionItems,
  resources,
  metrics,
  timeline,
};
}

/**

Create quick clarifying questions before planning
*/
async generateClarifyingQuestions(goalDescription: string, domain: string): Promise<string[]> {
const prompt = `User wants to: ${goalDescription}
Domain: ${domain}

Generate 5-7 specific clarifying questions to gather information needed for an effective, personalized plan.

Questions should cover:

Current state and starting point
Available resources (time, money, equipment, support)
Constraints and limitations
Preferences and past experience
Specific targets and timeline
Format: Return ONLY the questions, one per line, starting with "-"`;

text

const message = await this.anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 500,
  messages: [{ role: "user", content: prompt }],
});

const responseText = message.content[0].type === "text" ? message.content[0].text : "";

return responseText
  .split("\n")
  .filter((line) => line.trim().startsWith("-"))
  .map((line) => line.replace(/^-\s*/, "").trim());
}
}

// Export singleton instance
export const enhancedPlanner = new EnhancedAIPlanner();
</content>
</write_file>

Now let's update the API route to use the enhanced planner:

<write_file>
<path>src/app/api/ai/plan/enhanced/route.ts</path>
<content>import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { enhancedPlanner } from "@/lib/ai/enhanced-planner";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
try {
const { userId } = await auth();

text

if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const body = await req.json();
const { goalDescription, domain, userContext, mode } = body;

if (!goalDescription || !domain) {
  return NextResponse.json(
    { error: "Goal description and domain are required" },
    { status: 400 }
  );
}

// Mode: "questions" or "plan"
if (mode === "questions") {
  // Generate clarifying questions first
  const questions = await enhancedPlanner.generateClarifyingQuestions(
    goalDescription,
    domain
  );

  return NextResponse.json({ questions });
}

// Create detailed plan
const plan = await enhancedPlanner.createDetailedPlan(
  goalDescription,
  domain,
  userContext
);

// Save plan to database
const savedPlan = await db.goal.create({
  data: {
    userId,
    title: goalDescription,
    category: domain,
    description: plan.plan,
    status: "active",
    priority: "high",
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days default
  },
});

// Create action items as sub-tasks
if (plan.actionItems.length > 0) {
  await db.subTask.createMany({
    data: plan.actionItems.slice(0, 10).map((item, index) => ({
      goalId: savedPlan.id,
      title: item.task,
      description: item.task,
      completed: false,
      order: index,
    })),
  });
}

return NextResponse.json({
  success: true,
  plan,
  goalId: savedPlan.id,
});
} catch (error) {
console.error("Enhanced planning error:", error);
return NextResponse.json(
{ error: "Failed to create plan. Please try again." },
{ status: 500 }
);
}
}
</content>
</write_file>

Now let's create an enhanced AI orchestrator:

<write_file>
<path>src/lib/ai/enhanced-orchestrator.ts</path>
<content>import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/db";

/**

Enhanced AI Orchestrator with multi-agent capabilities
Analyzes user's entire goal ecosystem and provides holistic guidance
*/
export class EnhancedAIOrchestrator {
private anthropic: Anthropic;
constructor() {
this.anthropic = new Anthropic({
apiKey: process.env.ANTHROPIC_API_KEY!,
});
}

/**

Orchestrate daily priorities across all goals
*/
async orchestrateDailyPriorities(userId: string, userMessage?: string) {
// Fetch all user's active goals
const goals = await db.goal.findMany({
where: {
userId,
status: { in: ["active", "in_progress"] },
},
include: {
subTasks: true,
},
orderBy: {
priority: "desc",
},
});
text

// Fetch recent habit data
const habits = await db.habit.findMany({
  where: { userId },
  include: {
    completions: {
      where: {
        completedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      orderBy: { completedAt: "desc" },
    },
  },
});

// Build context
const context = this.buildUserContext(goals, habits);

// Create orchestration prompt
const prompt = `You are an expert life coach analyzing a user's complete goal ecosystem.
CURRENT GOALS:
${context.goalsContext}

HABIT TRACKING DATA:
${context.habitsContext}

USER MESSAGE:
${userMessage || "What should I focus on today?"}

YOUR TASK:

Analyze the user's entire situation holistically
Identify synergies between goals (e.g., workout supports both fitness and mental health)
Spot conflicts (e.g., too many evening commitments)
Determine optimal daily priorities
Provide specific, actionable recommendations for TODAY
OUTPUT FORMAT:

Today's Top Priorities
[3-5 specific actions ranked by impact, with time estimates]

[Action] (30 min) - [Why this matters across goals]
[Action] (45 min) - [Cross-goal benefit]
[Action] (20 min) - [Impact explanation]
Goal Synergies Identified
[How working on one goal benefits others]

Potential Conflicts
[Warning about overcommitment or competing priorities]

Energy Optimization
[When to do what based on typical energy levels]

High energy (morning): [Cognitively demanding tasks]
Medium energy (afternoon): [Moderate tasks]
Low energy (evening): [Easy wins, recovery]
Habit Insights
[Patterns noticed from tracking data]

Streak to maintain: [habit with longest streak]
Needs attention: [habit falling behind]
This Week's Focus
[What to emphasize over next 7 days]

Red Flags
[Any concerning patterns - overwork, neglecting self-care, etc.]

Encouragement
[Specific, personalized motivation based on their progress]

RULES:

Be SPECIFIC - exact tasks, exact times

Be REALISTIC - don't overload (max 3-4 hours productive work)

Be PERSONAL - reference their specific goals and progress

Be ENCOURAGING - celebrate wins, reframe setbacks

Be HOLISTIC - consider all life domains, not just productivity`;

const message = await this.anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 2000,
temperature: 0.8,
messages: [{ role: "user", content: prompt }],
});

const response = message.content[0].type === "text" ? message.content[0].text : "";

return {
guidance: response,
goalsSummary: {
total: goals.length,
byCategory: this.categorizeGoals(goals),
needingAttention: goals.filter((g) => {
const incompleteTasks = g.subTasks?.filter((st) => !st.completed) || [];
return incompleteTasks.length > 5; // Flag goals with many incomplete tasks
}),
},
habitsSummary: {
total: habits.length,
bestStreak: this.getBestStreak(habits),
needsAttention: habits.filter((h) => {
const recentCompletions = h.completions?.length || 0;
const expectedCompletions = this.getExpectedCompletions(h.frequency, 7); // Last week
return recentCompletions < expectedCompletions * 0.5; // Less than 50% completion
}),
},
};
}

/**

Analyze goal conflicts and provide resolution strategy
*/
async analyzeGoalConflicts(userId: string) {
const goals = await db.goal.findMany({
where: {
userId,
status: { in: ["active", "in_progress"] },
},
include: {
subTasks: true,
},
});
const prompt = `Analyze these goals for potential conflicts:

{goals.map((g, i) => ` {i + 1}. 
g
.
t
i
t
l
e
(
g.title({g.category})
Priority: ${g.priority}
Target Date: ${g.targetDate}
Tasks: ${g.subTasks?.length || 0} total, ${g.subTasks?.filter(st => !st.completed).length || 0} incomplete
`).join("\n")}

Identify:

Time conflicts (too many high-priority goals)
Resource conflicts (budget, energy, attention)
Conflicting approaches (e.g., aggressive fat loss + muscle gain)
Stress on specific life domains (e.g., all work goals, no self-care)
Provide:

Conflict severity (low/medium/high)

Specific conflicts identified

Recommended resolutions

Which goals to pause/deprioritize if needed

Optimal goal balance recommendation`;

const message = await this.anthropic.messages.create({
model: "claude-3-5-sonnet-20241022",
max_tokens: 1500,
messages: [{ role: "user", content: prompt }],
});

return message.content[0].type === "text" ? message.content[0].text : "";
}

/**

Weekly review and planning
*/
async generateWeeklyReview(userId: string) {
const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
// Get goals with progress from last week
const goals = await db.goal.findMany({
where: { userId },
include: {
subTasks: {
where: {
updatedAt: { gte: oneWeekAgo },
},
},
},
});

// Get habits completed this week
const habits = await db.habit.findMany({
where: { userId },
include: {
completions: {
where: {
completedAt: { gte: oneWeekAgo },
},
},
},
});

const prompt = `Create a comprehensive weekly review and next week plan:

LAST WEEK'S GOALS:
${goals.map(g => `

${g.title}: ${g.subTasks?.filter(st => st.completed).length || 0} tasks completed
`).join("\n")}
LAST WEEK'S HABITS:
${habits.map(h => `

${h.name}: 
h
.
c
o
m
p
l
e
t
i
o
n
s
?
.
l
e
n
g
t
h
∣
∣
0
c
o
m
p
l
e
t
i
o
n
s
(
h.completions?.length∣∣0completions({h.frequency} frequency)
`).join("\n")}
Provide:

Last Week Wins
[Specific accomplishments - be generous with celebration]

Challenges Faced
[What didn't go as planned - neutral, growth-focused tone]

Key Insights
[Patterns noticed, lessons learned]

Next Week Plan
Top 3 Goals to Advance
Habit Focus Areas
Specific Milestones to Hit
Potential Obstacles & Mitigation
Motivation Boost
[Personalized encouragement based on their journey]`;

text

const message = await this.anthropic.messages.create({
  model: "claude-3-5-sonnet-20241022",
  max_tokens: 1500,
  messages: [{ role: "user", content: prompt }],
});

return message.content[0].type === "text" ? message.content[0].text : "";
}

// Helper methods
private buildUserContext(goals: any[], habits: any[]) {
const goalsContext = goals.length > 0
? goals.map((g, i) => `
${i + 1}. 
g
.
t
i
t
l
e
(
g.title({g.category}, Priority: ${g.priority})

Target: ${g.targetDate ? new Date(g.targetDate).toLocaleDateString() : "No deadline"}
Progress: 
g
.
s
u
b
T
a
s
k
s
?
.
f
i
l
t
e
r
(
(
s
t
:
a
n
y
)
=
>
s
t
.
c
o
m
p
l
e
t
e
d
)
.
l
e
n
g
t
h
∣
∣
0
/
g.subTasks?.filter((st:any)=>st.completed).length∣∣0/{g.subTasks?.length || 0} tasks
Status: ${g.status}
`).join("\n")
: "No active goals";
text

const habitsContext = habits.length > 0
  ? habits.map((h) => {
      const recentCompletions = h.completions?.length || 0;
      const streak = this.calculateStreak(h.completions || []);
      return `
h
.
n
a
m
e
(
h.name({h.frequency})
Completions last 30 days: ${recentCompletions}
Current streak: ${streak} days
`;
}).join("\n")
: "No tracked habits";

return { goalsContext, habitsContext };
}

private categorizeGoals(goals: any[]) {
const categories: Record<string, number> = {};
goals.forEach((g) => {
categories[g.category] = (categories[g.category] || 0) + 1;
});
return categories;
}

private getBestStreak(habits: any[]) {
let best = { name: "", streak: 0 };
habits.forEach((h) => {
const streak = this.calculateStreak(h.completions || []);
if (streak > best.streak) {
best = { name: h.name, streak };
}
});
return best;
}

private calculateStreak(completions: any[]): number {
if (completions.length === 0) return 0;

const sorted = completions
.map((c) => new Date(c.completedAt))
.sort((a, b) => b.getTime() - a.getTime());

let streak = 1;
for (let i = 0; i < sorted.length - 1; i++) {
const daysDiff = Math.floor(
(sorted[i].getTime() - sorted[i + 1].getTime()) / (1000 * 60 * 60 * 24)
);
if (daysDiff === 1) {
streak++;
} else {
break;
}
}
return streak;
}

private getExpectedCompletions(frequency: string, days: number): number {
const frequencyMap: Record<string, number> = {
daily: 1,
weekly: 1 / 7,
monthly: 1 / 30,
};
return (frequencyMap[frequency] || 0) * days;
}

}

export const enhancedOrchestrator = new EnhancedAIOrchestrator();
</content>
</write_file>

Now let's create the API route for the enhanced orchestrator:

<write_file>
<path>src/app/api/ai/orchestrate/enhanced/route.ts</path>
<content>import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { enhancedOrchestrator } from "@/lib/ai/enhanced-orchestrator";

export async function POST(req: NextRequest) {
try {
const { userId } = await auth();

text

if (!userId) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const body = await req.json();
const { action, message } = body;

let result;

switch (action) {
  case "daily":
    result = await enhancedOrchestrator.orchestrateDailyPriorities(userId, message);
    break;
  
  case "conflicts":
    const conflicts = await enhancedOrchestrator.analyzeGoalConflicts(userId);
    result = { analysis: conflicts };
    break;
  
  case "weekly":
    const review = await enhancedOrchestrator.generateWeeklyReview(userId);
    result = { review };
    break;
  
  default:
    // Default to daily priorities
    result = await enhancedOrchestrator.orchestrateDailyPriorities(userId, message);
}

return NextResponse.json({
  success: true,
  ...result,
});
} catch (error) {
console.error("Enhanced orchestration error:", error);
return NextResponse.json(
{ error: "Failed to orchestrate. Please try again." },
{ status: 500 }
);
}
}
</content>
</write_file>

Now let's fix the email branding issue by creating a custom Clerk appearance configuration:

<write_file>
<path>src/lib/clerk-config.ts</path>
<content>/**

Clerk Appearance and Branding Configuration for Resurgo
*/
export const clerkAppearance = {
baseTheme: undefined,
variables: {
colorPrimary: "#000000",
colorBackground: "#ffffff",
colorText: "#000000",
colorTextSecondary: "#666666",
colorDanger: "#ef4444",
colorSuccess: "#10b981",
colorWarning: "#f59e0b",
fontFamily: "Inter, system-ui, sans-serif",
borderRadius: "0.5rem",
},
elements: {
formButtonPrimary: {
backgroundColor: "#000000",
color: "#ffffff",
"&:hover": {
backgroundColor: "#333333",
},
},
card: {
boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
},
headerTitle: {
fontWeight: "700",
},
headerSubtitle: {
color: "#666666",
},
},
};

/**

Email template customization
Note: This is configured in Clerk Dashboard -> Emails
To update email templates:
Go to https://dashboard.clerk.com
Select your application
Navigate to "Emails" in the sidebar
Customize each template (Verification, Password Reset, etc.)
Update the following in templates:
Replace "Ascend" with "Resurgo"
Update logo URL to Resurgo logo
Update colors to match brand (#000000 primary)
Update footer links to resurgo.life
Add social media links
*/
export const emailBrandingConfig = {
applicationName: "Resurgo",
supportEmail: "support@resurgo.life",
fromEmail: "noreply@resurgo.life",
logoUrl: "https://resurgo.life/logo.png", // Update with actual logo URL
brandColor: "#000000",
websiteUrl: "https://resurgo.life",
socialLinks: {
twitter: "https://twitter.com/resurgolife",
instagram: "https://instagram.com/resurgolife",
linkedin: "https://linkedin.com/company/resurgolife",
},
};

/**

Email template content suggestions
*/
export const emailTemplates = {
verification: {
subject: "Verify your Resurgo email address",
preheader: "Click the link below to verify your email and start your transformation journey",
heading: "Welcome to Resurgo",
body: `
Thank you for joining Resurgo - your partner in holistic life transformation.

Click the button below to verify your email address and unlock the full power of AI-driven goal planning, habit tracking, and personalized insights.
, buttonText: "Verify Email", footer:
Need help? Contact us at support@resurgo.life

Resurgo - Rise Again, Transform Your Life
resurgo.life
`,

},

passwordReset: {
subject: "Reset your Resurgo password",
preheader: "Click the link to securely reset your password",
heading: "Password Reset Request",
body: `
We received a request to reset your Resurgo password.

text

  Click the button below to create a new password. This link will expire in 1 hour.
  
  If you didn't request this, you can safely ignore this email.
`,
buttonText: "Reset Password",
},

magicLink: {
subject: "Sign in to Resurgo",
preheader: "Your secure sign-in link",
heading: "Sign In to Resurgo",
body: `
Click the button below to securely sign in to your Resurgo account.

text

  This link will expire in 10 minutes and can only be used once.
`,
buttonText: "Sign In",
},
};

/**

Instructions for updating Clerk email templates:
LOG INTO CLERK DASHBOARD:
https://dashboard.clerk.com
NAVIGATE TO EMAIL SETTINGS:
Select your app → Customization → Emails
UPDATE EACH EMAIL TEMPLATE:
A. Email Verification:
text

  - Subject: "Verify your Resurgo email address"
text

  - Find/Replace: "Ascend" → "Resurgo"
text

  - Update logo image URL
text

  - Update colors in HTML/CSS
text

  - Update footer links
B. Password Reset:
text

  - Subject: "Reset your Resurgo password"
text

  - Find/Replace: "Ascend" → "Resurgo"
text

  - Match branding
C. Magic Link:
text

  - Subject: "Sign in to Resurgo"
text

  - Find/Replace: "Ascend" → "Resurgo"
text

  - Match branding
TEST EMAILS:
Use "Send test email" feature in Clerk
Verify branding is correct
Check on mobile and desktop
Test in different email clients (Gmail, Outlook, etc.)
OPTIONAL - CUSTOM EMAIL DOMAIN:
Go to Email Settings → Sending Domain
Add custom domain (e.g., mail.resurgo.life)
Verify DNS records
This makes emails come from @resurgo.life instead of @clerk.dev
*/

/**

Resend email configuration (for custom transactional emails)
*/
export const resendConfig = {
from: "Resurgo noreply@resurgo.life",
replyTo: "support@resurgo.life",
templates: {
welcome: {
subject: "Welcome to Resurgo - Let's Transform Your Life",
preheader: "Your journey to holistic transformation starts now",
},

text

goalCreated: {
  subject: "Your AI-Powered Plan is Ready",
  preheader: "We've created a personalized roadmap for your goal",
},

weeklyDigest: {
  subject: "Your Week in Review - Resurgo",
  preheader: "Celebrate your wins and plan for next week",
},

milestoneAchieved: {
  subject: "🎉 Milestone Achieved!",
  preheader: "You're making incredible progress",
},
},
};
</content>
</write_file>

Now let's create Framer Motion animations throughout the app:

<write_file>
<path>src/lib/animations.ts</path>
<content>/**

Resurgo Framer Motion Animation Library
Consistent, smooth animations across the application
*/
import { Variants } from "framer-motion";

/**

Page transition animations
*/
export const pageTransition = {
initial: { opacity: 0, y: 20 },
animate: { opacity: 1, y: 0 },
exit: { opacity: 0, y: -20 },
transition: { duration: 0.3, ease: "easeInOut" },
};
export const pageSlide = {
initial: { opacity: 0, x: -20 },
animate: { opacity: 1, x: 0 },
exit: { opacity: 0, x: 20 },
transition: { duration: 0.4, ease: "easeOut" },
};

/**

Fade animations
*/
export const fadeIn = {
initial: { opacity: 0 },
animate: { opacity: 1 },
exit: { opacity: 0 },
transition: { duration: 0.2 },
};
export const fadeInUp = {
initial: { opacity: 0, y: 20 },
animate: { opacity: 1, y: 0 },
transition: { duration: 0.3 },
};

export const fadeInDown = {
initial: { opacity: 0, y: -20 },
animate: { opacity: 1, y: 0 },
transition: { duration: 0.3 },
};

/**

Scale animations
*/
export const scaleIn = {
initial: { opacity: 0, scale: 0.9 },
animate: { opacity: 1, scale: 1 },
exit: { opacity: 0, scale: 0.9 },
transition: { duration: 0.2 },
};
export const scaleOnHover = {
whileHover: { scale: 1.05 },
whileTap: { scale: 0.95 },
transition: { type: "spring", stiffness: 300, damping: 20 },
};

/**

Card animations
*/
export const cardHover = {
rest: { scale: 1, y: 0 },
hover: {
scale: 1.02,
y: -4,
transition: {
duration: 0.2,
ease: "easeOut",
},
},
};
/**

List stagger animations
*/
export const listContainer: Variants = {
hidden: { opacity: 0 },
show: {
opacity: 1,
transition: {
staggerChildren: 0.1,
},
},
};
export const listItem: Variants = {
hidden: { opacity: 0, x: -20 },
show: { opacity: 1, x: 0 },
};

/**

AI response typing animation
*/
export const typewriter = {
hidden: { opacity: 0 },
visible: (i: number = 1) => ({
opacity: 1,
transition: {
delay: i * 0.05,
duration: 0.1,
},
}),
};
/**

Progress bar animation
*/
export const progressBar = {
initial: { width: 0 },
animate: (percentage: number) => ({
width: ${percentage}%,
transition: { duration: 0.5, ease: "easeOut" },
}),
};
/**

Button press animation
*/
export const buttonPress = {
whileTap: { scale: 0.95 },
transition: { type: "spring", stiffness: 500, damping: 30 },
};
/**

Loading spinner
*/
export const spinner = {
animate: {
rotate: 360,
transition: {
duration: 1,
repeat: Infinity,
ease: "linear",
},
},
};
/**

Slide in from side
*/
export const slideInLeft = {
initial: { x: -100, opacity: 0 },
animate: { x: 0, opacity: 1 },
exit: { x: -100, opacity: 0 },
transition: { type: "spring", stiffness: 100, damping: 20 },
};
export const slideInRight = {
initial: { x: 100, opacity: 0 },
animate: { x: 0, opacity: 1 },
exit: { x: 100, opacity: 0 },
transition: { type: "spring", stiffness: 100, damping: 20 },
};

/**

Modal/Dialog animations
*/
export const modal = {
backdrop: {
initial: { opacity: 0 },
animate: { opacity: 1 },
exit: { opacity: 0 },
},
content: {
initial: { scale: 0.9, opacity: 0, y: 20 },
animate: { scale: 1, opacity: 1, y: 0 },
exit: { scale: 0.9, opacity: 0, y: 20 },
transition: { type: "spring", damping: 25, stiffness: 300 },
},
};
/**

Notification toast
*/
export const toast = {
initial: { opacity: 0, y: -50, scale: 0.3 },
animate: { opacity: 1, y: 0, scale: 1 },
exit: { opacity: 0, scale: 0.5, transition: { duration: 0.2 } },
transition: { type: "spring", damping: 20, stiffness: 300 },
};
/**

Collapse/Expand animation
*/
export const collapse = {
collapsed: { height: 0, opacity: 0 },
expanded: { height: "auto", opacity: 1 },
transition: { duration: 0.3, ease: "easeInOut" },
};
/**

Checkbox check animation
*/
export const checkboxCheck = {
initial: { pathLength: 0, opacity: 0 },
animate: { pathLength: 1, opacity: 1 },
transition: { duration: 0.3, ease: "easeOut" },
};
/**

Number counter animation
*/
export const counterAnimation = (from: number, to: number) => ({
animate: {
value: to,
transition: { duration: 1, ease: "easeOut" },
},
initial: { value: from },
});
/**

Pulse animation (for attention)
*/
export const pulse = {
animate: {
scale: [1, 1.05, 1],
transition: {
duration: 2,
repeat: Infinity,
ease: "easeInOut",
},
},
};
/**

Shake animation (for errors)
*/
export const shake = {
animate: {
x: [0, -10, 10, -10, 10, 0],
transition: { duration: 0.5 },
},
};
/**

Bouncing animation
*/
export const bounce = {
animate: {
y: [0, -20, 0],
transition: {
duration: 0.6,
repeat: Infinity,
ease: "easeInOut",
},
},
};
/**

Confetti celebration animation
*/
export const celebrate = {
initial: { scale: 0, rotate: 0 },
animate: {
scale: [0, 1.2, 1],
rotate: [0, 360],
transition: {
duration: 0.6,
ease: "easeOut",
},
},
};
/**

Skeleton loading animation
*/
export const skeleton = {
animate: {
opacity: [0.5, 1, 0.5],
transition: {
duration: 1.5,
repeat: Infinity,
ease: "easeInOut",
},
},
};
/**

Drag constraints (for draggable elements)
*/
export const dragConstraints = {
top: 0,
left: 0,
right: 0,
bottom: 0,
};
/**

Spring configurations
*/
export const springs = {
gentle: { type: "spring" as const, stiffness: 100, damping: 15 },
bouncy: { type: "spring" as const, stiffness: 300, damping: 20 },
stiff: { type: "spring" as const, stiffness: 500, damping: 30 },
slow: { type: "spring" as const, stiffness: 50, damping: 20 },
};
/**

Easing functions
*/
export const easings = {
easeOutCubic: [0.33, 1, 0.68, 1],
easeInOutCubic: [0.65, 0, 0.35, 1],
easeOutExpo: [0.16, 1, 0.3, 1],
easeInOutExpo: [0.87, 0, 0.13, 1],
}; </content>
</write_file>

Now let's create animated components using these animations:

<write_file>
<path>src/components/animated/AnimatedPage.tsx</path>
<content>"use client";

import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedPageProps {
children: ReactNode;
className?: string;
}

export function AnimatedPage({ children, className = "" }: AnimatedPageProps) {
return (
<motion.div
initial={pageTransition.initial}
animate={pageTransition.animate}
exit={pageTransition.exit}
transition={pageTransition.transition}
className={className}
>
{children}
</motion.div>
);
}
</content>
</write_file>

<write_file>
<path>src/components/animated/AnimatedCard.tsx</path>
<content>"use client";

import { motion } from "framer-motion";
import { cardHover, scaleIn } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedCardProps {
children: ReactNode;
className?: string;
onClick?: () => void;
enableHover?: boolean;
}

export function AnimatedCard({
children,
className = "",
onClick,
enableHover = true,
}: AnimatedCardProps) {
return (
<motion.div
initial={scaleIn.initial}
animate={scaleIn.animate}
variants={enableHover ? cardHover : undefined}
whileHover={enableHover ? "hover" : undefined}
onClick={onClick}
className={${className} ${onClick ? "cursor-pointer" : ""}}
>
{children}
</motion.div>
);
}
</content>
</write_file>

<write_file>
<path>src/components/animated/AnimatedList.tsx</path>
<content>"use client";

import { motion } from "framer-motion";
import { listContainer, listItem } from "@/lib/animations";
import { ReactNode } from "react";

interface AnimatedListProps {
children: ReactNode;
className?: string;
}

export function AnimatedList({ children, className = "" }: AnimatedListProps) {
return (
<motion.div
variants={listContainer}
initial="hidden"
animate="show"
className={className}
>
{children}
</motion.div>
);
}

interface AnimatedListItemProps {
children: ReactNode;
className?: string;
}

export function AnimatedListItem({ children, className = "" }: AnimatedListItemProps) {
return (
<motion.div
variants={listItem}
className={className}
>
{children}
</motion.div>
);
}
</content>
</write_file>

Now let's update the bundle analyzer configuration:

<write_file>
<path>next.config.enhanced.js</path>
<content>const withBundleAnalyzer = require('@next/bundle-analyzer')({
enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
output: "export",
images: {
unoptimized: true,
},

// Performance optimizations
swcMinify: true,

// Strict mode for better error catching
reactStrictMode: true,

// Experimental features for better performance
experimental: {
optimizeCss: true,
},

// Webpack optimizations
webpack: (config, { dev, isServer }) => {
// Production optimizations
if (!dev && !isServer) {
config.optimization = {
...config.optimization,
moduleIds: 'deterministic',
splitChunks: {
chunks: 'all',
cacheGroups: {
default: false,
vendors: false,
// Vendor chunk for node_modules
vendor: {
name: 'vendor',
chunks: 'all',
test: /node_modules/,
priority: 20,
},
// Common chunk for shared code
common: {
name: 'common',
minChunks: 2,
chunks: 'all',
priority: 10,
reuseExistingChunk: true,
enforce: true,
},
// Framework chunk (React, Next.js)
framework: {
chunks: 'all',
name: 'framework',
test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/, priority: 40, enforce: true, }, // Lib chunk for other libraries lib: { test(module) { return ( module.size() > 160000 &&
/node_modules[/\]/.test(module.identifier())
);
},
name(module) {
const hash = crypto.createHash('sha1');
hash.update(module.identifier());
return hash.digest('hex').substring(0, 8);
},
priority: 30,
minChunks: 1,
reuseExistingChunk: true,
},
},
},
};
}

text

return config;
},

// Headers for caching
async headers() {
return [
{
source: '/:all*(svg|jpg|png|webp|gif|ico)',
headers: [
{
key: 'Cache-Control',
value: 'public, max-age=31536000, immutable',
},
],
},
{
source: '/_next/static/:path*',
headers: [
{
key: 'Cache-Control',
value: 'public, max-age=31536000, immutable',
},
],
},
];
},
};

module.exports = withBundleAnalyzer(nextConfig);
</content>
</write_file>

Now let's create instructions and scripts for APK generation:

<write_file>
<path>APK_BUILD_GUIDE.md</path>
<content># Resurgo Android APK Build Guide

Prerequisites
Install Android Studio

Download from: https://developer.android.com/studio
Install Android SDK (API 33 or higher)
Configure ANDROID_HOME environment variable
Install Java JDK

Download JDK 17: https://www.oracle.com/java/technologies/downloads/
Set JAVA_HOME environment variable
Install Capacitor CLI

Bash

npm install -g @capacitor/cli
Build Process
Step 1: Build Web Assets
Bash

# Install dependencies
npm install

# Build for production
npm run build
Step 2: Sync with Capacitor
Bash

# Sync web assets to native project
npx cap sync android
Step 3: Configure App Details
Update capacitor.config.ts:

TypeScript

{
  appId: 'life.resurgo.app',
  appName: 'Resurgo',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: 'keystore.jks',
      keystorePassword: process.env.KEYSTORE_PASSWORD,
      keystoreAlias: 'resurgo',
      keystoreAliasPassword: process.env.KEY_PASSWORD,
    }
  }
}
Step 4: Generate Keystore (First Time Only)
Bash

keytool -genkey -v -keystore keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias resurgo
IMPORTANT: Save the passwords securely! You'll need them for every release.

Step 5: Update App Icons and Splash Screens
Generate Icons (use https://icon.kitchen or similar):

Create 1024x1024 icon
Place in android/app/src/main/res/ folders:
mipmap-mdpi (48x48)
mipmap-hdpi (72x72)
mipmap-xhdpi (96x96)
mipmap-xxhdpi (144x144)
mipmap-xxxhdpi (192x192)
Create Splash Screen:

Place in android/app/src/main/res/drawable/splash.png
Recommended size: 2732x2732
Step 6: Update App Metadata
android/app/src/main/AndroidManifest.xml:

XML

<manifest>
  <application
    android:label="Resurgo"
    android:icon="@mipmap/ic_launcher"
    android:roundIcon="@mipmap/ic_launcher_round"
    android:theme="@style/AppTheme">
    
    <!-- Set splash screen -->
    <activity
      android:name=".MainActivity"
      android:label="@string/title_activity_main"
      android:theme="@style/AppTheme.NoActionBarLaunch">
    </activity>
  </application>
</manifest>
android/app/src/main/res/values/strings.xml:

XML

<resources>
  <string name="app_name">Resurgo</string>
  <string name="title_activity_main">Resurgo - Transform Your Life</string>
  <string name="package_name">life.resurgo.app</string>
</resources>
Step 7: Build APK
Debug Build (for testing):

Bash

cd android
./gradlew assembleDebug
Output: android/app/build/outputs/apk/debug/app-debug.apk

Release Build (for production):

Bash

cd android
./gradlew assembleRelease
Output: android/app/build/outputs/apk/release/app-release.apk

Step 8: Build AAB (for Play Store)
Bash

cd android
./gradlew bundleRelease
Output: android/app/build/outputs/bundle/release/app-release.aab

Testing
Install APK on Device
Bash

# Via ADB
adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or drag and drop APK to emulator
Test Checklist
 App installs successfully
 Splash screen displays correctly
 App icon appears in launcher
 All features work (auth, goals, habits, etc.)
 No crashes on different Android versions
 Performance is smooth (60fps)
 Network requests work
 Local storage/database works
 Permissions are properly requested
 Offline mode works (if applicable)
Optimization
Reduce APK Size
Enable Proguard (in android/app/build.gradle):
gradle

buildTypes {
    release {
        minifyEnabled true
        shrinkResources true
        proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
    }
}
Use App Bundles (AAB instead of APK):

Smaller download size
Dynamic delivery
Required for Play Store
Optimize Images:

Use WebP format
Compress all assets
Remove unused resources
Performance Optimization
Enable Hermes (faster JS engine):
Already enabled in React Native / Capacitor

Split APKs by ABI:

gradle

splits {
    abi {
        enable true
        reset()
        include 'armeabi-v7a', 'arm64-v8a', 'x86', 'x86_64'
        universalApk true
    }
}
Distribution
Option 1: Direct Distribution (APK)
Send APK file directly to users
Users need to enable "Install from Unknown Sources"
Good for beta testing
Option 2: Google Play Store (AAB)
Create Developer Account:

Go to https://play.google.com/console
Pay one-time $25 fee
Prepare Store Listing:

App name: Resurgo
Short description (80 chars)
Full description (4000 chars) - see marketing copy below
Screenshots (at least 2)
Feature graphic (1024x500)
App icon (512x512)
Upload AAB:

Create new release
Upload app-release.aab
Set version code and name
Add release notes
Complete Content Rating:

Answer questionnaire
Get IARC rating
Set Pricing:

Free or Paid
Countries available
Submit for Review:

Usually takes 1-3 days
Automated Build Script
Create build-android.sh:

Bash

#!/bin/bash

echo "🚀 Building Resurgo for Android..."

# Build web assets
echo "📦 Building web assets..."
npm run build

# Sync with Capacitor
echo "🔄 Syncing with Capacitor..."
npx cap sync android

# Build release AAB
echo "🏗️ Building release bundle..."
cd android
./gradlew bundleRelease

# Build release APK
echo "📱 Building release APK..."
./gradlew assembleRelease

cd ..

echo "✅ Build complete!"
echo "📍 APK: android/app/build/outputs/apk/release/app-release.apk"
echo "📍 AAB: android/app/build/outputs/bundle/release/app-release.aab"
Make executable:

Bash

chmod +x build-android.sh
Run:

Bash

./build-android.sh
Versioning
Update version in package.json:

JSON

{
  "version": "1.0.0"
}
Update Android version in android/app/build.gradle:

gradle

android {
    defaultConfig {
        versionCode 1  // Integer, increment for each release
        versionName "1.0.0"  // String, user-facing version
    }
}
Troubleshooting
Build Failed
Check Java version: java -version (need JDK 17)
Check Gradle version in android/gradle/wrapper/gradle-wrapper.properties
Clean build: cd android && ./gradlew clean
APK Won't Install
Check if already installed (uninstall first)
Enable "Unknown Sources" in device settings
Check Android version compatibility
App Crashes
Check logs: adb logcat
Enable USB debugging
Look for React Native red screen errors
Performance Issues
Enable Proguard
Optimize images
Remove unused dependencies
Use production build (not debug)
Continuous Integration
GitHub Actions Example
.github/workflows/android-build.yml:

YAML

name: Android Build

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          distribution: 'temurin'
          java-version: '17'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build web assets
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease
      
      - name: Upload AAB
        uses: actions/upload-artifact@v3
        with:
          name: app-release
          path: android/app/build/outputs/bundle/release/app-release.aab
Next Steps
After successful build:

✅ Test on multiple devices
✅ Get beta testers feedback
✅ Prepare Play Store assets
✅ Submit to Play Store
✅ Set up crash reporting (Firebase Crashlytics)
✅ Set up analytics (Firebase Analytics / Mixpanel)
✅ Plan marketing campaign
✅ Prepare customer support channels </content>
</write_file>

Now let's create the comprehensive marketing copy for the app:

<write_file>
<path>APP_STORE_MARKETING.md</path>
<content># Resurgo - App Store Marketing Copy

App Name
Resurgo - Transform Your Life

Subtitle (30 characters)
AI-Powered Life Management

Short Description (80 characters)
Achieve your goals with personalized AI planning, habits, and holistic tracking

Full Description (4000 characters max)
Transform every area of your life with Resurgo - the intelligent life management platform that combines cutting-edge AI with evidence-based methodologies to help you achieve your goals across fitness, career, finance, relationships, and mental health.

Why Resurgo?

Unlike generic to-do apps, Resurgo understands that life is interconnected. Our AI doesn't just give you templates—it creates personalized, actionable plans based on YOUR unique situation, resources, and goals.

🎯 Personalized AI Planning

Get specific, evidence-based plans—not generic advice:
• Detailed nutrition and workout programs (with exact calories, macros, exercises)
• Career transition roadmaps (month-by-month learning paths)
• Financial strategies (specific budgets, investment allocations)
• Relationship improvement frameworks (with conversation scripts)
• Mental wellness practices (daily routines with scientific backing)

Example: Instead of "eat healthier," you get: "Consume 2,200 calories daily (165g protein, 245g carbs, 70g fat). Sample meal: 200g chicken breast, 1 cup rice, steamed broccoli."

📊 Holistic Goal Tracking

Manage multiple life domains in one place:
• Fitness & Nutrition
• Career & Skills
• Financial Wellness
• Relationships & Social
• Mental Health & Mindfulness

See how progress in one area benefits others. Your morning workout boosts both fitness AND mental health goals.

✅ Intelligent Habit Formation

Build lasting habits with science-backed strategies:
• Daily tracking with streak counters
• Smart reminders based on your schedule
• Progress analytics and insights
• Celebrate milestones automatically
• Atomic Habits methodology built-in

🤖 AI Orchestrator

Get daily guidance on what to prioritize:
• Analyzes all your goals holistically
• Identifies synergies and conflicts
• Suggests optimal daily schedule
• Prevents burnout and overwhelm
• Adapts to your progress and feedback

📈 Beautiful Analytics

Visualize your transformation:
• Progress charts and trends
• Streak calendars
• Goal completion rates
• Multi-domain health scores
• Weekly and monthly reviews

🔒 Privacy-First

Your data stays yours:
• End-to-end encryption
• No data selling
• Local-first architecture
• Optional cloud backup
• Delete anytime

🌟 Evidence-Based Approach

Every recommendation is backed by research:
• Fitness: Renaissance Periodization, Stronger by Science
• Finance: Bogleheads, FIRE movement
• Habits: Atomic Habits, Tiny Habits
• Mental Health: CBT, MBSR mindfulness
• Career: Deliberate practice research

Perfect For:

✓ Professionals seeking work-life balance
✓ Fitness enthusiasts tracking multiple goals
✓ Anyone wanting systematic self-improvement
✓ People who value data-driven decisions
✓ Those tired of generic productivity apps

What Makes Resurgo Different:

❌ Other apps: "Create a workout plan"
✅ Resurgo: "Based on your 155lb bodyweight and intermediate experience, follow this 4-day upper/lower split: Monday - Bench Press 3x8 at 135lbs, Rows 3x10 at 115lbs..."

❌ Other apps: "Save more money"
✅ Resurgo: "With your $4,500 monthly income and $3,200 expenses, save $800/month. Allocate $500 to Roth IRA (VTSAX), $300 to emergency fund (Marcus HYSA at 4.5% APY)..."

Success Stories:

"Resurgo helped me gain 15 lbs of muscle with a plan so detailed I never had to think—just execute." - Alex M.

"Transitioned from marketing to software engineering in 8 months following Resurgo's roadmap." - Sarah K.

"Finally have all my goals in one place. The AI keeps me from overcommitting." - James R.

Features at a Glance:

• Unlimited goals and habits
• AI-powered planning (GPT-4 & Claude)
• Daily orchestration and prioritization
• Progress tracking and analytics
• Customizable categories
• Dark mode
• Offline access
• Cross-device sync
• Email reports
• Export your data

Get Started:

Download Resurgo
Tell us your goal
Answer a few questions
Get your personalized plan
Start your transformation TODAY
Resurgo (Latin: "I rise again")

Rise above generic advice. Rise above one-size-fits-all. Rise to become the best version of yourself—across every dimension of life.

Transform holistically. Live intentionally. Achieve systematically.

Download Resurgo and start your journey now.

Subscription Info:
Free tier includes 3 active goals, basic habits, and limited AI usage.
Premium unlocks unlimited goals, advanced AI, weekly reviews, and priority support.

Contact:
support@resurgo.life
resurgo.life

Follow Us:
@resurgolife on Twitter, Instagram, LinkedIn

Keywords (100 characters)
goal tracker, habit tracker, AI planner, life management, productivity, fitness, finance, self improvement

Promotional Text (170 characters)
🎉 Launch Special: 50% off Premium for life! Transform your fitness, career, finances, and wellness with AI-powered planning. Download now and get your personalized roadmap.

What's New (In-App Updates)
Version 1.0.0
Welcome to Resurgo! 🎉

NEW FEATURES:
• Enhanced AI Planning - Get incredibly specific, actionable plans
• Multi-Domain Tracking - Fitness, career, finance, relationships, mental health
• Daily Orchestrator - AI analyzes your goals and tells you what to prioritize
• Beautiful Analytics - Visualize your progress across all life areas
• Habit Streaks - Build lasting habits with smart tracking

IMPROVEMENTS:
• Faster response times
• Smoother animations
• Better mobile experience
• Dark mode optimization

Your transformation starts now. Let's rise together.

Screenshots (Required: Minimum 2, Recommended 8)
Screenshot 1: Home Dashboard
Caption: "Your holistic life dashboard - all goals at a glance"
Shows: Clean dashboard with goal cards across different categories, progress rings, habit streaks

Screenshot 2: AI Planning
Caption: "Get incredibly detailed, personalized plans - not generic templates"
Shows: AI chat interface with specific plan (calorie calculations, workout program, timelines)

Screenshot 3: Daily Orchestrator
Caption: "AI tells you exactly what to focus on today"
Shows: Today's priorities list with time estimates and cross-goal benefits highlighted

Screenshot 4: Goal Details
Caption: "Track every aspect of your goals with beautiful analytics"
Shows: Goal detail page with progress chart, milestones, sub-tasks, notes

Screenshot 5: Habit Tracker
Caption: "Build lasting habits with smart tracking and insights"
Shows: Habit calendar with streaks, completion rates, best performing habits

Screenshot 6: Analytics
Caption: "Visualize your transformation across all life domains"
Shows: Charts showing progress over time, category breakdown, achievements

Screenshot 7: Weekly Review
Caption: "AI-powered weekly reviews celebrate wins and plan ahead"
Shows: Weekly review interface with accomplishments, challenges, next week plan

Screenshot 8: Dark Mode
Caption: "Beautiful dark mode for late-night planning"
Shows: App in dark mode with elegant black/gray color scheme

Feature Graphic (1024x500)
Text Overlay:
"Transform Your Life
Holistically"

Subtext:
"AI-Powered Planning • Multi-Domain Tracking • Evidence-Based"

Visual Elements:

Clean, modern design
Resurgo logo
Abstract visualization of life domains connected
Dark gradient background with accent colors
App Icon (512x512)
Design:

Simple, recognizable
Black background
White/gray "R" lettermark
Modern, clean font
Slight gradient or texture for depth
Variations:

Standard icon
Rounded icon (for certain launchers)
Adaptive icon (foreground + background layers)
Video Preview (Optional but Recommended, 30 seconds)
Script:

[0-5s] "Tired of generic advice that doesn't fit YOUR life?"

[5-10s] Show competitor apps giving template responses

[10-15s] "Meet Resurgo. AI that understands YOU."

[15-20s] Show AI generating specific plan with numbers, timelines, exact steps

[20-25s] Show user making progress, checking off goals, building streaks

[25-30s] "Transform holistically. Download Resurgo. Free to start."

Press Kit
Company Description
Resurgo is a holistic life management platform that uses advanced AI to help users achieve transformation across multiple life domains. Unlike generic productivity apps, Resurgo provides evidence-based, highly personalized planning and tracking for fitness, career, finance, relationships, and mental health—all in one elegant application.

Mission Statement
Resurgo's mission is to empower individuals to rise above generic, one-size-fits-all advice and achieve systematic, holistic transformation through intelligent, personalized guidance backed by science.

Founder Story
[To be filled with actual founder background]

Media Assets
Available at: resurgo.life/press

High-resolution app icon
Screenshots in multiple languages
Video demo
Logo files (SVG, PNG in various sizes)
Brand guidelines
Product images
Contact
Press: press@resurgo.life
General: hello@resurgo.life
Support: support@resurgo.life

Social Media
Twitter: @resurgolife
Instagram: @resurgolife
LinkedIn: linkedin.com/company/resurgolife
Website: resurgo.life

Launch Strategy
Pre-Launch (2 weeks before)
Build Landing Page

Capture emails for early access
Show key features and benefits
Include video demo
Add press kit link
Create Social Media Presence

Post transformation tips
Share evidence-based fitness/finance/productivity content
Build audience before launch
Reach Out to Influencers

Productivity YouTubers
Fitness influencers
Personal finance bloggers
Self-improvement podcasters
Submit to Directories

Product Hunt (schedule launch)
BetaList
AlternativeTo
Capterra
Launch Day
Product Hunt Launch

Post at 12:01am PST
Engage with comments
Ask friends for upvotes/reviews
Social Media Blitz

Announce on all platforms
Share success stories
Offer launch discount
Email List

Send to waitlist
Highlight special launch offer
Press Release

Send to tech blogs
Productivity publications
App review sites
Post-Launch (First Month)
Gather Feedback

In-app surveys
Email users for testimonials
Monitor reviews closely
Content Marketing

Blog posts on goal setting, habit formation
YouTube tutorials
Success story case studies
Paid Advertising (if budget allows)

Facebook/Instagram ads targeting self-improvement audience
Google ads for "goal tracker app", "AI planner"
Reddit ads in r/productivity, r/fitness, etc.
Community Building

Create Discord/Slack community
Weekly challenges
User showcase
Growth Tactics
Referral Program

Give 1 month free Premium for each referral
Referee gets 50% off first month
Content SEO

Write guides on achieving specific goals
Rank for "how to gain muscle", "how to change careers", etc.
Link back to app
Partnerships

Integrate with fitness trackers (Fitbit, Apple Health)
Partner with finance apps (Mint, YNAB)
Collaborate with productivity tools
User-Generated Content

Encourage users to share progress
Create hashtag #ResurgoRising
Feature user stories in app
Monetization Strategy
Free Tier
3 active goals
Unlimited habits
Basic AI planning (5 requests/month)
Progress tracking
Mobile app access
Premium ($9.99/month or $79.99/year)
Unlimited goals
Advanced AI planning (unlimited requests)
Daily AI orchestration
Weekly AI reviews
Advanced analytics
Priority support
Export data
No ads
Lifetime ($199 one-time)
All Premium features forever
Early access to new features
Founding member badge
Input on roadmap
Support Resources
FAQ
Q: How is Resurgo different from other goal trackers?
A: Resurgo provides incredibly specific, personalized plans instead of generic templates. Our AI calculates exact numbers, creates detailed timelines, and references scientific evidence.

Q: Is my data private?
A: Yes. We use end-to-end encryption and never sell your data. You can export or delete everything anytime.

Q: What if I don't like the AI's plan?
A: You can always customize it! The AI provides a starting point based on best practices, but you have full control.

Q: Does it work offline?
A: Yes. Most features work offline. AI planning requires internet, but tracking and viewing plans work offline.

Q: Can I cancel anytime?
A: Yes. No long-term commitments. Cancel anytime from your account settings.

Q: What if I need help?
A: We have in-app chat support, email support (support@resurgo.life), and extensive documentation at resurgo.life/help.

Legal
Privacy Policy
Link: resurgo.life/privacy

Terms of Service
Link: resurgo.life/terms

Age Rating
Minimum age: 13 years old
Content rating: Everyone
No explicit content, violence, or in-app purchases of real-world items
This comprehensive marketing package positions Resurgo as the premium, intelligent solution for anyone serious about holistic self-improvement.
</content>
</write_file>

Finally, let me create a master checklist document pulling everything together:

<write_file>
<path>MASTER_COMPLETION_CHECKLIST.md</path>
<content># Resurgo.life - Master Completion Checklist

🎯 Overview
This document tracks ALL incomplete tasks, enhancements, and features for Resurgo.life. Check off items as they're completed.

Last Updated: [Current Date]
Priority Legend: 🔴 Critical | 🟡 High | 🟢 Medium | 🔵 Low

🔴 CRITICAL - DO FIRST
Email System
 Update Clerk email templates to show "Resurgo" instead of "Ascend"
 Verification email template
 Password reset template
 Magic link template
 Welcome email template
 Configure custom email domain (mail.resurgo.life)
 Test email delivery (Gmail, Outlook, Apple Mail)
 Add email logging/monitoring with Resend
 Create email delivery dashboard
 Verify emails aren't going to spam
AI Enhancement
 Deploy enhanced AI planner (src/lib/ai/enhanced-planner.ts)
 Deploy enhanced AI orchestrator (src/lib/ai/enhanced-orchestrator.ts)
 Create API routes for enhanced AI
 /api/ai/plan/enhanced
 /api/ai/orchestrate/enhanced
 Test with real goals (fitness, career, finance, etc.)
 Verify AI gives specific numbers, not generic advice
 Add clarifying questions flow before planning
 Implement domain-specific knowledge bases
MCP Server Integration
 Run bash mcp-setup.sh to install all MCP servers
 Configure Brave Search MCP for research
 Configure Memory MCP for context persistence
 Configure Time MCP for scheduling
 Configure PostgreSQL MCP for analytics
 Test MCP integrations with AI planner
🟡 HIGH PRIORITY
Framer Motion Animations
 Install framer-motion: npm install framer-motion
 Update all page components to use <AnimatedPage>
 Update card components to use <AnimatedCard>
 Update lists to use <AnimatedList> and <AnimatedListItem>
 Add page transition animations
 Add AI response typewriter effect
 Add progress bar animations
 Add button press animations
 Add modal/dialog animations
 Add toast notification animations
 Test animations on mobile (60fps requirement)
Mobile App (APK)
 Update capacitor.config.ts with final configuration
 Generate app icons (all required sizes)
 48x48 (mdpi)
 72x72 (hdpi)
 96x96 (xhdpi)
 144x144 (xxhdpi)
 192x192 (xxxhdpi)
 512x512 (Play Store)
 Create splash screen (2732x2732)
 Update AndroidManifest.xml with final metadata
 Generate release keystore
 Build debug APK and test
 Build release APK
 Build AAB for Play Store
 Test on multiple Android versions (8, 9, 10, 11, 12, 13)
 Test on different screen sizes
 Optimize APK size (target: <25MB)
 Set up crash reporting (Firebase)
 Set up analytics (Firebase/Mixpanel)
App Store Marketing
 Write final app description (proofread)
 Create 8 screenshots (see APP_STORE_MARKETING.md)
 Design feature graphic (1024x500)
 Create promotional video (30 seconds)
 Write release notes for v1.0.0
 Prepare press kit
 Set up social media accounts
 Twitter @resurgolife
 Instagram @resurgolife
 LinkedIn company page
 Create landing page (resurgo.life)
 Set up email collection for waitlist
Bundle Optimization
 Install bundle analyzer: npm install --save-dev @next/bundle-analyzer
 Update next.config.js with enhanced configuration
 Run analysis: ANALYZE=true npm run build
 Identify largest bundles
 Implement code splitting for heavy components
 Lazy load non-critical components
 Optimize images (WebP format)
 Remove unused dependencies
 Tree-shake unused code
 Target: Main bundle <500KB, total <2MB
🟢 MEDIUM PRIORITY
Sidebar Configuration
 Review previous conversation for sidebar requirements
 Implement collapsible sections
 Add quick action buttons
 Add context-aware menu items
 Add customization options (user can reorder)
 Add keyboard shortcuts
 Add search functionality
 Make mobile-responsive
Database & Backend
 Add indexes for frequently queried fields
 Implement database backup strategy
 Set up automated backups (daily)
 Add data migration scripts
 Implement soft delete for user data
 Add audit logs for sensitive operations
 Optimize slow queries (use Prisma query analyzer)
 Add database connection pooling
Testing
 Set up Jest for unit tests
 Set up Playwright for E2E tests
 Write tests for AI planner
 Write tests for AI orchestrator
 Write tests for goal CRUD operations
 Write tests for habit tracking
 Write tests for user authentication
 Set up CI/CD pipeline (GitHub Actions)
 Automate tests on PR
 Set up test coverage reporting (target: >80%)
Documentation
 Update README.md with current state
 Create API documentation
 Create component documentation (Storybook?)
 Write user guide
 Create video tutorials
 Document deployment process
 Create troubleshooting guide
 Write contribution guidelines
🔵 LOW PRIORITY / FUTURE ENHANCEMENTS
Features
 Social features (share goals, follow friends)
 Team/group goals
 Goal templates marketplace
 Integration with wearables (Fitbit, Apple Watch)
 Voice input for quick logging
 Calendar integration (Google Calendar, Outlook)
 Gamification (achievements, badges, levels)
 Custom themes
 Multi-language support
 Accessibility improvements (WCAG 2.1 AA)
AI Enhancements
 Voice AI assistant
 Image recognition for food logging
 Predictive analytics (forecast goal completion)
 Personalized motivation messages
 Automated habit suggestions based on patterns
 Integration with research papers (arXiv, PubMed)
 Multi-agent AI system (specialized agents per domain)
Integrations
 Zapier integration
 IFTTT integration
 Apple Health
 Google Fit
 MyFitnessPal
 Mint/YNAB (finance)
 Todoist/Notion (productivity)
 Strava (fitness)
Platform Expansion
 iOS app (React Native or native Swift)
 Desktop app (Electron or Tauri)
 Browser extension (Chrome, Firefox)
 Wear OS app
 Apple Watch app
 Smart display app (Alexa, Google Home)
📋 PHASE-BY-PHASE EXECUTION PLAN
Phase 1: Critical Fixes (Week 1)
Goal: Fix broken/incomplete core features

Day 1-2: Email System

Log into Clerk Dashboard
Navigate to Customization → Emails
Update all templates (Verification, Password Reset, Magic Link)
Replace "Ascend" with "Resurgo"
Update logo URLs
Test email delivery
Add Resend logging
Document email configuration
Day 3-4: AI Enhancement - Infrastructure

Run bash mcp-setup.sh
Verify all MCP servers installed
Test Brave Search MCP (make a test query)
Test Memory MCP (store and retrieve data)
Deploy enhanced AI planner code
Deploy enhanced orchestrator code
Create API routes
Day 5-7: AI Enhancement - Testing & Refinement

Test fitness goal planning (e.g., "gain 15 lbs muscle")
Verify AI provides specific numbers (calories, macros, exercises)
Test career goal (e.g., "learn web development")
Verify AI provides month-by-month roadmap
Test financial goal (e.g., "save $10k")
Verify AI provides budget breakdown
Refine prompts based on output quality
Add more domain-specific knowledge if needed
Phase 2: UI/UX Polish (Week 2)
Goal: Make the app beautiful and delightful to use

Day 1-2: Framer Motion

Install dependencies
Import animation library in all pages
Wrap pages in AnimatedPage
Update cards to AnimatedCard
Add list animations
Add AI response animations
Test performance (use Chrome DevTools)
Adjust animation durations for feel
Day 3-4: Sidebar Enhancement

Review previous requirements from conversation history
Design new sidebar layout
Implement collapsible sections
Add quick actions
Add keyboard shortcuts
Test on mobile
Add customization UI
Day 5-7: Performance Optimization

Install bundle analyzer
Run build analysis
Identify heavy dependencies
Implement code splitting
Lazy load components
Optimize images
Test load times (Lighthouse score >90)
Phase 3: Mobile App (Week 3)
Goal: Production-ready Android app

Day 1-2: App Configuration

Update capacitor.config.ts
Generate app icons
Create splash screen
Update AndroidManifest.xml
Update strings.xml
Generate keystore
Build debug APK
Test on emulator
Day 3-4: Testing & Optimization

Test on real Android devices
Test on different Android versions
Fix any crashes or bugs
Optimize performance
Reduce APK size
Test offline functionality
Test permissions
Day 5-7: Marketing Materials

Take screenshots (8 different screens)
Design feature graphic
Create promotional video
Write final app description
Prepare press kit
Set up social media
Build landing page
Phase 4: Launch Preparation (Week 4)
Goal: Everything ready for public launch

Day 1-2: Final Testing

Complete QA checklist
Fix any remaining bugs
Test email flows
Test payment flows (if Premium is ready)
Load testing (simulate 100+ concurrent users)
Security audit
Privacy policy review
Day 3-4: Documentation & Support

Finish user documentation
Create FAQ
Set up support email
Create troubleshooting guides
Record tutorial videos
Prepare launch announcement
Day 5-7: Launch!

Submit to Google Play Store
Deploy web app to production
Post on Product Hunt
Announce on social media
Email waitlist
Send press releases
Monitor for issues
Respond to feedback
✅ VERIFICATION STEPS
After completing each phase, verify:

Phase 1 Verification
 Send test email from Clerk → Check it says "Resurgo"
 Create fitness goal → AI response has specific calories/macros
 Create career goal → AI response has month-by-month plan
 Check logs → MCP servers are being called successfully
Phase 2 Verification
 Navigate between pages → Smooth transitions
 Open goal modal → Smooth animation
 View analytics → Charts animate in
 Test on mobile → 60fps, no jank
 Run Lighthouse → Performance score >90
 Check bundle size → Main bundle <500KB
Phase 3 Verification
 Install APK on Android device → Installs without errors
 Open app → Splash screen displays
 Log in → Auth works
 Create goal → Everything works as on web
 Close app and reopen → Data persists
 Turn off internet → Offline mode works
 Check APK size → <25MB
Phase 4 Verification
 All links work
 No console errors
 No broken images
 Responsive on all screen sizes
 Accessible (test with screen reader)
 Fast (Lighthouse >90 on all pages)
 Secure (HTTPS, no XSS vulnerabilities)
 Privacy compliant (GDPR, CCPA)
📊 PROGRESS TRACKING
Overall Completion
Critical Tasks: 0/25 (0%)
High Priority: 0/45 (0%)
Medium Priority: 0/30 (0%)
Low Priority: 0/25 (0%)
Total: 0/125 (0%)

Time Estimates
Phase 1 (Critical): 40-50 hours
Phase 2 (UI/UX): 30-40 hours
Phase 3 (Mobile): 35-45 hours
Phase 4 (Launch): 15-20 hours
Total Estimated Time: 120-155 hours

Team Assignment
 Assign critical tasks to team members
 Set deadlines for each phase
 Schedule daily standups
 Set up project management tool (Linear, Jira, etc.)
🚨 BLOCKERS & DEPENDENCIES
Current Blockers
 None identified yet
Dependencies
Clerk Dashboard access (for email templates)
ANTHROPIC_API_KEY environment variable
BRAVE_SEARCH_API_KEY (for MCP)
Android Studio installed
Keystore passwords securely stored
Risks
AI may take multiple iterations to get right
App Store review could take 1-3 days
First-time Android builds often have issues
Marketing may need A/B testing
📝 NOTES & DECISIONS
Design Decisions
Using black/white color scheme for minimalism
Framer Motion for all animations (consistency)
Evidence-based approach (cite sources in AI responses)
Privacy-first (no tracking without consent)
Technical Decisions
Next.js 14 with App Router (latest stable)
Anthropic Claude for AI (better reasoning)
Capacitor over React Native (code reuse)
PostgreSQL over MongoDB (relational data)
Business Decisions
Freemium model (free tier + Premium)
Launch on Android first (easier approval)
Focus on organic growth initially
Build community before scaling ads
🎯 SUCCESS METRICS
Launch Goals (First Month)
 1,000 downloads
 100 Premium subscribers
 4.5+ star rating
 70%+ 30-day retention
 <2% crash rate
Long-Term Goals (6 Months)
 50,000 downloads
 5,000 Premium subscribers
 Featured on Product Hunt
 Covered by tech blogs
 80%+ user satisfaction
📞 SUPPORT & RESOURCES
Documentation
Clerk Docs: https://clerk.com/docs
Capacitor Docs: https://capacitorjs.com/docs
Framer Motion: https://www.framer.com/motion/
Anthropic API: https://docs.anthropic.com/
Community
Slack/Discord (to be created)
GitHub Discussions
r/Resurgo (to be created)
Team Contacts
Support: support@resurgo.life
Press: press@resurgo.life
General: hello@resurgo.life
Remember: Check off tasks as you complete them. Update progress percentages weekly. Celebrate wins! 🎉

Motto: "Resurgo - I Rise Again"

Let's build something amazing. 🚀
</content>
</write_file>

Perfect! Now let me create one final document - an enhanced README specifically for running and completing all these tasks:

<write_file>
<path>GETTING_STARTED_COMPLETE.md</path>
<content># Resurgo.life - Complete Setup & Enhancement Guide

This guide will help you set up, enhance, and complete ALL pending tasks for Resurgo.life.

📋 Prerequisites
Before starting, ensure you have:

 Node.js 18+ installed
 PostgreSQL database running
 Git configured
 Code editor (VS Code recommended)
 Clerk account
 Anthropic API key
 Resend API key
🚀 Quick Start
1. Clone and Install
Bash

# Clone the repository
git clone <your-repo-url>
cd resurgo

# Install dependencies
npm install

# Install MCP servers and additional dependencies
bash mcp-setup.sh
2. Environment Setup
Create .env.local:

env

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/resurgo"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# AI
ANTHROPIC_API_KEY="sk-ant-..."
OPENAI_API_KEY="sk-..."  # Optional, for OpenAI models

# Email
RESEND_API_KEY="re_..."

# MCP Servers
BRAVE_SEARCH_API_KEY="..."  # Get from https://brave.com/search/api/

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
3. Database Setup
Bash

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Seed with sample data
npx prisma db seed
4. Run Development Server
Bash

npm run dev
Visit http://localhost:3000

🎯 STEP-BY-STEP COMPLETION GUIDE
Follow these steps IN ORDER to complete all pending tasks:

STEP 1: Fix Email Branding (30 minutes)
Why First: Users are seeing wrong branding in emails

Log into Clerk Dashboard: https://dashboard.clerk.com

Select your Resurgo application

Navigate to Customization → Emails

Update Email Verification Template:

Click "Verification Code" template
Find all instances of "Ascend"
Replace with "Resurgo"
Update subject: "Verify your Resurgo email address"
Save changes
Update Password Reset Template:

Click "Reset Password Code" template
Replace "Ascend" with "Resurgo"
Update subject: "Reset your Resurgo
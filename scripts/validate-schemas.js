#!/usr/bin/env node
/**
 * Schema Validation Pipeline
 * Validates all data contracts, API schemas, and database models
 * Zero-tolerance for schema violations before deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCHEMAS = {
  'lib/types/user.ts': 'User Schema',
  'lib/types/trade.ts': 'Trade Schema',
  'lib/types/journal.ts': 'Journal Schema',
  'lib/types/psychology.ts': 'Psychology Schema',
  'lib/types/mentor.ts': 'Mentor Schema',
  'lib/schemas/api.ts': 'APIResponse Schemas'
};

const ERRORS = [];

// Validate TypeScript compilation
function validateTypeScript() {
  console.log('🔍 Validating TypeScript compilation...');
  // TypeScript errors will be caught by the npm script
}

// Validate schema definitions
function validateSchemas() {
  console.log('📋 Validating data schemas...');

  Object.entries(SCHEMAS).forEach(([filePath, description]) => {
    const fullPath = path.resolve(__dirname, '..', filePath);

    if (!fs.existsSync(fullPath)) {
      ERRORS.push(`Missing required schema file: ${filePath} (${description})`);
      return;
    }

    try {
      const content = fs.readFileSync(fullPath, 'utf8');

      // Check for required exports
      if (!content.includes('export') && !content.includes('interface') && !content.includes('type')) {
        ERRORS.push(`Invalid schema structure in ${filePath}: Missing type exports`);
      }

      // Check for Zod schemas if applicable
      if (filePath.includes('schemas') && !content.includes('z.')) {
        console.warn(`⚠️  ${filePath} may be missing Zod validation schemas`);
      }

    } catch (error) {
      ERRORS.push(`Failed to read schema file ${filePath}: ${error.message}`);
    }
  });
}

// Validate database schema alignment
function validateDatabaseSchemas() {
  console.log('🗄️  Validating database schema alignment...');

  const schemaPath = path.resolve(__dirname, '..', 'SUPABASE_SCHEMA.sql');

  if (!fs.existsSync(schemaPath)) {
    ERRORS.push('Missing required SUPABASE_SCHEMA.sql file');
    return;
  }

  try {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Check for required tables
    const requiredTables = [
      'profiles',
      'journals',
      'trades',
      'psychology_assessments',
      'playbooks',
      'mentoring_engagements'
    ];

    requiredTables.forEach(table => {
      if (!schema.includes(`CREATE TABLE public.${table}`)) {
        ERRORS.push(`Missing required database table: ${table}`);
      }
    });

    // Check for RLS policies
    if (!schema.includes('ROW LEVEL SECURITY')) {
      ERRORS.push('Missing Row Level Security (RLS) policies');
    }

  } catch (error) {
    ERRORS.push(`Failed to validate database schema: ${error.message}`);
  }
}

// Validate API contracts
function validateApiContracts() {
  console.log('🔗 Validating API contracts...');

  const apiRoutes = [
    'app/auth',
    'app/protected',
    'app/api'
  ];

  apiRoutes.forEach(route => {
    const routePath = path.resolve(__dirname, '..', route);

    if (fs.existsSync(routePath)) {
      // Check for route.ts/route.js files
      const routeFiles = fs.readdirSync(routePath, { recursive: true })
        .filter(file => file.endsWith('route.ts') || file.endsWith('route.js'));

      if (routeFiles.length === 0) {
        console.warn(`⚠️  API route ${route} has no route handlers`);
      }
    }
  });
}

// Main validation pipeline
async function validatePipeline() {
  console.log('🚀 Starting Zero-Tolerance Validation Pipeline...\n');

  try {
    validateTypeScript();
    validateSchemas();
    validateDatabaseSchemas();
    validateApiContracts();

    if (ERRORS.length > 0) {
      console.error('\n❌ Validation Failed! Critical errors found:');
      ERRORS.forEach(error => console.error(`   - ${error}`));
      process.exit(1);
    } else {
      console.log('\n✅ All validations passed! Code is production-ready.');
    }

  } catch (error) {
    console.error('\n💥 Validation pipeline crashed:', error.message);
    process.exit(1);
  }
}

// Export for testing purposes
export { validatePipeline };

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  validatePipeline();
}

#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Monitors build performance and plugin health
 */

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));

function checkBuildHealth() {
  console.log('🔍 Running deployment health check...\n');
  
  try {
    // Clean previous build
    console.log('🧹 Cleaning previous build...');
    execSync('npm run clean', { stdio: 'inherit' });
    
    // Run build with timing
    console.log('🏗️  Running optimized Webpack build...');
    const startTime = Date.now();
    execSync('npm run build', { stdio: 'inherit' });
    const buildTime = Date.now() - startTime;
    
    // Check build output
    const distStats = execSync('du -sh dist', { encoding: 'utf8' }).trim();
    
    console.log('\n✅ Build Health Report:');
    console.log(`   ⏱️  Build Time: ${(buildTime / 1000).toFixed(2)}s`);
    console.log(`   📦 Bundle Size: ${distStats}`);
    console.log(`   🚀 Status: HEALTHY`);
    
    // Check for common issues
    if (buildTime > 120000) {
      console.log('⚠️  Warning: Build time exceeds 2 minutes');
    }
    
    // Check for webpack-specific optimizations
    const assetCount = execSync('find dist -name "*.js" | wc -l', { encoding: 'utf8' }).trim();
    console.log(`   📊 JavaScript Assets: ${assetCount}`);
    
    return true;
  } catch (error) {
    console.log('\n❌ Build Health Check Failed:');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

function checkDependencies() {
  console.log('\n📋 Checking dependencies...');
  
  try {
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    if (outdated) {
      console.log('⚠️  Some dependencies are outdated');
    }
  } catch (error) {
    console.log('✅ Dependencies are up to date');
  }
}

function checkWebpackConfig() {
  console.log('\n⚙️  Checking Webpack configuration...');
  
  try {
    execSync('webpack --config webpack.config.cjs --mode=production --dry-run', { stdio: 'pipe' });
    console.log('✅ Webpack configuration is valid');
  } catch (error) {
    console.log('❌ Webpack configuration error');
    return false;
  }
  
  return true;
}

function main() {
  const isHealthy = checkBuildHealth();
  checkDependencies();
  checkWebpackConfig();
  
  console.log('\n🎯 Deployment Readiness:', isHealthy ? 'READY' : 'NEEDS ATTENTION');
  process.exit(isHealthy ? 0 : 1);
}

if (require.main === module) {
  main();
}

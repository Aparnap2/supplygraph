import React from 'react';
import { getAGUIComponent } from './apps/web/src/lib/agui-registry';
import { AGUIComponentName } from './packages/shared-types';

// Test function to verify registry mapping
function testRegistry() {
  console.log('Testing AGUI Component Registry...\n');

  const componentNames: AGUIComponentName[] = [
    'thinking_loader',
    'inventory_check',
    'quote_fetcher',
    'quote_approval_card',
    'payment_processor',
    'payment_success',
    'error_card'
  ];

  const results: Record<string, boolean> = {};

  componentNames.forEach(name => {
    try {
      const Component = getAGUIComponent(name);
      if (Component && typeof Component === 'function') {
        console.log(`✓ ${name}: Component found and is a valid React component`);
        results[name] = true;
      } else {
        console.log(`✗ ${name}: Component not found or invalid`);
        results[name] = false;
      }
    } catch (error) {
      console.log(`✗ ${name}: Error retrieving component - ${error}`);
      results[name] = false;
    }
  });

  // Test unknown component
  const UnknownComponent = getAGUIComponent('unknown_component');
  console.log('\nTesting unknown component:');
  console.log(`✓ unknown_component: Returns fallback component - ${!!UnknownComponent}`);

  // Summary
  const passed = Object.values(results).every(Boolean);
  console.log('\n=== Registry Test Summary ===');
  console.log(`Total components tested: ${componentNames.length}`);
  console.log(`Passed: ${Object.values(results).filter(Boolean).length}`);
  console.log(`Failed: ${Object.values(results).filter(v => !v).length}`);
  console.log(`Overall: ${passed ? '✓ PASSED' : '✗ FAILED'}`);

  return passed;
}

// Export for use in test runner
export { testRegistry };
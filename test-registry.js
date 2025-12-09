// Simple test to verify registry mapping
console.log('Testing AGUI Registry...\n');

// Import the built registry
try {
  const { AGUI_COMPONENT_REGISTRY } = require('./apps/web/src/lib/agui-registry.tsx');

  // Test that all expected components exist
  const expectedComponents = [
    'thinking_loader',
    'inventory_check',
    'quote_fetcher',
    'quote_approval_card',
    'payment_processor',
    'payment_success',
    'error_card'
  ];

  console.log('Expected components:', expectedComponents);
  console.log('\nActual components in registry:', Object.keys(AGUI_COMPONENT_REGISTRY));

  // Check each component
  expectedComponents.forEach(name => {
    const Component = AGUI_COMPONENT_REGISTRY[name];
    const status = Component ? '✓ FOUND' : '✗ MISSING';
    console.log(`${status}: ${name}`);
  });

  // Test unknown component
  const UnknownComponent = AGUI_COMPONENT_REGISTRY['unknown_component'];
  console.log(`\nUnknown component test: ${UnknownComponent ? '✓ Returns fallback' : '✗ No fallback'}`);

  console.log('\nRegistry test complete!');
} catch (error) {
  console.error('Error loading registry:', error.message);
}
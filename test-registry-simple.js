"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const agui_registry_1 = require("./apps/web/src/lib/agui-registry");
// Simple test to verify registry mapping
console.log('Testing AGUI Registry...\n');
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
console.log('\nActual components in registry:', Object.keys(agui_registry_1.AGUI_COMPONENT_REGISTRY));
// Check each component
expectedComponents.forEach(name => {
    const Component = agui_registry_1.AGUI_COMPONENT_REGISTRY[name];
    const status = Component ? '✓ FOUND' : '✗ MISSING';
    console.log(`${status}: ${name}`);
});
// Test unknown component
const UnknownComponent = agui_registry_1.AGUI_COMPONENT_REGISTRY['unknown_component'];
console.log(`\nUnknown component test: ${UnknownComponent ? '✓ Returns fallback' : '✗ No fallback'}`);
console.log('\nRegistry test complete!');

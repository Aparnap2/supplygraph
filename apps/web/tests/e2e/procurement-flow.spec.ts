import { test, expect } from '@playwright/test';

// Base URL configuration
test.use({
  baseURL: 'http://localhost:3000',
  storageState: './tests/e2e/auth-storage.json'
});

// Test authentication flow
test('should authenticate with Google OAuth', async ({ page }) => {
  await page.goto('/');
  
  // Check if already authenticated
  const loginButton = page.getByRole('button', { name: /sign in|login/i });
  
  if (await loginButton.isVisible()) {
    await loginButton.click();
    
    // Mock Google OAuth flow
    await page.waitForURL('**/auth/google');
    await expect(page).toHaveURL(/auth\/google/);
    
    // In a real test, you would complete the OAuth flow
    // For testing, we'll mock the authenticated state
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'test-token');
      localStorage.setItem('user-data', JSON.stringify({
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
        orgId: 'test-org-456'
      }));
    });
    
    await page.goto('/');
  }
  
  // Verify authentication
  await expect(page.getByText(/welcome|dashboard/i)).toBeVisible();
  await expect(page.getByText('Test User')).toBeVisible();
});

// Test procurement request creation
test('should create a new procurement request', async ({ page }) => {
  await page.goto('/procurement/requests');
  
  // Click create new request button
  await page.getByRole('button', { name: /create new request|new procurement/i }).click();
  
  // Fill out request form
  await page.getByLabel('Title').fill('Office Supplies Procurement');
  await page.getByLabel('Description').fill('Procurement of office chairs and desks');
  
  // Add items
  await page.getByRole('button', { name: /add item/i }).click();
  await page.getByLabel('Item Name').first().fill('Office Chairs');
  await page.getByLabel('Quantity').first().fill('10');
  await page.getByLabel('Unit').first().fill('each');
  
  await page.getByRole('button', { name: /add item/i }).click();
  await page.getByLabel('Item Name').nth(1).fill('Desks');
  await page.getByLabel('Quantity').nth(1).fill('5');
  await page.getByLabel('Unit').nth(1).fill('each');
  
  // Submit form
  await page.getByRole('button', { name: /submit|create request/i }).click();
  
  // Verify request creation
  await expect(page.getByText('Request created successfully')).toBeVisible();
  await expect(page.getByText('Office Supplies Procurement')).toBeVisible();
  await expect(page.getByText('CREATED')).toBeVisible();
});

// Test vendor management
test('should manage vendors', async ({ page }) => {
  await page.goto('/vendors');
  
  // Add new vendor
  await page.getByRole('button', { name: /add vendor|new vendor/i }).click();
  
  await page.getByLabel('Vendor Name').fill('Office Supplies Co');
  await page.getByLabel('Email').fill('sales@officesupplies.com');
  await page.getByLabel('Phone').fill('(555) 123-4567');
  await page.getByLabel('Contact Person').fill('John Doe');
  
  await page.getByRole('button', { name: /save|add vendor/i }).click();
  
  // Verify vendor creation
  await expect(page.getByText('Vendor added successfully')).toBeVisible();
  await expect(page.getByText('Office Supplies Co')).toBeVisible();
  
  // Edit vendor
  await page.getByRole('button', { name: /edit/i, exact: true }).first().click();
  await page.getByLabel('Phone').fill('(555) 987-6543');
  await page.getByRole('button', { name: /save|update/i }).click();
  
  await expect(page.getByText('Vendor updated successfully')).toBeVisible();
  
  // Delete vendor
  await page.getByRole('button', { name: /delete/i }).first().click();
  await page.getByRole('button', { name: /confirm/i }).click();
  
  await expect(page.getByText('Vendor deleted successfully')).toBeVisible();
});

// Test RFQ sending workflow
test('should send RFQs to vendors', async ({ page }) => {
  await page.goto('/procurement/requests');
  
  // Select a request
  await page.getByText('Office Supplies Procurement').click();
  
  // Navigate to RFQ section
  await page.getByRole('button', { name: /send rfq|request quotes/i }).click();
  
  // Select vendors
  await page.getByLabel('Select Vendors').click();
  await page.getByText('Office Supplies Co').click();
  await page.getByText('ABC Suppliers').click();
  
  // Add RFQ message
  await page.getByLabel('Additional Message').fill('Please provide your best quote for the attached items.');
  
  // Send RFQs
  await page.getByRole('button', { name: /send rfq|send requests/i }).click();
  
  // Verify RFQ sending
  await expect(page.getByText('RFQs sent successfully')).toBeVisible();
  await expect(page.getByText('QUOTES_REQUESTED')).toBeVisible();
});

// Test quote processing
test('should process received quotes', async ({ page }) => {
  await page.goto('/quotes');
  
  // Wait for quotes to appear (mock data)
  await expect(page.getByText('Office Supplies Co')).toBeVisible();
  await expect(page.getByText('$1,500.00')).toBeVisible();
  
  // View quote details
  await page.getByText('Office Supplies Co').click();
  
  // Verify quote details
  await expect(page.getByText('Quote Details')).toBeVisible();
  await expect(page.getByText('Office Chairs')).toBeVisible();
  await expect(page.getByText('10')).toBeVisible();
  await expect(page.getByText('$150.00')).toBeVisible();
  
  // Compare quotes
  await page.getByRole('button', { name: /compare quotes/i }).click();
  await expect(page.getByText('Quote Comparison')).toBeVisible();
});

// Test approval workflow
test('should approve quotes and process payment', async ({ page }) => {
  await page.goto('/procurement/requests');
  
  // Select the request with quotes
  await page.getByText('Office Supplies Procurement').click();
  
  // Navigate to approval section
  await page.getByRole('button', { name: /approve quote|select winner/i }).click();
  
  // Select winning quote
  await page.getByLabel('Select Winning Quote').click();
  await page.getByText('Office Supplies Co - $1,500.00').click();
  
  // Add approval notes
  await page.getByLabel('Approval Notes').fill('Approved based on best price and delivery time.');
  
  // Submit approval
  await page.getByRole('button', { name: /approve|submit approval/i }).click();
  
  // Verify approval
  await expect(page.getByText('Quote approved successfully')).toBeVisible();
  await expect(page.getByText('APPROVED')).toBeVisible();
  
  // Process payment
  await page.getByRole('button', { name: /process payment|pay now/i }).click();
  
  // Mock Stripe payment (in real test, use Stripe test cards)
  await page.waitForURL('**/payment');
  await expect(page.getByText('Payment Details')).toBeVisible();
  
  // Fill payment form
  await page.getByLabel('Card Number').fill('4242424242424242'); // Stripe test card
  await page.getByLabel('Expiry').fill('12/30');
  await page.getByLabel('CVC').fill('123');
  await page.getByLabel('Name on Card').fill('Test User');
  
  // Submit payment
  await page.getByRole('button', { name: /pay|submit payment/i }).click();
  
  // Verify payment
  await expect(page.getByText('Payment successful')).toBeVisible();
  await expect(page.getByText('PAID')).toBeVisible();
});

// Test request completion
test('should complete procurement request', async ({ page }) => {
  await page.goto('/procurement/requests');
  
  // Select the completed request
  await page.getByText('Office Supplies Procurement').click();
  
  // Verify completion status
  await expect(page.getByText('COMPLETED')).toBeVisible();
  
  // Check timeline
  await page.getByRole('button', { name: /timeline|history/i }).click();
  await expect(page.getByText('Request Created')).toBeVisible();
  await expect(page.getByText('RFQs Sent')).toBeVisible();
  await expect(page.getByText('Quotes Received')).toBeVisible();
  await expect(page.getByText('Quote Approved')).toBeVisible();
  await expect(page.getByText('Payment Processed')).toBeVisible();
  await expect(page.getByText('Request Completed')).toBeVisible();
});

// Test multi-tenant isolation
test('should enforce multi-tenant isolation', async ({ page, context }) => {
  // Test that user from org1 cannot see data from org2
  
  // Set org1 context
  await context.addCookies([
    {
      name: 'org-context',
      value: 'org1',
      domain: 'localhost',
      path: '/'
    }
  ]);
  
  await page.goto('/procurement/requests');
  
  // Verify only org1 requests are visible
  const org1Requests = page.getByText(/request.*org1/i);
  await expect(org1Requests).toBeVisible();
  
  // Verify no org2 requests are visible
  const org2Requests = page.getByText(/request.*org2/i);
  await expect(org2Requests).not.toBeVisible();
  
  // Switch to org2 context
  await context.addCookies([
    {
      name: 'org-context',
      value: 'org2',
      domain: 'localhost',
      path: '/'
    }
  ]);
  
  await page.reload();
  
  // Verify only org2 requests are visible
  await expect(page.getByText(/request.*org2/i)).toBeVisible();
  await expect(page.getByText(/request.*org1/i)).not.toBeVisible();
});

// Test AGUI rendering
test('should render AGUI components dynamically', async ({ page }) => {
  await page.goto('/procurement/requests');
  
  // Select a request that requires approval
  await page.getByText('Office Supplies Procurement').click();
  
  // Trigger AGUI component rendering
  await page.getByRole('button', { name: /approve/i }).click();
  
  // Verify AGUI component is rendered
  const aguiComponent = page.locator('[data-testid="agui-component"]');
  await expect(aguiComponent).toBeVisible();
  
  // Verify component props
  await expect(aguiComponent).toContainText('Quote Approval');
  await expect(aguiComponent).toContainText('Office Supplies Co');
  await expect(aguiComponent).toContainText('$1,500.00');
  
  // Test AGUI event handling
  await aguiComponent.getByRole('button', { name: /approve quote/i }).click();
  
  // Verify event was processed
  await expect(page.getByText('Approval processed')).toBeVisible();
});

// Test error handling
test('should handle errors gracefully', async ({ page }) => {
  // Mock API failure
  await page.route('**/api/**', route => {
    if (route.request().url().includes('/api/procurement')) {
      return route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' })
      });
    }
    return route.continue();
  });
  
  await page.goto('/procurement/requests');
  
  // Attempt to create request (should fail)
  await page.getByRole('button', { name: /create new request/i }).click();
  await page.getByLabel('Title').fill('Test Request');
  await page.getByRole('button', { name: /submit/i }).click();
  
  // Verify error handling
  await expect(page.getByText(/error|failed/i)).toBeVisible();
  await expect(page.getByText('Internal server error')).toBeVisible();
  
  // Verify error recovery
  await page.getByRole('button', { name: /retry|try again/i }).click();
  await expect(page.getByLabel('Title')).toHaveValue('Test Request');
});

// Test responsive design
test('should work on mobile devices', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 812 });
  
  await page.goto('/');
  
  // Test mobile navigation
  await page.getByRole('button', { name: /menu|hamburger/i }).click();
  await expect(page.getByRole('navigation')).toBeVisible();
  
  // Test mobile form inputs
  await page.getByRole('link', { name: /procurement/i }).click();
  await page.getByRole('button', { name: /create new/i }).click();
  
  // Verify mobile-friendly form
  const titleInput = page.getByLabel('Title');
  await expect(titleInput).toBeVisible();
  await titleInput.fill('Mobile Test Request');
  
  // Test mobile buttons
  const submitButton = page.getByRole('button', { name: /submit/i });
  await expect(submitButton).toBeVisible();
  await expect(submitButton).toHaveCSS('font-size', /\d+px/); // Should have appropriate size
});

// Test accessibility
test('should be accessible', async ({ page }) => {
  await page.goto('/');
  
  // Test keyboard navigation
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  
  // Test screen reader labels
  await expect(page.getByLabel('Title')).toBeVisible();
  await expect(page.getByLabel('Description')).toBeVisible();
  
  // Test ARIA attributes
  const mainContent = page.locator('[role="main"]');
  await expect(mainContent).toBeVisible();
  
  const navigation = page.locator('[role="navigation"]');
  await expect(navigation).toBeVisible();
  
  // Test color contrast (basic check)
  const buttons = page.getByRole('button');
  for (const button of await buttons.all()) {
    const color = await button.evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    const background = await button.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    // Basic contrast check (in real tests, use proper contrast ratio calculation)
    expect(color).not.toBe(background);
  }
});

// Test performance
test('should load pages quickly', async ({ page }) => {
  const startTime = Date.now();
  await page.goto('/procurement/requests');
  const loadTime = Date.now() - startTime;
  
  // Verify reasonable load time
  expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
  
  // Test subsequent navigation performance
  const navStartTime = Date.now();
  await page.getByRole('link', { name: /vendors/i }).click();
  const navTime = Date.now() - navStartTime;
  
  expect(navTime).toBeLessThan(1000); // Should navigate in under 1 second
});
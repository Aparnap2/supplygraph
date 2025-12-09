# Manual Browser Testing Instructions

## Overview
This document provides step-by-step instructions for manually testing the SupplyGraph platform in a web browser.

## Prerequisites
1. Ensure both services are running:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8000
2. Open Chrome browser with Developer Tools

## Testing Steps

### 1. Dashboard Loading Test
1. Navigate to: http://localhost:3000
2. **Expected**: SupplyGraph dashboard loads with professional UI
3. **Current Status**:
   - ✅ UI loads correctly
   - ⚠️ Values are currently hardcoded (24 requests, $45,320 savings, etc.)
   - ℹ️ Check browser console for any errors

### 2. Navigation Tab Test
1. Click on different tabs: Overview, Requests, Vendors, Analytics
2. **Expected**: Smooth transitions between tabs
3. **Current Status**:
   - ✅ Tab switching works visually
   - ⚠️ No data persistence as data is static

### 3. CSV Upload Modal Test
1. Click "Upload CSV/Excel" button
2. **Expected**: Modal should open with drag-and-drop area
3. **Current Status**:
   - ✅ Modal opens (if component exists)
   - ❌ File upload not connected to backend
   - **Note**: The backend `/api/upload-csv` endpoint is working

### 4. View Details Test
1. Click "View Details" on any request in the table
2. **Expected**: AGUIChat component should load
3. **Current Status**:
   - ✅ View Details button exists
   - ❌ Data not loaded from backend
   - **Note**: The backend `/api/requests/{id}` endpoint is working

### 5. Responsive Design Test
1. Resize browser window to different sizes
2. **Expected**: Layout should adapt appropriately
3. **Test Sizes**:
   - Desktop: > 1200px
   - Tablet: 768px - 1200px
   - Mobile: < 768px

### 6. API Testing in Browser Console
Open Chrome DevTools (F12) and run these commands:

```javascript
// Test stats API
fetch('http://localhost:8000/api/stats')
  .then(r => r.json())
  .then(console.log)

// Test requests API
fetch('http://localhost:8000/api/requests')
  .then(r => r.json())
  .then(console.log)

// Test AI insights
fetch('http://localhost:8000/api/ai-insights')
  .then(r => r.json())
  .then(console.log)

// Test WebSocket connection
const ws = new WebSocket('ws://localhost:8000/ws');
ws.onopen = () => console.log('WebSocket connected');
ws.onmessage = (e) => console.log('Received:', JSON.parse(e.data));
ws.send(JSON.stringify({message: 'Test message', org_id: 'test', user_id: 'test'}));
```

### 7. Manual CSV Upload Test
1. Create a test CSV file with this content:
```csv
item_name,category,quantity,unit_price,priority,description
Office Chairs,Furniture,10,150.00,HIGH,Ergonomic office chairs
Laptops,IT Equipment,5,1200.00,MEDIUM,Dell Latitude laptops
Safety Helmets,Safety,20,45.00,CRITICAL,Construction site safety
```

2. Use this command in console to test upload (since UI not connected):
```javascript
// Convert CSV to Blob
const csv = `item_name,category,quantity,unit_price,priority,description
Office Chairs,Furniture,10,150.00,HIGH,Ergonomic office chairs
Laptops,IT Equipment,5,1200.00,MEDIUM,Dell Latitude laptops
Safety Helmets,Safety,20,45.00,CRITICAL,Construction site safety`;

const blob = new Blob([csv], { type: 'text/csv' });
const formData = new FormData();
formData.append('file', blob, 'test.csv');

// Upload via API
fetch('http://localhost:8000/api/upload-csv', {
  method: 'POST',
  body: formData
})
.then(r => r.json())
.then(console.log);
```

## Expected Behaviors Based on PRD

### Professional UI Standards
- Enterprise-grade color scheme (blues, grays)
- Consistent spacing and typography
- Loading states for async operations
- Professional error messages

### Smooth Transitions
- No jarring page reloads
- Loading indicators during data fetch
- Smooth animations where appropriate

### Error Handling
- Network errors should show user-friendly messages
- Form validation should be clear
- No console errors in normal operation

### AI-Powered Features
- Insights should feel intelligent and relevant
- Recommendations should be actionable
- Chat responses should be contextual

## Quick Verification Checklist

- [ ] Dashboard loads without errors
- [ ] All tabs are clickable
- [ ] No console JavaScript errors
- [ ] API endpoints return data (test with console commands)
- [ ] WebSocket connects and responds
- [ ] CSV upload processes correctly via API
- [ ] Request details can be retrieved via API
- [ ] UI is responsive on different screen sizes

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Backend has CORS configured for localhost:3000, should work

### Issue: WebSocket Connection Failed
**Solution**: Check if backend is running on port 8000

### Issue: API Calls Not Working
**Solution**: Verify backend is running and check browser console for errors

### Issue: Values Not Updating
**Solution**: Frontend needs to be connected to backend APIs (not yet implemented)

## Performance Checks
1. Open Chrome DevTools > Network tab
2. Reload the page
3. Check:
   - Page load time should be < 3 seconds
   - No failed requests
   - Asset sizes are reasonable

## Final Notes
The backend infrastructure is fully functional. The main limitation is that the frontend is displaying mock data instead of fetching from the backend. This is a development task rather than a bug.
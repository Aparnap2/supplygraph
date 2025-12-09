// Basic test for Gmail OAuth integration

import { gmailSimpleService } from './src/lib/gmail-simple'

console.log('🚀 Testing Gmail OAuth Integration')
console.log('==================================')

// Test environment setup
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-client-id'
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret'
process.env.SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'

async function runTests() {
  try {
    console.log('✅ Gmail service imported successfully')

    const testOrgId = 'test-org-123'

    // Test 1: Generate auth URL
    const authUrl = gmailSimpleService.getAuthUrl(testOrgId)
    console.log('✅ Auth URL generated successfully')
    console.log('📄 Auth URL length:', authUrl.length)
    console.log('🔗 Contains google.com:', authUrl.includes('google.com'))
    console.log('🏢 Contains org ID:', authUrl.includes(testOrgId))

    // Test 2: Credentials storage
    const mockCredentials = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiryDate: new Date(Date.now() + 60 * 60 * 1000),
      email: 'test@example.com',
      organizationId: testOrgId
    }

    await gmailSimpleService.storeGmailCredentials(mockCredentials)
    console.log('✅ Credentials stored successfully')

    const stored = await gmailSimpleService.getGmailCredentials(testOrgId)
    if (stored && stored.email === 'test@example.com') {
      console.log('✅ Credentials retrieved successfully')
      console.log('📧 Email:', stored.email)
      console.log('🏢 Organization:', stored.organizationId)
    } else {
      console.log('❌ Credentials retrieval failed')
      return false
    }

    console.log('🎉 All basic tests passed!')
    console.log('')
    console.log('📋 Next steps:')
    console.log('1. Update .env.local with your Google OAuth credentials')
    console.log('2. Go to Google Cloud Console to create OAuth credentials')
    console.log('3. Test the OAuth flow with a real Gmail account')
    console.log('4. Test email sending functionality')

    return true
  } catch (error) {
    console.error('❌ Test failed:', (error as Error).message)
    return false
  }
}

// Run tests
runTests().then(success => {
  process.exit(success ? 0 : 1)
})
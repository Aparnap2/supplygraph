// Test script for Gmail OAuth integration
// This script tests the Gmail API integration functionality

const { gmailSimpleService } = require('./src/lib/gmail-simple')

// Test environment setup
const testOrgId = 'test-org-123'
const testEmail = 'test@example.com'

async function testGmailAuthUrl() {
  console.log('\n🔗 Testing Gmail Auth URL generation...')

  try {
    const authUrl = gmailSimpleService.getAuthUrl(testOrgId)
    console.log('✅ Auth URL generated successfully')
    console.log('📄 Auth URL:', authUrl.substring(0, 100) + '...')
    return true
  } catch (error) {
    console.error('❌ Failed to generate auth URL:', error.message)
    return false
  }
}

async function testGmailCredentialsStorage() {
  console.log('\n💾 Testing Gmail credentials storage...')

  try {
    const mockCredentials = {
      accessToken: 'test-access-token',
      refreshToken: 'test-refresh-token',
      expiryDate: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
      email: testEmail,
      organizationId: testOrgId
    }

    await gmailSimpleService.storeGmailCredentials(mockCredentials)

    // Retrieve credentials
    const stored = await gmailSimpleService.getGmailCredentials(testOrgId)

    if (stored && stored.email === testEmail) {
      console.log('✅ Credentials stored and retrieved successfully')
      console.log('📧 Email:', stored.email)
      console.log('🏢 Organization:', stored.organizationId)
      return true
    } else {
      console.error('❌ Stored credentials do not match')
      return false
    }
  } catch (error) {
    console.error('❌ Failed to store/retrieve credentials:', error.message)
    return false
  }
}

async function testEmailConfigurationStatus() {
  console.log('\n🔍 Testing email configuration status...')

  try {
    const credentials = await gmailSimpleService.getGmailCredentials(testOrgId)

    if (credentials) {
      console.log('✅ Gmail is configured for organization')
      console.log('📧 Email:', credentials.email)
      console.log('⏰ Token expiry:', credentials.expiryDate)
      return true
    } else {
      console.log('⚠️  Gmail is not configured for this organization')
      return false
    }
  } catch (error) {
    console.error('❌ Failed to check configuration status:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('🚀 Starting Gmail Integration Tests')
  console.log('=====================================')

  // Set environment variables for testing
  process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'test-client-id'
  process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'test-client-secret'
  process.env.SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000'

  const results = []

  // Run tests
  results.push(await testGmailAuthUrl())
  results.push(await testGmailCredentialsStorage())
  results.push(await testEmailConfigurationStatus())

  // Summary
  console.log('\n📊 Test Results Summary')
  console.log('=========================')
  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`✅ Passed: ${passed}/${total}`)
  console.log(`❌ Failed: ${total - passed}/${total}`)

  if (passed === total) {
    console.log('\n🎉 All tests passed! Gmail OAuth integration is ready.')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.')
  }

  // Cleanup test data
  gmailSimpleService.credentialsStore?.delete(testOrgId)
  console.log('\n🧹 Test data cleaned up')
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error)
}

module.exports = {
  testGmailAuthUrl,
  testGmailCredentialsStorage,
  testEmailConfigurationStatus,
  runAllTests
}
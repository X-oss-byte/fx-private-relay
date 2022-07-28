import test, { expect }  from '../fixtures/basePages'
import {
  deleteEmailAddressMessages, 
  generateRandomEmail, 
  getVerificationCode } from '../e2eTestUtils/helpers';

test.describe('Relay e2e function email forwarding', () => {
    // use stored authenticated state
    test.use({ storageState: 'state.json' })

    test.beforeEach(async ({ dashboardPage, context, request }) => {
      await dashboardPage.sendMaskEmail(context, request)
    });
    
    test('Check that the user can use the masks on websites and receive emails sent to the masks, C1553068, C1553065', async ({ 
      dashboardPage,
    }) => {
        await dashboardPage.open()
        const forwardedEmailCount = await dashboardPage.checkForwardedEmailCount()
        
        expect(forwardedEmailCount).toEqual('1Forwarded')        

        await dashboardPage.userMenuButton.click()
        await dashboardPage.signOutButton.click()
        expect(await dashboardPage.signOutToastAlert.textContent()).toContain('You have signed out.')     
    })
})

test.describe('Relay e2e auth flows', () => {
  let testEmail: string;

  test.beforeEach(async ({ landingPage }) => {
      await landingPage.open()      
  });
  
  test.afterEach(async ({ request }) => {
      if (testEmail) await deleteEmailAddressMessages(request, testEmail)
  })

  test('Verify user can sign up for an account C1818784, C1811801, C1553064', async ({
      dashboardPage, 
      landingPage,
      authPage,
      request,
      page
    }) => {

      // sign up with a randomly generated email
      testEmail = await generateRandomEmail()
      await landingPage.goToSignUp()
      await authPage.signUp(testEmail, process.env.E2E_TEST_ACCOUNT_PASSWORD as string)

      // get verification code from restmail
      const verificationCode = await getVerificationCode(request, testEmail, page)
      await authPage.enterVerificationCode(verificationCode)

      // verify successful login
      expect(await dashboardPage.signOutToastAlert.textContent()).toContain('Successfully')
      expect(await dashboardPage.signOutToastAlert.textContent()).toContain(testEmail)

      // sign out and verify successful signout
      await dashboardPage.userMenuButton.click()
      await dashboardPage.signOutButton.click()
      expect(await dashboardPage.signOutToastAlert.textContent()).toContain('You have signed out.')
  })

  test('Verify that the "Sign Up" button works correctly, C1818792', async ({     
    landingPage
  }) => {    
    await landingPage.selectPricingPlanSignUp()

    // verify redirect to subscription page
    expect(await landingPage.subscriptionTitle.textContent()).toContain('Set up your subscription')
  })
})
import test, { expect } from '../fixtures/basePages';

test.describe('Chrome console', () => {
  test('Verify no console errors or logs', async ({ page, loginPage, homePage, profilePage }) => {
    await loginPage.visit();
    await loginPage.successLogin();
    const logs =[]; 
    page.on("console", (message) => {
      logs.push({message, type: message.type()})
    })
    const errors = [];
    page.on("pageerror", (exception) => {
      errors.push({exception})
    })
    expect.soft(logs.length).toBe(0);
    expect(errors.length).toBe(0);
  });
});

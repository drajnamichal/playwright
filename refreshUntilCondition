await registrationPage.clickSendSms();
    // refresh the page until the SMS arrives
    await expect
      .poll(
        async () => {
          await smsPage.reload();
          const sms = smsPage.locator(
            '//td[contains(string(),"Vas overovaci kod:")]'
          );
          return sms.isVisible();
        },
        {
          // Poll for 60 seconds
          timeout: 60000,
        }
      )
      .toBeTruthy();

// get cookies
    const obj = await context.cookies();
// get access token
    const tokenObject = obj.filter((val) => val.name.includes('idToken'));
    const token = tokenObject.map((a) => a.value).toString();

// submit investment and wait for response
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/invoice/api/graphql') && req.method() === 'POST'
    );
    yourPage.submit();
    page.waitForResponse((resp) => resp.url().includes('/invoice/api/graphql') && resp.status() === 200);
    // get transactionId
    const invoiceRequest = await requestPromise;
    const transactionId = invoiceRequest.postDataJSON().variables.input.transactionId;

// refresh the page, send request to orders api and verify status
    await expect
      .poll(
        async () => {
          await page.reload();
          const invoiceResponse = await request.post('/invoice/api/graphql', {
            data: {
              query:
                'query GetOrderInfo($transactionId: ID!) { Invoice(transactionId: $transactionId) { status, unsuccessOrFailReasons } }',
              variables: {
                transactionId: `${transactionId}`,
              },
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          const jsonData = await invoiceResponse.json();
          const invoiceStatus = jsonData.data.Invoice.status;
          return invoiceStatus !== 'InProgress';
        },
        {
          // Poll for 60 seconds
          timeout: 60000,
        }
      )
      .toBeTruthy();

// continue

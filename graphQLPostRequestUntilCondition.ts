// get cookies
    const obj = await context.cookies();
// get access token
    const tokenObject = obj.filter((val) => val.name.includes('idToken'));
    const token = tokenObject.map((a) => a.value).toString();

// submit investment and wait for response
    const requestPromise = page.waitForRequest(
      (req) => req.url().includes('/orders/api/graphql') && req.method() === 'POST'
    );
    xyzPage.submit();
    page.waitForResponse((resp) => resp.url().includes('/orders/api/graphql') && resp.status() === 200);
    // get transactionId
    const investRequest = await requestPromise;
    const transactionId = investRequest.postDataJSON().variables.input.transactionId;

// refresh the page, send request to orders api and verify status
    await expect
      .poll(
        async () => {
          await page.reload();
          const ordersResponse = await request.post('/orders/api/graphql', {
            data: {
              query:
                'query GetOrderInfo($transactionId: ID!) { Order(transactionId: $transactionId) { status, unsuccessOrFailReasons } }',
              variables: {
                transactionId: `${transactionId}`,
              },
            },
            headers: {
              authorization: `Bearer ${token}`,
            },
          });
          const jsonData = await ordersResponse.json();
          const orderStatus = jsonData.data.Order.status;
          return orderStatus !== 'InProgress';
        },
        {
          // Poll for 60 seconds
          timeout: 60000,
        }
      )
      .toBeTruthy();

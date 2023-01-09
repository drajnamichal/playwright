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

// continue


// This code uses the Playwright library to send a GraphQL POST request to the /orders/api/graphql endpoint. It first gets the cookies from the context and extracts the idToken cookie value, which it uses as an authorization token in the request headers.

// The code then waits for a request to the /orders/api/graphql endpoint with a POST method and extracts the transactionId from the request's postDataJSON. It then refreshes the page and sends a new request to the /orders/api/graphql endpoint using the request object.

// This new request queries the Order field with the transactionId and waits for the status field to not be InProgress. If the status field is not InProgress within 60 seconds, the poll function returns true. Otherwise, it will continue to poll until the timeout is reached.

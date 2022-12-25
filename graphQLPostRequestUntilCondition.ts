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

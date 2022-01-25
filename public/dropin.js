// dummy data
let threeDSecureParameters = {
  amount: "250",
  email: "test@example.com",
  billingAddress: {
    givenName: "Jill", // ASCII-printable characters required, else will throw a validation error
    surname: "Doe", // ASCII-printable characters required, else will throw a validation error
    phoneNumber: "8101234567",
    streetAddress: "555 Smith St.",
    extendedAddress: "#5",
    locality: "Oakland",
    region: "CA",
    postalCode: "12345",
    countryCodeAlpha2: "US",
  },
  additionalInformation: {
    workPhoneNumber: "8101234567",
    shippingGivenName: "Jill",
    shippingSurname: "Doe",
    shippingPhone: "8101234567",
    shippingAddress: {
      streetAddress: "555 Smith St.",
      extendedAddress: "#5",
      locality: "Oakland",
      region: "CA",
      postalCode: "12345",
      countryCodeAlpha2: "US",
    },
  },
};

const getClientToken = async () => {
  const response = await fetch("/client_token");
  const clientToken = await response.json();
  return clientToken;
};

const createDropIn = (clientToken) => {
  braintree.dropin.create(
    {
      authorization: clientToken.braintreeclienttoken,
      container: "#dropin-container",
      threeDSecure: true,
      googlePay: {
        googlePayVersion: 2,
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: "123.45",
          currencyCode: "USD",
        },
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              // We recommend collecting and passing billing address information with all Google Pay transactions as a best practice.
              billingAddressRequired: false,
              billingAddressParameters: {
                format: "FULL",
              },
            },
          },
        ],
      },
    },
    function (err, dropinInstance) {
      if (err) {
        // Handle any errors that might've occurred when creating Drop-in
        console.error(err);
        return;
      }
      // testing GooglePay Update
      // adding event listener + button to update drop in config https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#updateConfiguration

      const updateButton = document.querySelector("#update-dropin-config");
      updateButton.addEventListener("click", async function (event) {
        event.preventDefault();
        await dropinInstance.updateConfiguration(
          "googlePay",
          "transactionInfo",
          {
            totalPrice: "200.00",
            totalPriceStatus: "FINAL",
            currencyCode: "USD",
          }
        );
        console.log(
          dropinInstance._merchantConfiguration.googlePay.transactionInfo
        );
      });

      // request payment method payload from drop-in
      let requestPaymentMethodButton = document.querySelector("#submit-button");
      requestPaymentMethodButton.addEventListener("click", function (e) {
        e.preventDefault();
        dropinInstance.requestPaymentMethod(
          {
            threeDSecure: threeDSecureParameters,
          },
          function (err, payload) {
            if (err) {
              console.log(err);
            } else {
              console.log(payload);
              let payButton = document.querySelector("#pay-button");
              payButton.addEventListener("click", function (event) {
                event.preventDefault();
                // Send payload.nonce to your server
                createTransaction(payload);
                payButton.disabled = true;
              });
            }
          }
        );
      });
    }
  );
};

const createTransaction = async (payload, amount) => {
  const formData = {
    nonce: payload.nonce,
    amount: amount,
  };
  console.log(formData);
  const response = await fetch("/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const transactionRespose = await response.json();
  console.log(transactionRespose);
};

// to request client token and set up drop-in on page load

(async function () {
  const clientToken = await getClientToken();
  createDropIn(clientToken);
})();

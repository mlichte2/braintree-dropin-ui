// Add variables from dotenv into process.env vars
require("dotenv").config();

// set up express server
const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

// import braintree module
const braintree = require("braintree");

//allows JSON payloads to be sent to server
// const cors = require("cors");
const bp = require("body-parser");
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

// servers
app.use(express.static("public"));

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// create client token

app.get("/client_token", (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ braintreeclienttoken: response.clientToken });
  });
});

// create transaction

app.post("/checkout", (req, res) => {
  console.log(req.body);
  const nonceFromTheClient = req.body.nonce;
  const deviceDataFromTheClient = req.body.deviceData;
  // Use payment method nonce here
  gateway.transaction.sale(
    {
      amount: "250",
      paymentMethodNonce: nonceFromTheClient,
      deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.send(err);
        return;
      }
      console.log(result);
      res.send(result);
    }
  );
});

# Braintree Drop-in UI

To be used for testing purposes. A simple implementation of the Drop-in using Express. 

To install/run:

1. clone repo locally
2. run `npm install` or `npm i`
3. create a .env file in the root folder and insert your Braintree SANDBOX API keys + Merchant ID (https://developer.paypal.com/braintree/articles/control-panel/important-gateway-credentials#api-credentials)
  - BRAINTREE_MERCHANT_ID='merchantID'
  - BRAINTREE_PUBLIC_KEY='publicKey'
  - BRAINTREE_PRIVATE_KEY='privateKey'
  - (optional) create a PORT='Port number'
4. run `nodemon app.js` to run using nodemon (which allows you to make changes without restarting the server)
5. Navigate to localhost:5000, or, localhost:${PORT} (if you set up a PORT value)

You can test it deployed on Heroku here: https://mikrs-braintree-drop-in.herokuapp.com/

Update button is there to update the Dropin Configuration: https://braintree.github.io/braintree-web-drop-in/docs/current/Dropin.html#updateConfiguration

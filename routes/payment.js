var express = require("express");
var router = express.Router();
var Paymongo = require('paymongo');
const cors = require('cors');

const paymongo = new Paymongo(process.env.SECRET_KEY || "sk_test_amdL4FT9xNotTy5YSV3LsZRS");

const corsOptions = {
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200,
  credentials: true,
  allowedHeaders: ['Content-Type']
}

router.post("/", cors(corsOptions), async function(request, response) {
  try {
    const expiry = request.body.expiry;
    const expiryArray = expiry.split('/');

    // const tokenData = { 
    //   data: {
    //     attributes: {
    //       billing: {
    //         name: request.body.name,
    //         email: request.body.email,
    //       },
    //       number: request.body.number,
    //       exp_month: parseInt(expiryArray[0]),
    //       exp_year: parseInt(expiryArray[1]),
    //       cvc: request.body.cvc,
    //     }
    //   }
    // }

    const payload = {
      data: {
        attributes: {
          amount: request.body.paymentAmount, 
          currency: 'PHP', 
          payment_method_allowed: ['card'] 
        }
      }
    }

    const paymentIntent = await paymongo.paymentIntents.create(payload);

    const { paymentAmount } = request.body;

    response.json(paymentIntent);
  } catch (err) {
    response.json(err)
  }
});

module.exports = router;

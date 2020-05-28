const express = require("express")
const config = require('config')
const Paymongo = require("paymongo")
const router = express.Router()

const paymongo = new Paymongo(config.get('paymongo_sk'))

router.post('/', async (req, res) => {
  const { amount } = req.body

  try {
    
    const payload = { 
      data: {
        attributes: {
          amount: amount,
          payment_method_allowed: ['card'],
          payment_method_options: { 
            card: {
              request_three_d_secure: 'automatic'
            }
          },
          currency: 'PHP'
        }
      }
    }

    const { data: paymentIntent } = await paymongo.paymentIntents.create(payload)
    
    res.json(paymentIntent)
  } catch (error) {
    res.json({
      error: error
    })
  }
})

router.post('/:id/attach', async (req, res) => {
  const { id } = req.params
  const { payment_method_id, client_key, return_url } = req.body

  try {
    const payload = {
      data: {
        attributes: {
          payment_method: payment_method_id,
          client_key,
          return_url
        }
      }
    }

    const { data: paymentIntentAttach } = await paymongo.paymentIntents.attach(id, payload)

    res.json(paymentIntentAttach)
  } catch (error) {
    res.json(error)
  }
})

module.exports = router
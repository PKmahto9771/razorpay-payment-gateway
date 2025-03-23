const express = require('express')
const cors = require('cors')
const Razorpay = require('razorpay')

require('dotenv').config()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())

app.get('/', (req, res)=>{
    res.send('Server is running')
})

app.post('/order', async (req, res) => {
    try {
      const razorpay = new Razorpay({
        key_id: process.env.KEY_ID,
        key_secret: process.env.KEY_SECRET,
      });
  
      if (!req.body.amount) {
        return res.status(400).json({ error: 'Amount is required' });
      }
  
      const options = {
        amount: req.body.amount,
        currency: req.body.currency,
        receipt: req.body.receipt,
      };
  
      const order = await razorpay.orders.create(options);
      if (!order) return res.status(500).json({ error: 'Error creating order' });
  
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server Error' });
    }
});  

app.listen(process.env.PORT, ()=>{
    console.log(`Server started on ${process.env.PORT}`)
})
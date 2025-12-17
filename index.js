const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const axios = require('axios');
require('dotenv').config();

const mongoose = require('mongoose');
const { env } = require('process');

mongoose.connect('mongodb://localhost:27017/chandra')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

app.use(cors());
app.use(express.json());

const secretKey = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

const User = mongoose.model('users', userSchema);

const productScema = new mongoose.Schema({
name: {type: String},
price: {type: String},
image: {type: String},
description: {type: String}
})
const Products = mongoose.model('products', productScema);

app.post('/signup', async (req, res) => {
    const {name, email, password} = req.body;

const existingUser = await User.findOne({email});

if (existingUser) {
 return res.status(401).json({message: "An account is already registered with this email."});
}
  const hashedPwd = await bcrypt.hash(password, 10);

  await User.create({name, email, password: hashedPwd});
    res.json({message: "user created successfully"});
})

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    try {
    const user = await User.findOne({email});
    if(!user) {
        console.log('user not found');
       return res.status(401).json({message: "user not found"});
    }

    const matchedPwd = await bcrypt.compare(password, user.password);

    if(!matchedPwd) {
        return res.status(401).json({message: "wrong password"});
    }

    const Claims = {
        userName: user.name,
        userID: user._id,
        email: user.email
    }

    const token = jwt.sign(Claims, secretKey);
 console.log("Successfully logged in:", token);
    res.status(200).json({token});

    } catch (error) {
        res.status(500).json({message: "invalid login" });
    }
});

app.get('/products', async (req, res) => {
    const token = req.headers['authorization'];
    try {
        const claims = await jwt.verify(token, secretKey);
        if(!claims) {
            console.log('error loging');
        }
        const products =   await Products.find();
        res.status(200).json({user: claims, products: products});
    } catch (error) {
        res.status(401).json({error, message: "invalid token"});
    }
});


//order schema for mongo
const orderSchema = new mongoose.Schema({
  products: [
    {
      _id: String,
      name: String,
      price: Number,
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  billing: {
    name: String,
    email: String,
    phone: String,
  },
  shipping: {
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  payment: {
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
    status: { type: String, default: "pending" },
  },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model('orders', orderSchema);


// razorpay
var instance = new Razorpay({
  key_id: process.env.RZ_KEY_ID,
  key_secret: process.env.RZ_KEY_SECRET,
});


app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body; // Amount in rupees

    const options = {
      amount: amount * 100, // convert to paise
      currency: "INR",
      receipt: "order_rcpt_" + Math.random(),
    };

    const order = await instance.orders.create(options);

    res.json({
      success: true,
      orderId: order.id,
      amount: amount * 100,
      key: instance.key_id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error creating order");
  }
});

app.post("/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cartItems, billing, shipping, totalAmount } = req.body;

  // Verify signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", instance.key_secret)
    .update(sign.toString())
    .digest("hex");

  if (razorpay_signature === expectedSign) {
    try {
      // Save order in MongoDB
      const order = new Order({
        products: cartItems,
        totalAmount,
        billing,
        shipping,
        payment: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          status: "paid",
        },
      });

      await order.save();

      return res.json({ 
        success: true,
        message: "Payment verified and order saved!",
        orderId: order._id,
        order: order
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: "Error saving order" });
    }
  } else {
    return res.json({ success: false, message: "Invalid payment signature" });
  }
});


app.get('/order/:id', async (req, res) => {
try {
  const order = await Order.findById(req.params.id);
  res.json(order);

} catch (error) {
   res.status(500).send("Error fetching order");
}
});

app.get('/singleproduct/:id', async (req, res) => {

try {
  const product = await Products.findById(req.params.id);
  res.status(200).json(product);
} catch (error) {
  res.json({message: 'error loading data'});
}
})


app.post('/order/sendordersuccessemail', async (req, res) => {
  try {

    const{email, name, orderId, orderAmt} = req.body;

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', {  
   "sender":{  
      "name":"Chandra Angular",
      "email":"pikmybook@gmail.com"
   },
   "to":[  
      {  
         "email":email,
         "name": name
      }
   ],
   "subject":"Order Success",
   "htmlContent":`<html><head></head><body><p>Hello,</p>Here is your orderID: ${orderId}, your orderAmount: ${orderAmt} </p></body></html>`
  },
  {
    headers: {
          "api-key": process.env.BREVO_KEY,
          "Content-Type": "application/json"
        }
      }
    );
res.json({success: true, message: 'email delivered successfully', brevoResponse: response.data})
  } catch (error) {
    res.status(500).json({success: false,
      message: "Failed to send email",
      error: error.response?.data || error.message});
  }
});


app.listen(5000, () => console.log('app is running chandra'));
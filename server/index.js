const express = require("express");
const server = express();
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const mercadopago = require("mercadopago");

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(express.static(path.join(__dirname, "../client")));
server.use(cors());
// server.get("/", (req, res) => res.status(200).sendFile(index.html));
server.post("/create_preference", (req, res) => {
  let preference = {
    items: [
      {
        title: req.body.description,
        unit_price: Number(req.body.price),
        quantity: Number(req.body.quantity),
      },
    ],
    back_urls: {
      success: "http://localhost:8080/feedback",
      failure: "http://localhost:8080/feedback",
      pending: "http://localhost:8080/feedback", //no online payment
    },
    auto_return: "approved",
  };
  mercadopago.preferences
    .create(preference)
    .then(response => {
      res.json({ id: response.body.id });
    })
    .catch(err => console.log(err));
});
server.get("/feedback", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/feedback.html"));
  // res.json({
  //   Payment: req.query.payment_id,
  //   Status: req.query.status,
  //   MerchantOrder: req.query.merchant_order_id,
  // });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, err =>
  err ? console.log(err) : console.log(`Server up at http://localhost:${PORT}`)
);

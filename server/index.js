const express = require("express");
const server = express();
const path = require("path");
require("dotenv").config();
const cors = require("cors");
const mercadopago = require("mercadopago");
mercadopago.configure({
  access_token:
    "TEST-3076814606281143-052618-882de10712a4d694205a0b548c093e20-85941293",
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
// app.get("/feedback", (req, res) => {
//   res.json({
//     Payment: req.query.payment_id,
//     Status: req.query.status,
//     MerchantOrder: req.query.merchan_order_id,
//   });
// });

const PORT = process.env.PORT || 8080;
server.listen(PORT, err =>
  err ? console.log(err) : console.log(`Server up at http://localhost:${PORT}`)
);

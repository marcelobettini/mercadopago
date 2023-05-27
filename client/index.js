const productDescription = document.getElementById("product-description");
const coffee1Btn = document.getElementById("donate-1");
const coffee2Btn = document.getElementById("donate-2");
const coffee3Btn = document.getElementById("donate-3");
const coffee5Btn = document.getElementById("donate-5");
const coffee10Btn = document.getElementById("donate-10");
let totalAmount = 0;

const btnCheckout = document.getElementById("button-checkout");
const COFFEEVAL = 500;

coffee1Btn.addEventListener("click", () => {
  updateTotalAmount(1);
});
coffee2Btn.addEventListener("click", () => {
  updateTotalAmount(2);
});
coffee3Btn.addEventListener("click", () => {
  updateTotalAmount(3);
});
coffee5Btn.addEventListener("click", () => {
  updateTotalAmount(5);
});
coffee10Btn.addEventListener("click", () => {
  updateTotalAmount(10);
});

const updateTotalAmount = coffeeQtty => {
  const singleMulti = coffeeQtty === 1 ? "cafecito" : "cafecitos";
  totalAmount = Number(coffeeQtty * COFFEEVAL);
  btnCheckout.textContent = `Invitar ${coffeeQtty} ${singleMulti}: $${totalAmount} `;
};

// MercadoPago FrontEnd Integration

const mercadopago = new MercadoPago(
  "TEST-5cee82b4-d314-446d-82a4-63cc44bbdbea",
  {
    locale: "es-AR",
  }
);

document.getElementById("button-checkout").addEventListener("click", () => {
  const orderData = {
    quantity: totalAmount / COFFEEVAL,
    description: productDescription.textContent,
    price: COFFEEVAL,
  };
  console.log(orderData);

  fetch("http://localhost:8080/create_preference", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderData),
  })
    .then(res => res.json())
    .then(preference => createCheckoutButton(preference.id))
    .catch(err => alert("Error inesperado", err));
});

function createCheckoutButton(preferenceId) {
  // Initialize the checkout
  const bricksBuilder = mercadopago.bricks();

  const renderComponent = async bricksBuilder => {
    if (window.checkoutButton) window.checkoutButton.unmount();

    await bricksBuilder.create(
      "wallet",
      "button-checkout", // class/id where the payment button will be displayed
      {
        initialization: {
          preferenceId: preferenceId,
        },
        callbacks: {
          onError: error => console.error(error),
          onReady: () => {},
        },
      }
    );
  };
  window.checkoutButton = renderComponent(bricksBuilder);
}

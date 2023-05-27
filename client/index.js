const productDescription = document.getElementById("product-description");
const coffee1Btn = document.getElementById("donate-1");
const coffee2Btn = document.getElementById("donate-2");
const coffee3Btn = document.getElementById("donate-3");
const coffeeQttyForm = document.getElementById("coffee-qtty-form");
const totalAmount = document.getElementById("total-amount");
const COFFEEVAL = 300;

coffee1Btn.addEventListener("click", () => {
  updateTotalAmount(1);
});
coffee2Btn.addEventListener("click", () => {
  updateTotalAmount(2);
});
coffee3Btn.addEventListener("click", () => {
  updateTotalAmount(3);
});
coffeeQttyForm.addEventListener("submit", e => {
  e.preventDefault();
  const formData = new FormData(coffeeQttyForm);
  updateTotalAmount(Number(formData.get("qtty")));
});

const updateTotalAmount = coffeeQtty => {
  totalAmount.textContent = coffeeQtty * COFFEEVAL;
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
    quantity: Number(totalAmount.textContent) / COFFEEVAL,
    description: productDescription.textContent,
    price: totalAmount.textContent,
  };

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

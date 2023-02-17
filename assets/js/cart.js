/* Carrito */

// #1 Base de datos
const db = [
  {
    id: 1,
    name: "Orange MC",
    price: 55,
    image: "assets/img/c_orange.png",
    category: "Camisa",
    quantity: 0,
  },
  {
    id: 2,
    name: "Vino MC",
    price: 65,
    image: "assets/img/c_vino.png",
    category: "Camisa",
    quantity: 7,
  },
  {
    id: 3,
    name: "Cuadro ML",
    price: 85,
    image: "assets/img/c_cuadro.png",
    category: "Camisa",
    quantity: 4,
  },
  {
    id: 4,
    name: "Saco Blue",
    price: 235,
    image: "assets/img/s_blue.png",
    category: "Sacos",
    quantity: 4,
  },
  {
    id: 5,
    name: "Saco Vino",
    price: 123,
    image: "assets/img/s_vino.png",
    category: "Sacos",
    quantity: 2,
  },
  {
    id: 6,
    name: "Saco Gris",
    price: 123,
    image: "assets/img/s_gris.png",
    category: "Sacos",
    quantity: 5,
  },
  {
    id: 7,
    name: "Traje Armani",
    price: 123,
    image: "assets/img/t_h_azul.png",
    category: "Trajes",
    quantity: 4,
  },
  {
    id: 8,
    name: "Traje Etsy",
    price: 123,
    image: "assets/img/t_gris.png",
    category: "Trajes",
    quantity: 4,
  },
  {
    id: 100,
    name: "Traje Boss",
    price: 1500,
    image: "assets/img/t_boss.png",
    category: "Trajes",
    quantity: 4,
  },
];

const products = db;


// #2 Pintar los productos en el DOM
const productContainer = document.getElementById("products__content");

function printProducts() {
  let html = "";
  for (const product of products) {
    html += `
    <article class="products__card ${product.category}">
      <div class="products__shape">
        <img src="${product.image}" alt="${product.name}" class="products__img">
      </div>

      <div class="products__data">
        <h2 class="products__name">${product.name}</h2>
        <div class="">
          <h3 class="products__price">$${product.price}</h3>
          <span class="products__quantity">Quedan solo ${product.quantity} unidades</span>
        </div>
        <button type="button" class="button products__button addToCart" data-id="${product.id}">
          <i class="bx bx-plus"></i>
        </button>
      </div>
    </article>
    `;
  }
  productContainer.innerHTML = html;
  window.localStorage.setItem("productsDB", JSON.stringify(products));
  console.log('pinta al inicio')
}

printProducts();


// #3 Carrito
let cart = window.localStorage.getItem("cartDB")
  ? JSON.parse(window.localStorage.getItem("cartDB"))
  : [];
const cartContainer = document.getElementById("cart__container");
const cartCount = document.getElementById("cart-count");
const itemsCount = document.getElementById("items-count");
const cartTotal = document.getElementById("cart-total");

function printCart() {
  let html = "";
  for (const article of cart) {
    const product = products.find((p) => p.id === article.id);
    html += `
    <article class="cart__card">
        <div class="cart__box">
          <img src="${product.image}" alt="${product.name}" class="cart__img">
        </div>

        <div class="cart__details">
          <h3 class="cart__title">${product.name} <span class="cart__price">$${
      product.price
    }</span></h3>

          <div class="cart__amount">
            <div class="cart__amount-content">
              <span class="cart__amount-box removeToCart" data-id="${
                product.id
              }">
                <i class="bx bx-minus"></i>
              </span>

              <span class="cart__amount-number">${article.qty}</span>

              <span class="cart__amount-box addToCart" data-id="${product.id}">
                <i class="bx bx-plus"></i>
              </span>
            </div>

            <i class="bx bx-trash-alt cart__amount-trash deleteToCart" data-id="${
              product.id
            }"></i>
            </div>
            
            <span class="cart__subtotal">
            <span class="cart__stock">Quedan ${
              product.quantity - article.qty
            } unidades</span>
            <span class="cart__subtotal-price">${
              product.price * article.qty
            }</span>
            </span>
            </div>
            </article>
            `;
  }
  cartContainer.innerHTML = html;
  cartCount.innerHTML = totalArticles();
  itemsCount.innerHTML = totalArticles();
  cartTotal.innerHTML = numberToCurrency(totalAmount());
  checkButtons();
  window.localStorage.setItem('cartDB', JSON.stringify(cart))
}

printCart();
// #4 Agragar al carrito
function addToCart(id, qty = 1) {
  const product = products.find((p) => p.id === id);
  if (product && product.quantity > 0) {
    const article = cart.find((a) => a.id === id);

    if (article) {
      if (checkStock(id, qty + article.qty)) {
        article.qty++;
      } else {
       Swal.fire({
          position: 'top-end',
          icon: 'warning',
          title: 'No hay stock suficiente',
          showConfirmButton: false,
          timer: 1500
        })

      }
    } else {
      cart.push({ id, qty });
    }
  } else {
    /*window.alert("Producto agotado");*/
    Swal.fire({
      position: 'top-end',
      icon: 'warning',
      title: 'Producto agotado',
      showConfirmButton: false,
      timer: 1500
    })

  }
  printCart();
}



function checkStock(id, qty) {
  const product = products.find((p) => p.id === id);
  return product.quantity - qty >= 0;
}

// #5 Remover articulos
function removeFromCart(id, qty = 1) {
  const article = cart.find((a) => a.id === id);

  if (article && article.qty - qty > 0) {
    article.qty--;
  } else {
    const confirm = window.confirm("Estás Seguro??");
    if (confirm) {
      cart = cart.filter((a) => a.id !== id);
    }
  }
  printCart();
}

// #6 Eliminar del carrito
function deleteFromCart(id) {
  const article = cart.find((a) => a.id === id);
  cart.splice(cart.indexOf(article), 1);
  printCart();
}

// #7 Contar Artículos
function totalArticles() {
  return cart.reduce((acc, article) => acc + article.qty, 0);
}

// #8 El total
function totalAmount() {
  return cart.reduce((acc, article) => {
    /* Primero recorre los productos, la base de datos para traer las propiedades y luego busca al producto por su id y lo hace coincidir con el articulo, si lo encuntra multiplica el precio del producto por la cantidad de artículos del carrito*/
    const product = products.find((p) => p.id === article.id);
    return acc + product.price * article.qty;
  }, 0);
}

// #9 Limpiar Carrito
function clearCart() {
  Swal.fire({
    title: 'Esta seguro de Vaciar el Carrito?',
    showDenyButton: false,
    showCancelButton: true,
    confirmButtonText: 'Vaciar',
    //denyButtonText: `Don't save`,
  }).then((result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      cart = [];
      printCart();
    } else if (result.isDenied) {
      Swal.fire('Changes are not saved', '', 'info')
    }
  })
  
}




// #10 Comprar
function checkout() {
  cart.forEach((article) => {
    const product = products.find((p) => p.id === article.id);

    product.quantity -= article.qty;
  });

  cart = [];

  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Your work has been saved',
    showConfirmButton: false,
    timer: 1500
  })
 
  printProducts();
  printCart();


}

function checkButtons() {
  if (cart.length > 0) {
    document.getElementById("cart-checkout").removeAttribute("disabled");
    document.getElementById("cart-empty").removeAttribute("disabled");
  } else {
    document
      .getElementById("cart-checkout")
      .setAttribute("disabled", "disabled");
    document.getElementById("cart-empty").setAttribute("disabled", "disabled");
  }
}

function numberToCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

/* Agregando eventos a nuestros botones */
productContainer.addEventListener("click", function (e) {
  const add = e.target.closest(".addToCart");

  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }
});

/* Agregando eventos a nuestro boton principal*/
buttonMain = document.getElementById('addToCartMain').addEventListener("click", function (e) {
 
  if (e.target) {
    addToCart(100);
  }
});

cartContainer.addEventListener("click", function (e) {
  const remove = e.target.closest(".removeToCart");
  const add = e.target.closest(".addToCart");
  const deleteCart = e.target.closest(".deleteToCart");

  if (remove) {
    
    const id = +remove.dataset.id;
    removeFromCart(id);
  }

  if (add) {
    const id = +add.dataset.id;
    addToCart(id);
  }

  if (deleteCart) {
    const id = +deleteCart.dataset.id;
    deleteFromCart(id);
  }
});

const actionButtons = document.getElementById("action-buttons");

actionButtons.addEventListener("click", function (e) {
  const clear = e.target.closest("#cart-empty");
  const buy = e.target.closest("#cart-checkout");

  if (clear) {
    clearCart();
  }

  if (buy) {
    checkout();
  }
});










const productsContainer = document.getElementById("products");
const productDetailsContainer = document.getElementById("product-details");
const orderDetailsContainer = document.getElementById("order-details");

const getData = () => {
  fetch("./data.json")
    .then((response) => response.json())
    .then((data) => {
      const products = data.categories["دجاج"];

      productsContainer.innerHTML = "";
      for (const product of products) {
        const productContent = `<li>
          <figure class="product" onclick="getProductDetails('${encodeURIComponent(
            JSON.stringify(product)
          )}')">
            <img src="./images/${product.image}" alt="${product.name}">
            <figcaption>
              <h3>${product.name}</h3>
              <p>${product.sizes["كبير أوي"]}ج.م</p>
            </figcaption>
          </figure>
        </li>`;
        productsContainer.innerHTML += productContent;
      }
    })
    .catch((error) => console.error("Error ", error));
};

const getProductDetails = (product) => {
  const { name, sizes } = JSON.parse(decodeURIComponent(product));
  let selectedSize = 0;
  let selectedSizeName = "";
  let quantity = 1;

  productDetailsContainer.innerHTML = "";
  const productDetailsContent = `
    <h2>${name}</h2>
    <ul class="sizes-container">
      <li>
        <button data-size-price="${sizes["كبير أوي"]}" data-size-name="كبير أوي">
          <span>كبير أوي</span>
          <span>${sizes["كبير أوي"]}ج.م</span>
        </button>
      </li>
      <li>
        <button data-size-price="${sizes["كبير"]}" data-size-name="كبير">
          <span>كبير </span>
          <span>${sizes["كبير"]}ج.م</span>
        </button>
      </li>
      <li>
        <button data-size-price="${sizes["وسط"]}" data-size-name="وسط">
          <span> وسط</span>
          <span>${sizes["وسط"]}ج.م</span>
        </button>
      </li>
    </ul>
    <section class="toppings">
      <h3>&#129513; مع اضافة</h3>
      <ul class="toppings-container">
        <div>
          <li>
            <button data-extra-name="اكسترا شيدر" data-extra-price="15">
              <span>اكسترا شيدر</span>
              <span>15ج.م</span>
              <span>&check;</span>
            </button>
          </li>
          <li>
            <button data-extra-name="اكسترا موتزريلا" data-extra-price="15">
              <span>اكسترا موتزريلا</span>
              <span>15ج.م</span>
              <span>&check;</span>
            </button>
          </li>
          <li>
            <button data-extra-name="اكسترا رومي مدخن" data-extra-price="15">
              <span>اكسترا رومي مدخن</span>
              <span>15ج.م</span>
              <span>&check;</span>
            </button>
          </li>
        </div>
        <div>
          <li>
            <button data-extra-name="اكسترا بيفي" data-extra-price="15">
              <span>اكسترا بيفي</span>
              <span>15ج.م</span>
              <span>&check;</span>
            </button>
          </li>
          <li>
            <button data-extra-name="اكسترا مشروم" data-extra-price="25">
              <span>اكسترا مشروم</span>
              <span>25ج.م</span>
              <span>&check;</span>
            </button>
          </li>
          <li>
            <button data-extra-name="اكسترا باربكيو" data-extra-price="10">
              <span>اكسترا باربكيو</span>
              <span>10ج.م</span>
              <span>&check;</span>
            </button>
          </li>
        </div>
      </ul>
    </section>
    <section class="quantity">
      <h3>حدد الكمية</h3>
      <div>
        <button disabled id="remove">-</button>
        <p id="count">1</p>
        <button disabled id="add">+</button>
      </div>
    </section>
    <button type="button" class="add-btn" disabled id="add-btn">اضافة للسلة</button>`;
  productDetailsContainer.innerHTML = productDetailsContent;

  // Product Sizes
  const sizesBtns = document.querySelectorAll(".sizes-container button");
  sizesBtns.forEach((sizeBtn) =>
    sizeBtn.addEventListener("click", () => {
      for (const btn of sizesBtns) {
        btn.classList.remove("active");
      }
      selectedSize = sizeBtn.getAttribute("data-size-price");
      selectedSizeName = sizeBtn.getAttribute("data-size-name");
      sizeBtn.classList.add("active");
      document.getElementById("add-btn").disabled = false;
      document.getElementById("add").disabled = false;
      document.getElementById("remove").disabled = false;
      console.log(selectedSize);
    })
  );

  // Product extra toppings
  const toppingsBtns = document.querySelectorAll(".toppings button");
  toppingsBtns.forEach((btn) =>
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
    })
  );

  // Increase / Decrease product count
  let count = +document.getElementById("count").innerText;
  document.getElementById("add").addEventListener("click", () => {
    count++;
    document.getElementById("count").innerText = count;
    quantity = count;
  });

  document.getElementById("remove").addEventListener("click", () => {
    if (count > 1) {
      count--;
    }
    document.getElementById("count").innerText = count;
    quantity = count;
  });

  // Send data to cart
  document.getElementById("add-btn").addEventListener("click", () => {
    // order extra toppings
    const selectdToppings = document.querySelectorAll(
      ".toppings button.active"
    );
    const extra = [];
    for (const topping of selectdToppings) {
      extra.push({
        extraName: topping.getAttribute("data-extra-name"),
        extraPrice: topping.getAttribute("data-extra-price"),
      });
    }

    const order = {
      productName: name,
      productSizeNme: selectedSizeName,
      productSizePrice: selectedSize,
      quantity,
      extra,
    };
    getOrderDetails(order);

    productDetailsContainer.innerHTML = `<p class="no-data">لا توجد بيانات للعرض</p>`;
  });
};
let total = 0;
const getOrderDetails = (order) => {
  const { productName, productSizeNme, productSizePrice, quantity, extra } =
    order;

  // Add price for new product
  total +=
    quantity *
    (extra.reduce((acc, item) => acc + +item.extraPrice, 0) +
      +productSizePrice);

  document.getElementById("total").innerText = total.toFixed(2);

  const updateTotal = (state, price, toppingsPrice) => {
    if (state === "add") {
      total += price + toppingsPrice;
    }

    if (state === "remove") {
      total -= price + toppingsPrice;
    }
    document.getElementById("total").innerText = total.toFixed(2);
  };

  const getExtraContent = (extraToppings) => {
    let content = "";
    for (const topping of extraToppings) {
      content += `
    <div>
      <dt>&#129513;${topping.extraName}</dt>
      <dd>${topping.extraPrice}ج.م</dd>
    </div>`;
    }
    return content;
  };
  const orderContent = ` 
    <tr>
      <td>
        <p><span class="quantity">${quantity} </span> ${productName} (${productSizeNme} )</p>
        ${
          extra.length
            ? `<dl class="extra" data-extra-price="${extra.reduce(
                (acc, item) => acc + +item.extraPrice,
                0
              )}">${getExtraContent(extra)}</dl>`
            : ""
        }
      </td>
      <td>
        <span class="price">${productSizePrice}</span>ج.م
      </td>
      <td>
        <button class="cart-add-btn">+</button>
        <button class="cart-remove-btn">-</button>
      </td>
    </tr>`;
  orderDetailsContainer.innerHTML += orderContent;

  // add/remove btns
  const addBtns = document.querySelectorAll(".cart-add-btn");
  const removeBtns = document.querySelectorAll(".cart-remove-btn");
  addBtns.forEach((btn) => {
    // Increase product count
    const currentProduct = btn.parentNode.parentNode;
    const productPrice = +currentProduct.querySelector(".price").innerText;
    const extraPrice =
      +currentProduct
        .querySelector(".extra")
        ?.getAttribute("data-extra-price") || 0;

    btn.addEventListener("click", () => {
      let currentQuantity =
        +currentProduct.querySelector(".quantity").innerText;
      currentProduct.querySelector(".quantity").innerText = currentQuantity + 1;
      updateTotal("add", productPrice, extraPrice);
    });
  });

  removeBtns.forEach((btn) => {
    // Decrease product count
    const currentProduct = btn.parentNode.parentNode;
    const productPrice = +currentProduct.querySelector(".price").innerText;
    const extraPrice =
      +currentProduct
        .querySelector(".extra")
        ?.getAttribute("data-extra-price") || 0;

    btn.addEventListener("click", () => {
      let currentQuantity =
        +currentProduct.querySelector(".quantity").innerText;
      if (currentQuantity > 1) {
        currentProduct.querySelector(".quantity").innerText =
          currentQuantity - 1;
        updateTotal("remove", productPrice, extraPrice);
      }
    });
  });
};

// empty cart
document.getElementById("empty-cart").addEventListener("click", () => {
  orderDetailsContainer.innerHTML = "";
  total = 0;
  document.getElementById("total").innerText = total.toFixed(2);
});

getData();

/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the shoppingcart website, which is used to fullfill
 * the function of check all the watches in the shoppingcart, user can also change the
 * Quantity and color of the watch, then display the total price of all the watches.
 */

"use strict";

(function() {

  window.addEventListener('load', init);
  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";

  /**
   * This function initializes all the functions and event listeners on page load.
   */
  async function init() {
    await getAllWatches();
    changeHeaderWhenScrolled();
    checkoutStatusChecking();
    id("checkout").addEventListener("click", () => {
      moveViewIfLoggedInOrNot();
    });
    addOrChangeFromCart();
  }

  /**
   * Add or change quanitity of items from Shoping Cart
   * when remove button clicked or quanity changed.
   */
  function addOrChangeFromCart() {
    for (let remove of qsa(".remove p")) {
      remove.addEventListener("click", (event) => {
        removeItem(event);
      });
    }
    for (let selector of qsa(".selectorquantity")) {
      selector.addEventListener("change", (event) => {
        changeQuantity(event);
      });
    }
  }

  /**
   * change the header background and text color when scrolled down.
   */
  function changeHeaderWhenScrolled() {
    window.onscroll = function() {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    };
  }

  /** This function is used to deal with if user is logged in or not*/
  async function moveViewIfLoggedInOrNot() {
    let response = await fetch("/REM/checkiflogin");
    await statusCheck(response);
    let result = await response.text();
    if (result === "havn't Login") {
      window.location.href = "login.html";
    } else {
      window.location.href = "payment.html";
    }
  }

  /**
   * This function checks if there are items in the shopping cart
   * and updates the checkout button status.
   */
  function checkoutStatusChecking() {
    if (id("left-side").children.length === 1) {
      qs("button").disabled = true;
    } else {
      qs("button").disabled = false;
    }
  }

  /**
   * This function changes the quantity of a watch in the shopping cart.
   * @param {Event} event - The event triggered by changing the quantity.
   */
  async function changeQuantity(event) {
    let card = event.target.closest(".product");
    let numberOfWatch = event.target.value;
    let formdata = new FormData();
    formdata.append("id", card.id);
    formdata.append("number", numberOfWatch);
    try {
      let response = await fetch("/REM/changequantity", {
        method: "POST",
        body: formdata
      });
      response = await statusCheck(response);
      response = await response.text();
      if (response === "change the quantity successfully") {
        id("left-side").innerHTML = "";
        let result = getCurrentWatches();
        changeSummary(result);
      }
    } catch (err) {
      errHandle();
    }
  }

  /**
   * This function removes an item from the shopping cart.
   * @param {Event} event - The event triggered by removing an item.
   */
  async function removeItem(event) {
    let card = event.target.closest(".product");
    let formdata = new FormData();
    formdata.append("id", card.id);
    try {
      let response = await fetch("/REM/removeitem", {
        method: "POST",
        body: formdata
      });
      await statusCheck(response);
      response = await response.text();
      id("left-side").innerHTML = "";
      let result = await getCurrentWatches();
      changeSummary(result);
      checkoutStatusChecking();
    } catch (err) {
      errHandle();
    }
  }

  /**
   * Fetches all watch information from the backend and updates the UI.
   */
  async function getAllWatches() {
    try {
      let response = await fetch(GET_WATCH_INFO_URL);
      response = await statusCheck(response);
      let result = await response.json();
      let head = gen("h2");
      head.textContent = "Your Selections (" + result.length + ")";
      id("left-side").appendChild(head);
      for (let product of result) {
        let eachProduct = updateWebView(product);
        id("left-side").appendChild(eachProduct);
      }
      changeSummary(result);
    } catch (err) {
      errHandle();
    }
  }

  /**
   * Fetches current watches in the shopping cart from the backend and updates the UI.
   * @return {Array} - The list of current watches.
   */
  async function getCurrentWatches() {
    try {
      let response = await fetch(GET_WATCH_INFO_URL);
      response = await statusCheck(response);
      let result = await response.json();
      let head = gen("h2");
      head.textContent = "Your Selections (" + result.length + ")";
      id("left-side").appendChild(head);
      for (let product of result) {
        let eachProduct = updateWebView(product);
        id("left-side").appendChild(eachProduct);
      }
      let removes = qsa(".remove p");
      for (let remove of removes) {
        remove.addEventListener("click", (event) => {
          removeItem(event);
        });
      }
      for (let selector of qsa(".selectorquantity")) {
        selector.addEventListener("change", (event) => {
          changeQuantity(event);
        });
      }
      changeSummary(result);
      return result;
    } catch (err) {
      errHandle();
    }
  }

  /**
   * Updates the UI with the watch information.
   * @param {Object} product - The watch product information.
   * @return {HTMLElement} productContainer - The container element with the watch information.
   */
  function updateWebView(product) {
    let productContainer = gen('section');
    productContainer.classList.add('product-container');

    let productSection = addProductDescription(product, productContainer);
    addCostOptions(product, productSection);

    // Insert a divider
    let hr = gen('hr');
    productContainer.appendChild(hr);

    return productContainer;
  }

  /**
   * Adds product description to the product container.
   * @param {Object} product - The watch product information.
   * @param {HTMLElement} productContainer - The container element for the product.
   * @returns {HTMLElement} - The section element with the product description.
   */
  function addProductDescription(product, productContainer) {
    let productSection = gen('section');
    productSection.classList.add('product');
    productContainer.appendChild(productSection);
    let img = gen('img');
    img.src = product.Img1;
    productSection.appendChild(img);
    let descriptionSection = gen('section');
    descriptionSection.classList.add('description');
    productSection.appendChild(descriptionSection);
    let productName = gen('p');
    productName.classList.add('description-name');
    productName.textContent = product.Name;
    descriptionSection.appendChild(productName);
    let productId = gen('p');
    productId.classList.add('description-id');
    productId.textContent = 'ID: ' + product.Type;
    descriptionSection.appendChild(productId);
    let productStatus = gen('p');
    productStatus.classList.add('description-status');
    productStatus.textContent = "Available";
    descriptionSection.appendChild(productStatus);
    let productStatusMsg = gen('p');
    productStatusMsg.classList.add('description-status-msg');
    productStatusMsg.textContent = "Your selection is available to purchase online.";
    descriptionSection.appendChild(productStatusMsg);
    productSection.id = product.WatchID;
    return productSection;
  }

  /**
   * Adds cost options to the product section.
   * @param {Object} product - The watch product information.
   * @param {HTMLElement} productSection - The section element for the product.
   */
  function addCostOptions(product, productSection) {
    let costSection = createCostSection();
    productSection.appendChild(costSection);

    addPriceToSection(product.Price, costSection);
    addQuantitySelector(product.Quantity, costSection);
    addColorSelector(costSection);
    addRemoveOption(costSection);
  }

  /**
   * Creates and returns the cost section element.
   * @return {HTMLElement} - The created cost section element.
   */
  function createCostSection() {
    let costSection = gen('section');
    costSection.classList.add('cost');
    return costSection;
  }

  /**
   * Adds the price information to the given section.
   * @param {number} price - The price of the product.
   * @param {HTMLElement} section - The section to which the price information is added.
   */
  function addPriceToSection(price, section) {
    let priceElement = gen('p');
    priceElement.textContent = '$' + price;
    section.appendChild(priceElement);
  }

  /**
   * Adds a quantity selector to the given section.
   * @param {number} selectedQuantity - The currently selected quantity of the product.
   * @param {HTMLElement} section - The section to which the quantity selector is added.
   */
  function addQuantitySelector(selectedQuantity, section) {
    let quantitySelector = gen('select');
    quantitySelector.classList.add("selectorquantity");
    for (let i = 1; i <= 3; i++) {
      let option = gen('option');
      option.value = i;
      option.textContent = 'QTY: ' + i;
      quantitySelector.appendChild(option);
      if (i === selectedQuantity) {
        option.selected = true;
      }
    }
    section.appendChild(quantitySelector);
  }

  /**
   * Adds a color selector to the given section.
   * @param {HTMLElement} section - The section to which the color selector is added.
   */
  function addColorSelector(section) {
    let colorSelector = gen('select');
    for (let color of ['blue', 'white', 'black']) {
      let option = gen('option');
      option.value = color;
      option.textContent = 'COLOR: ' + color.toUpperCase();
      colorSelector.appendChild(option);
    }
    section.appendChild(colorSelector);
  }

  /**
   * Adds a remove option to the given section.
   * @param {HTMLElement} section - The section to which the remove option is added.
   */
  function addRemoveOption(section) {
    let removeSection = gen('section');
    removeSection.classList.add('remove');
    let remove = gen('p');
    remove.textContent = 'Remove';
    removeSection.appendChild(remove);
    section.appendChild(removeSection);
  }

  /**
   * Updates the order summary with the current watch selections.
   * @param {Array} result - An array containing all the watch objects.
   */
  function changeSummary(result) {
    let subtotal = 0;
    let numberOfWatch = 0;
    for (let i = 0; i < result.length; i++) {
      numberOfWatch = numberOfWatch + result[i].Quantity;
      subtotal = subtotal + parseInt((result[i].Price)) * (result[i].Quantity);
    }
    qs("#order-summary p").textContent = numberOfWatch + " item";
    let tax = subtotal * 0.1025;
    let total = subtotal + tax;

    qs("#subtotal p").textContent = "$ " + Math.floor(subtotal);
    qs("#tax p").textContent = "$ " + Math.floor(tax);
    qs("#total p").textContent = "$ " + Math.floor(total);
  }

  /** This function is used to handle the error */
  function errHandle() {
    id("errdisplay").classList.remove("hidden");
    setTimeout(() => {
      id("errdisplay").classList.add("hidden");
    }, 2000);
  }

  /**
   * Helper function to create a new HTML element.
   * @param {string} selector - The type of element to create.
   * @return {HTMLElement} - The created element.
   */
  function gen(selector) {
    return document.createElement(selector);
  }

  /**
   * Helper function to check the response status and return the result if successful.
   * @param {Response} res - The response to check.
   * @return {Promise<Response>} - The valid response if successful.
   * @throws {Error} - If the response is not successful.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Helper function to get an element by its ID.
   * @param {string} id - The ID of the element.
   * @return {HTMLElement} - The element with the specified ID.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Helper function to get the first element that matches the selector.
   * @param {string} selector - The CSS selector.
   * @return {HTMLElement} - The first element that matches the selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * This function is used to get all the elements by its name
   * @param {string} selector - the elements wants to be find in the HTML page
   * @return {Node} return the all the node that selector corespond to .
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

})();
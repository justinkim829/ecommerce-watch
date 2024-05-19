"use strict";

(function () {

  window.addEventListener('load', init);
  const GET_WATCH_INFO_URL = "/REM/getwatchesinfo";
  const COLOR = ["blue", "white", "black"];

  function init() {

    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function (evt) {
      openSidebar(evt);
    });

    //click and close the side bar
    id("close").addEventListener('click', function () {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function () {
        hideExistSidebars(SIDEBARS[(i + 1) % 3], SIDEBARS[(i + 2) % 3]);
        toggleSidebar(SIDEBARS[i]);
      })
    }
    let checkoutButton = id("checkout");
    checkoutButton.addEventListener("click", () => {
      window.location.href = "payment.html";
    })
    getAllWatches();
  }

  function openSidebar(evt) {
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');

    id("sidebar").style.left = '0px';
    id("overlay").style.display = "block";
    id("overlay").style.pointerEvents = 'auto';
    [type1Sidebar, type2Sidebar, type3Sidebar].forEach(sidebar => {
      sidebar.style.left = '0px';
    });
    evt.stopPropagation();
    document.addEventListener('click', closeSidebar);
  }
  // HEADER FUNCTION START
  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
      subSidebar.style.display = "block";
    } else {
      subSidebar.style.left = "0px";
      subSidebar.style.display = "none";
    }
  }

  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
        sidebar.style.display = "none";
      }
    });
  }

  //when click the place other than sidebar, the sidebar would be closed
  function closeSidebar(event) {
    let sidebar = id('sidebar');
    let type1Sidebar = id('type1sidebar');
    let type2Sidebar = id('type2sidebar');
    let type3Sidebar = id('type3sidebar');
    let overlay = id("overlay");

    if (!sidebar.contains(event.target) && !type1Sidebar.contains(event.target) &&
      !type2Sidebar.contains(event.target) && !type3Sidebar.contains(event.target)) {
      sidebar.style.left = "-300px";
      hideAllSidebars(type1Sidebar, type2Sidebar, type3Sidebar);
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';

      document.removeEventListener('click', closeSidebar);
    }

  }

  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
  }


  async function getAllWatches() {
    try {
      let response = await fetch(GET_WATCH_INFO_URL);
      response = await statusCheck(response);
      let result = await response.json();
      let head = gen("h2");
      head.textContent = "Your Selections (" + result.length + ")";
      id("left-side").appendChild(head)
      for (let product of result) {
        let eachProduct = updateWebView(product);
        id("left-side").appendChild(eachProduct);
      }
      changeSummary(result);

    } catch (err) {
      console.error(err)
    }
  }

  //for each watch
  function updateWebView(product) {

    let productContainer = gen('section');
    productContainer.classList.add('product-container');

    // Create product section
    let productSection = gen('section');
    productSection.classList.add('product');
    productContainer.appendChild(productSection);

    // Add image
    let img = gen('img');
    img.src = product.Img1; //!!!!!!!!
    productSection.appendChild(img);

    // Add description section
    let descriptionSection = gen('section');
    descriptionSection.classList.add('description');
    productSection.appendChild(descriptionSection);

    // Product name
    let productName = gen('p');
    productName.classList.add('description-name');
    productName.textContent = product.Name; //!!!!!!!!!
    descriptionSection.appendChild(productName);

    // Product ID
    let productId = gen('p');
    productId.classList.add('description-id');
    productId.textContent = 'ID: ' + product.Type; //!!!!!! type
    descriptionSection.appendChild(productId);

    // Product availability
    let productStatus = gen('p');
    productStatus.classList.add('description-status');
    productStatus.textContent = "Available";
    descriptionSection.appendChild(productStatus);

    // Product status message
    let productStatusMsg = gen('p');
    productStatusMsg.classList.add('description-status-msg');
    productStatusMsg.textContent = "Your selection is available to purchase online.";
    descriptionSection.appendChild(productStatusMsg);

    // Cost section
    let costSection = gen('section');
    costSection.classList.add('cost');
    productSection.appendChild(costSection);

    // Price
    let price = gen('p');
    price.textContent = '$' + product.Price;//!!!!!!!!
    costSection.appendChild(price);

    // Quantity selector
    let quantitySelector = gen('select');
    for (let i = 1; i <= 3; i++) {
      let option = gen('option');
      option.value = i;
      option.textContent = 'QTY: ' + i;
      quantitySelector.appendChild(option);
      if (i === product.Quantity) option.selected = true;
    }
    costSection.appendChild(quantitySelector);

    // Color selector
    let colorSelector = gen('select');
    for (let i = 0; i < COLOR.length; i++) {
      const option = gen('option');
      option.value = COLOR[i];
      option.textContent = 'COLOR: ' + COLOR[i].toUpperCase();
      colorSelector.appendChild(option);
    }
    costSection.appendChild(colorSelector);

    // Remove/Edit options
    let removeSection = gen('section');
    removeSection.classList.add('remove');
    costSection.appendChild(removeSection);

    let edit = gen('p');
    edit.textContent = 'Edit';
    removeSection.appendChild(edit);

    let remove = gen('p');
    remove.textContent = 'Remove';
    removeSection.appendChild(remove);

    // Insert a divider
    let hr = gen('hr');
    productContainer.appendChild(hr);

    return productContainer;
  }

  function changeSummary(result) {
    qs("#order-summary p").textContent = result.length + " item";
    let subtotal=0;
    for (let product of result) {
      subtotal = subtotal + (product.Price)*(product.Quantity);
    }
    let tax = subtotal * 0.1025;
    let total = subtotal + tax;

    qs("#subtotal p").textContent = "$"+subtotal;
    qs("#tax p").textContent = "$"+tax;
    qs("#total p").textContent = "$"+total;
  }





  function gen(selector) {
    return document.createElement(selector);
  }


  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} res - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }


  /**
   * This function is used to get that element by its ID
   * @param {string} id - the ID that wants to get
   * @return {Node} return the node that ID corespond to .
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * This function is used to get that element by its name
   * @param {string} selector - the element wants to be find in the HTML page
   * @return {Node} return the node that selector corespond to .
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

})();
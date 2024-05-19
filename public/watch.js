"use strict";

(function () {

  window.addEventListener('load', init);

  const CATEGORIES_MAP = new Map([
    ['M', 3],
    ['D', 3],
    ['P', 3]
  ]);

  function init() {

    sidebarStart();

    qs("#product-details p").addEventListener("click", displayDetailSidebar)
    qs("#sidebarfordetail .close").addEventListener("click", closeTheDetailSidebar)
    checkClickedWatch();

    let wishlistIcon = qs("#add-to-wishlist p");
    wishlistIcon.addEventListener('click', addToWishlist);

    let rightArrow = qs("#right-arrow p");
    rightArrow.addEventListener('click', () => {
      nextPicture(true);
    });

    let leftArrow = qs("#left-arrow p");
    leftArrow.addEventListener('click', () => {
      nextPicture(false);
    });

    //lock header when window is scrolled down
    window.onscroll = function () {
      let header = qs("header");
      if (window.scrollY > 0) {
        header.classList.add("lock-header");
      } else {
        header.classList.remove("lock-header");
      }
    }

    receiveSidebarToWatch();
  }

  function receiveSidebarToWatch() {
    const checkProductID = setInterval(() => {
      const productID = sessionStorage.getItem('productID');
      if (productID) {
        reloadPage(productID);
        clearInterval(checkProductID);
      }
    }, 100);
  }

  function sidebarStart() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function(evt) {
      openSidebar(evt);
    });

    //click and close the side bar
    qs(".close").addEventListener('click', function() {
      closeSidebar(id("sidebar"), SIDEBARS[0], SIDEBARS[1], SIDEBARS[2]);
    });

    for (let i = 0; i < SIDEBARS.length; i++) {
      let idText = "type" + String(i + 1);
      id(idText).addEventListener("click", function() {
        hideExistSidebars(SIDEBARS[(i + 1) % 3], SIDEBARS[(i + 2) % 3]);
        toggleSidebar(SIDEBARS[i]);
      })
    }
  }

  /**
   * this function is used to change into the next picture when we clicked the arrow
   * @param {boolean} isRightArrow - whether user chicked the arrow
   */
  function nextPicture(isRightArrow) {
    let currentImage = qs("#img-container img");

    let currentNumberIndex = currentImage.src.indexOf(".") - 1;
    let currentNumber = parseInt(currentImage.src[currentNumberIndex]);

    let nextNumber;
    let allHR = qsa("#image-number hr");
    if (isRightArrow) {
      nextNumber = (currentNumber + 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 1 : nextNumber;
      allHR[currentNumber % 4].classList.toggle("to-black-border");
      allHR[currentNumber % 4].classList.toggle("to-white-border");
    } else {
      nextNumber = (currentNumber - 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 4 : nextNumber;
      allHR[(currentNumber + 2) % 4].classList.toggle("to-black-border");
      allHR[(currentNumber + 2) % 4].classList.toggle("to-white-border");
    }
    allHR[currentNumber - 1].classList.toggle("to-black-border");
    allHR[currentNumber - 1].classList.toggle("to-white-border");

    let startIndex = currentImage.src.indexOf("img/");
    let path = currentImage.src.substring(startIndex, currentNumberIndex);
    let newSrc = path + nextNumber + ".png";

    currentImage.src = newSrc;
  }

  /** this function is used to add this product into the wishlist when click the love icon*/
  function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    if (id("add-message").children.length === 0) {
      if (wishlistIcon.textContent === "â™¡") {
        wishlistIcon.textContent = "â™¥ï¸Ž"
        message.textContent = "Added to wishlist";
      } else {
        wishlistIcon.textContent = "â™¡";
        message.textContent = "Removed from Wishlist";
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
    }
  }

  function displayDetailSidebar(event) {
    let productDetails = id("sidebarfordetail");
    productDetails.style.right = "0px";
    id("overlay").style.display = "block";
    id("overlay").style.pointerEvents = 'auto';
    event.stopPropagation();
    document.addEventListener('click', closeDetailSidebarAuto);

  }

  function closeTheDetailSidebar() {
    let productDetails = id("sidebarfordetail");
    productDetails.style.right = "-400px";
    id("overlay").style.display = "none";
  }

  function closeDetailSidebarAuto(event) {
    let sidebarfordetail = id("sidebarfordetail");

    if (!sidebarfordetail.contains(event.target)) {
      sidebarfordetail.style.right = "-400px";
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
      document.removeEventListener('click', closeSidebar);
    }

  }

  // RELOAD PAGEEEEEEEEEE
  function resetHRs() {
    let allHRs = qsa("#image-number hr");
    for (let i = 0; i < allHRs.length; i++) {
      allHRs[i].classList.remove("to-white-border");
      allHRs[i].classList.add("to-black-border");
    }
    allHRs[0].classList.add("to-white-border");
    allHRs[0].classList.remove("to-blacke-border");
  }

  function checkClickedWatch() {
    let options = qsa(".double-sidebar ul li");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', () => {
        let productID = options[i].querySelector("p").textContent;
        reloadPage(productID);
      });
    }
  }

  function resetAllSidebar() {
    let overlay = id("overlay");
    let arraySidebars = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar'), id("sidebar")];
    for (let sidebar of arraySidebars) {
      sidebar.style.left = "-300px";
      overlay.style.display = "none";
      overlay.style.pointerEvents = 'none';
    }
  }

  function changeWatchImages(productID) {
    resetAllSidebar();
    let productType = productID[0];
    let productNum = parseInt(productID[1]);

    let folderPath = `img/${productType}/watch${productNum}`;
    let imagePath = folderPath + "/img1.png";
    let currentImage = qs("#img-container img");
    currentImage.src = imagePath;
    currentImage.alt = imagePath;

    let productNumber = qs("#product-number p");
    productNumber.textContent = productID;

    let recommendations = [];
    let watchNums = CATEGORIES_MAP.get(productType);
    for (let i = productNum + 1; i <= productNum + watchNums; i++) {
      let nextWatchNum = (i % watchNums) === 0 ? watchNums : i % watchNums;
      if (nextWatchNum !== productNum) {
        let sameCatPath = `img/${productType}/watch${nextWatchNum}/img1.png`;
        recommendations.push([sameCatPath, productType + nextWatchNum]);
      }
    }
    for (let key of CATEGORIES_MAP.keys()) {
      if (key !== productType) {
        let diffCatPath = `img/${key}/watch${productNum}/img1.png`;
        recommendations.push([diffCatPath, key + productNum]);
      }
    }
    let recommendedWatches = qsa("#recommendation-list .watch-box img");
    for (let i = 0; i < recommendedWatches.length; i++) {
      recommendedWatches[i].src = recommendations[i][0];
      recommendedWatches[i].alt = recommendations[i][1];

      recommendedWatches[i].removeEventListener('click', recommendedWatches[i].clickHandler);

      recommendedWatches[i].clickHandler = () => reloadPage(recommendedWatches[i].alt);
      recommendedWatches[i].addEventListener('click', recommendedWatches[i].clickHandler, { once: true });
    }
  }

  function reloadPage(productID) {
    changeWatchImages(productID);
    resetHRs();
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


  /**
   * this function is used to change into the next picture when we clicked the arrow
   * @param {boolean} isRightArrow - whether user chicked the arrow
   */
  function nextPicture(isRightArrow) {
    let currentImage = qs("#img-container img");

    let currentNumberIndex = currentImage.src.indexOf(".") - 1;
    let currentNumber = parseInt(currentImage.src[currentNumberIndex]);

    let nextNumber;
    let allHR = qsa("#image-number hr");
    if (isRightArrow) {
      nextNumber = (currentNumber + 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 1 : nextNumber;
      allHR[currentNumber % 4].classList.toggle("to-black-border");
      allHR[currentNumber % 4].classList.toggle("to-white-border");
    } else {
      nextNumber = (currentNumber - 1) % 5;
      nextNumber = (nextNumber % 5 === 0) ? 4 : nextNumber;
      allHR[(currentNumber + 2) % 4].classList.toggle("to-black-border");
      allHR[(currentNumber + 2) % 4].classList.toggle("to-white-border");
    }
    allHR[currentNumber - 1].classList.toggle("to-black-border");
    allHR[currentNumber - 1].classList.toggle("to-white-border");

    let startIndex = currentImage.src.indexOf("img/");
    let path = currentImage.src.substring(startIndex, currentNumberIndex);
    let newSrc = path + nextNumber + ".png";

    currentImage.src = newSrc;
  }

  /** this function is used to add this product into the wishlist when click the love icon*/
  function addToWishlist() {
    let wishlistIcon = qs("#add-to-wishlist p");
    let message = gen("p");
    if (id("add-message").children.length === 0) {
      if (wishlistIcon.textContent === "♡") {
        wishlistIcon.textContent = "♥︎"
        message.textContent = "Added to wishlist";
      } else {
        wishlistIcon.textContent = "♡";
        message.textContent = "Removed from Wishlist";
      }
      setTimeout(() => {
        id("add-message").removeChild(message);
      }, 1500);
      id("add-message").appendChild(message);
    }
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

    if (!sidebar.contains(event.target) && event.target !== menu
      && !type1Sidebar.contains(event.target) && !type2Sidebar.contains(event.target)
      && !type3Sidebar.contains(event.target)) {
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

  //HEADER FUNCTION END
  function gen(element) {
    return document.createElement(element);
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

  /**
   * This function is used to get all the elements by its name
   * @param {string} selector - the elements wants to be find in the HTML page
   * @return {Node} return the all the node that selector corespond to .
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();
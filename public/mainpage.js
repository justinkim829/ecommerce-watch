"use strict";

(function() {

  window.addEventListener("load", init);

  /** This function is used to initialize all the functions */
  function init() {
    sidebarStart();
    setDefaultInput();
    sendSidebarToWatch();
  }

  /** This function is used to change the mainpage into each watch page */
  function sendSidebarToWatch() {
    let options = qsa(".double-sidebar ul li");
    for (let i = 0; i < options.length; i++) {
      options[i].addEventListener('click', () => {
        let productID = options[i].querySelector("p").textContent;
        sessionStorage.setItem('productID', productID);
        window.location.href = "watch.html";
      });
    }
  }

  /**
   * This function is used to open the sidebar
   * @param {object} - evt refers to which specific sidebar is being clicked
   */
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
   * This function is used to make sure when there is nothing input into the search bar,
   * When we hit return on the search bar, we would go to certian watch page
   */
  function setDefaultInput() {
    let input = qs("#search-part input");
    input.addEventListener('keypress', (evt) => {
      if (evt.key === "Enter") {
        let inputValue = input.value.trim().toLowerCase();
        if (inputValue === '' || "watch".includes(inputValue)) {
          window.location.href = 'watch.html';
        }
      }
    });
  }

  /** This function is used to control all the small sidebars and open it when clicked */
  function sidebarStart() {
    const SIDEBARS = [id('type1sidebar'), id('type2sidebar'), id('type3sidebar')];
    id("menu").classList.add(".change");
    id("menu").addEventListener('click', function(evt) {
      openSidebar(evt);
    });

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
   * This function is used to open and close the sidebar
   * @param {object} - subSidebar the sidebar that poll out
   */
  function toggleSidebar(subSidebar) {
    if (subSidebar.style.left === "0px") {
      subSidebar.style.left = "300px";
      subSidebar.style.display = "block";
    } else {
      subSidebar.style.left = "0px";
      subSidebar.style.display = "none";
    }
  }

  /**
   * This function is used to hide all the appeared sidebars
   * @param {object} - subSidebar1 the subsidebar that already poll out
   * @param {object} - subSidebar2 the subsidebar that already poll out
   */
  function hideExistSidebars(subSidebar1, subSidebar2) {
    [subSidebar1, subSidebar2].forEach(sidebar => {
      if (sidebar.style.left === "300px") {
        sidebar.style.left = "0px";
        sidebar.style.display = "none";
      }
    });
  }

  /**
   * when click the place other than sidebar, the sidebar would be closed
   * @param {object} - the action of click the page
   */
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

  /**
   * This function is used to close all the sidebars
   * @param {object} - subSidebar1 the sidebar that poll out
   * @param {object} - subSidebar2 the sidebar that poll out
   * @param {object} - subSidebar3 the sidebar that poll out
   */
  function hideAllSidebars(subSidebar1, subSidebar2, subSidebar3) {
    [subSidebar1, subSidebar2, subSidebar3].forEach(sidebar => {
      sidebar.style.left = "-300px";
      sidebar.style.display = "none";
    });
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
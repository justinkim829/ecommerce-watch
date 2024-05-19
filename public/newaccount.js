"use strict";

(function () {

  window.addEventListener('load', init);
  const CREATE_URL = "/REM/createAccount";

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
    id("form1").addEventListener("submit", (evt) => {
      createAccount(evt);
    });
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

  async function createAccount(event) {
    event.preventDefault();

    let formData = new FormData();
    formData.append("Email", id('emailaddress').value);
    formData.append("Password", id('password').value);
    formData.append("Gender", id('title').value);
    formData.append("FirstName", id('firstname').value);
    formData.append("LastName", id('lastname').value);
    formData.append("Month", id('month').value);
    formData.append("Day", id('day').value);
    formData.append("Year", id('year').value);

    try {
      let response = await fetch(CREATE_URL, {
        method: "POST",
        body: formData
      });
      response = await statusCheck(response);
      let result = await response.text();
      let message = gen("p");
      message.textContent = result;
      id("showstatus").appendChild(message);

    } catch (err) {
      console.error(err);
    }
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

  function gen(selector) {
    return document.createElement(selector);
  }

})();
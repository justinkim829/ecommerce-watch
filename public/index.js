/*
 * Name: Jincheng Wang,Jinseok Kim
 * Date: May 28, 2024
 * Class: CSE 154
 * This is the JS to implement for the mianpage website, which is used to fullfill
 * to search the watches they want in the search bar, also view some recommendation
 * watches below.
 */

"use strict";

(function() {

  window.addEventListener("load", init);

  /** This function is used to initialize all the functions */
  function init() {
    filterSearchBar();
    sendRecommendationsToWatch();
    changeHeaderWhenScrolled();
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

  /**
   * This function is used to change the images and contents of the page
   * to match the clicked recommendation (watch).
   */
  function sendRecommendationsToWatch() {
    let recommended = qsa(".box");
    let productIDs = ["M1", "D1", "P3"];

    for (let i = 0; i < recommended.length; i++) {
      recommended[i].addEventListener('click', () => {
        let productID = productIDs[i];
        localStorage.setItem('productID', productID);
        window.location.href = "watch.html";
      });
    }
  }

  /**
   * This function is used to filter through the watches
   * and move to the watch page that fits the user input.
   */
  function filterSearchBar() {
    let input = qs("#search-part input");
    input.addEventListener('keypress', async (evt) => {
      if (evt.key === "Enter") {
        let inputValue = input.value.trim().toLowerCase();
        let params = new FormData();
        params.append("input", inputValue);
        try {
          let recommendedID = await postData('/REM/recommendation', params, true);
          localStorage.setItem('productID', recommendedID);
          window.location.href = "watch.html";
        } catch (err) {
          id("textarea").value = "";
          id("textarea").placeholder = "No Matches Found. Try Again.";
        }
      }
    });
  }

  /**
   * Fetches data from post endpoints.
   * @param {String} endPoint - the endpoint of the post
   * @param {FormData} params - the body of the post request
   * @param {String} isReturnText - the return text
   * @returns {String|JSON} data - the processed data
   */
  async function postData(endPoint, params, isReturnText) {
    let data;
    try {
      data = await fetch(endPoint, {
        method: 'POST',
        body: params
      });
      await statusCheck(data);
      if (isReturnText) {
        data = await data.text();
      } else {
        data = await data.json();
      }
      return data;
    } catch (err) {
      throw new Error(await data.text());
    }
  }

  /**
   * Checks the status of the response.
   * @param {Response} res - The response object.
   * @throws an error if the response is not ok.
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
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

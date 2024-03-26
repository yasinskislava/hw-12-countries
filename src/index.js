import {
  error,
  defaultModules,
} from "../node_modules/@pnotify/core/dist/PNotify.js";
import * as PNotifyMobile from "../node_modules/@pnotify/mobile/dist/PNotifyMobile.js";

defaultModules.set(PNotifyMobile, {});

import debounce from "../node_modules/lodash.debounce/index.js";
const searchbar = document.querySelector("input");
const searchList = document.getElementById("searchList");
searchbar.addEventListener(
  "input",
  debounce(() => {
    fetch(
      `https://restcountries.com/v3.1/all?fields=name,flags,languages,capital,population`
    )
      .then((value) => value.json())
      .then((value) => {
        const countryList = [];
        value.map((country) => {
          if (
            country.name.common
              .toLocaleLowerCase()
              .includes(searchbar.value.toLocaleLowerCase())
          ) {
            countryList.push(country);
          }
        });

        if (countryList.length > 10) {
          error({
            text: "Too many mathes found. Please enter a more specific query!",
          });
          searchList.innerHTML = "";
        } else if (countryList.length > 1) {
          searchList.style.marginLeft = "620px";
          searchList.innerHTML = "";
          for (let i = 0; i < 10; i++) {
            if (countryList[i]) {
              searchList.insertAdjacentHTML(
                "beforeend",
                `<li>${countryList[i].name.common}</li>`
              );
            }
          }
        } else if (countryList.length === 1) {
          const languagesList = Object.values(countryList[0].languages);
          let languagesMarkUp = "";
          for (let i = 0; i < 3; i++) {
            if (languagesList[i]) {
              languagesMarkUp += `<li>${languagesList[i]}</li>`;
            }
          }
          searchList.style.marginLeft = "440px";
          searchList.innerHTML = `
            <div class="card">
                <h2 class="title">${countryList[0].name.common}</h2>
                <div class="box">
                    <ul class="list">
                        <li><b>Capital:</b> ${countryList[0].capital[0]}</li>
                        <li><b>Population:</b> ${countryList[0].population}</li>
                        <li>
                            <b>Languages:</b>
                            <ul class="list languagesList">
                                ${languagesMarkUp}
                            </ul>
                        </li>
                    </ul>
                    <img src="${countryList[0].flags.png}">
                </div>
            </div>`;
          console.log(countryList[0]);
        } else {
          error({
            text: "No countries found!",
          });
          searchList.innerHTML = "";
        }
      });
  }, 500)
);

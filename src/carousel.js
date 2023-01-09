"use strict";

import { playStop, isPlaying } from "./app.js";
import { getStations } from "./utils/fetchData.js";

let stationsCarousel;
let stationsData;

// Carousel constructor
class Carousel {
  constructor(el) {
    this.el = el;
    this.carouselOptions = ["previous", "add", "next"];
    this.carouselData = stationsData;
    if (stationsData.length < 5) {
      console.log("stations les than5");
      const emptyEl = [{}, {}, {}, {}, {}];
      this.carouselData = [...this.carouselData, ...emptyEl];
    }
    this.carouselInView = [1, 2, 3, 4, 5];
    this.carouselContainer;
  }

  mounted() {
    this.setupCarousel();
  }

  // Build carousel html
  setupCarousel() {
    const container = document.createElement("div");
    const controls = document.createElement("div");

    // Add container for carousel items and controls
    this.el.append(container, controls);
    container.className = "carousel-container";
    controls.className = "carousel-controls";

    // Take dataset array and append items to container
    this.carouselData.forEach((item, index) => {
      const carouselItem = document.createElement("div");
      const carouselItemFavicon = document.createElement("img");
      const carouselItemName = document.createElement("p");

      container.append(carouselItem);
      carouselItem.appendChild(carouselItemFavicon);
      carouselItem.appendChild(carouselItemName);

      // Add item attributes and favicon
      carouselItem.className = `carousel-item carousel-item-${index + 1}`;
      carouselItemFavicon.src = item.favicon;
      if (!item.favicon) {
        carouselItemFavicon.src = "../public/images/radio-4-256.png";
        carouselItemFavicon.style = "opacity: 0.2";
      }
      const carouselItemUrl = item.url;
      console.log(carouselItemUrl);
      carouselItemName.textContent = item.name;
      carouselItem.setAttribute("loading", "lazy");

      carouselItem.addEventListener("click", () => {
        if (isPlaying) {
          playStop();
        }
        if (carouselItemUrl) {
          playStop(carouselItemUrl);
        }
      });
    });

    this.carouselOptions.forEach((option) => {
      const btn = document.createElement("button");
      const axSpan = document.createElement("span");

      // Add accessibility spans to button
      axSpan.innerText = option;
      axSpan.className = "ax-hidden";
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carousel-control carousel-control-${option}`;
      btn.setAttribute("data-name", option);

      // Add carousel control options
      controls.append(btn);
    });

    // After rendering carousel to our DOM, setup carousel controls' event listeners
    this.setControls([...controls.children]);

    // Set container property
    this.carouselContainer = container;
  }

  setControls(controls) {
    controls.forEach((control) => {
      control.onclick = (event) => {
        event.preventDefault();
        // Manage control actions, update our carousel data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
      };
    });
  }

  controlManager(control) {
    if (control === "previous") {
      if (isPlaying) {
        playStop();
      }
      return this.previous();
    }
    if (control === "next") {
      if (isPlaying) {
        playStop();
      }
      return this.next();
    }
    if (control === "add") return this.addFavorites();

    return;
  }

  previous() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.unshift(this.carouselData.pop());

    // Push the first item to the end of the array so that the previous item is front and center
    this.carouselInView.push(this.carouselInView.shift());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
      this.carouselContainer.children[
        index
      ].className = `carousel-item carousel-item-${item}`;
    });

    // Using the first 5 items in data array update content of carousel items in view
    this.carouselData.slice(0, 5).forEach((data, index) => {
      document.querySelector(`.carousel-item-${index + 1}`).src = data.src;
    });
  }

  next() {
    // Update order of items in data array to be shown in carousel
    this.carouselData.push(this.carouselData.shift());

    // Take the last item and add it to the beginning of the array so that the next item is front and center
    this.carouselInView.unshift(this.carouselInView.pop());

    // Update the css class for each carousel item in view
    this.carouselInView.forEach((item, index) => {
      this.carouselContainer.children[
        index
      ].className = `carousel-item carousel-item-${item}`;
    });

    // Using the first 5 items in data array update content of carousel items in view
    this.carouselData.slice(0, 5).forEach((data, index) => {
      document.querySelector(`.carousel-item-${index + 1}`).src = data.src;
    });
  }

  // Add to favorites stations.
  addFavorites() {
    let favoritesData = JSON.parse(localStorage.getItem("favoritesRadiosData"));
    console.log("fav data before ", favoritesData);
    if (!favoritesData) {
      let favoritesData = [];
      localStorage.setItem(
        "favoritesRadiosData",
        JSON.stringify(favoritesData)
      ); // not sure need or not ////////////////////////
      favoritesData = JSON.parse(localStorage.getItem("favoritesRadiosData")); // ? not sure need or not update
    }

    if (
      favoritesData.some(
        (el) => el.changeuuid === this.carouselData[0].changeuuid
      )
    ) {
      favoritesData.forEach((el) => {
        if (el.changeuuid === this.carouselData[0].changeuuid) {
          favoritesData.splice(favoritesData.indexOf(el), 1);
        }
      }); //unfavorite element
    } else {
      favoritesData.unshift(this.carouselData[0]);
    }
    if (favoritesData.length > 5) {
      favoritesData.splice(5);
    }
    localStorage.setItem("favoritesRadiosData", JSON.stringify(favoritesData));
    console.log("fav data after ", favoritesData);
    renderCarousel("fromaddfavorites");
  }
}

// Refers to the carousel
const el = document.querySelector(".carousel");

// Creating carousel
async function createCarousel(data) {
  el.innerHTML = `<div class="loader"></div>`;
  try {
    if (data === "favorites") {
      stationsData = JSON.parse(localStorage.getItem("favoritesRadiosData"));
      if (!stationsData) {
        console.log("NO FAVORITES STATIONS ");
        el.innerHTML = `<div class="empty-favorites"><p>NO FAVORITES YET</p></div>`;
        return;
      }
    } else if (data === "fromaddfavorites" || !data) {
      const search = document.querySelector("#search");
      const searchText = search.value;
      stationsData = await getStations(searchText); // double         ???
    } else if (data === "homepage") {
      stationsData = await getStations();
    } else {
      stationsData = await getStations(data);
    }
    el.innerHTML = "";
    stationsCarousel = new Carousel(el);
    stationsCarousel.mounted();
  } catch (error) {
    throw new Error("CANNOT Get Stations data", error.message);
  }
}

function renderCarousel(data) {
  if (stationsCarousel) {
    document.querySelector(".carousel").innerHTML = "";
  }

  if (data !== "favorites") {
    const buttonsMenu = document.querySelectorAll(".icon > div"); //try new fitches
    buttonsMenu.forEach((el) => {
      if (el.classList.contains("selected")) {
        el.classList.remove("selected");
      }
    });
  }
  createCarousel(data);
}

renderCarousel();

export { stationsCarousel, renderCarousel };

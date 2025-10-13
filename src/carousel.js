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
      carouselItemName.textContent = item.name;
      carouselItem.setAttribute("loading", "lazy");

      // Only treat as a real click if it wasn't part of a swipe/drag
      let downX = 0, downY = 0;
      carouselItem.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        downX = e.clientX; downY = e.clientY;
      });
      carouselItem.addEventListener("click", (e) => {
        // If a swipe just happened on touch/pen, the container-level handler will suppress it.
        // Here, for mouse clicks, guard against drags by checking small movement from mousedown.
        const moved = Math.hypot((e.clientX - downX) || 0, (e.clientY - downY) || 0) > 5;
        if (moved) return;
        if (carouselItem.classList.contains("carousel-item-1")) {
          if (isPlaying) {
            playStop();
          }
          if (carouselItemUrl) {
            playStop(carouselItemUrl);
          }
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

    // Enable touch/pointer swipe navigation
    this.setupTouch();
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

  // Add swipe support for touchscreens using Pointer Events with a touch fallback
  setupTouch() {
    const el = this.carouselContainer;
    if (!el) return;
    // Allow vertical scroll, we'll handle horizontal gestures
    try { el.style.touchAction = "pan-y"; } catch (_) { }

    this.didSwipe = false;
    this.lastPointerType = null;
    let startX = 0;
    let startY = 0;
    let tracking = false;
    let pointerId = null;
    const threshold = 40; // pixels to qualify as a swipe

    const onPointerDown = (e) => {
      // Only primary button for mouse
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      tracking = true;
      this.didSwipe = false;
      this.lastPointerType = e.pointerType || null;
      startX = e.clientX;
      startY = e.clientY;
      pointerId = e.pointerId;
      // Capture only for touch/pen to improve swipe tracking
      if (e.pointerType !== 'mouse' && el.setPointerCapture && pointerId != null) {
        try { el.setPointerCapture(pointerId); } catch (_) { }
      }
    };

    const onPointerMove = (e) => {
      if (!tracking || (pointerId != null && e.pointerId !== pointerId)) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      // For touch/pen only: if horizontal movement dominates and exceeds a small deadzone, prevent scroll
      if (e.pointerType !== 'mouse' && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
        e.preventDefault();
      }
    };

    const onPointerUp = (e) => {
      if (!tracking || (pointerId != null && e.pointerId !== pointerId)) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > threshold) {
        if (dx < 0) {
          this.next();
        } else {
          this.previous();
        }
        this.didSwipe = true;
      }
      tracking = false;
      pointerId = null;
    };

    const onPointerCancel = () => {
      tracking = false;
      pointerId = null;
    };

    if (window.PointerEvent) {
      el.addEventListener('pointerdown', onPointerDown, { passive: true });
      el.addEventListener('pointermove', onPointerMove);
      el.addEventListener('pointerup', onPointerUp);
      el.addEventListener('pointercancel', onPointerCancel);
    } else {
      // Touch fallback
      el.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        tracking = true;
        this.didSwipe = false;
        this.lastPointerType = 'touch';
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
      }, { passive: true });
      el.addEventListener('touchmove', (e) => {
        if (!tracking || !e.touches || e.touches.length === 0) return;
        const t = e.touches[0];
        const dx = t.clientX - startX;
        const dy = t.clientY - startY;
        // Apply a small deadzone to avoid canceling taps
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
          e.preventDefault();
        }
      }, { passive: false });
      el.addEventListener('touchend', (e) => {
        if (!tracking) return;
        const t = e.changedTouches && e.changedTouches[0];
        if (!t) return;
        const dx = t.clientX - startX;
        if (Math.abs(dx) > threshold) {
          if (dx < 0) this.next(); else this.previous();
          this.didSwipe = true;
        }
        tracking = false;
      });
      el.addEventListener('touchcancel', onPointerCancel);
    }

    // Suppress click events that occur right after a swipe
    el.addEventListener('click', (e) => {
      // Suppress only after touch/pen swipes, not mouse interactions
      if (this.didSwipe && this.lastPointerType !== 'mouse') {
        e.stopPropagation();
        e.preventDefault();
        this.didSwipe = false;
      } else {
        // Reset swipe state after normal clicks
        this.didSwipe = false;
      }
    }, true);
  }

  controlManager(control) {
    if (control === "previous") {
      return this.previous();
    }
    if (control === "next") {
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
    if (!favoritesData) {
      let favoritesData = [];
      localStorage.setItem(
        "favoritesRadiosData",
        JSON.stringify(favoritesData)
      );
    }
    favoritesData = JSON.parse(localStorage.getItem("favoritesRadiosData"));
    if (
      !favoritesData.some(
        (el) => el.changeuuid === this.carouselData[0].changeuuid
      )
    ) {
      favoritesData.unshift(this.carouselData[0]);
    } else {
      favoritesData.forEach((el) => {
        if (el.changeuuid === this.carouselData[0].changeuuid) {
          favoritesData.splice(favoritesData.indexOf(el), 1);
        }
      }); //unfavorite element
    }
    if (favoritesData.length > 5) {
      favoritesData.splice(5);
    }
    localStorage.setItem("favoritesRadiosData", JSON.stringify(favoritesData));
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
      if (!stationsData || stationsData.length === 0) {
        el.innerHTML = `<div class="empty-favorites"><p>NO FAVORITES YET</p></div>`;
        stationsData = [];
        return;
      }
      stationsData = JSON.parse(localStorage.getItem("favoritesRadiosData"));
    } else {
      stationsData = await getStations(data);
    }

    el.innerHTML = "";
    stationsCarousel = new Carousel(el);
    stationsCarousel.mounted();
  } catch (error) {
    alert(
      "CANNOT GET STATIONS! Please check your internet connection and try another server in settings."
    );
    console.error(error);
  }
}

async function renderCarousel(data) {
  if (data === "fromaddfavorites") {
    const favoritesBtn = document.querySelector(".icon__favorites");
    if (favoritesBtn.classList.contains("selected")) {
      data = "favorites";
    } else {
      return;
    }
  }

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

export { stationsCarousel, renderCarousel };

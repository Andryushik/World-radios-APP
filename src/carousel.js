'use strict';

import { playStop, isPlaying } from './app.js';
import { getStations } from './utils/fetchData.js';

let stationsCarousel;
let stationsData;

// Carousel constructor
class Carousel {
  constructor(el) {
    this.el = el;
    this.carouselOptions = ['previous', 'add', 'next'];
    this.carouselData = stationsData;
    this.carouselInView = [1, 2, 3, 4, 5];
    this.carouselContainer;
  }

  mounted() {
    this.setupCarousel();
  }

  // Build carousel html
  setupCarousel() {
    const container = document.createElement('div');
    container.addEventListener('click', () => {
      if (isPlaying) {
        playStop();
      }
      playStop();
    });
    const controls = document.createElement('div');

    // Add container for carousel items and controls
    this.el.append(container, controls);
    container.className = 'carousel-container';
    controls.className = 'carousel-controls';

    // Take dataset array and append items to container
    this.carouselData.forEach((item, index) => {
      const carouselItem = document.createElement('div');
      const carouselItemFavicon = document.createElement('img');
      const carouselItemName = document.createElement('p');

      container.append(carouselItem);
      carouselItem.appendChild(carouselItemFavicon);
      carouselItem.appendChild(carouselItemName);

      // Add item attributes and favicon
      carouselItem.className = `carousel-item carousel-item-${index + 1}`;
      carouselItemFavicon.src = item.favicon;
      if (!item.favicon) {
        carouselItemFavicon.src = '../public/images/radio-4-256.png';
      }
      carouselItemName.textContent = item.name;
      carouselItem.setAttribute('loading', 'lazy');
    });

    this.carouselOptions.forEach((option) => {
      const btn = document.createElement('button');
      const axSpan = document.createElement('span');

      // Add accessibility spans to button
      axSpan.innerText = option;
      axSpan.className = 'ax-hidden';
      btn.append(axSpan);

      // Add button attributes
      btn.className = `carousel-control carousel-control-${option}`;
      btn.setAttribute('data-name', option);

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
        if (isPlaying) {
          playStop();
        }
        // Manage control actions, update our carousel data first then with a callback update our DOM
        this.controlManager(control.dataset.name);
      };
    });
  }

  controlManager(control) {
    if (control === 'previous') return this.previous();
    if (control === 'next') return this.next();
    if (control === 'add') return this.add();

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
  add() {}
}

// Refers to the carousel
const el = document.querySelector('.carousel');

// Creating carousel
async function createCarousel(data) {
  try {
    stationsData = await getStations(data);
    stationsCarousel = new Carousel(el);
    stationsCarousel.mounted();
    console.log('stationsCarousel  -  ', stationsCarousel);
  } catch (error) {
    throw new Error('CANNOT Get Stations', error.message);
  }
}

function renderCarousel(data) {
  if (stationsCarousel) {
    document.querySelector('.carousel').innerHTML = '';
  }
  createCarousel(data);
}

renderCarousel();

export { stationsCarousel, renderCarousel };

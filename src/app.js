import { stationsCarousel, renderCarousel } from "./carousel.js";
import { settingsDiv } from "./utils/serverConfig.js";

/*  stream */
const audio = document.querySelector("#stream");

/* search */
const searchBtn = document.querySelector("#search-btn");
const search = document.querySelector("#search");

search.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    renderCarousel(search.value);
  }
});
searchBtn.addEventListener("click", function () {
  renderCarousel(search.value);
});

/* home-logo button */
const homeBtn = document.querySelector(".logo");
homeBtn.addEventListener("click", function () {
  search.value = "";
  renderCarousel("homepage");
});

/* country button */
const countryBtn = document.querySelector(".icon__country");
const countriesDropdown = document.getElementById("country");
countriesDropdown.addEventListener("click", function () {
  countryBtn.classList.add("selected");
  countriesDropdown.style.display = "block";
  countriesDropdown.addEventListener("change", function () {
    countryBtn.classList.remove("selected");
    renderCarousel(search.value);
  });
  countriesDropdown.addEventListener("focusout", function () {
    countryBtn.classList.remove("selected");
  });
});

/* favorites button */
const favoritesBtn = document.querySelector(".icon__favorites");
favoritesBtn.addEventListener("click", function (e) {
  e.preventDefault();
  favoritesBtn.classList.toggle("selected");
  if (favoritesBtn.classList.contains("selected")) {
    renderCarousel("favorites");
  } else {
    renderCarousel(search.value);
  }
});

/*  settings button */
const settingsBtn = document.querySelector(".icon__settings");
settingsBtn.addEventListener("click", function (e) {
  e.preventDefault();
  settingsBtn.classList.toggle("selected");
  if (settingsBtn.classList.contains("selected")) {
    document.querySelector(".carousel").innerHTML = settingsDiv;
  } else {
    renderCarousel("homepage");
  }
});

/*  play button */
const play = document.querySelector(".play");
const stop = document.querySelector(".stop");
const playBtn = document.querySelector(".circle__btn");
const wave1 = document.querySelector(".circle__back-1");
const wave2 = document.querySelector(".circle__back-2");

/*  volume slider */
let currentVolume = 0.5;
audio.volume = currentVolume;
const container = document.querySelector(".slider__box");
const btn = document.querySelector(".slider__btn");
const color = document.querySelector(".slider__color");
const tooltip = document.querySelector(".slider__tooltip");

const dragElement = (target, btn) => {
  target.addEventListener("mousedown", (e) => {
    onMouseMove(e);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  });

  const onMouseMove = (e) => {
    e.preventDefault();
    let targetRect = target.getBoundingClientRect();
    let x = e.pageX - targetRect.left + 10;
    if (x > targetRect.width) {
      x = targetRect.width;
    }
    if (x < 0) {
      x = 0;
    }
    btn.x = x - 10;
    btn.style.left = btn.x + "px";

    // get the position of the button inside the container (%)
    let percentPosition = ((btn.x + 10) / targetRect.width) * 100;

    // color width = position of button (%)
    color.style.width = percentPosition + "%";

    // move the tooltip when button moves, and show the tooltip
    tooltip.style.left = btn.x - 5 + "px";
    tooltip.style.opacity = 1;

    // show the percentage in the tooltip
    tooltip.textContent = Math.round(percentPosition) + "%";
    currentVolume = percentPosition / 100;
    audio.volume = currentVolume;
  };

  const onMouseUp = (/*e*/) => {
    window.removeEventListener("mousemove", onMouseMove);
    tooltip.style.opacity = 0;

    btn.addEventListener("mouseover", function () {
      tooltip.style.opacity = 1;
    });

    btn.addEventListener("mouseout", function () {
      tooltip.style.opacity = 0;
    });
  };
};

dragElement(container, btn);

/*  play button  */
function playBtnToggle() {
  stop.classList.toggle("visibility");
  play.classList.toggle("visibility");
  playBtn.classList.toggle("shadow");
  wave1.classList.toggle("stopped");
  wave2.classList.toggle("stopped");
}

playBtnToggle();
let isPlaying = false;

async function playStop(
  carouselItemUrl = stationsCarousel.carouselData[0].url
) {
  try {
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      playBtnToggle();
    } else {
      audio.src = await carouselItemUrl;
      audio.play();
      isPlaying = true;
      playBtnToggle();
    }
  } catch (error) {
    throw new Error("CANNOT Play in playStop", error.message);
  }
}

playBtn.addEventListener("click", function (e) {
  e.preventDefault();
  playStop();
});

export { isPlaying, playStop };

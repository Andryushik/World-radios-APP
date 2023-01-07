import { exampleCarousel } from './carousel.js';

/*  play button */
const play = document.querySelector('.play');
const stop = document.querySelector('.stop');
const playBtn = document.querySelector('.circle__btn');
const wave1 = document.querySelector('.circle__back-1');
const wave2 = document.querySelector('.circle__back-2');

/*  volume slider */
const container = document.querySelector('.slider__box');
const btn = document.querySelector('.slider__btn');
const color = document.querySelector('.slider__color');
const tooltip = document.querySelector('.slider__tooltip');

const dragElement = (target, btn) => {
  target.addEventListener('mousedown', (e) => {
    onMouseMove(e);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
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
    btn.style.left = btn.x + 'px';

    // get the position of the button inside the container (%)
    let percentPosition = ((btn.x + 10) / targetRect.width) * 100;

    // color width = position of button (%)
    color.style.width = percentPosition + '%';

    // move the tooltip when button moves, and show the tooltip
    tooltip.style.left = btn.x - 5 + 'px';
    tooltip.style.opacity = 1;

    // show the percentage in the tooltip
    tooltip.textContent = Math.round(percentPosition) + '%';
  };

  const onMouseUp = (e) => {
    window.removeEventListener('mousemove', onMouseMove);
    tooltip.style.opacity = 0;

    btn.addEventListener('mouseover', function () {
      tooltip.style.opacity = 1;
    });

    btn.addEventListener('mouseout', function () {
      tooltip.style.opacity = 0;
    });
  };
};

dragElement(container, btn);

// Setup carousel and methods
exampleCarousel.mounted();

/*  play button  */
stop.classList.toggle('visibility');
play.classList.toggle('visibility');
playBtn.classList.toggle('shadow');
wave1.classList.toggle('stopped');
wave2.classList.toggle('stopped');

playBtn.addEventListener('click', function (e) {
  e.preventDefault();
  stop.classList.toggle('visibility');
  play.classList.toggle('visibility');
  playBtn.classList.toggle('shadow');
  wave1.classList.toggle('stopped');
  wave2.classList.toggle('stopped');
});

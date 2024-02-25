import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

const stepsSlider = document.getElementById('steps-slider');
const input0 = document.getElementById('input-with-keypress-0');
const input1 = document.getElementById('input-with-keypress-1');
const inputs = [input0, input1];

noUiSlider.create(stepsSlider, {
  start: [0, 900],
  connect: true,
  tooltips: [true, wNumb({ decimals: 1 })],
  range: {
    'min': 0,
    'max': 1000
  }, step: 10,
});

stepsSlider.noUiSlider.on('update', (values, handle) => {
  inputs[1].value = Math.floor(values[handle]);
});

inputs.forEach((input, handle) => {

  input.addEventListener('change', function () {
    stepsSlider.noUiSlider.setHandle(handle, this.value);
  });

  input.addEventListener('keydown', function (e) {

    const values = stepsSlider.noUiSlider.get();
    const value = Number(values[handle]);

    const steps = stepsSlider.noUiSlider.steps();
    const step = steps[handle];

    let position;

    switch (e.which) {
      case 13:
        stepsSlider.noUiSlider.setHandle(handle, this.value);
        break;
      case 38:
        position = step[1];
        if (position === false) {
          position = 1;
        }
        if (position !== null) {
          stepsSlider.noUiSlider.setHandle(handle, value + position);
        }
        break;
      case 40:
        position = step[0];
        if (position === false) {
          position = 1;
        }
        if (position !== null) {
          stepsSlider.noUiSlider.setHandle(handle, value - position);
        }
        break;
    }
  });
});


const burgerButton = document.querySelector('.js-toggle-button');
const nav = document.querySelector('.nav__list');

burgerButton.onclick = function () {
  nav.classList.toggle('nav__list-open');
  burgerButton.classList.toggle('burger-button--close');
};


// Слайдер карточек
const slider = document.getElementById('slider');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const sliderItems = document.querySelector('.slider__item');
const pagItems = document.querySelectorAll('.slider__pagination-item');
let countSlider = 0;

const createrWidth = () => sliderItems.offsetWidth;

// Блокировка кнопок слайдера
function toggleDisabledButtons() {
  if (countSlider === 0) {
    prev.setAttribute('disabled', 'true');
  } else {
    prev.removeAttribute('disabled');
  }
  if (countSlider === 2) {
    next.setAttribute('disabled', 'true');
  } else {
    next.removeAttribute('disabled');
  }
}

// Смена фона слайдера
function togglerBg() {
  if (countSlider === 0) {
    document.documentElement.style.setProperty('--app-primaryColor', '#f3ebe1');
  }
  if (countSlider === 1) {
    document.documentElement.style.setProperty('--app-primaryColor', '#eae6fc');
  }
  if (countSlider === 2) {
    document.documentElement.style.setProperty('--app-primaryColor', '#e5e6e8');
  }
}

// Смена фона пагинации
const togglerBhPag = () => {
  for (let i = 0; i <= 2; i++) {
    if (i === countSlider) {
      pagItems[i].style.backgroundColor = '#7859cf';
    } else {
      pagItems[i].style.backgroundColor = '#ffffff';
    }
  }
};

function startSliderScripts() {
  toggleDisabledButtons();
  togglerBg();
  togglerBhPag();
}

// Cмена фона при событиях
pagItems.forEach((pagItem) => {
  pagItem.addEventListener('mouseover', (e) => {
    togglerBhPag();
    e.target.style.backgroundColor = 'rgba(120, 89, 207, 0.25)';
  });
  pagItem.addEventListener('mousedown', (e) => {
    e.target.style.backgroundColor = '#7859cf';
  });
  pagItem.addEventListener('mouseup', (e) => {
    e.target.style.backgroundColor = 'rgba(120, 89, 207, 0.25)';
  });
  pagItem.addEventListener('mouseout', () => {
    togglerBhPag();
  });
});

// Переключния по кнопкам пагинации
pagItems.forEach((pagItem, index) => {
  pagItem.addEventListener('click', () => {
    if ((index === 1 && countSlider === 0) || (index === 2 && countSlider === 1)) {
      slider.scrollBy(createrWidth(), 0);
      countSlider += 1;
      startSliderScripts();
    }
    if ((index === 0 && countSlider === 1) || (index === 1 && countSlider === 2)) {
      slider.scrollBy(-(createrWidth()), 0);
      countSlider -= 1;
      startSliderScripts();
    }
    if (index === 0 && countSlider === 2) {
      slider.scrollBy(-(2 * createrWidth()), 0);
      countSlider -= 2;
      startSliderScripts();
    }
    if (index === 2 && countSlider === 0) {
      slider.scrollBy(2 * createrWidth(), 0);
      countSlider += 2;
      startSliderScripts();
    }
  });
});

//Переключние слайдера
next.addEventListener('click', () => {
  // debugger;
  slider.scrollBy(createrWidth(), 0);
  countSlider += 1;
  toggleDisabledButtons();
  togglerBg();
  togglerBhPag();
});

prev.addEventListener('click', () => {
  slider.scrollBy(-(createrWidth()), 0);
  countSlider -= 1;
  toggleDisabledButtons();
  togglerBg();
  togglerBhPag();

});

startSliderScripts();

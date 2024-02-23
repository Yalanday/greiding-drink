import noUiSlider from 'nouislider';
import wNumb from 'wnumb';

const burgerButton = document.querySelector('.js-toggle-button');
const nav = document.querySelector('.nav__list');
const stepsSlider = document.getElementById('steps-slider');
const input0 = document.getElementById('input-with-keypress-0');
const input1 = document.getElementById('input-with-keypress-1');
const inputs = [input0, input1];

burgerButton.onclick = function () {
  nav.classList.toggle('nav__list-open');
  burgerButton.classList.toggle('burger-button--close');
};

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
  inputs[handle].value = Math.floor(values[handle]);
});

if (input0.value === '0') {
  input0.style.color = '#bdbdbd';
}

inputs.forEach((input, handle) => {

  input.addEventListener('change', function () {
    stepsSlider.noUiSlider.setHandle(handle, this.value);
  });

  input.addEventListener('keydown', function (e) {

    const values = stepsSlider.noUiSlider.get();
    const value = Number(values[handle]);

    // [[handle0_down, handle0_up], [handle1_down, handle1_up]]
    const steps = stepsSlider.noUiSlider.steps();

    // [down, up]
    const step = steps[handle];

    let position;

    // 13 is enter,
    // 38 is key up,
    // 40 is key down.
    switch (e.which) {

      case 13:
        stepsSlider.noUiSlider.setHandle(handle, this.value);
        break;

      case 38:

        // Get step to go increase slider value (up)
        position = step[1];

        // false = no step is set
        if (position === false) {
          position = 1;
        }

        // null = edge of slider
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

// Слайдер
const slider = document.getElementById('slider');
const next = document.getElementById('next');
const prev = document.getElementById('prev');
const sliderItem = document.querySelector('.slider__item');
const pagItems = document.querySelectorAll('.slider__pagination-item');
let countSlider = 0;

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

if (countSlider === 0) {
  pagItems[0].style.backgroundColor = '#7859cf';
}

// Смена фона пагинации
const togglerBhPag = () => {
  for (let i = 0; i <= 2; i++) {
    if (i === countSlider) {
      pagItems[i].style.backgroundColor = '#7859cf';
    } else {
      pagItems[i].style.backgroundColor = '#fff';
    }
  }
};

togglerBhPag();

const createrWidth = () => sliderItem.offsetWidth;

next.addEventListener('click', () => {
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

toggleDisabledButtons();


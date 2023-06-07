'use strict';

const theme = document.querySelector('.themes');
const themeToggler = document.querySelector('.theme-toggler');

themeToggler.onclick = () => {
  themeToggler.classList.toggle('active');
  if (themeToggler.classList.contains('active')) {
    document.body.classList.add('active');
  } else {
    document.body.classList.remove('active');
  }
};

document.querySelector('#theme-open').onclick = () => {
  theme.classList.add('active');
  document.body.style.paddingRight = '40vmin';
};

document.querySelector('#theme-close').onclick = () => {
  theme.classList.remove('active');
  document.body.style.paddingLeft = '0vmin';
};

const colorTiles = document.querySelectorAll('.color');

for (const color of colorTiles) {
  color.addEventListener('click', () => {
    const colorHue = color.getAttribute('hue');
    const colorSaturation = color.getAttribute('saturation');
    const colorButton = color.style.background;

    document.querySelector(':root').style.setProperty('--hue', colorHue);
    document.querySelector(':root').style.setProperty('--saturation', colorSaturation);
    document.querySelector(':root').style.setProperty('--main-color', colorButton);   
  });
}


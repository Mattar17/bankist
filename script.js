'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const header = document.querySelector('.header');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const h4 = document.querySelector('h4');
const nav = document.querySelector('.nav');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

btnScrollTo.addEventListener('click', () => {
  section1.scrollIntoView({
    behavior: 'smooth'
  })
});

const randomInt = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const randomColor = () => {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
}

// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = el.getAttribute('href');
//     document.querySelector(id).scrollIntoView(
//       { behavior: 'smooth' }
//     );
//   })
// });
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  tabs.forEach((tab) => {
    tab.classList.remove('operations__tab--active');
  })
  clicked.classList.add('operations__tab--active');
  const content = document.querySelector(`.operations__content--${clicked.dataset.tab}`);
  tabsContent.forEach((c) => {
    c.classList.remove('operations__content--active');
  })
  content.classList.add('operations__content--active');
})

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = nav.querySelector('img');
    siblings.forEach((s) => {
      if (s !== link) {
        s.style.opacity = opacity;
      }
    })
    logo.style.opacity = opacity;

  }
}

nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
})
nav.addEventListener('mouseout', function (e) {
  handleHover(e, 1);
})

// window.addEventListener('scroll', function () {
//   const coordinates = header.getBoundingClientRect();

//   if (window.scrollY > coordinates.top) {
//     nav.classList.add('sticky');
//   }
//   else {
//     nav.classList.remove('sticky');
//   }
// })
const section2 = document.querySelector('#section--2');
// Sticky Navigation 

const observerCallback = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  }
  else {
    nav.classList.remove('sticky');
  }

}

const headerObserver = new IntersectionObserver(observerCallback, { root: null, threshold: 0 });

headerObserver.observe(header, section2);
////////
// Reveal section

const revealSection = function (entries, observer) {

  entries.forEach((ent) => {
    if (!ent.isIntersecting) return;
    ent.target.classList.remove('section--hidden');

    observer.unobserve(ent.target);
  })

}
const sectionsObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
})

document.querySelectorAll('.section').forEach((s) => {
  sectionsObserver.observe(s);
  s.classList.add('section--header');
})

//////
// Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const showImage = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(showImage, {
  root: null,
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img => imgObserver.observe(img));

//Slider

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotsContainer = document.querySelector('.dots');
let currentSlide = 0;

const createDots = function () {
  slides.forEach((s, i) => {
    dotsContainer.insertAdjacentHTML('beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    )
  });
}
createDots();

const activateDot = function (slide) {
  document.querySelectorAll('.dots__dot').forEach((d) => {
    d.classList.remove('dots__dot--active');
  })

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList
    .add('dots__dot--active');
}
activateDot(currentSlide);

const goToSlide = function (slideNum) {
  slides.forEach((s, i) => {
    s.style.transform = `translateX(${100 * (i - slideNum)}%)`;
  }
  )
}
goToSlide(0);

const nextSlide = function () {
  if (currentSlide === slides.length - 1)
    currentSlide = 0;
  else
    currentSlide++;

  activateDot(currentSlide);
  goToSlide(currentSlide);
}

const prevSlide = function () {
  if (currentSlide === 0)
    currentSlide = slides.length - 1;
  else
    currentSlide--;
  activateDot(currentSlide);
  goToSlide(currentSlide);
}

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') {
    nextSlide();
  }
  else if (e.key === 'ArrowLeft') {
    prevSlide();
  }
})

dotsContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    const targetSlide = e.target.dataset.slide;
    activateDot(Number(targetSlide));
    goToSlide(Number(targetSlide));
  }
})



















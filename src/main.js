import "./styles/main.pcss";

if (process.env.NODE_ENV === "development") {
  require("file-loader!./index.pug");
}

window.onload = function () {

  let scrollAnimation = () => {//скролл эффекты

    gsap.from('.header', {duration: 1, opacity: 0});

    //секция hero
    let tlHero = gsap.timeline({defaults: {duration: 1, opacity: 0, y: 300}});
    tlHero
      .from('.hero__content h1', {ease: "back.out(1.6)"})
      .from('.hero__content h2', {ease: "back.out(1.6)"}, '-=0.3')
      .from('.hero__content h3, .hero__content p', {ease: "back.out(1.6)"}, '-=0.5')
      .from('.hero__btn', {y: 0}, '-=0.5');

    //секция practice заголовок
    let tlPractice = gsap.timeline({
      scrollTrigger: {
        trigger: '.practice__header-container h2',
        start: '-10% 80%',
        end: 'bottom 60%',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      defaults: {x: 400, opacity: 0, ease: "power4.out",}
    });

    tlPractice
      .from('.practice__header-container h2', {})
      .from('.practice__header-container h3', {x: -400});

    //секция practice контент
    let tlPracticeOne = gsap.timeline({
      scrollTrigger: {
        trigger: '.practice__list:first-child',
        start: '-10% 80%',
        end: '150% bottom',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      defaults:
        {x: 50, opacity: 0, ease: "power4.out",}
    });

    tlPracticeOne
      .from('.practice__list:first-child .practice__item:first-child', {}, '-=0.4')
      .from('.practice__list:first-child .practice__item:nth-child(2)', {}, '-=0.4')
      .from('.practice__list:first-child .practice__item:last-child', {}, '-=0.4');

    let tlPracticeTwo = gsap.timeline({
      scrollTrigger: {
        trigger: '.practice__list:nth-child(2)',
        start: '-10% 80%',
        end: '150% bottom',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      defaults: {x: 50, opacity: 0, ease: "power4.out",}
    });

    tlPracticeTwo
      .from('.practice__list:nth-child(2) .practice__item:first-child', {}, '-=0.4')
      .from('.practice__list:nth-child(2) .practice__item:nth-child(2)', {}, '-=0.4')
      .from('.practice__list:nth-child(2) .practice__item:last-child', {}, '-=0.4');

    let tlPracticeThree = gsap.timeline({
      scrollTrigger: {
        trigger: '.practice__list:last-child',
        start: 'top 80%',
        end: '150% bottom',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      defaults: {x: 50, opacity: 0, ease: "power4.out",}
    });

    tlPracticeThree
      .from('.practice__list:last-child .practice__item:first-child', {}, '-=0.4')
      .from('.practice__list:last-child .practice__item:nth-child(2)', {}, '-=0.4')
      .from('.practice__list:last-child .practice__item:last-child', {}, '-=0.4');

    //секция inst
    let instBtn = gsap.from('.inst__btn-more', {
      scrollTrigger: {
        trigger: '.inst__btn-more',
        start: 'center bottom',
        end: 'center center',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      opacity: 0
    });

    //секция contact
    let contact = gsap.from('.contacts__container', {
      scrollTrigger: {
        trigger: '.contacts__content',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
        toggleActions: 'restart reverse restart reset'
      },
      duration: 1,
      y: 400,
      opacity: 0
    });
  }
  scrollAnimation();


  let openInst = () => {//открыть слайдер instagram
    const items = document.querySelectorAll('.inst__item');
    const fullscreen = document.querySelector('.fullscreen');
    const close = document.querySelector('.fullscreen__close');
    let body = document.querySelector('body');
    let activeSlide = 0;

    for (let i = 0; i < items.length; i++) {
      items[i].addEventListener('click', evt => {
        evt.preventDefault();

        body.style.overflow = 'hidden';
        fullscreen.classList.add('fullscreen--active');
        activeSlide = i;
        swiper.slideTo(activeSlide)
      })
    }

    close.addEventListener('click', evt => {
      evt.preventDefault()

      body.style.overflow = 'visible';
      fullscreen.classList.remove('fullscreen--active');
    })

    const swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      effect: 'fade',
      preloadImages: false,
      lazy: {
        loadPrevNext: false,
      },
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
    });
  }



  let api = () => {//api карта
    ymaps.ready(init);

    function init() {
      let map = new ymaps.Map("map", {
        center: [55.79945718, 37.53164888],
        zoom: 15,
        controls: []
      });

      map.controls.add('zoomControl', {
        size: 'small',
        position:
          {
            bottom: '30px',
            right: '10px'
          }
      });

      map.behaviors.disable('scrollZoom');//отключаю масштабирование по колесу
      map.behaviors.disable('drag');//отключаю прокручивание по зажатию

      let placeMark = new ymaps.Placemark([55.79938477, 37.53186419], {
          balloonContent: [
            '<div class="map__balloon">',
            'Ленинградский пр-т., 47 стр.1',
            '</div>'
          ].join('')
        },
        {
          // iconLayout: "default#image",
          // iconImageHref: 'images/icons/location.png',
          // iconImageSize: [21, 34]
        });

      map.geoObjects.add(placeMark)
      placeMark.balloon.open();//зафиксировать балун открытым
    }
  };
  api();


  let scrollEffect = () => {//плавная прокрутка страницы

    function getSamePageAnchor(link) {
      if (
        link.protocol !== window.location.protocol ||
        link.host !== window.location.host ||
        link.pathname !== window.location.pathname ||
        link.search !== window.location.search
      ) {
        return false;
      }
      return link.hash;
    }

    function scrollToHash(hash, e) {
      let heightMenu = document.getElementsByTagName('header')[0].getBoundingClientRect().height;
      const elem = hash ? document.querySelector(hash) : false;
      if (elem) {
        if (e) e.preventDefault();
        gsap.to(window, {scrollTo: {y: elem.getBoundingClientRect().top + window.scrollY - heightMenu}});
      }
    }

    document.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', e => {
        scrollToHash(getSamePageAnchor(a), e);
      });
    });

    scrollToHash(window.location.hash);
  };
  scrollEffect();


  let parallaxEffect = () => {//эфект паралакса

    let withWindow = document.documentElement.clientWidth;

    if (withWindow > 900) {
      let parallaxMain = (function () {
        const bg = document.querySelector(".hero__bg");

        return {
          move: function (block, windowScroll, strafeAmount) {
            let strafe = windowScroll / -strafeAmount + "%";
            let style = block.style;
            let transformString = "translate3d(0, " + strafe + ", 0)";

            style.transform = transformString;
            style.webkitTransform = transformString;
          },
          init: function (wScroll) {
            this.move(bg, wScroll, -20);
          }
        }
      }());

      window.onscroll = function () {
        let wScroll = window.pageYOffset;
        parallaxMain.init(wScroll);
      };
    } else {
      window.onscroll = function () {
      };
    }
  }
  parallaxEffect();


  let validation = () => {//валидация формы
    const myForm = document.querySelector('.form');
    const send = document.querySelector('.form__btn');

    send.addEventListener('click', e => {
      e.preventDefault();

      if (validateForm(myForm)) {
        const send = document.querySelector('.form__btn');
        const thanks = document.querySelector('.form__thanks');
        const data = {
          name: myForm.elements.name.value,
          address: myForm.elements.address.value,
          email: myForm.elements.email.value,
          tel: myForm.elements.tel.value,
          obj: myForm.elements.obj.value,
          text: myForm.elements.text.value
        };
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('POST', 'mailer.php');
        xhr.send(JSON.stringify(data));
        xhr.addEventListener('load', () => {
          send.classList.add('form__btn--send')
          thanks.style.opacity = "1";

          function timerBtn() {
            send.classList.remove('form__btn--send')
          }

          function timerThanks() {
            thanks.style.opacity = "0";
          }

          setTimeout(timerThanks, 1500)
          setTimeout(timerBtn, 500)
          myForm.reset();
        })
      }
    });

    function validateForm(form) {
      let valid = true;

      if (!validateField(form.elements.name)) {
        valid = false;
      }

      if (!validateField(form.elements.email)) {
        valid = false;
      }

      return valid;
    }

    function validateField(field) {
      let fieldError = field.nextElementSibling;


      if (!field.checkValidity()) {
        fieldError.textContent = field.validationMessage;
        field.classList.add('form__input--error')
        fieldError.style.display = "block";

        return false;
      } else {
        fieldError.textContent = '';
        field.classList.remove('form__input--error')
        fieldError.style.display = "none";

        return true;
      }
    }
  };
  validation();


  let hamburgerClose = () => {//закрытие гамбургера
    let hamburgerItems = document.querySelectorAll('.hamburger__item');
    const checkbox = document.querySelector('#hamburger__toggle');

    for (let i = 0; i < hamburgerItems.length; i++) {
      hamburgerItems[i].addEventListener('click', evt => {
        evt.preventDefault();

        checkbox.checked = false;
      })
    }
  };
  hamburgerClose();

  let openMoreSlides = () => {//кнопка показать еще
    const btn = document.querySelector('.inst__btn-more');
    let data = Array.from(document.querySelectorAll('.inst__list .inst__item'));
    let step = 6;
    let item = 0;

    data.slice(step).forEach(e => e.style.display = 'none');
    item += step;

    btn.addEventListener('click', function (e) {
      let tmp = data.slice(item, item + step);
      tmp.forEach(e => e.style.display = 'block');
      item += step;

      if (tmp.length < 6)
        this.remove();
    });
  };

  let getInstagram = () => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', 'instagram.php');
    xhr.responseType = 'json';
    xhr.send();
    xhr.addEventListener('load', ()=> {
      if (xhr.status >= 400) {
        console.log('Ошибка');
      } else {
        const instagramInfo = xhr.response;

        for (const item of instagramInfo) {
          createItemDom(item);
          createItemDomSwiper(item);
        }

        openMoreSlides();
        openInst();
      }
    });

    function createItemDom(item) {
      const list = document.querySelector('.inst__list');
      const li = document.createElement('li');
      const p = document.createElement('p');
      const div = document.createElement('div');
      const img = document.createElement('img');

      list.appendChild(li);
      li.appendChild(p);
      li.appendChild(div);
      li.appendChild(img);

      li.classList.add('inst__item');
      div.classList.add('inst__cover-block');
      img.classList.add('inst__img');

      img.setAttribute('src', item.image);
      img.setAttribute('alt', 'изображение из инстограмма');

      p.textContent = item.description;
    }

    function createItemDomSwiper(item) {
      const list = document.querySelector('.fullscreen__list');
      const li = document.createElement('li');
      const container = document.createElement('div');
      const columnLeft = document.createElement('div');
      const img = document.createElement('img');
      const columnRight = document.createElement('div');
      const header = document.createElement('div');
      const linkName = document.createElement('a');
      const linkIcon = document.createElement('a');
      const svg = document.createElement('img');
      const p = document.createElement('p');

      list.appendChild(li);
      li.appendChild(container);
      container.appendChild(columnLeft);
      columnLeft.appendChild(img);
      container.appendChild(columnRight);
      columnRight.appendChild(header);
      columnRight.appendChild(p);
      header.appendChild(linkName);
      header.appendChild(linkIcon);
      linkIcon.appendChild(svg);

      li.classList.add('fullscreen__item', 'swiper-slide');
      container.classList.add('fullscreen__container');
      columnLeft.classList.add('fullscreen__columnLeft');
      img.classList.add('inst__img');
      columnRight.classList.add('fullscreen__columnRight');
      header.classList.add('fullscreen__header');
      linkName.classList.add('fullscreen__link-name');
      linkIcon.classList.add('fullscreen__link-icon');
      svg.classList.add('inst__icon');

      img.setAttribute('src', item.image);
      img.setAttribute('alt', 'изображение из инстограмма');
      linkName.setAttribute('href', 'https://www.instagram.com/yourist_msk/');
      linkIcon.setAttribute('href', 'https://www.instagram.com/yourist_msk/');
      svg.setAttribute('src', require(`images/content/insta.png`).default);
      svg.setAttribute('alt', 'иконка');

      p.textContent = item.description;
      linkName.textContent = 'yourist_msk';
    }
  };
  getInstagram();


}
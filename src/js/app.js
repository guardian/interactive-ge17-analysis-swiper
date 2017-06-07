import xr from 'xr'
import Swiper from 'swiper'
import animatedScrollTo from 'animated-scroll-to'
import Promise from 'promiscuous'

if(!window.Promise) window.Promise = Promise

let isAndroidApp = (window.location.origin === "file://" && /(android)/i.test(navigator.userAgent)) ? true : false;
var minimalUIChecks = 0;

const $ = sel => document.querySelector(sel)
const $$ = sel => [].slice.apply(document.querySelectorAll(sel))

let width = document.querySelector(".interactive-atom").clientWidth;
let isMobile = width < 980;
let breakpoint = (width < 355) ? "300" : "355";

<<<<<<< 757740890d6be0b6eacc47ae3aab96ef52bf7ab0
const vh = $('.swiper-container').getBoundingClientRect().top
=======
let vh = $('.swiper-container').getBoundingClientRect().top//getCoords($('.swiper-container')).top
>>>>>>> android shmandroid

let pastFirst = false;

function initSwiper() {
    var swipers = [];
    var cardStacks = document.querySelectorAll('.swiper-container--horizontal');

    var swiperVertical = new Swiper(document.querySelector(".swiper-container--vertical"), {
        paginationClickable: true,
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: ".pagination",
        direction: "vertical",
        autoHeight: true
    });

    for (var s = 0; s < cardStacks.length; s++) {
        var swiper = new Swiper(cardStacks[s], {
                paginationClickable: true,
                loop: false,
                slidesPerView: 1,
                spaceBetween: 0,
                pagination: ".pagination",
                centeredSlides: true,
                autoHeight: true
            })
            .on('onTouchStart', function(currentSwiper, e) {
                if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
                    window.GuardianJSInterface.registerRelatedCardsTouch(true);
                }

                const el = $('.swiper-slide-active .after-el')
                if (el) {
                    el.classList.add('after-el--transparent')
                    el.classList.remove('after-el--filled')
                }
            })
            .on('onTouchEnd', function(currentSwiper, e) {
                if (isAndroidApp && window.GuardianJSInterface.registerRelatedCardsTouch) {
                    window.GuardianJSInterface.registerRelatedCardsTouch(false);
                }

                const el = $('.swiper-slide-active .after-el')
                if (el) {
                    el.classList.remove('after-el--transparent')
                    el.classList.add('after-el--filled')
                }
            })
            .on("onSlideChangeStart", (swipe) => {

                let newAnnotation = document.querySelector(".annotation-layer[data-graphic=" + swipe.slides[swipe.snapIndex].getAttribute("data-graphic") + "]")
                let annotations = document.querySelectorAll(".swiper-slide-active .annotation-layer");

                for (var i = 0; i < annotations.length; i++) {
                    if (annotations[i]) {
                        annotations[i].style.opacity = "0";
                    }
                }

                if (newAnnotation) {
                    newAnnotation.style.opacity = "1";
                }
            });
    }

    loadGraphics(swiperVertical);
}

function loadGraphics(swiperVertical) {
    let stacks = document.querySelectorAll(".swiper-slide--vertical");

    if (isMobile) {
        addSomePadding();
        loadCardsMobile();

        swiperVertical.on("onSlideChangeEnd", (swipe) => {
            loadCardsMobile();
        });
    } else {
        let cardsToLoad = document.querySelectorAll(".interactive-desktop .has-graphic");
        for (let i = 0; i < cardsToLoad.length; i++) {
            loadCard(cardsToLoad[i], breakpoint);
        }

    }
}

function loadCard(el, breakpoint) {
    if (el.getAttribute("loaded") !== "yes") {
        let graphicId = el.getAttribute("data-graphic");

        xr.get(`<%= path %>/graphics/${graphicId}${breakpoint}.html`, {}, {
            "raw": true
        }).then((d) => {
            el.innerHTML = d.response;
            el.setAttribute("loaded", "yes");
        });
    }
}

function loadCardsMobile() {
    let cardsToLoad = document.querySelectorAll(".swiper-slide-active .has-graphic, .swiper-slide-next .has-graphic");

    for (let i = 0; i < cardsToLoad.length; i++) {
        loadCard(cardsToLoad[i], breakpoint)
    }
}

function addSomePadding() {
    let wastedHeight = Math.min(Math.round((window.innerHeight - 32) - breakpoint * (4 / 3)), 120);
    let stylesToAppend = `.background-slide { top: ${wastedHeight}px !important;} .annotation-layer { top: ${wastedHeight}px !important;}`;

    var ss = document.createElement("style");
    let ssEl = document.head.appendChild(ss);

    ssEl.innerHTML = stylesToAppend;
}

document.addEventListener('touchend', (e) => {
    console.log(window.scrollY, pastFirst);

    vh = window.scrollY + $('.swiper-container').getBoundingClientRect().top

    if(!pastFirst && window.scrollY > 24) {
        doTheScroll();
    }
})

function doTheScroll() {
    let savedScroll = window.scrollY;
    setTimeout(() => {
        if (savedScroll === window.scrollY) {
            if (!pastFirst) {
                pastFirst = true;
                animatedScrollTo(vh, {
                    speed: 500,
                    minDuration: 200,
                    maxDuration: 750
                });

                // do it again just in case it's slightly off :) 
                setTimeout(() => {
                    animatedScrollTo(vh, {
                        speed: 500,
                        minDuration: 200,
                        maxDuration: 750
                    });

                    let savedHeight = window.innerHeight;

                    checkIfMinimalUI(savedHeight);
                }, 250);
            }
        } else {
            doTheScroll(savedScroll);
        }
    }, 5);

}

function checkIfMinimalUI(savedHeight) {
    minimalUIChecks++;
    setTimeout(() => {
        if (savedHeight !== window.innerHeight) {
            document.querySelector(".interactive-mobile__overlay").classList.add("show-overlay");
            animatedScrollTo(0, {
                speed: 500,
                minDuration: 200,
                maxDuration: 750
            });

            pastFirst = false;
        }
        minimalUIChecks = minimalUIChecks - 1;

        if(minimalUIChecks === 0) {
            checkIfMinimalUI(savedHeight);
        }
    }, 1000);
}

initSwiper();

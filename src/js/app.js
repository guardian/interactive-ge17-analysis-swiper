import xr from 'xr'
import Swiper from 'swiper'

let width = document.querySelector(".interactive-atom").clientWidth;
let isMobile = width < 980;
let breakpoint = (width < 355) ? "300" : "355";

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
            }).on("onTouchMove", (a, b) => {
                // console.log(a, b);
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
    //change 355 to breakpoint
    let wastedHeight = Math.min(Math.round(window.innerHeight - 355*(4/3)), 120);
    let stylesToAppend = `.background-slide { top: ${wastedHeight}px !important;} .annotation-layer { top: ${wastedHeight}px !important;}`;

    var ss = document.createElement("style");
    let ssEl = document.head.appendChild(ss);

    ssEl.innerHTML = stylesToAppend;
}

initSwiper();

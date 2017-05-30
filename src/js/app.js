import xr from 'xr'
import Swiper from 'swiper'

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
                let annotations = document.querySelectorAll(".annotation-layer");

                for (var i = 0; i < annotations.length; i++) {
                    if(annotations[i]) {
                        annotations[i].style.opacity = "0";
                    }
                }

                if(newAnnotation) {
                    newAnnotation.style.opacity = "1";
                }
            });
    }
}

function loadGraphics() {
    let allLayers = document.querySelectorAll(".has-graphic");

    let breakpoint = "375";

    for(let i = 0; i < allLayers.length; i++) {
        let el = allLayers[i];
        let graphicId = el.getAttribute("data-graphic");

        xr.get(`<%= path %>/graphics/${graphicId}${breakpoint}.html`, {}, {"raw": true}).then((d) => {
            el.innerHTML = d.response;
        });
    }
}

initSwiper();
loadGraphics();
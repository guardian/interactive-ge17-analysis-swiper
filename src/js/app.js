import Swiper from 'swiper'

var swipers = [];
var cardStacks = document.querySelectorAll('.swiper-container--horizontal');

var swiperVertical = new Swiper(document.querySelector(".swiper-container--vertical"), {
        paginationClickable: true,
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: ".pagination",
        direction: "vertical",
    });

for (var s = 0; s < cardStacks.length; s++) {
  var swiper = new Swiper(cardStacks[s], {
        paginationClickable: true,
        loop: false,
        slidesPerView: 1,
        spaceBetween: 0,
        pagination: ".pagination",
        centeredSlides: true
    }).on("onTouchMove", (a, b) => {
    	// console.log(a, b);
    })
    .on("onSlideChangeEnd", (swipe) => {
    	let index = swipe.snapIndex + 1;

    	let annotations = document.querySelectorAll(".annotation-layer");
    	let current = document.querySelector(".annotation-layer--" + index);
    	
    	for(var i = 0; i < annotations.length; i++) {
    		annotations[i].style.opacity = "0";
    	}

    	current.style.opacity = "1";
    });
}
var el = document.createElement('script');
el.src = '<%= path %>/app.js';
document.body.appendChild(el);

let mobile = document.querySelector(".swiper-no-swiping");

window.addEventListener("scroll", () => {
	if(window.scrollY > 48) {
		mobile.classList.remove("swiper-no-swiping");
	}
})
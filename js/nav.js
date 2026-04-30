const mobileToggle = document.getElementById("mobile-toggle");
const mobileNav = document.getElementById("nav-mobile");

if(mobileToggle && mobileNav) {
    mobileToggle.addEventListener("click", function(){
        if( mobileNav.classList.contains("hidden")){
            mobileNav.classList.remove("hidden");
            mobileNav.style.display = "flex";
            mobileNav.style.flexDirection = "column";
        }else{
            mobileNav.classList.add("hidden");
            mobileNav.style.display = "none";
        }
    });
}
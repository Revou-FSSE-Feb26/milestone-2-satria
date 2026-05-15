const mobileToggle = document.getElementById("mobile-toggle");
const mobileNav = document.getElementById("nav-mobile");

if(mobileToggle && mobileNav) {
    // toggle mobile menu open/close
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

    //Auto close mobile menu when any nav link is clicked
    const mobileNavLinks = mobileNav.querySelectorAll("a");
    mobileNavLinks.forEach(link => {
        link.addEventListener("click", function(){
            mobileNav.classList.add("hidden");
            mobileNav.style.display = "none";
        });
    });
}
//Shared Header - Dynamic Injection

const isSubPage = window.location.pathname.includes("/pages/");
const basePath = isSubPage ? "../" : "";

//inject header HTML into #site-header
document.getElementById("site-header").innerHTML = `
<div class="font-neue text-[#FFFFFFB3] flex items-center justify-between px-4 py-4 md:px-8">
    <a 
    href="${basePath}index.html" class="text-xl font-bold text-(--yellow-brand) font-neue"
    >
        Revou Fun
    </a>

    <!-- Mobile menu toggle button -->
    <button
        id="mobile-toggle"
        aria-label="toggle navigation"
        class="md:hidden flex flex-col gap-1.5 gap-2"
    >
        <span class="block w-6 h-0.5 bg-white"></span>
        <span class="block w-6 h-0.5 bg-white"></span>
        <span class="block w-6 h-0.5 bg-white"></span>
    </button>

    <nav class="hidden md:flex gap-6 items-center">
        <a
            href="${basePath}index.html#Hero"
            class="hover:text-(--yellow-brand) transition-colors"
            >Home</a
        >
        <a
            href="${basePath}index.html#games"
            class="hover:text-(--yellow-brand) transition-colors"
            >Games</a
        >
        <a
            href="${basePath}index.html#about"
            class="hover:text-(--yellow-brand) transition-colors"
            >About Us</a
        >
        <a
            href="${basePath}index.html#feature"
            class="hover:text-(--yellow-brand) transition-colors"
            >Features</a
        >
        <a href="#news" class="hover:text-(--yellow-brand)">News</a>
        <button
            class="bg-(--purple-glow) text-white px-4 py-2 rounded-xl hover:brightness-110 transition font-medium"
        >
            Play Now!
        </button>
    </nav>
</div>
<!-- Desktop navbar -->
<div
    id="nav-mobile"
    class="hidden flex-col bg-black px-4 pb-4 md:hidden text-white"
    style="display: none"
>
    <a
        href="${basePath}index.html#Hero"
        class="py-2 border-b border-gray-700 hover:text-(--yellow-brand)"
        >Home</a
    >
    <a
        href="${basePath}index.html#games"
        class="py-2 border-b border-gray-700 hover:text-(--yellow-brand)"
        >Games</a
    >
    <a
        href="${basePath}index.html#about"
        class="py-2 border-b border-gray-700 hover:text-(--yellow-brand)"
        >About Us</a
    >
    <a
        href="${basePath}index.html#feature"
        class="py-2 border-b border-gray-700 hover:text-(--yellow-brand)"
        >Features</a
    >
    <a
        href="${basePath}index.html#news"
        class="py-2 border-b border-gray-700 hover:text-(--yellow-brand)"
        >News</a
    >
    <a 
        href="${basePath}index.html#games"
        class="mt-4 bg-(--yellow-brand) text-black py-2 rounded-xl font-medium hover:brightness-110 transition"
    >
        Play Now!
    </a>
</div>
`;

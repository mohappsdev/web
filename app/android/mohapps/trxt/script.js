document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    const screenshots = [
        'images/scr1.jpg',
        'images/scr2.jpg',
        'images/scr3.jpg',
        'images/scr4.jpg',
        'images/scr5.jpg'
    ];

    // --- DOM ELEMENTS ---
    const slidesContainer = document.getElementById('carousel-slides');
    const indicatorsContainer = document.getElementById('carousel-indicators');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // --- STATE ---
    let currentIndex = 0;
    let startX = 0;
    let isDragging = false;
    let scrollLeft = 0;

    // --- INITIALIZATION ---
    function initCarousel() {
        if (screenshots.length === 0) return;

        // Create slides and indicators
        screenshots.forEach((src, index) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `App Screenshot ${index + 1}`;
            slidesContainer.appendChild(img);

            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Event Listeners
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        // --- IMPROVED SWIPE HANDLING ---
        slidesContainer.addEventListener('mousedown', handleDragStart);
        slidesContainer.addEventListener('touchstart', handleDragStart, { passive: true });
        slidesContainer.addEventListener('mousemove', handleDragMove);
        slidesContainer.addEventListener('touchmove', handleDragMove, { passive: false });
        slidesContainer.addEventListener('mouseup', handleDragEnd);
        slidesContainer.addEventListener('touchend', handleDragEnd);
        slidesContainer.addEventListener('mouseleave', handleDragEnd);
        
        // Use a timeout to debounce the scroll event listener
        let scrollTimeout;
        slidesContainer.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateIndicators, 50); // 50ms delay
        });
    }

    // --- FUNCTIONS ---
    function goToSlide(index) {
        if (index < 0) index = screenshots.length - 1;
        if (index >= screenshots.length) index = 0;

        const slideWidth = slidesContainer.clientWidth;
        slidesContainer.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
    }

    function updateIndicators() {
        const slideWidth = slidesContainer.clientWidth;
        currentIndex = Math.round(slidesContainer.scrollLeft / slideWidth);

        document.querySelectorAll('.indicator').forEach((indicator, i) => {
            indicator.classList.toggle('active', i === currentIndex);
        });
    }
    
    // --- DRAG/SWIPE HANDLERS ---
    function handleDragStart(e) {
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        scrollLeft = slidesContainer.scrollLeft;
        slidesContainer.style.cursor = 'grabbing';
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault(); // Prevent vertical scroll
        const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const walk = (x - startX) * 1.5; // Scroll speed
        slidesContainer.scrollLeft = scrollLeft - walk;
    }

    function handleDragEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        slidesContainer.style.cursor = 'grab';

        // Determine the closest slide to snap to
        const slideWidth = slidesContainer.clientWidth;
        const endX = e.type.includes('mouse') ? e.pageX : e.changedTouches[0].pageX;
        const diff = startX - endX;

        if (Math.abs(diff) > slideWidth / 4) { // If swiped more than 25% of the slide width
            if (diff > 0) {
                goToSlide(currentIndex + 1); // Swiped left
            } else {
                goToSlide(currentIndex - 1); // Swiped right
            }
        } else {
            // Not a significant swipe, snap back to current slide
            goToSlide(currentIndex);
        }
    }

    // --- START THE CAROUSEL ---
    initCarousel();
});
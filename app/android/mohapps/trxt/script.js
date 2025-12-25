document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURATION ---
    // Add your screenshot filenames here. The path is relative to the HTML file.
    const screenshots = [
        'images/Scr1.png',
        'images/Scr2.png',
        'images/Scr3.png',
        'images/Scr4.png',
        'images/Scr5.png'
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

    // --- INITIALIZATION ---
    function initCarousel() {
        if (screenshots.length === 0) return;

        // Create slides and indicators
        screenshots.forEach((src, index) => {
            // Create slide image
            const img = document.createElement('img');
            img.src = src;
            img.alt = `App Screenshot ${index + 1}`;
            slidesContainer.appendChild(img);

            // Create indicator dot
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });

        // Event Listeners
        prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
        nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
        
        // Touch events for swiping
        slidesContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
        slidesContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
        slidesContainer.addEventListener('touchend', handleTouchEnd);
        
        // Scroll event to update indicators
        slidesContainer.addEventListener('scroll', updateIndicators);
    }

    // --- FUNCTIONS ---
    function goToSlide(index) {
        // Clamp index to be within bounds
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
    
    // --- TOUCH HANDLERS ---
    function handleTouchStart(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        slidesContainer.style.cursor = 'grabbing';
    }

    function handleTouchMove(e) {
        if (!isDragging) return;
        // Prevent vertical scroll from happening while swiping horizontally
        if (Math.abs(e.touches[0].clientX - startX) > 5) {
            e.preventDefault();
        }
    }

    function handleTouchEnd(e) {
        if (!isDragging) return;
        isDragging = false;
        slidesContainer.style.cursor = 'grab';

        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // If swipe distance is significant, change slide
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                goToSlide(currentIndex + 1); // Swiped left, go to next
            } else {
                goToSlide(currentIndex - 1); // Swiped right, go to prev
            }
        }
    }

    // --- START THE CAROUSEL ---
    initCarousel();
});
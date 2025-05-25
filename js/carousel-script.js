document.addEventListener('DOMContentLoaded', function() {
    if (typeof mlcCarouselSettings === 'undefined' || typeof mlcCarouselSettings.targetClass === 'undefined') {
        return;
    }

    const targetClass = mlcCarouselSettings.targetClass;
    const carouselTrack = document.querySelector('.' + targetClass);

    if (!carouselTrack) {
        return;
    }

    if (carouselTrack.classList.contains('mlc-initialized')) {
        return;
    }
    carouselTrack.classList.add('mlc-initialized');

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('mlc-logo-carousel-container');
    
    if (carouselTrack.parentNode) {
        carouselTrack.parentNode.insertBefore(carouselContainer, carouselTrack);
    } else {
        return; 
    }
    carouselContainer.appendChild(carouselTrack);
    
    carouselTrack.classList.add('mlc-logo-carousel-track');
    
    const logoItems = Array.from(carouselTrack.children).filter(el => el.nodeType === 1 && el.classList.contains('col'));
    
    if (logoItems.length === 0) {
        return;
    }

    logoItems.forEach((item) => {
        item.classList.add('mlc-logo-carousel-item');
        const img = item.querySelector('img');
        if (img && !img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
    });

    const originalItemCount = logoItems.length;
    if (originalItemCount > 0) {
        for (let i = 0; i < originalItemCount; i++) {
            const clone = logoItems[i].cloneNode(true);
            clone.classList.add('mlc-cloned-item');
            carouselTrack.appendChild(clone);
        }
    }

    let isDown = false;
    let startX;
    let scrollLeftTrack; 
    let isDragging = false;
    const dragThreshold = 10; // Píxeles que hay que mover para considerar un drag

    // --- Manejadores para Mouse ---
    function handleMouseDown(e) {
        isDown = true;
        isDragging = false;
        carouselContainer.classList.add('active');
        startX = e.pageX - carouselContainer.offsetLeft;
        scrollLeftTrack = carouselContainer.scrollLeft;
        if (getComputedStyle(carouselTrack).animationName !== 'none') {
            carouselTrack.style.animationPlayState = 'paused';
        }
    }

    function handleMouseLeaveCarousel() {
        // Si se suelta fuera, el mouseup global lo maneja
    }

    function handleMouseUpGlobal() {
        if (!isDown) return;
        isDown = false;
        carouselContainer.classList.remove('active');
        if (getComputedStyle(carouselTrack).animationName !== 'none') {
            carouselTrack.style.animationPlayState = 'running';
        }
        setTimeout(() => isDragging = false, 0);
    }

    function handleMouseMove(e) {
        if (!isDown) return;
        if (!isDragging && Math.abs(e.pageX - (startX + carouselContainer.offsetLeft)) > dragThreshold) {
            isDragging = true;
        }
        if(isDragging) {
            e.preventDefault(); // Prevenir selección de texto
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 1.5; 
            carouselContainer.scrollLeft = scrollLeftTrack - walk;
        }
    }

    // --- Manejadores para Touch ---
    function handleTouchStart(e) {
        isDown = true;
        isDragging = false;
        carouselContainer.classList.add('active');
        startX = e.touches[0].pageX - carouselContainer.offsetLeft;
        scrollLeftTrack = carouselContainer.scrollLeft;
        if (getComputedStyle(carouselTrack).animationName !== 'none') {
            carouselTrack.style.animationPlayState = 'paused';
        }
    }

    function handleTouchMove(e) {
        if (!isDown) return;
        if (!isDragging && Math.abs(e.touches[0].pageX - (startX + carouselContainer.offsetLeft)) > dragThreshold) {
            isDragging = true;
        }
        if (isDragging) {
            e.preventDefault(); // ¡CLAVE! Prevenir el scroll de la página para controlar el carrusel
            const x = e.touches[0].pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 1.5;
            carouselContainer.scrollLeft = scrollLeftTrack - walk;
        }
    }

    function handleTouchEnd() {
        if (!isDown) return;
        isDown = false;
        carouselContainer.classList.remove('active');
        if (getComputedStyle(carouselTrack).animationName !== 'none') {
            carouselTrack.style.animationPlayState = 'running';
        }
         setTimeout(() => isDragging = false, 0);
    }

    // Asignar Event Listeners
    carouselContainer.addEventListener('mousedown', handleMouseDown);
    carouselContainer.addEventListener('mouseleave', handleMouseLeaveCarousel);
    document.addEventListener('mouseup', handleMouseUpGlobal); 
    carouselContainer.addEventListener('mousemove', handleMouseMove);

    carouselContainer.addEventListener('touchstart', handleTouchStart, { passive: true }); // passive:true si no se usa preventDefault en touchstart
    carouselContainer.addEventListener('touchmove', handleTouchMove, { passive: false }); // passive:false ES NECESARIO para que e.preventDefault() funcione
    carouselContainer.addEventListener('touchend', handleTouchEnd);
    carouselContainer.addEventListener('touchcancel', handleTouchEnd); // También manejar touchcancel

    // Pausa/Reanudar animación con hover
    carouselContainer.addEventListener('mouseenter', () => {
        if (getComputedStyle(carouselTrack).animationName !== 'none') {
            carouselTrack.style.animationPlayState = 'paused';
        }
    });
    carouselContainer.addEventListener('mouseleave', () => { 
        if (!isDown && getComputedStyle(carouselTrack).animationName !== 'none') {
             carouselTrack.style.animationPlayState = 'running';
        }
    });
    
    // Prevenir acción de enlaces si hubo drag
    Array.from(carouselTrack.querySelectorAll('a')).forEach(link => {
        link.addEventListener('click', function(e) {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });
});
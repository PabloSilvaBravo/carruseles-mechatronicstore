document.addEventListener('DOMContentLoaded', function() {
    if (typeof mlcCarouselSettings === 'undefined' || typeof mlcCarouselSettings.targetClass === 'undefined') {
        console.error('MS Store Logo Carousel (Plugin JS): mlcCarouselSettings no definido o targetClass no encontrada en settings.');
        return;
    }

    const targetClass = mlcCarouselSettings.targetClass;
    console.log('MS Store Logo Carousel (Plugin JS): DOMContentLoaded. Buscando elemento con clase: .' + targetClass);

    const carouselTrack = document.querySelector('.' + targetClass);

    if (!carouselTrack) {
        console.error('MS Store Logo Carousel (Plugin JS): Elemento con clase ".' + targetClass + '" NO ENCONTRADO. Asegúrate de haber añadido la clase en UX Builder.');
        return;
    }
    console.log('MS Store Logo Carousel (Plugin JS): Elemento objetivo encontrado:', carouselTrack);

    if (carouselTrack.classList.contains('custom-logo-carousel-initialized')) {
        console.warn('MS Store Logo Carousel (Plugin JS): El carrusel para el elemento encontrado ya fue inicializado.');
        return;
    }
    carouselTrack.classList.add('custom-logo-carousel-initialized');

    const carouselContainer = document.createElement('div');
    carouselContainer.classList.add('custom-logo-carousel-container');

    if (carouselTrack.parentNode) {
        carouselTrack.parentNode.insertBefore(carouselContainer, carouselTrack);
    } else {
        console.error('MS Store Logo Carousel (Plugin JS): El elemento objetivo no tiene un nodo padre.');
        return; 
    }
    carouselContainer.appendChild(carouselTrack);

    carouselTrack.classList.add('custom-logo-carousel-track');

    const logoItems = Array.from(carouselTrack.children).filter(el => el.nodeType === 1 && el.classList.contains('col'));

    if (logoItems.length === 0) {
        console.warn('MS Store Logo Carousel (Plugin JS): No se encontraron elementos hijos con la clase "col" para usar como ítems.');
        return;
    }

    logoItems.forEach((item) => {
        item.classList.add('custom-logo-carousel-item');
        const img = item.querySelector('img');
        if (img && !img.hasAttribute('loading')) {
            img.loading = 'lazy';
        }
    });

    const originalItemCount = logoItems.length;
    if (originalItemCount > 0) {
        for (let i = 0; i < originalItemCount; i++) {
            const clone = logoItems[i].cloneNode(true);
            carouselTrack.appendChild(clone);
        }
    }

    let isDown = false;
    let startX;
    let scrollLeftTrack; 
    let isDragging = false;

    function handleMouseDown(e) {
        isDown = true;
        isDragging = false;
        carouselContainer.classList.add('active');
        startX = e.pageX - carouselContainer.offsetLeft;
        scrollLeftTrack = carouselContainer.scrollLeft;
        if (getComputedStyle(carouselTrack).animationName !== 'none') { // Verifica si hay animación aplicada
            carouselTrack.style.animationPlayState = 'paused';
        }
    }

    function handleMouseLeaveCarousel() {
        // Lógica para cuando el mouse sale del carrusel mientras está presionado
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
        if (!isDragging && Math.abs(e.pageX - (startX + carouselContainer.offsetLeft)) > 5) {
            isDragging = true;
        }
        if(isDragging) {
            const x = e.pageX - carouselContainer.offsetLeft;
            const walk = (x - startX) * 1.5; 
            carouselContainer.scrollLeft = scrollLeftTrack - walk;
        }
    }

    carouselContainer.addEventListener('mousedown', handleMouseDown);
    carouselContainer.addEventListener('mouseleave', handleMouseLeaveCarousel);
    document.addEventListener('mouseup', handleMouseUpGlobal);
    carouselContainer.addEventListener('mousemove', handleMouseMove);

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

    Array.from(carouselTrack.querySelectorAll('a')).forEach(link => {
        link.addEventListener('click', function(e) {
            if (isDragging) {
                e.preventDefault();
            }
        });
    });

    console.log('MS Store Logo Carousel (Plugin JS): Inicialización completa para el elemento con clase ".' + targetClass + '".');
});
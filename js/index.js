window.addEventListener('load', function () {
    const preview = document.querySelector('.preview-window');
    preview.style.opacity = '0';
    preview.style.transform = 'translateY(20px)';

    setTimeout(function () {
        preview.style.transition = '0.6s ease';
        preview.style.opacity = '1';
        preview.style.transform = 'translateY(0)';
    }, 100);
});

(($) => {
    window.theme = {
        ...window.theme,

        // Menu
        menuMobileDisplayCategories: function () {
            $('.nav-mobile .first-level > .sub > a').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('show');

                if (item.hasClass('show')) {
                    item.children('.sub').slideDown();
                } else {
                    item.children('.sub').slideUp();
                }

                event.preventDefault();
                return false;
            });
        },
    };

    // execução das funçoes
    $(() => {
        setTimeout(() => {
            theme.menuMobileDisplay();
        }, 20);
    });
})(jQuery);

(($) => {
    window.theme = {
        ...window.theme,

        settings: {},

        // Close and Open and apply overlay
        closeAndOpen: function () {
            $('[data-toggle="closed"]').on('click', function () {
                let target = $($(this).data('target'));
                target.addClass('u-show').attr('data-toggle', 'open');

                $('[data-overlay="shadow"]').addClass('u-show');
                $('body').addClass('overflowed');
            });

            $('[data-overlay="shadow"]').on('click', function () {
                $('[data-toggle="open"]').removeClass('u-show').removeAttr('data-toggle');
                $('[data-overlay="shadow"]').removeClass('u-show');
                $('body').removeClass('overflowed');
            });

            $('[data-toggle="close"]').on('click', function () {
                $('[data-overlay="shadow"]').trigger('click');
            });
        },

        // Menu
        menuMobileDisplayCategories: function () {
            $('.menuMobile-menu .menu-list > .subLists > .menu-link').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');

                if (item.hasClass('u-show')) {
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
            theme.closeAndOpen();
            theme.menuMobileDisplayCategories();
        }, 20);
    });
})(jQuery);

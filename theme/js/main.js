(($) => {
    window.theme = {
        ...window.theme,

        settings: {
            lastScrollPosition: 0,
        },

        openApplyOverlayClose: function () {
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

        scrollHidesMenu: function () {
            const header = $('[data-header="scroll"]');
            let headerHeight = $('[data-header="scroll"]').outerHeight() + 20;
            let position = $(window).scrollTop() - 20;

            if (position > this.settings.lastScrollPosition && position > headerHeight) {
                header.addClass('u-effectHeader');
            } else if (position > headerHeight && position < this.settings.lastScrollPosition) {
                header.removeClass('u-effectHeader');
            }

            this.settings.lastScrollPosition = position;
        },

        getScroll: function () {
            let internal = this;

            $(window).on('scroll', function () {
                internal.scrollHidesMenu();
            });
        },

        bannerSlides: function () {
            if ($('.banner-slides').length) {
                const slideshow = $('.banner-slides');
                let size = $('.swiper-slide', slideshow).length;
                let settings = slideshow.data('settings');

                if (size > 0) {
                    new Swiper('.swiper', {
                        preloadImages: false,
                        loop: true,
                        autoHeight: true,
                        effect: 'slide',
                        autoplay: {
                            delay: settings.timer,
                            disableOnInteraction: false,
                        },
                        lazy: {
                            loadPrevNext: true,
                        },
                        pagination: {
                            el: '.banner-slides .swiper-pagination',
                            bulletClass: 'icon-circle',
                            bulletActiveClass: 'icon-circle-empty',
                            clickable: !settings.isMobile,
                        },

                        navigation: {
                            prevEl: '.icon-arrow-left',
                            nextEl: '.icon-arrow-right',
                        },
                    });

                    if (settings.stopOnHover) {
                        $('.banner-slides .swiper').on('mouseenter', function () {
                            this.swiper.autoplay.stop();
                        });

                        $('.banner-slides .swiper').on('mouseleave', function () {
                            this.swiper.autoplay.start();
                        });
                    }
                }
            }
        },
    };

    // execução das funçoes
    $(() => {
        theme.getScroll();

        setTimeout(() => {
            theme.openApplyOverlayClose();
            theme.scrollHidesMenu();
        }, 20);

        if ($('html').hasClass('page-home')) {
            setTimeout(function () {
                theme.bannerSlides();
            }, 40);
        }
    });
})(jQuery);

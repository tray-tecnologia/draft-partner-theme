(($) => {
    $.fn.changeElementType = function (newType) {
        var attrs = {};

        $.each(this[0].attributes, function (idx, attr) {
            attrs[attr.nodeName] = attr.nodeValue;
        });

        this.replaceWith(function () {
            return $('<' + newType + '/>', attrs).append($(this).contents());
        });
    };

    window.theme = {
        ...window.theme,

        settings: {
            lastScrollPosition: 0,
            storeId: 0,
            productThumbs: null,
            productGallery: null,
        },

        /* Beginning General Functions */
        openApplyOverlayClose: function () {
            const buttonClose = $('[data-toggle="close"]');
            const divOverlay = $('[data-overlay="shadow"]');
            const buttonToOpen = $('[data-toggle="closed"]');

            buttonToOpen.on('click', function () {
                let target = $($(this).data('target'));
                target.addClass('u-show').attr('data-toggle', 'open');

                divOverlay.addClass('u-show');
                $('body').addClass('overflowed');
            });

            divOverlay.on('click', function () {
                $('.video iframe').attr('src', '');
                const modal = $('[data-toggle="open"]');

                modal.removeClass('u-show').removeAttr('data-toggle');
                divOverlay.removeClass('u-show');
                $('body').removeClass('overflowed');
            });

            buttonClose.on('click', function () {
                divOverlay.trigger('click');
            });
        },

        scrollHidesMenu: function () {
            const header = $('[data-header="scroll"]');
            let headerHeight = $('[data-header="scroll"]').outerHeight() + 20;
            let position = $(window).scrollTop() - 20;

            if (position > this.settings.lastScrollPosition && position > headerHeight) {
                header.addClass('u-effectHeader');
                header.addClass('u-shadow');
            } else if (position > headerHeight && position < this.settings.lastScrollPosition) {
                header.removeClass('u-effectHeader');
                header.addClass('u-shadow');
            } else if (position < headerHeight) {
                header.removeClass('u-shadow');
            }

            this.settings.lastScrollPosition = position;
        },

        getScroll: function () {
            let internal = this;

            $(window).on('scroll', function () {
                internal.scrollHidesMenu();
            });
        },

        mainMenuMobile: function () {
            $('[data-toggle="account"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },

        libMaskInit: function () {
            let phoneMaskBehavior = function (val) {
                return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
            };

            let phoneMaskOptions = {
                onKeyPress: function (val, e, field, options) {
                    field.mask(phoneMaskBehavior.apply({}, arguments), options);
                },
            };

            $('.mask-phone').mask(phoneMaskBehavior, phoneMaskOptions);
            $('.mask-cep').mask('00000-000');
        },
        /* --- End General Functions --- */

        bannerSlides: function () {
            const targetElement = '[data-slides="banner"]';
            if ($(targetElement).length) {
                const slideshow = $(targetElement);
                let size = $('.swiper-slide', slideshow).length;
                let settings = slideshow.data('settings');

                if (size > 0) {
                    new Swiper(`${targetElement} .swiper`, {
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
                            el: `${targetElement} .swiper-pagination`,
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
                        $(`${targetElement} .swiper`).on('mouseenter', function () {
                            this.swiper.autoplay.stop();
                        });

                        $(`${targetElement} .swiper`).on('mouseleave', function () {
                            this.swiper.autoplay.start();
                        });
                    }
                }
            }
        },

        brandsSlides: function () {
            const targetElement = '[data-slides="brands"]';
            if (!$(targetElement).length) {
                $(`${targetElement} .brands-content`).remove();
            } else {
                new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 5,
                    lazy: {
                        loadPrevNext: true,
                    },
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 2,
                            spaceBetween: 10,
                        },
                        680: {
                            slidesPerView: 3,
                            spaceBetween: 10,
                        },
                        900: {
                            slidesPerView: 4,
                            spaceBetween: 20,
                        },
                        1000: {
                            slidesPerView: 5,
                            spaceBetween: 20,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: true,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });
            }
        },

        customerReviewsSlidesOnHome: function () {
            const targetElement = '[data-slides="reviews"]';

            if (!$(targetElement).length) {
                $(`${targetElement} .dep_lista`).remove();
            } else {
                $('.dep_lista').changeElementType('div');
                $('.dep_item').changeElementType('div');

                $('.dep_item').addClass('swiper-slide');
                $(`${targetElement} .dep_lista`).addClass('swiper-wrapper').wrap('<div class="swiper"></div>');
                $(`${targetElement} .swiper`).append(`           
                    <div class="swiper-pagination"></div>
                `);

                const swiper = new Swiper(`${targetElement} .swiper`, {
                    slidesPerView: 3,
                    loop: false,
                    breakpoints: {
                        0: {
                            slidesPerView: 1,
                        },
                        600: {
                            slidesPerView: 2,
                        },
                        1000: {
                            slidesPerView: 3,
                        },
                    },
                    pagination: {
                        el: `${targetElement} .swiper-pagination`,
                        bulletClass: 'icon-circle',
                        bulletActiveClass: 'icon-circle-empty',
                        clickable: false,
                    },
                    on: {
                        init: function () {
                            $(targetElement).addClass('show');
                        },
                    },
                });

                $(`${targetElement} .dep_dados`).wrap('<div class="review"></div>');
                $(`${targetElement} .dep_lista li:hidden`).remove();
            }
        },

        loadNewsPageOnHome: function () {
            if ($('.news').length) {
                let dataFiles = $('html').data('files');

                $.ajax({
                    url: `/loja/busca_noticias.php?loja=${this.settings.storeId}&${dataFiles}`,
                    method: 'get',
                    success: function (response) {
                        let target;
                        let pageNews;

                        if (!$(response).find('.noticias').length) {
                            $('.section.news').remove();
                            return;
                        }

                        target = $('.section.news .news-content');
                        pageNews = $($(response).find('.noticias'));

                        pageNews.find('li:nth-child(n+4)').remove();
                        pageNews.find('li').wrapInner('<div class="news-item"></div>');
                        pageNews = pageNews.contents();

                        pageNews.each(function (index, pageNews) {
                            const removeImage = $(pageNews).find('img').closest('div').remove();
                        });

                        target.append(pageNews);
                    },
                });
            }
        },
        /* Beginning Product Page */
        gallerySlidesOnProductPage: function () {
            const targetGallery = '[data-slides="gallery"]';
            const targetThumbs = '[data-slides="gallery-thumbs"]';

            theme.settings.productThumbs = new Swiper(targetThumbs, {
                spaceBetween: 10,
                lazy: {
                    loadPrevNext: true,
                },
                breakpoints: {
                    0: {
                        slidesPerView: 2,
                    },
                    350: {
                        slidesPerView: 3,
                    },
                    768: {
                        slidesPerView: 4,
                    },
                    1280: {
                        slidesPerView: 5,
                    },
                },
                freeMode: true,
                watchSlidesProgress: true,
            });

            theme.settings.productGallery = new Swiper(targetGallery, {
                spaceBetween: 10,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    prevEl: '.slides-buttonPrev--gallery',
                    nextEl: '.slides-buttonNext--gallery',
                },
                thumbs: {
                    swiper: this.settings.productThumbs,
                },
            });
        },

        openProductVideoModal: function () {
            const video = $('[data-button="video"]');
            const modal = $('[data-modal="video"]');

            video.on('click', function () {
                modal.find('iframe').addClass('lazyload').attr('data-src', $(this).data('url'));
            });
        },

        getQuantityChangeOnProductPage: function () {
            const buttonQtd = $('[data-quantity]');
            let inputQtd = $('[data-buy-product="box"] #quantidade input#quant');

            //the quantity button will only be displayed if the single-click selling option is disabled and the product has no variations
            if (
                !$('[data-has-variations]')[0] ||
                ($('[data-buy-product="box"] div#quantidade label')[0] && !$('[data-has-variations]')[0])
            ) {
                $('[data-quantity]').addClass('u-show');
            }

            buttonQtd.on('click', function (event) {
                event.preventDefault();

                let valueQtd = parseInt(inputQtd.val());
                const operator = $(event.target).val();
                const number = parseInt(`${operator}1`);
                valueQtd += number;

                if (valueQtd < 1 || Number.isNaN(valueQtd)) {
                    inputQtd.val(1);
                } else {
                    inputQtd.val(valueQtd);
                }
            });
        },

        generateShippingToProduct: function () {
            const shippingForm = $('[data-shipping="form"]');
            const resultBox = $('[data-shipping="result"]');

            shippingForm.on('submit', function (event) {
                event.preventDefault();
                let variant = $('#form_comprar').find('input[type="hidden"][name="variacao"]');
                let url = $('#shippingSimulatorButton').data('url');
                let inputQtd = $('#quant:visible');
                let cep = $('input', this).val().split('-');

                if (inputQtd.is(':visible')) {
                    inputQtd = inputQtd.val();
                }

                if (variant.length && variant.val() === '') {
                    resultBox
                        .addClass('loaded')
                        .html(
                            `<p class="error-block">Por favor, selecione as varia&ccedil;&otilde;es antes de calcular o frete.</p>`
                        );
                    return;
                }

                variant = variant.val() || 0;

                url = url
                    .replace('cep1=%s', `cep1=${cep[0]}`)
                    .replace('cep2=%s', `cep2=${cep[1]}`)
                    .replace('acao=%s', `acao=${variant}`)
                    .replace('dade=%s', `dade=${inputQtd}`);

                resultBox.removeClass('loaded').addClass('loading');

                function insertShippingInTable(shippingResult) {
                    shippingResult.find('table:first-child, p, table tr td:first-child').remove();
                    shippingResult
                        .find('table, table th, table td')
                        .removeAttr('align class width border cellpadding cellspacing height colspan');

                    shippingResult.find('table').addClass('shipping-table');

                    var frete = shippingResult.find('table th:first-child').text();
                    if (frete == 'Forma de Envio:') {
                        shippingResult.find('table th:first-child').html('Frete');
                    }

                    var valor = shippingResult.find('table th:nth-child(2)').text();
                    if (valor == 'Valor:') {
                        shippingResult.find('table th:nth-child(2)').html('Valor');
                    }

                    var prazo = shippingResult.find('table th:last-child').text();
                    if (prazo == 'Prazo de Entrega e Observa&ccedil;&otilde;es:') {
                        shippingResult.find('table th:last-child').html('Prazo');
                    }
                    shippingResult = shippingResult.children();
                }

                const errorMessage =
                    'N&atilde;o foi poss&iacute;vel obter os pre&ccedil;os e prazos de entrega. Tente novamente mais tarte.';

                /* Validate zip code first using viacep web service */
                $.ajax({
                    url: `https://viacep.com.br/ws/${cep[0] + cep[1]}/json/`,
                    method: 'get',
                    dataType: 'json',
                    success: function (viacepResponse) {
                        if (viacepResponse.erro) {
                            const message = 'CEP inv&aacute;lido. Verifique e tente novamente.';
                            resultBox
                                .removeClass('loading')
                                .addClass('loaded')
                                .html(`<p class="error-block">${message}</p>`);

                            return;
                        }

                        $.ajax({
                            url: url,
                            method: 'get',
                            success: function (response) {
                                if (response.includes('N&atilde;o foi poss&iacute;vel estimar o valor do frete')) {
                                    resultBox
                                        .removeClass('loading')
                                        .addClass('loaded')
                                        .html(`<p class="error-block">${errorMessage}</p>`);

                                    return;
                                }

                                let shippingRates = $(response.replace(/Prazo de entrega: /gi, ''));
                                insertShippingInTable(shippingRates);

                                resultBox.removeClass('loading').addClass('loaded').html('').append(shippingRates);
                            },
                            error: function (request, status, error) {
                                console.error(`[Theme] Could not recover shipping rates. Error: ${error}`);

                                if (request.responseText !== '') {
                                    console.error(`[Theme] Error Details: ${request.responseText}`);
                                }

                                resultBox
                                    .removeClass('loading')
                                    .addClass('loaded')
                                    .html(`<p class="error-block">${errorMessage}</p>`);
                            },
                        });
                    },
                    error: function (request, status, error) {
                        console.error(`[Theme] Could not validate cep. Error: ${error}`);
                        console.error(`[Theme] Error Details: ${request.responseJSON}`);

                        resultBox
                            .removeClass('loading')
                            .addClass('loaded')
                            .html(`<p class="error-block">${errorMessage}</p>`);
                    },
                });

                return false;
            });
        },

        organizeProductPage: function () {
            const additionalFieldSelector = $('.varCont .dd .ddTitle');

            additionalFieldSelector.attr('tabindex', 0);
        },

        adjustOpenTabs: function (content, linksDesk, linksMobile) {
            const openContent = $('.tabs .tabs-content.active');

            if ($(window).width() < 768 && openContent.length > 0) {
                openContent.hide().removeClass('active');
                linksDesk.removeClass('active');
                linksMobile.removeClass('active');
                content.slideUp().removeClass('active');
            } else if ($(window).width() >= 768) {
                const firstLink = linksDesk.first();
                const target = firstLink.attr('href').split('#')[1];

                openContent.hide().removeClass('active');
                firstLink.addClass('active');
                linksMobile.removeClass('active');
                $(`#${target}`).show().addClass('active');
            }
        },

        goToProductReviews: function () {
            const ratingStars = $('.pageProduct .pageProduct-nameAndInformation .product-rating');
            const internal = this;

            ratingStars.on('click', function () {
                let target;
                let adjust;

                if ($(window).width() < 768) {
                    target = '.pageProduct-tabs .tabs .tabs-navMobile.tabs-linkComments';
                    adjust = 60;
                } else {
                    target = '.pageProduct-tabs .tabs-nav .nav-link.tabs-linkComments';
                    adjust = 120;
                }

                $(target).trigger('click');

                if (target && target !== '#') {
                    $('html,body').animate(
                        {
                            scrollTop: Math.round($(target).offset().top) - adjust,
                        },
                        600
                    );
                }
            });

            setTimeout(() => {
                $('#form-comments .submit-review').on('click', function (e) {
                    if (!$('#form-comments .stars .starn.icon-star').length) {
                        const textError = 'Avaliação do produto obrigatória, dê sua avaliação por favor';
                        $('#div_erro .blocoAlerta').text(textError).show();
                        setTimeout(() => {
                            $('#div_erro .blocoAlerta').hide();
                        }, 5000);
                    }
                });
            }, 3000);
        },

        chooseProductReview: function () {
            $('#form-comments .rateBlock .starn').on('click', function () {
                const message = $(this).data('message');
                const rating = $(this).data('id');

                $(this).parent().find('#rate').html(message);
                $(this).closest('form').find('#nota_comentario').val(rating);

                $(this).parent().find('.starn').removeClass('icon-star');

                $(this).prevAll().addClass('icon-star');

                $(this).addClass('icon-star');
            });
        },

        sendProductReview: function () {
            $('#form-comments').on('submit', function (event) {
                const form = $(this);

                $.ajax({
                    url: form.attr('action'),
                    method: 'post',
                    dataType: 'json',
                    data: form.serialize(),
                    success: function (response) {
                        form.closest('.tabs-content.comments').find('.blocoAlerta').hide();
                        form.closest('.tabs-content.comments').find('.blocoSucesso').show();

                        setTimeout(function () {
                            form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                            $('#form-comments #mensagem_coment').val('');

                            form.find('#nota_comentario').val('');
                            form.find('#rate').html('');

                            form.find('.starn').removeClass('icon-star');
                        }, 8000);
                    },
                    error: function (response) {
                        const error = JSON.stringify(response);

                        form.closest('.tabs-content.comments').find('.blocoSucesso').hide();
                        form.closest('.tabs-content.comments').find('.blocoAlerta').html(error).show();
                    },
                });

                event.preventDefault();
            });
        },

        reviewsOnProductPage: function () {
            let commentsBlock = $(`<div class="tabs-reviews">${window.commentsBlock}</div>`);
            const buttonReview =
                '<button type="submit" class="submit-review button2">Enviar Avalia&ccedil;&atilde;o</button>';
            const star = '<span class="icon-star" aria-hidden="true"></span>';
            const starEmpty = '<span class="icon-star-empty" aria-hidden="true"></span>';

            commentsBlock.find('.hreview-comentarios + .tray-hide').remove();

            $.ajax({
                url: '/mvc/store/greeting',
                method: 'get',
                dataType: 'json',
                success: function (response) {
                    if (!Array.isArray(response.data)) {
                        commentsBlock.find('#comentario_cliente form.tray-hide').removeClass('tray-hide');

                        commentsBlock.find('#form-comments #nome_coment').val(response.data.name);
                        commentsBlock.find('#form-comments #email_coment').val(response.data.email);

                        commentsBlock.find('#form-comments [name="ProductComment[customer_id]"]').val(response.data.id);
                    } else {
                        commentsBlock.find('#comentario_cliente a.tray-hide').removeClass('tray-hide');
                    }

                    $('#tray-comment-block').before(commentsBlock);

                    $('#form-comments #bt-submit-comments').before(buttonReview).remove();

                    $('.ranking .rating').each(function () {
                        let review = Number(
                            $(this)
                                .attr('class')
                                .replace(/[^0-9]/g, '')
                        );

                        for (i = 1; i <= 5; i++) {
                            if (i <= review) {
                                $(this).append(star);
                            } else {
                                $(this).append(starEmpty);
                            }
                        }
                    });

                    $('#tray-comment-block').remove();

                    theme.chooseProductReview();
                    theme.sendProductReview();
                },
            });
        },

        buyTogetherOnProductPage: function () {
            const boxImages = $('.compreJunto form .fotosCompreJunto');
            const image = $('.compreJunto .produto img');
            const qtd = $('.compreJunto .precoCompreJunto .unidades_preco .unidades_valor');
            const spansLinksRemove = $(
                '.compreJunto .precoCompreJunto div:first-child> span, .compreJunto .precoCompreJunto div:first-child> a, .compreJunto .precoCompreJunto div:first-child > br'
            );
            let listQtd = [];

            boxImages.append('<div class="plus color to">=</div>');

            qtd.each(function () {
                const value = $(this).text();
                listQtd.push(value);
            });

            spansLinksRemove.each((i, span) => span.remove());

            image.each(function (index) {
                let bigImgUrl = $(this).attr('src').replace('/90_', '/180_');
                const link = $(this).parent().attr('href') || '';
                const name = $(this).attr('alt');

                $(this).addClass('buyTogether-img lazyload').attr('src', '').attr('data-src', bigImgUrl);

                if (link !== '') {
                    $(this).unwrap();
                    $(this).parents('span').after(`<a class="buyTogether-nameProduct" href="${link}">${name}</a>`);
                } else {
                    $(this).parents('span').after(`<p class="buyTogether-nameProduct">${name}</p>`);
                }

                if (listQtd[index] == 1) {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidade</p>`);
                } else {
                    $(this).after(`<p class="buyTogether-text">${listQtd[index]} unidades</p>`);
                }
            });
        },

        tabNavigationOnProductPage: function () {
            const internal = this;
            const customTab = $('tabs-navMobile[href*="AbaPersonalizada"]');
            const urlTabs = $('.pageProduct .tabs .tabs-content[data-url]');
            const linkNavTabs = $('.pageProduct .tabs-nav .nav-link');
            const linkNavMobileTabs = $('.pageProduct .tabs .tabs-navMobile');
            const content = $('.pageProduct .tabs .tabs-content');

            customTab.each(function () {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                $(target).detach().insertAfter(this);
            });

            urlTabs.each(function () {
                let tab = $(this);
                let url = tab.data('url');

                $.ajax({
                    url: url,
                    method: 'get',
                    success: function (response) {
                        tab.html(response);
                        $('#atualizaFormas li table').css('display', 'none');
                        openPaymentMethod();
                    },
                });
            });

            const openPaymentMethod = () => {
                $('#formasPagto #linkPagParcelado').remove();

                return $('#atualizaFormas li a').on('click', function () {
                    $(this).toggleClass('u-visible');
                });
            };

            linkNavTabs.on('click', function (event) {
                const tabs = $(this).closest('.pageProduct-tabs');

                if (!$(this).hasClass('active')) {
                    let target = $(this).attr('href').split('#')[1];
                    target = $(`#${target}`);

                    $(linkNavTabs, tabs).removeClass('active');
                    $(this).addClass('active');
                    $(content, tabs).fadeOut();

                    setTimeout(function () {
                        target.fadeIn();
                    }, 300);
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            linkNavMobileTabs.on('click', function (event) {
                let target = $(this).attr('href').split('#')[1];
                target = $(`#${target}`);

                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                    target.removeClass('active').slideUp();
                } else {
                    linkNavMobileTabs.removeClass('active');
                    content.removeClass('active').slideUp();

                    $(this).addClass('active');
                    target.addClass('active').slideDown();
                }

                event.preventDefault();
                event.stopPropagation();
                return false;
            });

            internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);

            $(window).on('resize', function () {
                internal.adjustOpenTabs(content, linkNavTabs, linkNavMobileTabs);
            });
        },

        recreateGalleryProductVariationImage: function (newVariationImages) {
            const allImages = $('[data-gallery="image"]');
            const boxImages = $('[data-gallery="box-images"]');
            const boxThumbs = $('[data-gallery="box-thumbs"]');
            const productName = $('.pageProduct .pageProduct-name').text();
            let htmlThumbs = ``;
            let htmlImages = ``;

            $.each(newVariationImages, function (index, item) {
                let slideIndex = index + 1;

                htmlImages += `
                    <div class="swiper-slide gallery-image" data-gallery="image">
                        <img class="gallery-img${slideIndex === 1 ? ' swiper-lazy' : ' lazyload'}" data-src="${
                    item.https
                }" alt="${productName}" width="1000px" height="1000px">
                    </div>
                `;

                htmlThumbs += `
                    <div class="swiper-slide gallery-thumb" data-gallery="image">
                        <img class="gallery-img${slideIndex === 1 ? ' swiper-lazy' : ' lazyload'}" data-src="${
                    item.thumbs[90].https
                }" alt="${productName}" width="90px" height="90px">
                    </div>
                `;
            });

            if (theme.settings.productThumbs) {
                theme.settings.productThumbs.destroy();
            }

            if (theme.settings.productGallery) {
                theme.settings.productGallery.destroy();
            }

            allImages.remove();
            boxImages.html(htmlImages);
            boxThumbs.html(htmlThumbs);

            theme.gallerySlidesOnProductPage();
        },

        loadProductVariantImage: function (id) {
            $.ajax({
                url: `/web_api/variants/${id}`,
                method: 'get',
                success: function (response) {
                    const newVariationImages = response.Variant.VariantImage;

                    if (newVariationImages.length) {
                        theme.recreateGalleryProductVariationImage(newVariationImages);
                    }
                },
                error: function (request, status, error) {
                    console.log(`[Theme] An error occurred while retrieving product variant image. Details: ${error}`);
                },
            });
        },

        initProductVariationImageChange: function () {
            const productVariationBox = $('.pageProduct-variants');
            const internal = this;

            productVariationBox.on('click', '.lista_cor_variacao li[data-id]', function () {
                internal.loadProductVariantImage($(this).data('id'));
            });

            productVariationBox.on('click', '.lista-radios-input', function () {
                internal.loadProductVariantImage($(this).find('input').val());
            });

            productVariationBox.on('change', 'select', function () {
                internal.loadProductVariantImage($(this).val());
            });
        },
        /* --- End Product Page Organization --- */
        /* Beginning Pages Tray Organization */
        processRteVideoAndTable: function () {
            $(`.col-panel .tablePage, 
               .page-extra .page-content table, 
               .page-extras .page-content table, 
               .board_htm table,
               .rte table,
               .page-noticia table
            `).wrap('<div class="table-overflow"></div>');

            $(`.page-noticia iframe[src*="youtube.com/embed"], 
               .page-noticia iframe[src*="player.vimeo"],
               .board_htm iframe[src*="youtube.com/embed"],
               .board_htm iframe[src*="player.vimeo"],
               .rte iframe[src*="youtube.com/embed"],
               .rte iframe[src*="player.vimeo"]
            `).wrap('<div class="rte-video-wrapper"></div>');
        },

        insertBreadcrumbNavigationInPage: function (local = '', customName = false) {
            let items;
            let breadcrumb = '';
            let pageName = document.title.split(' - ')[0].split(' | ')[0];

            if (local === 'listNews') {
                if (!window.location.href.includes('busca_noticias')) {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                    ];
                } else {
                    items = [
                        { text: 'Home', link: '/' },
                        { text: 'Not&iacute;cias', link: '/noticias' },
                        { text: 'Todas as Not&iacute;cias', link: '/busca_noticias' },
                    ];
                }
            } else if (local === 'news') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName },
                ];
            } else if (local === 'wishlist') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Lista de Desejos', link: '/listas' },
                ];
            } else if (local != '' && customName === true) {
                items = [{ text: 'Home', link: '/' }, { text: local }];
            } else {
                items = [{ text: 'Home', link: '/' }, { text: pageName }];
            }

            $.each(items, function (index, item) {
                if (this.link) {
                    breadcrumb += `                       
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <a itemprop="item" class="breadcrumb-link" href="${item.link}">
                                <span itemprop="name">${item.text}</span>
                            </a>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>   
                        `;
                } else {
                    breadcrumb += `
                        <li class="breadcrumb-item" itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                            <span itemprop="name">${item.text}</span>
                            <meta itemprop="position" content="${index + 1}" />
                        </li>          
                    `;
                }
            });

            $('.default-content > .container').prepend(`
                <ol class="breadcrumb" itemscope itemtype="https://schema.org/BreadcrumbList">
                    ${breadcrumb}
                </ol>
            `);
        },

        toggleShowReviewsForm: function () {
            $('[data-toggle="reviews"]').on('click', function (event) {
                let item = $(this).parent();

                item.toggleClass('u-show');
                event.preventDefault();
            });
        },

        validateFormFieldsToSendCustomerReview: function () {
            const formToSendReview = $('.page-depoimentos .container3 #depoimento');
            const buttonToSendReview = $('.page-depoimentos .container3 #depoimento .btn_submit');

            formToSendReview.validate({
                rules: {
                    nome_depoimento: {
                        required: true,
                    },
                    email_depoimento: {
                        required: true,
                        email: true,
                    },
                    msg_depoimento: {
                        required: true,
                    },
                    input_captcha: {
                        required: true,
                    },
                },
                messages: {
                    nome_depoimento: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_depoimento: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    msg_depoimento: {
                        required: 'Por favor, escreva uma mensagem no seu depoimento',
                    },
                    input_captcha: {
                        required: 'Por favor, preencha com o c&oacute;digo da imagem de verifica&ccedil;&atilde;o',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });

            buttonToSendReview.on('click', function () {
                const button = $(this);

                if (formToSendReview.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });

            /* Create observer to detect Tray return */

            let target = $('#aviso_depoimento').get(0);
            let config = { attributes: true };

            let observerReviewMessage = new MutationObserver(function () {
                buttonToSendReview.html('Enviar Depoimento').removeAttr('disabled');
            });

            observerReviewMessage.observe(target, config);
        },

        organizeContactUsPage: function () {
            const textPageContact = $('.page-contact .default-content > .container');
            const buttonPageContact = $('.page-contact #btn_submit img.image');
            const inputTelPageContact = $('.page-contact #telefone_contato');
            const textEmailPageContact = $('.page-contact .email-texto');
            const tel01PageContact = $('.page-contact .contato-telefones .block:nth-child(1)');
            const tel02PageContact = $('.page-contact .contato-telefones .block:nth-child(2)');

            textPageContact.prepend(`
                <h1>Fale conosco</h1>
                <p class="contactUs-description">Precisa falar com a gente? Utilize uma das op&ccedil;&otilde;es abaixo para entrar em contato conosco.</p>
            `);
            buttonPageContact.parent().text('Enviar Mensagem').addClass('button2').children().remove();
            inputTelPageContact.removeAttr('onkeypress maxlength').addClass('mask-phone');
            textEmailPageContact.parent().wrap('<div class="contactUs-email"></div>');

            if (tel01PageContact.length) {
                let phoneNumberFormatted = tel01PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel01PageContact.unwrap().parent().addClass('contactUs-phone')
                    .html(`<h3>Central de Atendimento ao Cliente</h3>
                    <a href="tel:${phoneNumber}" title="Ligue para n&oacute;s">${phoneNumberFormatted}</a>`);
            }

            if (tel02PageContact.length) {
                let phoneNumberFormatted = tel02PageContact.text();
                let phoneNumber = phoneNumberFormatted.replace(/\D/g, '');

                tel02PageContact
                    .wrap('<div class="contactUs-whats"></div>')
                    .parent()
                    .insertAfter('.page-contact .contactUs-phone').html(`<h3>WhatsApp</h3>
                        <a target="_blank" rel="noopener noreferrer" href="https://api.whatsapp.com/send?l=pt&phone=55${phoneNumber}" title="Fale conosco no WhatsApp">${phoneNumberFormatted}</a>`);
            }
        },

        validateFormFieldsToSendContactEmail: function () {
            const formToSendContact = $('.page-contact .container2 .formulario-contato');
            const buttonToSendContact = $('.page-contact .container2 .formulario-contato .btn_submit');

            formToSendContact.validate({
                rules: {
                    nome_contato: {
                        required: true,
                    },
                    email_contato: {
                        required: true,
                        email: true,
                    },
                    mensagem_contato: {
                        required: true,
                    },
                },
                messages: {
                    nome_contato: {
                        required: 'Por favor, informe seu nome completo',
                    },
                    email_contato: {
                        required: 'Por favor, informe seu e-mail',
                        email: 'Por favor, preencha com um e-mail v&aacute;lido',
                    },
                    mensagem_contato: {
                        required: 'Por favor, escreva uma mensagem para entrar em contato',
                    },
                },
                errorElement: 'span',
                errorClass: 'error-block',
            });
            buttonToSendContact.on('click', function () {
                const button = $(this);

                if (formToSendContact.valid()) {
                    button.html('Enviando...').attr('disabled', true);
                }
            });
        },

        organizeNewsletterRegistrationPage: function () {
            if ($('.page-newsletter .formulario-newsletter').length) {
                $(
                    '.page-newsletter .formulario-newsletter .box-captcha input, .page-newsletter .formulario-newsletter .box-captcha-newsletter input'
                )
                    .attr('placeholder', 'Digite o c&oacute;digo ao lado')
                    .trigger('focus');
                $('.formulario-newsletter .newsletterBTimg').html('Enviar').removeClass().addClass('button2');
            } else {
                $('.page-newsletter .default-content').addClass('success-message-newsletter');
                $('.page-newsletter .default-content.success-message-newsletter .board p:first-child a')
                    .addClass('button2')
                    .html('Voltar para p&aacute;gina inicial');
            }

            setTimeout(function () {
                $('.page-newsletter .default-content').addClass('u-show');
            }, 200);
        },

        organizeNewsPage: function () {
            const titleButtonPage = $('.page-busca_noticias #listagemCategorias b');
            if (!window.location.href.includes('busca_noticias')) {
                titleButtonPage.replaceWith('<h1>Not&iacute;cias</h1>');
            }
        },

        organizePagesTray: function () {
            const login = $('.caixa-cadastro #email_cadastro');
            const buttonReviewPage = $('.page-depoimentos .container .btn_submit');
            const titleReviewPage = $('.page-depoimentos .container #comentario_cliente');
            const buttonAdvancedSearch = $('.page-search #Vitrine input[type="image"]');

            login.attr('placeholder', 'Digite seu e-mail*');
            buttonReviewPage.html('Enviar Depoimento').addClass('button2 review-button');
            titleReviewPage.prepend(
                '<button class="review-form" data-toggle="reviews">Deixei seu depoimento sobre nós <span class="icon-arrow-simple" aria-hidden="true"></span></button>'
            );
            buttonAdvancedSearch.after('<button type="submit" class="button2">BUSCAR</button>');
            buttonAdvancedSearch.remove();
        },

        /* --- End Pages Tray Organization --- */

        /* To Action in ajax.html */
        updateCartTotal: function () {
            $('[data-cart="amount"]').text($('.cart-preview-item').length);
        },
    };

    // Execution of Functions
    $(() => {
        const lazyLoadImages = new LazyLoad({
            elements_selector: '.lazyload',
        });

        theme.organizePagesTray();
        theme.getScroll();

        setTimeout(() => {
            theme.processRteVideoAndTable();
            theme.openApplyOverlayClose();
            theme.scrollHidesMenu();
            theme.mainMenuMobile();
            theme.libMaskInit();
        }, 20);

        if ($('html').hasClass('page-home')) {
            setTimeout(function () {
                theme.bannerSlides();
                theme.loadNewsPageOnHome();
            }, 40);
            theme.customerReviewsSlidesOnHome();
            theme.brandsSlides();
        } else if ($('html').hasClass('page-product')) {
            theme.gallerySlidesOnProductPage();
            theme.openProductVideoModal();
            theme.getQuantityChangeOnProductPage();
            theme.initProductVariationImageChange();
            theme.generateShippingToProduct();
            theme.goToProductReviews();
            theme.reviewsOnProductPage();
            theme.tabNavigationOnProductPage();
            theme.buyTogetherOnProductPage();
            setTimeout(() => {
                theme.organizeProductPage();
            }, 20);
        } else if ($('html').hasClass('page-contact')) {
            theme.organizeContactUsPage();
            theme.validateFormFieldsToSendContactEmail();
        } else if ($('html').hasClass('page-newsletter')) {
            theme.organizeNewsletterRegistrationPage();
        } else if ($('html').hasClass('page-depoimentos')) {
            theme.toggleShowReviewsForm();
            theme.validateFormFieldsToSendCustomerReview();
        } else if ($('html').hasClass('page-busca_noticias')) {
            theme.organizeNewsPage();
            theme.insertBreadcrumbNavigationInPage('listNews');
        } else if ($('html').hasClass('page-noticia')) {
            theme.insertBreadcrumbNavigationInPage('news');
        } else if ($('html').hasClass('page-company')) {
            theme.insertBreadcrumbNavigationInPage('Sobre nós', true);
        } else if (
            $('html').hasClass('page-listas_index') ||
            $('html').hasClass('page-listas_evento') ||
            $('html').hasClass('page-listas_criar')
        ) {
            theme.insertBreadcrumbNavigationInPage('wishlist');
        } else if ($('html').hasClass('page-extra')) {
            theme.insertBreadcrumbNavigationInPage('Sistema de Afiliados', true);
        }
    });
})(jQuery);

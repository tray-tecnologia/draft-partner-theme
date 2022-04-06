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
        },

        /* Beginning General Functions */
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

                $(`${targetElement} .dep_dados`).wrap('<a href="/depoimentos-de-clientes" title="Ver depoimento"></a>');
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

            const galleryThumbs = new Swiper(targetThumbs, {
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

            const galleryImages = new Swiper(targetGallery, {
                spaceBetween: 10,
                lazy: {
                    loadPrevNext: true,
                },
                navigation: {
                    prevEl: '.slides-buttonPrev--galery',
                    nextEl: '.slides-buttonNext--galery',
                },
                thumbs: {
                    swiper: galleryThumbs,
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

            //the quantity button will only be displayed if the single click sell option is disabled
            if ($('[data-buy-product="box"] div#quantidade label')[0]) {
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
            const internal = this;
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

        /* --- End Product Page --- */
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

        insertBreadcrumbNavigationInPage: function (local = '') {
            let items;
            let breadcrumb = '';
            let pageName = document.title.split(' - ')[0];

            if (local == 'listNews') {
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
            } else if (local == 'news') {
                items = [
                    { text: 'Home', link: '/' },
                    { text: 'Not&iacute;cias', link: '/noticias' },
                    { text: pageName },
                ];
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

    // execução das funçoes
    $(() => {
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
            setTimeout(() => {
                theme.organizeProductPage();
            }, 20);
            theme.generateShippingToProduct();
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
        }
    });
})(jQuery);

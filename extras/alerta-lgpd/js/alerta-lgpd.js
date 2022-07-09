/* LGPD function */
getCookie: function () {
    const cookiesAccepted = Cookies.get('lgpd-alert');
    const closeButton = $('.lgpdAlert-close');

    if (cookiesAccepted != 'true') {
        $('.lgpdAlert').addClass('show-lgpd-alert');

        closeButton.on('click', function () {
            $('.lgpdAlert').removeClass('show-lgpd-alert');
            Cookies.set('lgpd-alert', true, { expires: 7 });
        })
    }
},
/* --- End LGPD function  --- */

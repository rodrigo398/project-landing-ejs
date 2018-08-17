$(document).ready(function() {
  $('#colum-nota .content-banner.banner300x250')
    .last()
    .addClass('sticker');
  $('#side-menu').addClass('sticker');

  var styles = {
    width: '100%',
    maxWidth: 'initial'
  };

  var ventana_ancho = $(window).width();

  if (ventana_ancho > 768) {
    $('#colum-nota .content-banner.banner300x250, #colum-nota aside')
      .last()
      .addClass('sticker');
    $('#side-menu').addClass('sticker');
  } else {
    if (ventana_ancho <= 768) {
      $('#colum-nota .content-banner.banner300x250, #colum-nota aside')
        .last()
        .removeClass('sticker');
      $('#side-menu').removeClass('sticker');
      $('#colum-nota .content-banner.banner300x250, #colum-nota aside')
        .last()
        .css(styles);
      $('#side-menu').css(styles);
    }
  }

  $('.sticker').sticky({
    topSpacing: 0,
    bottomSpacing: 0,
    width: 0
  });
});

var APP = APP || {};
APP.user = {};

APP.readCookie = function(cname) {
  var name = cname + '=',
    cookies = document.cookie.split(';');

  for (var i = 0, k = cookies.length; i < k; i++) {
    var cookie = cookies[i];
    while (cookie.charAt(0) == ' ') {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) == 0) {
      return true;
    }
  }
  return false;
};

APP.isLogd = function() {
  return APP.readCookie('qesq');
};

/**MOSTRAMOS DATOS DEL USUARIO LOGUEADO*/
APP.user.ShowUserData = function(data) {
  $('#boton-ingresar').hide();
  $('.body-index .dropdown-toggle').prepend(
    "<i class='fa fa-user fa-fw'></i> <i class='fa fa-caret-down'></i>"
  );
  $('#user-name').append(data.firstname + ' ' + data.lastname);
  $('.user-name').append(data.firstname + ' ' + data.lastname);
  $('.dropdown-toggle').css('display', 'block');

  $('#menu-login').empty();
  $(
    '<a href="/logout"><i class="fa fa-sign-out fa-fw"></i>Logout</a>'
  ).appendTo('#menu-login');
};

APP.init = function() {
  if (APP.isLogd()) {
    $.getJSON('/api/getuser', function(data) {
      APP.user.ShowUserData(data);
    });
  } else {
    $('#menu-login').empty();
    $(
      "<a onclick=\"javascript:openPopUpProvider('facebook', false, '1', 'landing' );\"><i class=\"fa fa-sign-in fa-fw\"></i>Login</a>"
    ).appendTo('#menu-login');
    $('.nav-item.dropdown').hide();
  }
};

APP.init();

window.addEventListener(
  'message',
  function(event) {
    if (event.origin !== 'https://www.landing.com') return;
    sendToken(event.data);
  },
  false
);

function sendToken(tokenID) {
  $.post(
    '/api/users',
    {
      token: tokenID
    },
    function(data) {
      APP.user.ShowUserData(data);
      location.reload();
    }
  );
}

function openPopUpProvider(provider, associate, publicationId, publicationUrl) {
  var host = window.location.origin;
  var winOpenId = window.open(
    'https://www.landing.com/usuarios/popup_LoginSSO.html',
    host,
    'height=500,width=500,status=no,toolbar=no'
  );
  switch (provider) {
    case 'facebook':
      winOpenId.resizeTo(860, 480);
      break;
  }
  winOpenId.focus();
}

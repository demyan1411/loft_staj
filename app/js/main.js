
 $(document).ready(function() {

 	"use strict";


//Запуск модулей


$('.button-up').on('click', function() {
  $('html, body').animate({scrollTop: 0}, 300);
});

if($('#map').length) {
  map.init();
}



  if($('form').length) {
    Popups.init();
    validateThisForm.init();
  }

});

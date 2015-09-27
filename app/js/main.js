
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



var map = (function() {

  var start = function() {
		_setUpListeners();
	},
	_setUpListeners = function() {
    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [59.960733, 30.375911],
                zoom: 12,
                controls: ['smallMapDefaultSet']
            }, {
                searchControlProvider: 'yandex#search'
            });


          var HintLayout = ymaps.templateLayoutFactory.createClass( "<div class='hint'>" +
                "<div class='hint__title'>{{ properties.title }}</div>" +
                "<div class='hint__text'>{{ properties.address }}</div>" +
                "<img src='{{properties.img}}' class='hint__img'>" +
                "</div>", {
                    getShape: function () {
                        var el = this.getElement(),
                            result = null;
                        if (el) {
                            var firstChild = el.firstChild;
                            result = new ymaps.shape.Rectangle(
                                new ymaps.geometry.pixel.Rectangle([
                                    [0, 0]
                                ])
                            );
                        }
                        return result;
                    }
                }
            );

        var myPlacemark = new ymaps.Placemark(
          [59.965894, 30.301756], {
            title: "ТК Северная",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg",
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map1.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myPlacemark.events.add('mouseenter', function () {
          console.log('О, событие!');
      });
        myMap.geoObjects.add(myPlacemark);

        var myPlacemark2 = new ymaps.Placemark(
          [59.940069, 30.346043], {
            title: "name2",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map1.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark2);

        var myPlacemark3 = new ymaps.Placemark(
          [59.963485, 30.367674], {
            title: "name3",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark3);

        var myPlacemark4 = new ymaps.Placemark(
          [59.942304, 30.262275], {
            title: "Тname4",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark4);

        var myPlacemark5 = new ymaps.Placemark(
          [59.9862, 30.392737], {
            title: "name5",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map3.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark5);

        var myPlacemark6 = new ymaps.Placemark(
          [59.952123, 30.41745], {
            title: "name6",
            address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map3.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemark6);

    });
	}

  return {
        init: start
  }

  }());

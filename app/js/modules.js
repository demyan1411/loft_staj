//******* ie8 preventDefault
	function ie8SafePreventEvent(e) {
	    if (e.preventDefault) {
	        e.preventDefault()
	    } else {
	        e.stop()
	    };

	    e.returnValue = false;
	    e.stopPropagation();
	}


// Popups

var Popups = (function(){
	var	popups = $('.popup');

  var start = function() {
    _setUpListeners();
  },
  _setUpListeners = function() {

	    $('.popup__close, .popup__overlay').on('click', function(e){
				if($(this).closest('.popup').attr('id') !== 'preload') {
		      e.preventDefault();
		      _close();
				}
	    });

  },
  _close = function() {
		popups.fadeOut(300);
	}

	return {
    init: start,

		open: function(id) {
			var	reqPopup = popups.filter(id);

			reqPopup.fadeIn(300);
		},
		close: function(id) {
			var	reqPopup = popups.filter(id);

			reqPopup.fadeOut(300);
		}
	}
}());

// Плагин для tooltips

 $.fn.tooltip = function(options) {
    options = {
        position: options.position || 'right',
        content : options.content || 'Tooltip',
    };

    var markup = '<div class="tooltip tooltip_' + options.position + '">' +
                    '<div class="tooltip__inner">' + options.content + '</div>' +
                 '</div>';

    var $this = this,
        body = $('body'),
        elemLength = $('.tooltipstered').length;
    var thisElemNumber;



    if(!$this.is("[data-elem-number]")) {
      $this.attr('data-elem-number', elemLength);
    }


    if(!$this.hasClass('tooltipstered')) {
      thisElemNumber = $this.data('elem-number');
      $this
        .addClass('tooltipstered')
        .attr('data-tooltip-position', options.position);
        body.append(markup);
        _positionIt($this, body.find('.tooltip').last(), options.position);
    }

    $this.on('mousedown', function() {
    	$('[data-tooltip-number = ' + thisElemNumber +']').remove();
      $this.removeClass('tooltipstered').removeClass('error');
    });

    $('[type="reset"]').on('click', function() {
      $('[data-elem-number]').removeClass('tooltipstered').removeClass('error');
      $('[data-tooltip-number]').remove();
    });

    $(window).resize(function() {
    	$('.tooltipstered').each(function() {
    		var position = $(this).data('tooltip-position'),
            resizedTooltipNumber = $(this).data('elem-number'),
            resizedTooltip = $('[data-tooltip-number = ' + resizedTooltipNumber +']');
    		_positionIt($(this), resizedTooltip, position);
    	});
    });

    function _positionIt(elem, tooltip, position) {
        if(!tooltip.is("[data-tooltip-number]")) {
          tooltip.attr('data-tooltip-number', thisElemNumber);
        }

        var elemWidth = elem.outerWidth(true),
            elemHeight = elem.outerHeight(true),
            topEdge = elem.offset().top,
            bottomEdge = topEdge + elemHeight,
            leftEdge = elem.offset().left,
            rightEdge = leftEdge + elemWidth+1;

        var tooltipWidth = tooltip.outerWidth(true),
            tooltipHeight = tooltip.outerHeight(true),
            leftCentered = (elemWidth / 2) - (tooltipWidth / 2),
            topCentered = (elemHeight / 2) - (tooltipHeight / 2);

        var positions = {};

        switch(position) {
            case 'right' :
                positions = {
                    left: rightEdge,
                    top: topEdge + topCentered
                };
                break;
            case 'top' :
                positions = {
                    left: leftEdge + leftCentered,
                    top: topEdge - tooltipHeight
                };
                break;
            case 'bottom' :
                positions = {
                    left: leftEdge + leftCentered,
                    top: bottomEdge
                };
                break;
            case 'left' :
                positions = {
                    left: leftEdge - tooltipWidth,
                    top: topEdge + topCentered
                };
                break;
        }

        tooltip
            .offset(positions)
            .css({
                'opacity': 1
            });
    }
};

// Валидатор


var validateThisForm = (function() {

  var start = function() {
    _setUpListeners();

  },
  _setUpListeners = function() {
		$('form').on('submit', function(e) {
      ie8SafePreventEvent(e);

      var $this = $(this);

      if(validateThis($this)) {
			     postFormData($this);
  		}

    });

  },
	validateThis = function(form) {
	  var textType = form.find('[data-validation="text"]'),
	      mailType = form.find('[data-validation="mail"]'),
	      phoneType = form.find('[data-validation="phone"]');

	  textType.each(function() {
	    var $this = $(this),
	        emptyField = $.trim($this.val());

	    if(emptyField === '') {
	      $this.tooltip({
	        content: 'Заполните поле',
	        position: 'right'
	      });
	      $this.addClass('error');
	    } else {
	      $this.removeClass('error');
	    }
	  });

	  mailType.each(function() {
	    var $this = $(this),
	        regExp = /^([a-zA-Z0-9_.-])+@([a-zA-Z0-9_.-])+\.([a-zA-Z])+([a-zA-Z])+/,
	        isMail = regExp.test($this.val());

	    if(!isMail) {
	      $this.tooltip({
	        content: 'Заполните поле',
	        position: 'right'
	      });
	      $this.addClass('error');
	    } else {
	      $this.removeClass('error');
	    }
	  });

	  phoneType.each(function() {
	    var $this = $(this),
	        regExp = /[0-9]/,
	        isphone = regExp.test($this.val());

	    if(!isphone) {
	      $this.tooltip({
	        content: 'Заполните поле',
	        position: 'right'
	      });
	      $this.addClass('error');
	    } else {
	      $this.removeClass('error');
	    }
	  });

	  return form.find('.error').length === 0;
	},
	postFormData = function(form) {

		var serverAnswer = _ajaxForm(form);

		serverAnswer.done(function(ans) {
			console.log(ans);
			if( ans === 'ok' ) {
				Popups.close('#preload');
				Popups.open('#success');
				form.find('input, textarea').val('');
			} else {
				Popups.close('#preload');
				Popups.open('#error');
			};
		});

	},
	_ajaxForm = function(form) {
		var url = form.attr('action');

		if(!url) {
			console.log('set action attribute to your form, you fool!!');
		}

		var data = form.serialize();

		var result = $.ajax({
			url: url,
			type: 'POST',
			data: data,
			beforeSend: function () {
				Popups.open('#preload');
			}
		})
		.fail(function(ans) {
			console.log('проблемы PHP');
		});

		return result;

	}

  return {
    init: start
  }

}());

///////////////// MAP ////////////////

var map = (function() {

  var start = function() {
		_setUpListeners();
	},
	_setUpListeners = function() {
    ymaps.ready(function () {
        var myMap = new ymaps.Map('map', {
                center: [59.272186, 35.031547],
                zoom: 6,
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

        var myPlacemarkR1 = new ymaps.Placemark(
          [59.912797, 30.506257], {
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
        myMap.geoObjects.add(myPlacemarkR1);



        var myPlacemarkR2 = new ymaps.Placemark(
          [60.041503, 30.447013], {
            title: "ТК Северная",
            address: "Ленинградская обл., Всеволожский р-н, пос. Мурино, ул. Новая, д 7, строение 1",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map1.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkR2);




        var myPlacemarkR3 = new ymaps.Placemark(
          [59.699712, 29.932512], {
            title: "ТК Северная",
            address: "Ленинградская обл., Ломоносовский р-н, с.Русско-Высоцкое",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map1.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkR3);



				var myPlacemarkR4 = new ymaps.Placemark(
          [59.902312, 30.320162], {
            title: "ТК Северная",
            address: "г.Санкт-Петербург, ул.Киевская, д.3",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map1.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkR4);




        var myPlacemarkB1 = new ymaps.Placemark(
          [58.120168, 30.309355], {
            title: "ТК НордЭнерго",
            address: "Новгородская обл.: г.Сольцы",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB1);




        var myPlacemarkB2 = new ymaps.Placemark(
          [57.927807, 30.70677], {
            title: "ТК НордЭнерго",
            address: "Новгородская обл.: п.Волот",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB2);


				var myPlacemarkB3 = new ymaps.Placemark(
          [59.12119, 31.670285], {
            title: "ТК НордЭнерго",
            address: "Новгородская обл.: г.Чудово",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB3);


				var myPlacemarkB4 = new ymaps.Placemark(
          [59.433979, 39.670277], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: с.Кубенское",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB4);

				var myPlacemarkB5 = new ymaps.Placemark(
          [59.37924, 39.508005], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: с.Остахово",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB5);

				var myPlacemarkB6 = new ymaps.Placemark(
          [58.928995, 40.042709], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: д.Новое",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB6);

				var myPlacemarkB7 = new ymaps.Placemark(
          [59.288083, 39.926818], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: п.Дорожный (аэропорт)",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB7);

				var myPlacemarkB8 = new ymaps.Placemark(
          [59.120977, 40.10843], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: с.Княгинино",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB8);

				var myPlacemarkB9 = new ymaps.Placemark(
          [59.619352, 39.335879], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: с.Новленское",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB9);

				var myPlacemarkB9 = new ymaps.Placemark(
          [59.76338, 39.06987], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: д. Нефедово",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB9);

				var myPlacemarkB10 = new ymaps.Placemark(
          [59.559612, 39.164076], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: д. Севастьяново",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB10);

				var myPlacemarkB11 = new ymaps.Placemark(
          [59.553133, 38.356949], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: д. Березник",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB11);

				var myPlacemarkB12 = new ymaps.Placemark(
          [59.127406, 37.90692], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: г.Череповец",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB12);

				var myPlacemarkB13 = new ymaps.Placemark(
          [59.153675, 37.888675], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: Северное шоссе, 67",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB13);

				var myPlacemarkB14 = new ymaps.Placemark(
          [59.343364, 38.616328], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: с. Чаромское",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB14);

				var myPlacemarkB15 = new ymaps.Placemark(
          [59.194735, 38.500652], {
            title: "ТК НордЭнерго",
            address: "Вологодская обл.: д. Прогресс",
            img: "img/hint__img1.jpg"
        } ,{
            hintLayout: HintLayout,
            iconLayout: 'default#image',
            iconImageHref: 'img/map2.png',
            iconImageSize: [23, 33],
            iconImageOffset: [-3, -42]
        });
        myMap.geoObjects.add(myPlacemarkB15);




        // var myPlacemark6 = new ymaps.Placemark(
        //   [59.952123, 30.41745], {
        //     title: "name6",
        //     address: "Ленинградская обл., Всеволожский р-н, дер. Кудрово, ул. Ленинградская, д.3, лит. Б",
        //     img: "img/hint__img1.jpg"
        // } ,{
        //     hintLayout: HintLayout,
        //     iconLayout: 'default#image',
        //     iconImageHref: 'img/map3.png',
        //     iconImageSize: [23, 33],
        //     iconImageOffset: [-3, -42]
        // });
        // myMap.geoObjects.add(myPlacemark6);




    });
	}

  return {
        init: start
  }

  }());

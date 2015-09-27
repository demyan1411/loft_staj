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

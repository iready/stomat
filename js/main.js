$(document).ready(function() {
  var COUNTBOX = "#result";

  $('.open-popup-link').magnificPopup({
    type:'inline',
    midClick: true,
    removalDelay: 500,
    mainClass: 'mfp-fade'
  });

  if (window.location.pathname == '/') new WOW().init();

  if ($(COUNTBOX).length > 0) initCountBox();

  if ($('.affix_handler').length > 0) {
    $('.affix_handler').addClass('affix')
    $('.affix').affix({
      offset: {
        top: 500,
        bottom: $('body').height() - $('.ask-me').offset().top
    }}).css("max-width",($('.container').width() / 4) - 32);
  }
  $( window ).resize(function() {
    $('.affix').css("max-width", $('.container').width() / 4);
  });

  today = (new Date()).setDate((new Date()).getDate());

  $('.datetimepicker').periodpicker({
    norange: true, // use only one value
    cells: [1, 2], // show only one month
    lang: 'ru',
    clearButtonInButton: true,
    useTimepickerLimits: false,
    minDate: today.toString(),

    resizeButton: true, // deny resize picker
    fullsizeButton: false,
    fullsizeOnDblClick: false,

    timepicker: true, // use timepicker
    timepickerOptions: {
      hours: true,
      minutes: true,
      seconds: false,
      ampm: true
    }
  });
});

function initCountBox() {
    var HALF_SCREEN_OFFSET = 600;
    var showed                            = true;

    $(window).on("scroll", function(){
        if(!showed && $(COUNTBOX).length) return false;

        var scrolledHeight     = $(window).scrollTop();
        var countboxOffset    = $(COUNTBOX).offset().top;

        if (scrolledHeight + HALF_SCREEN_OFFSET >= countboxOffset) {
          $(".spincrement").spincrement({
              thousandSeparator: "",
              duration: 5000
          });

          showed = false;
        }
    });
};

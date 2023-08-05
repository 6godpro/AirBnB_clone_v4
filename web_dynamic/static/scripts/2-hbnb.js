$('document').ready(function () {
  // Everything goes here
  const checked = [];
  $('.amenities input[data-id]').on('click', function (event) {
    const target = event.target;
    if (target.checked === true) {
      checked.push(target.dataset.name);
    } else {
      checked.splice(checked.indexOf(target.dataset.name), 1);
    }
    const filter = checked.join(', ');
    $('DIV.amenities h4').text(filter);
  });

  // request the endpoint to check status
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
    if (data?.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
});

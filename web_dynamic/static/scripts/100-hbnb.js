$('document').ready(function () {
  // request the endpoint to check status
  $.get('http://localhost:5001/api/v1/status/', (data) => {
    if (data?.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  // the HTML content for the data
  function responseHtml (data) {
    $('SECTION.places').html(data.map((place) => {
      return `<ARTICLE>
                <DIV class="title_box">
                  <H2>${place.name}</H2>
                  <DIV class="price_by_night">
                    $${place.price_by_night}
                  </DIV>
                </DIV>
                <DIV class="information">
                  <DIV class="max_guest">
                    ${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}
                  </DIV>
                  <DIV class="number_rooms">
                    ${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}
                  </DIV>
                  <DIV class="number_bathrooms">
                    ${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}
                  </DIV>
                </DIV>
                <div class="user">
                  <b>Owner:</b> ${place.user.first_name} ${place.user.last_name}
                </div>
                <DIV class="description">
                  ${place.description}
                </DIV>
              </ARTICLE>`;
    }));
  }
  // initial loading of page, show all places
  $.ajax({
    url: 'http://localhost:5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: responseHtml
  });

  const amenities = {};
  $('.amenities input[data-id]').click(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    $('DIV.amenities h4').text(Object.values(amenities).join(', '));
  });

  const states = {};
  $('DIV.locations ul h2 input[data-id]').click(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    $('.locations h4').text(Object.values(locations).join(', '));
  });

  const cities = {};
  $('DIV.locations ul ul li input[data-id]').click(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    $('.locations h4').text(Object.values(locations).join(', '));
  });

  $('section.filters button').click(function () {
    const requestData = {};
    const filters = Object.assign({}, amenities, cities, states);
    if (Object.keys(filters).length > 0) {
      requestData.amenities = Object.keys(amenities);
      requestData.states = Object.keys(states);
      requestData.cities = Object.keys(cities);
    }
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify(requestData),
      contentType: 'application/json',
      dataType: 'json',
      success: responseHtml
    });
  });
});

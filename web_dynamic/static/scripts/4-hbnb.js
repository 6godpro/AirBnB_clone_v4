$('document').ready(function () {
  // Everything goes here
  const checked = {};
  $('.amenities input[data-id]').on('click', function (event) {
    const target = event.target;
    if (target.checked === true) {
      checked[target.dataset.id] = target.dataset.name;
    } else {
      delete checked[target.dataset.id];
    }
    const filter = Object.values(checked).join(', ');
    $('DIV.amenities h4').text(filter);
  });

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
  // onclick show based on filter
  $('section.filters button').click(function () {
    const filterData = Object.keys(checked);
    const requestData = {};
    // checking for the presence of something in the array, in case someone
    // clicks the button without selecting any amenity.
    requestData.amenities = filterData;
    $.ajax({
      url: 'http://localhost:5001/api/v1/places_search/',
      type: 'POST',
      data: filterData.length > 0 ? JSON.stringify(requestData) : '{}',
      contentType: 'application/json',
      dataType: 'json',
      success: responseHtml
    });
  });
});

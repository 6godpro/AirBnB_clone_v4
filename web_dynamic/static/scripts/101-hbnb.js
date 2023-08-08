$('document').ready(function () {
  // request the endpoint to check status
  $.get('http://localhost:5001/api/v1/status/', (data) => {
    if (data?.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  // reviews state
  const placesReview = {};

  function storeReview (placeId, reviews) {
    // isolate the show value by placeId
    placesReview[placeId] = {};
    const reviewState = {};
    reviewState.show = false;
    reviewState.reviews = reviews;
    placesReview[placeId] = reviewState;
  }

  // the HTML content for the data
  function responseHtml (data) {
    $('section.places').append(data.map((place) => {
      storeReview(place.id, place.reviews);
      return `<article>
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
                <div class="reviews">
                  <div class="title">
                      <h2>
                        ${place.reviews.length} Review${place.reviews !== 1 ? 's' : ''}
                      </h2>
                      <span data-id="${place.id}">show</span>
                  </div>
                  <ul data-id="${place.id}">
                  </ul>
                </div>
              </article>`;
    }));
  }

  $('section.places').on('click', 'span', function (event) {
    const placeId = $(this).attr('data-id');
    placesReview[placeId].show = !placesReview[placeId].show;
    const reviews = placesReview[placeId].reviews;
    if (placesReview[placeId].show) {
      $(`section.places ul[data-id=${placeId}]`).append(reviews.map((review) => {
        return `<li>
                    <h3>
                      From ${review.user.first_name} ${review.user.last_name} ${review.created_at}
                    </h3>
                    <p>${review.text}</p>
                </li>`;
      }));
      $(this).text('hide');
    } else {
      $(`section.places ul[data-id=${placeId}]`).html('');
      $(this).text('show');
    }
  });

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

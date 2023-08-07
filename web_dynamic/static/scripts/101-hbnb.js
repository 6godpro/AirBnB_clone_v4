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
  let show = false;
  const placesReview = {};

  function storeReview (placeId, reviews) {
    placesReview[placeId] = reviews;
  }

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
                <div class="reviews">
                  <div class="title">
                      <h2>
                        ${place.reviews.length} Review${place.reviews !== 1 ? 's' : ''}
                      </h2>
                      <span data-id="${place.id} onclick='${(event) => console.log('line 50:', event)}'">show</span>
                  </div>
                  <ul>
                    ${storeReview(place.id, place.reviews)}
                    <li>
                        <h3>From Chiamaka 22nd May 2023</h3>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas ratione.</p>
                    </li>
                  </ul>
                </div>
              </ARTICLE>`;
    }));
  }
  $('section.places').delegate('div.title', 'click', function () {
    show = !show;
    // console.log(show)
    const placeId = $('div.title span').attr('data-id');
    const reviews = placesReview[placeId];
    // console.log(reviews)
    if (show) {
      $('div.reviews ul').html(reviews.map((review) => {
        return `<li>
                    <h3>
                      From ${review.user.first_name} ${review.user.last_name} ${review.created_at}
                    </h3>
                    <p>${review.text}</p>
                </li>`;
      }));
      $('div.title span').text('hide');
    } else {
      $('div.reviews ul').html('');
      $('div.title span').text('show');
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

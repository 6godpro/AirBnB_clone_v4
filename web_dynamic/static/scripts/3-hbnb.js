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
  $.get('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data?.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: function (data) {
      $('SECTION.places').append(data.map((place) => {
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
  });
});

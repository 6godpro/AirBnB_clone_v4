$('document').ready( function () {
  // Everything goes here
  const checked = [];
  $('.amenities input[data-id]').on('click', function (event) {
    const target = event.target;
    if (target.checked === true) {
      console.log(target.dataset.name)
      checked.push(target.dataset.name);
    } else {
      checked.splice(checked.indexOf(target.dataset.name), 1);
    }
    const filter = checked.join(', ')
    $('DIV.amenities h4').text(filter)
  });

  // request the endpoint to check status
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
    if (data['status'] === 'OK') {
      $('DIV#api_status').addClass('available')
    }
    else {
      $('DIV#api_status').removeClass('available')
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
                  <DIV class="title">
                    <H2>${place.name}</H2>
                    <DIV class="price_by_night">
                      $${place.price_by_night}
                    </DIV>
                  </DIV>
                  <DIV class="information">
                    <DIV class="max_guest">
                      <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                      <BR />
                      ${place.max_guest} Guests
                    </DIV>
                    <DIV class="number_rooms">
                      <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                      <BR />
                      ${place.number_rooms} Bedrooms
                    </DIV>
                    <DIV class="number_bathrooms">
                      <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                      <BR />
                      ${place.number_bathrooms} Bathrooms
                    </DIV>
                  </DIV>
                  <DIV class="description">
                    ${place.description}
                  </DIV>
                </ARTICLE>`;
		}));
	}});
});

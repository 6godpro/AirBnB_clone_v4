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
})

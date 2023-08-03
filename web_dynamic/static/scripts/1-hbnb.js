$('document').ready( function () {
  // Everything goes here
  const checked = [];
  $('.amenities input[data-id]').on('click', function (event) {
    const target = event.target;
    checked.append(target);
    console.log(checked)
  });
})
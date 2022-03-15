mapboxgl.accessToken = mbxToken;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: campground.geometry.coordinates,
  zoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({
  color: '#FF5800'
})
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 30 }).setHTML(
      `<h4 class='mb-1 mt-2 text-center'>${campground.title}</h4><p class='mb-0 text-center'>${campground.location}</p>`
    )
  )
  .addTo(map);

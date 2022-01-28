

//* REMEMBERRRRRRRRRRRRRRRRRRRRRRRR TO INSTALL mapbox-gl (SEE DOCS), OR MARKER WON'T APPEAR
// we can add the token straight here but if someday token changes, I would have to come and change here
// so its recommended to use .env
mapboxgl.accessToken = mapToken;

// now we will store our locations geometrical coordinates
const campPoint =  campground.geometry.coordinates 

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: campPoint, // starting position [lng, lat]
    zoom:6 // starting zoom
});

// adding control options to map
map.addControl(new mapboxgl.NavigationControl());

// adding a marker which will mark our campground

const marker = new mapboxgl.Marker()
.setLngLat(campPoint)
.setPopup(
    new mapboxgl.Popup({offset:25})
    .setHTML(`<h4>${campground.title}</h4><p>${campground.location}</p>`)
)
.addTo(map);



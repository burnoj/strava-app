// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

require("@rails/ujs").start()
require("turbolinks").start()
require("@rails/activestorage").start()
require("channels")
require("dotenv").config();

// Uncomment to copy all static images under ../images to the output folder and reference
// them with the image_pack_tag helper in views (e.g <%= image_pack_tag 'rails.png' %>)
// or the `imagePath` JavaScript helper below.
//
// const images = require.context('../images', true)
// const imagePath = (name) => images(name, true)


// ----------------------------------------------------
// Note(lewagon): ABOVE IS RAILS DEFAULT CONFIGURATION
// WRITE YOUR OWN JS STARTING FROM HERE 👇
// ----------------------------------------------------




// # ---------------------- GLOBAL VARIABLES ---------------------- #



// # Strava API has a defaul 'read' parameter - you need to change this to read all (or the corresponding suffix you want), this url authorises the app to use the data
const read_all = console.log(process.env.READ_ALL)

// # Copied code from output url of previous entry, grants access to data
const code = console.log(process.env.CODE)

// # gets refresh token - access token expires after a while
const refresh = console.log(process.env.REFRESH)

// # gets mapbox token
const mapbox = process.env.MAPBOX_TOKEN

// # Personal Strava Keys
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET
const RefreshToken = process.env.REFRESH_TOKEN

const auth_link = "https://www.strava.com/oauth/token"



// # ---------------------- GET ALL STRAVA ACTIVITES ---------------------- #



function getActivities(res){

    const activities_link = `https://www.strava.com/api/v3/athlete/activities?access_token=${res.access_token}`
    fetch(activities_link)
        .then((res) => (res.json()))
        .then(function (data) {

            const zoom = data[0].start_latlng
            var mymap = L.map('mapid').setView([zoom[0], zoom[1]], 11);

            L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox/streets-v11',
                tileSize: 512,
                zoomOffset: -1,
                accessToken: mapbox
            }).addTo(mymap);

            for(var x=0; x<data.length; x++){
              const coordinates = L.Polyline.fromEncoded(data[x].map.summary_polyline).getLatLngs()

              L.polyline(

                  coordinates,
                  {
                      color: "blue",
                      weight: "5",
                      opacity: .7,
                      lineJoin: "round"
                  }
                ).addTo(mymap)
            }
        })
}

function reAuthorize() {
  fetch(auth_link, {
      method: 'post',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'

      },

      body: JSON.stringify({
         client_id: clientId,
          client_secret: clientSecret,
          refresh_token: RefreshToken,
          grant_type: 'refresh_token'

      })
  }).then(res => res.json())
      .then(res => getActivities(res))
}


// External imports
import "bootstrap";

// Internal imports, e.g:
// import { initSelect2 } from '../components/init_select2';

document.addEventListener('turbolinks:load', () => {
  reAuthorize();
  // reAuthorize();
  // Call your functions here, e.g:
  // initSelect2();
});

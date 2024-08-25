const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

const getDistanceFromLatLonInKm = require("./helper/distanceCalculator");

// @ POST
// api/store?name=bluh&gold=12312&level=214
const searchStores = asyncHandler(async (req, res) => {
  const { place } = req.body;
  const address = place.formatted_address;
  const parts = address.split(",");
  const addressCity = parts.slice(0, 2);
  const city = parts.slice(1,2)[0]
  const parsedCity = city.replaceAll(' ','')

//   console.log(city)
  // console.log(addressCity)

  // (1) URL ENCODING
  const encodedAddress = encodeURI(addressCity);

  // (2) GEOCODE
  const latitude_Longitude_Location = await axios.get(
    `https://geocode.maps.co/search?q=${encodedAddress}&api_key=66bfee81a778d577826886kjy61c62f`
  );

  // (2.5) extract longitude and latitude of address from GEOCODE API results
//   console.log(latitude_Longitude_Location.data)
  const longitude = latitude_Longitude_Location.data[0].lon;
  const latitude = latitude_Longitude_Location.data[0].lat;
  // (3) Look through database to find the nearest pizza store (within 30km)

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // (3.1) Get all pizza stores in the same city (Any Pizza franchise) limit 20
  // const { data, error } = await supabase.from("Pizza_store").select('latitude, longitude').eq('city',city).limit(10);
  

    
    const { data, error } = await supabase.from("Pizza_store")
                                    .select('latitude, longitude, city, Brand')
                                    .eq('city', parsedCity )
                                    .limit(10);
  // LATER:  for each pizza store Calculate the distance


  //   console.log(data)

  // (3.5) if there's no addresses within 30km using the database results then use google "NEARBY"/"PLACES" API to find some and update the database with new locations
  //https://developers.google.com/maps/documentation/places/web-service/search-nearby





  //

  // return a list of json objects with longitude and latitudes to display on map
    /* {
        pizza Coupon: title, 


    }
    
    */

  return res.status(200).json({ pizzaStores: data });
});

module.exports = { searchStores };

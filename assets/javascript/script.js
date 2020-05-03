//Define global vars for the whole page

let currentCity
let apiKey = '110d802a19d34727572afd71cc350157'

if (localStorage.getItem('currentCity')) { //if it exists already
  currentCity = localStorage.getItem('currentCity') //make it that
}
else { //if it doesn't exist already
  currentCity = 'Atlanta' //make it empty
}

let ourMomentInstance = moment()

//Search Bar Code

//Define global vars for the search bar
let searchHistory //important to define it here - if statements have their own scope

if(localStorage.getItem('searchHistory')){ //if it exists already
  searchHistory = localStorage.getItem('searchHistory').split(',') //make it that
}
else{ //if it doesn't exist already
  searchHistory = [] //make it empty
}

localStorage.setItem('currentCity', currentCity)

// searchHistory = ['Jefferson City','Daly City','Amarillo'] test cities

// console.log(localStorage.getItem('searchHistory').split(',')) proper code for retreiving the array

//Define the search history updater function
const searchHistoryUpdater = (myArr) => {
  console.log('running search history updater')
  if (myArr.length <= 5){ //if there are 5 or less cities to display
    $('#search-history').html('')
    for (i = myArr.length - 1;i >=0;i--) { //go backwards so new cities are added to the top of the list
      let newElem = $('<li>')
      newElem.addClass('list-group-item')
      newElem.text(myArr[i])
      mySafeID = myArr[i].split(' ').join('') //remove whitespace
      mySafeID = mySafeID.replace(/\W/g, '') //remove all non alphanumeric characters
      for(let index in mySafeID){

      }
      //to do: before creating id, check for characters that will break the ID, for example:

      //non-malicious: "Martha's Vineyard" , "St. Louis"
      //malicious: "badString'"`</html>"

      newElem.attr("id",`search-item-${mySafeID}`) //remove whitespace
      newElem.data('name',myArr[i])
      $('#search-history').append(newElem)
      $(`#search-item-${mySafeID}`).click(event => {
        //interesting question- when an element is deleted from the search history array
        // (by the else statement), and then deleted from the page on line 15, what happens to
        // its event listener?
        console.log(event.currentTarget.id)
        currentCity = $(`#${event.currentTarget.id}`).data('name') //gets the city name after search-item-
        localStorage.setItem('currentCity', currentCity) //put the new current city in storage
        mainPageUpdater()
      }
      )
    }
  }else{
    searchHistory = myArr.slice(searchHistory.length - 5) //cut the list down to the 5 most recent cities
    localStorage.setItem('searchHistory',searchHistory) //save the new search history
    console.log(`new history: ${searchHistory}`) //debug
    searchHistoryUpdater(searchHistory) //call this function again, with the newly shortened global
    // variable as the argument (this recursion will terminate the first time, because we just made
    // searchHistory 5 elements long, and the terminating condition [satisfying the first if] is
    // length <= 5)
    // however, we could theoretically only reduce the length of searchHistory by 1 (by calling slice(1)),
    // and the function would continue to call itself until it had shortened the list to 5 elements
    //
    // we <3 recursive programming!
  }
  
}

//Add an event listener to the search button

$('#search-button').click(event => {
  event.preventDefault()
  let myVal = $('#search-input').val()
  currentCity = myVal //since we're going to use currentCity elsewhere, we use a separate variable,
  //myVal, for what we're doing with the variable just inside this function
  localStorage.setItem('currentCity', currentCity) //put the new current city in storage

  //to do: check if the value is a valid city before adding it to the search history

  //add the new city to the search history
  searchHistory.includes(myVal)? $.noop() : searchHistory.push(myVal)
  //save the new search history
  localStorage.setItem('searchHistory',searchHistory)
  //run the search history updater
  searchHistoryUpdater(searchHistory)

  $('#search-input').val('') //clear the form field after we update the search history

  //Update Main Page
  mainPageUpdater()
})

const mainPageUpdater = () => {
  $('#todaysDate').text(`(${ourMomentInstance.format('M/DD/YYYY')})`)
  //update the search history from the stored search history, if it isn't empty
  if (localStorage.getItem('searchHistory')){
    searchHistory = localStorage.getItem('searchHistory').split(',')
    searchHistoryUpdater(searchHistory)
  }
  //Get current weather
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${apiKey}&units=metric`)
  .then(r => {
    if(r.status == 404){ //if the city is not found
      throw new Error('bad city')
    } 
    return r.json() //LPT: if you define an arrow function as arg => r.doAThing (no {}),
  }) //the function will return r.doAThing
  .then(data => {
    $('#search-input').val('')
    $('#currentCityName').text(`${currentCity}`)
    //Update image
    $('#weatherIcon').html(`<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">`)
    //Update temperature
    $('#currentCityTemp').text(`${data.main.temp} °C`)
    //Update humidity
    $('#currentCityHumid').text(`${data.main.humidity}%`)
    //Update wind speed
    $('#currentCityWind').text(`${data.wind.speed} km/h`)
    //Update UV Index
    fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${data.coord.lat}&lon=${data.coord.lon}`)
      .then(r => r.json())
      .then(uvData => {
        $('#currentCityUV').text(uvData.value)
      })
    //Get 5 day forecast
    fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=current,hourly&appid=${apiKey}&units=metric`)
      .then(r => r.json())
      .then(data => {
        console.log(data)
        $('#fiveDayForecast').html('')
        for(let i = 1; i <=5; i++){
          let newElem = $('<div>')
          /* card HTML
                <div class="card d-inline-block m-3" style="width: 12rem;">
                  <div class="card-body bg-primary text-white border rounded">
                    <h5 class="card-title">MM/DD/YYYY</h5>
                    <span id = "card1-icon"></span>
                    <p class="card-text">
                      <p>Temperature: <span id="card1-Temp">XX °F</span></p>
                      <p>Humidity: <span id="card1-Humid">XX%</span></p>
                    </p>
                  </div>
                </div>
          */
         newElem.addClass("card d-inline-block m-3")
         newElem.attr("style","width: 14rem;")
         let newChild = $('<div>')
         newChild.addClass("card-body bg-primary text-white border rounded")
        //  newChild.attr("style","height:200px;")
          newChild.html(`
            <h5 class="card-title">${ourMomentInstance.add(1,'days').format('M/DD/YYYY'
            )}</h5>
              <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png">
              <p class="card-text">
                <p>Temperature: ${data.daily[i].temp.day} °C</p>
                <p>Humidity: ${data.daily[i].humidity}%</p>
              </p>`)
        newElem.append(newChild)
        $('#fiveDayForecast').append(newElem)
        } //end of for loop
        //reset the moment instance
        ourMomentInstance.subtract(5, 'days')
      })
    
  })
  .catch(e => {
    $('#search-input').val('City not found')
  })
}

mainPageUpdater() //get the main page started with a city
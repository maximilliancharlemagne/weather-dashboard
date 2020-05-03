//Define global vars for the whole page

let currentCity = 'Atlanta'

//Search Bar Code

//Define global vars for the search bar
let currentSearch = ''
let searchHistory = []

//Define the search history updater function
const searchHistoryUpdater = (myArr) => {
  console.log('running search history updater')
  if (myArr.length <= 5){ //if there are 5 or less cities to display
    $('#search-history').html('')
    for (i = myArr.length - 1;i >=0;i--) { //go backwards so new cities are added to the top of the list
      let newElem = $('<li>')
      newElem.addClass('list-group-item')
      newElem.text(myArr[i])
      newElem.attr("id",`search-item-${myArr[i]}`)
      $('#search-history').append(newElem)
      $(`#search-item-${myArr[i]}`).click(event => {
        console.log(event.currentTarget.id)
        currentCity = event.currentTarget.id.slice(12) //gets the city name after search-item-
        mainPageUpdater()
      }
      )
    }
  }else{
    searchHistory = myArr.slice(searchHistory.length - 5) //cut the list down to the 5 most recent cities
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

  //to do: check if the value is a valid city before adding it to the search history

  //add the new city to the search history
  searchHistory.includes(myVal)? $.noop() : searchHistory.push(myVal)
  //run the search history updater
  searchHistoryUpdater(searchHistory)

  $('#search-input').val('') //clear the form field after we update the search history

  //Update Main Page
  mainPageUpdater()
})

const mainPageUpdater = () => {
  $('#currentCityName').text(`${currentCity}`)
}

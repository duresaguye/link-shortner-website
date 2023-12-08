// create localstorage item
let history = JSON.parse(localStorage.getItem('history')) || []
let result = document.getElementById('result')
let shortenedUrl = document.getElementById('result-url')

function shorten() {
  // get input data and validate with the regex
  const longUrl = document.getElementById('input_data').value;
  const regex = /^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/;


  if (regex.test(longUrl)) {

    const accessToken = 'your api key goes here';
    //fetch bitly data by post request
    fetch('https://api-ssl.bitly.com/v4/shorten', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "long_url": longUrl,
        "domain": "bit.ly"
      })
    })
      .then(response => response.json())
      .then(data => {
        // modify result
        document.getElementById('display-url').innerText = data.link
        document.getElementById('result').style.visibility = 'visible'
        shortenedUrl.innerText = (longUrl.length > 25) ? longUrl.slice(0, 26) + '...' : longUrl
        // add data to the localstorage
        history.push([longUrl, data.link])
        localStorage.setItem('history', JSON.stringify(history))
        // update history data
        updateHistory()
      })
      .catch(error => {
        switch(error.code){
          case 429:
            alert('Too many request, try again later')
            break;
          case 403:
            alert('These service is currently unavailable')
            break;
          default:
            alert('Please try again later')
            break;
        }
      });
  }
}
// display history data
let parseHistory = JSON.parse(localStorage.getItem('history'))
function updateHistory() {
  history.forEach(element => {
    document.getElementById('box').innerHTML += `
    <div class='result'>
     <div class="result-box">
       <p class="url" id="result-url">${element[0]}</p>
       <div id="action-box">
         <p id="display-url">${element[1]}</p>
         <button id="copy-btn" onclick="navigator.clipboard.writeText('${element[1]}')">Copy</button>
       </div>
     </div>
    </div>
  `;
  })
}
updateHistory()

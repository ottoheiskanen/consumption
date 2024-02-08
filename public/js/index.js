const tableContainer = document.getElementById('table-container');

let sites = [];
let interval;
let barChart;

let siteRating = {
  "https://ylilauta.org": "bad",
  "https://www.reddit.com": "bad",
  "https://twitter.com": "bad",
  "https://www.youtube.com": "neutral",
  "https://www.hs.fi": "neutral",
  "https://www.iltalehti.fi": "bad",
  "https://www.is.fi": "bad",
  "https://www.yle.fi": "neutral",
  "https://elearn.uef.fi": "good",
  "https://github.com": "good",
  "https://m.karelia.fi": "good",
  "https://news.ycombinator.com": "neutral",
  "https://www.twitch.tv": "bad"
}

window.onload = function() {
  refreshPageData();
  interval = setInterval(refreshPageData, 10000*6);
}

function refreshPageData() {
  loadData();
}

function daysTrackedSince(date) {
  const today = new Date();
  const startDate = new Date(date);
  const timeDiff = Math.abs(today.getTime() - startDate.getTime());
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

function displayData(data) {
  if (!data) {
    return;
  }

  tableContainer.innerHTML = '';

  //table
  const table = document.createElement('table');
  table.setAttribute('border', '1');
  table.setAttribute('cellpadding', '5');
  table.setAttribute('cellspacing', '0');
  table.setAttribute('width', '100%');

  //header
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  const th1 = document.createElement('th');
  th1.textContent = 'Tracked For:';
  tr.appendChild(th1);
  const th2 = document.createElement('th');
  th2.textContent = 'Site';
  tr.appendChild(th2);
  const th3 = document.createElement('th');
  th3.textContent = 'Time Spent';
  tr.appendChild(th3);

  const th4 = document.createElement('th');
  th4.textContent = 'Site Rating';
  tr.appendChild(th4);

  thead.appendChild(tr);
  table.appendChild(thead);
  
  //table body
  const tbody = document.createElement('tbody');
  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = `${daysTrackedSince(data[i].created_at)} days`;
    tr.appendChild(td1);
    const td2 = document.createElement('td');
    td2.textContent = new URL(data[i].url).hostname;
    tr.appendChild(td2);
    const td3 = document.createElement('td');
    const totalTime = data[i].time_spent;
    //turn seconds in to days, hours, minutes, seconds
    const days = Math.floor(totalTime / (60 * 60 * 24));
    const hours = Math.floor(totalTime / (60 * 60)) % 24;
    const minutes = Math.floor(totalTime / 60) % 60;
    const seconds = totalTime % 60;

    td3.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    tr.appendChild(td3);

    const td4 = document.createElement('td');

    if (data[i].rating === "good") {
      td4.textContent = "😊";
      tr.style.backgroundColor = "rgba(0, 255, 0, 0.3)";
    } else if (data[i].rating === "neutral") {
      td4.textContent = "😐";
      tr.style.backgroundColor = "rgba(255, 255, 0, 0.3)";
    } else {
      td4.textContent = "💀";
      tr.style.backgroundColor = "rgba(255, 0, 0, 0.3)";
    }

    tr.appendChild(td4);

    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
} 

function loadData() {
  fetch('http://localhost:6969/sites',{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {

      //add rating to data
      data.forEach(site => {
        site.rating = siteRating[site.url] || "neutral";
      });

      sites = data;
      displayData(sites);
      drawChart(sites);
  });
}

function postSiteData(siteUrl, siteName) {
  const apiUrl = 'http://localhost:6969/sites';

  const url = new URL(siteUrl);
  const baseUrl = `${url.protocol}//${url.hostname}`;

  const data = {
      url: baseUrl,
      name: siteName
};

  fetch(apiUrl, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), 
  })
  .then(response => response.json()) 
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}

function drawChart(sites) {
  if (!sites) {
    return;
  }

  if (barChart) {
    barChart.destroy();
  }

  const backgroundColors = sites.map(site => site.rating === "good" ? 'rgba(0, 255, 0, 0.6)' : site.rating === "neutral" ? 'rgba(255, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.3)');
  const labels = sites.map(site => new URL(site.url).hostname.split('.').slice(-2).join('.'));

  const data = {
    labels: labels,
    datasets: [{
      label: 'Time Spent (minutes)',
      data: sites.map(site => site.time_spent/60),
      backgroundColor: [
        ...backgroundColors
      ],
      borderColor: [
        'rgba(0, 0, 0, 1)',
      ],
      borderWidth: 1
    }]
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    },
  };

  barChart = new Chart(
    document.getElementById('bar-chart').getContext('2d'),
    config
  );
}
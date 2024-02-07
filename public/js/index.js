const tableContainer = document.getElementById('table-container');

window.onload = function() {
  loadData();
  drawChart();
}

function displayData(data) {
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
  th1.textContent = 'Date';
  tr.appendChild(th1);
  const th2 = document.createElement('th');
  th2.textContent = 'Site';
  tr.appendChild(th2);
  const th3 = document.createElement('th');
  th3.textContent = 'Time Spent';
  tr.appendChild(th3);
  thead.appendChild(tr);
  table.appendChild(thead);
  
  //table body
  const tbody = document.createElement('tbody');
  for (let i = 0; i < data.length; i++) {
    const tr = document.createElement('tr');
    const td1 = document.createElement('td');
    td1.textContent = data[i].created_at;
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
    tbody.appendChild(tr);
  }

  table.appendChild(tbody);
  tableContainer.appendChild(table);
} 

function loadData() {
  fetch('http://localhost:9292/sites',{
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      displayData(data);
  });
}

function postSiteData(siteUrl, siteName) {
  const apiUrl = 'http://localhost:9292/sites';

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

function drawChart() {
  // const labels = Utils.months({count: 7});
  const labels = [1,2,3,4,5,6,7];
  const data = {
    labels: labels,
    datasets: [{
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
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

  const barChart = new Chart(
    document.getElementById('bar-chart').getContext('2d'),
    config
  );
}
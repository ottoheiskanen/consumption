const tableContainer = document.getElementById('table-container');

window.onload = function() {
  //fetch data from server
  loadData();
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
    td2.textContent = data[i].name;
    tr.appendChild(td2);
    const td3 = document.createElement('td');
    td3.textContent = data[i].time_spent;
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
  const apiUrl = 'http://localhost:9292/sites'; // Replace with your actual endpoint URL

  const url = new URL(siteUrl);
  const baseUrl = `${url.protocol}//${url.hostname}`;

  // Prepare the data to be sent
  const data = {
      url: baseUrl,
      name: siteName
  };

  // Use fetch API to post the data
  fetch(apiUrl, {
      method: 'POST', // or 'PUT'
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Convert data object to JSON string
  })
  .then(response => response.json()) // Parse the JSON response
  .then(data => {
      console.log('Success:', data);
  })
  .catch((error) => {
      console.error('Error:', error);
  });
}



document.getElementById('post-button').addEventListener('click', function() {
  // const siteUrl = document.getElementById('site-url').value;
  // const siteName = document.getElementById('site-name').value;
  // postSiteData(siteUrl, siteName);

  postSiteData('https://example.com', 'Example Site');
});
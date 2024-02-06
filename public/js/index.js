const tableContainer = document.getElementById('table-container');

const data = [
    {
      createdAt: new Date('2024-02-01T09:00:00'),
      siteURL: 'https://example.com',
      siteName: 'Example',
      timeSpent: 120 // Time spent in minutes
    },
    {
      createdAt: new Date('2024-02-02T10:30:00'),
      siteURL: 'https://anotherexample.com',
      siteName: 'Another Example',
      timeSpent: 90
    },
    {
      createdAt: new Date('2024-02-03T15:45:00'),
      siteURL: 'https://yetanotherexample.com',
      siteName: 'Yet Another Example',
      timeSpent: 45
    }
];

function loadData(data) {
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
      td1.textContent = data[i].createdAt;
      tr.appendChild(td1);
      const td2 = document.createElement('td');
      td2.textContent = data[i].siteName;
      tr.appendChild(td2);
      const td3 = document.createElement('td');
      td3.textContent = data[i].timeSpent;
      tr.appendChild(td3);
      tbody.appendChild(tr);
    }

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}


loadData(data);
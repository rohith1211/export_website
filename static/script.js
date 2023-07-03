document.getElementById("queryForm").addEventListener("submit", function(event) {
  event.preventDefault();
  const query = document.getElementById("queryInput").value;

  // Send the query to the server-side script using AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/query", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const response = JSON.parse(xhr.responseText);
        displayTableData(response.data);
      } else {
        console.error("Error executing query:", xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify({ query: query }));
});

document.getElementById("exportButton").addEventListener("click", function() {
  // Export functionality remains the same as before
  // ...
  // Show download success pop-up
  alert("Download successful!");
});

function displayTableData(data) {
  const tableHeaders = document.getElementById("tableHeaders");
  const tableBody = document.getElementById("tableBody");
  
  // Clear existing table headers and data
  tableHeaders.innerHTML = "";
  tableBody.innerHTML = "";

  if (data.length === 0) {
    const noResultsRow = document.createElement("tr");
    const noResultsCell = document.createElement("td");
    noResultsCell.setAttribute("colspan", "3");
    noResultsCell.textContent = "No results found";
    noResultsRow.appendChild(noResultsCell);
    tableBody.appendChild(noResultsRow);
    return;
  }

  // Create table headers based on the keys of the first row
  const headerKeys = Object.keys(data[0]);
  headerKeys.forEach(function(key) {
    const th = document.createElement("th");
    th.textContent = key;
    tableHeaders.appendChild(th);
  });

  // Populate table rows with data
  data.forEach(function(rowData) {
    const row = document.createElement("tr");
    headerKeys.forEach(function(key) {
      const cell = document.createElement("td");
      cell.textContent = rowData[key];
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });
}

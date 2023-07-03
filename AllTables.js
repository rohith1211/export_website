const mysql = require('mysql');

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'mysql-mum-airawat.ct0jojfspogh.ap-south-1.rds.amazonaws.com',
  user: 'dpa_airawat_dev_sp',
  password: 'LaU4BR8NCKgvclmoQZXb',
  database: 'dpa_airawat_dev_1'
});

// Connect to the MySQL database
connection.connect();

// Query to retrieve table names
const query = `SELECT table_name FROM information_schema.tables WHERE table_schema = '${connection.config.database}'`;

// Execute the query
connection.query(query, (error, results) => {
  if (error) {
    console.error('Error:', error);
  } else {
    const tableNames = results.map(result => result.table_name);
    console.log('Table Names:', tableNames);
  }

  // Close the database connection
  connection.end();
});

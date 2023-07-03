from flask import Flask, render_template, request, redirect, session
import mysql.connector
import csv

app = Flask(__name__)

def create_connection(host, port, user, password, database):
    try:
        connection = mysql.connector.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=database
        )
        return connection
    except mysql.connector.Error as error:
        return None

@app.route('/')
def home():
    return redirect('/database-creds')

@app.route('/database-creds', methods=['GET', 'POST'])
def database_creds():
    if request.method == 'POST':
        # Get the database connection details from the form input
        host = request.form.get('host')
        port = request.form.get('port')
        user = request.form.get('user')
        password = request.form.get('password')
        database = request.form.get('database')

        # Create the database connection
        connection = create_connection(host, port, user, password, database)

        if connection is not None:
            # Store the database credentials in session for later use
            session['db_creds'] = {
                'host': host,
                'port': port,
                'user': user,
                'password': password,
                'database': database
            }

            return redirect('/query')

        # If the connection was not established, display an error message
        error_message = 'Failed to establish a database connection. Please check your credentials.'
        return render_template('database_creds.html', error_message=error_message)

    return render_template('database_creds.html')

@app.route('/query', methods=['GET', 'POST'])
def query_results():
    # Check if the database credentials are stored in session
    db_creds = session.get('db_creds')
    if db_creds is None:
        # If the credentials are not available, redirect to the database credentials page
        return redirect('/database-creds')

    if request.method == 'POST':
        # Get the SQL query from the form input
        sql_query = request.form.get('sql_query')

        # Create the database connection using the stored credentials
        connection = create_connection(**db_creds)

        if connection is not None:
            cursor = connection.cursor()

            cursor.execute(sql_query)
            results = cursor.fetchall()
            columns = [col[0] for col in cursor.description]  # Get column names

            # Close the cursor and the database connection
            cursor.close()
            connection.close()

            # Generate a unique filename for each query
            filename = 'query_result.csv'

            # Save the results to a CSV file
            with open(filename, 'w', newline='') as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow(columns)  # Write column names to CSV file
                writer.writerows(results)

            return render_template('query_results.html', columns=columns, results=results, filename=filename)

        # If the connection was not established, display an error message
        error_message = 'Failed to establish a database connection. Please check your credentials.'
        return render_template('query.html', error_message=error_message)

    return render_template('query.html')

@app.route('/download/<filename>')
def download(filename):
    session['success_message'] = 'Download successful!'
    return redirect('/static/' + filename)

if __name__ == '__main__':
    app.secret_key = 'your_secret_key'
    app.run(debug=True)

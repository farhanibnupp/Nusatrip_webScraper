# Importing all module in the project is mandatory
from flask import Flask, redirect, url_for, request, render_template, send_file, jsonify
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from datetime import datetime
import time
import random
import re
from flask_mysqldb import MySQL


#importing the scrapper
from booking import *

app = Flask(__name__)

# initialize database
app.config['MYSQL_HOST'] = 'localhost'  # MySQL server host
app.config['MYSQL_USER'] = 'root'  # MySQL username
app.config['MYSQL_PASSWORD'] = ''  # MySQL password
app.config['MYSQL_DB'] = 'webscrapper_nusatrip'  # MySQL database name

mysql = MySQL(app)

#Initialize data for DataFrame
data = []

#job id in the database can not accesed if the value is -2
job_id = -2
from_ = ""
to = ""
cabin_class =""
date = ""
time_temp = ""
#counter for data scrapping progress
c = 0
#counter for data scrapping per page
number_of_flight = 0


#function for saving the dataframe to CSV files
def save():
    print("saving the data...")
    # Get the current date and time
    now = datetime.now()

    # Format the date and time as strings
    formatted_date = now.strftime("%Y%m%d-")  # Format: YYYY-MM-DD
    formatted_time = now.strftime("%H%M%S")  # Format: HH:MM:SS

    # Join the date and time strings
    datetime_string = formatted_date + " " + formatted_time


    df = pd.DataFrame(data)
    df.columns = df.columns.str.upper()
    global time_temp
    time_temp = "booking.com-" + date + " " + from_ + " to " + to + "-"+ datetime_string + ".csv"
    df.to_csv("booking.com-" + date + " " + from_ + " to " + to + "-"+ datetime_string + ".csv", index=False)
    print("data saved")
    print (time_temp)
    return(time_temp)
    


# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)
mysql = MySQL(app)


#route for download the csv file
@app.route('/download', methods=['POST', 'GET'])
def download():   
    if request.method =='GET':
        css_path = url_for('static', filename='styles.css')
        filename = save()
        print("performing download")
        time.sleep(random.uniform(.1,.5))

        return send_file(filename,as_attachment=True, mimetype='text/csv')
    

#route for testing
@app.route('/test', methods=['GET'])
def test():
    css_path = request.args.get('css_path')
    filename = request.args.get('filename')
    return render_template("scrapper_final.html", css_path=css_path, filename=filename)
   

#route for display scrapper tools
@app.route('/', methods=['GET'])
def display():
    css_path = request.args.get('css_path')
    filename = request.args.get('filename')
    return render_template("scrapper.html", css_path=css_path, filename=filename)
   

    
@app.route('/scrapper' , methods=['POST', 'GET'])
def insert_param():
    global c 
    global number_of_flight
    global data
    JOB_ID = get_job_id()+1
    print(JOB_ID)
    if request.method == 'POST':

        # INSERTING JOB ID TO T_JOB TABLE
        insert_job_id(datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        print(get_job_id)
        # SEND DATA TO PARAM TABLE   
        START_DATE = request.form.get('START_DATE1')
        PERIODS = request.form.get('PERIODS1')
        DEPARTURE = request.form.get('DEPARTURE1')
        DESTINATION = request.form.get('DESTINATION1')
        PLATFORM = request.form.get('PLATFORM1')
        insert_param_to_db(JOB_ID, START_DATE, PERIODS, DEPARTURE, DESTINATION)
        css_path = url_for('static', filename='styles.css')
        return render_template("scrapper.html", css_path=css_path)
    
    if request.method == 'GET':
        return jsonify({'progress_value': c})

def insert_job_id(TIMESTAMP):
    app.config['MYSQL_HOST'] = 'localhost'  # MySQL server host
    app.config['MYSQL_USER'] = 'root'  # MySQL username
    app.config['MYSQL_PASSWORD'] = ''  # MySQL password
    app.config['MYSQL_DB'] = 'webscrapper_nusatrip'  # MySQL database name
    try:
        # Create a database connection cursor
        cur = mysql.connection.cursor()

        # Define the SQL query to insert data into the table
        query = "INSERT INTO t_job (DATETIME) VALUES (%s)"

        # Prepare the data to be inserted as a tuple
        data = (TIMESTAMP,)

        # Execute the query with the provided parameters
        cur.execute(query, data)

        # Commit the changes to the database
        mysql.connection.commit()

        print("Data inserted successfully!")
    except Exception as e:
        print(f"Error occurred: {e}")
        # Rollback the transaction in case of any error
        mysql.connection.rollback()
    finally:
        # Close the cursor
        cur.close()
        
#routes for checking database connection
@app.route('/check_connection')
def index():
    try:
        # Check if the MySQL connection is open
        if mysql.connection:
            print("MySQL connection is established.")
        else:
            print("MySQL connection is not established.")

        return 'Check the console or logs for the MySQL connection status.'
    except Exception as e:
        return 'An error occurred: ' + str(e)

#routes for checking the t_flight_rates table    
@app.route('/access_table_test')
def print_table_structure():
    try:
        # Get a cursor to execute SQL queries
        cursor = mysql.connection.cursor()

        # Execute SQL query to retrieve table structure
        table_name = 't_flight_rates'  # Replace with your table name
        query = f"DESCRIBE {table_name}"
        cursor.execute(query)

        # Fetch all rows from the query result
        result = cursor.fetchall()

        # Print the table structure
        for row in result:
            print(row)

        cursor.close()

        return 'Table structure printed in the console or logs.'

    except Exception as e:
        return 'An error occurred: ' + str(e)

#routes for checking all databases and tables in the server
@app.route('/all_databases_and_tables')
def print_databases_and_tables():
    try:
        # Get a cursor to execute SQL queries
        cursor = mysql.connection.cursor()

        # Execute SQL query to retrieve all databases
        cursor.execute("SHOW DATABASES")

        # Fetch all rows from the query result
        databases = cursor.fetchall()

        # Print all databases
        for db in databases:
            db_name = db[0]
            print(f"Database: {db_name}")

            # Switch to the database
            cursor.execute(f"USE {db_name}")

            # Execute SQL query to retrieve all tables in the current database
            cursor.execute("SHOW TABLES")

            # Fetch all rows from the query result
            tables = cursor.fetchall()

            # Print all tables
            for table in tables:
                table_name = table[0]
                print(f"\tTable: {table_name}")

        cursor.close()

        return 'Database and table information printed in the console or logs.'

    except Exception as e:
        return 'An error occurred: ' + str(e)




# Define the function to insert data into the database
def insert_param_to_db(JOB_ID, START_DATE,PERIODS,DEPARTURE, DESTINATION):
    
    app.config['MYSQL_HOST'] = 'localhost'  # MySQL server host
    app.config['MYSQL_USER'] = 'root'  # MySQL username
    app.config['MYSQL_PASSWORD'] = ''  # MySQL password
    app.config['MYSQL_DB'] = 'webscrapper_nusatrip'  # MySQL database name
    try:
        # Create a database connection cursor
        cur = mysql.connection.cursor()

        # Define the SQL query to insert data into the table
        query = "INSERT INTO param (JOB_ID, START_DATE,PERIODS,DEPARTURE, DESTINATION) VALUES (%s, %s, %s, %s, %s)"

        # Prepare the data to be inserted
        data =  (JOB_ID, START_DATE,PERIODS,DEPARTURE, DESTINATION)

        # Execute the query with the provided parameters
        cur.execute(query, data)

        # Commit the changes to the database
        mysql.connection.commit()

        print("Data inserted successfully!")
    except Exception as e:
        print(f"Error occurred: {e}")
        # Rollback the transaction in case of any error
        mysql.connection.rollback()
    finally:
        # Close the cursor
        cur.close()


#routes for manually insert the existing DataFrame to t_flight_rates tables
@app.route('/insert')
def insert_dataframe():
    from booking import c , number_of_flight, data

    #delete temporary files

    # #reseting flight counter
    # global c
    # c = 0
    
    df = pd.DataFrame(data)
    df.columns = df.columns.str.upper()

    app.config['MYSQL_HOST'] = 'localhost'  # MySQL server host
    app.config['MYSQL_USER'] = 'root'  # MySQL username
    app.config['MYSQL_PASSWORD'] = ''  # MySQL password
    app.config['MYSQL_DB'] = 'webscrapper_nusatrip'  # MySQL database name
    try:
        # Get a cursor to execute SQL queries
        cursor = mysql.connection.cursor()

        # Iterate through each row of the DataFrame and insert into the database
        for _, row in df.iterrows():
            query = """
            INSERT INTO t_flight_rates (JOB_ID, PLATFORM, DEPARTURE_DATE, DEPARTURE_AIRPORT, DESTINATION_AIRPORT, 
            MARKETING_AIRLINE, FLIGHT_CODE, CABIN_CLASS, DEPARTURE_TIME, ARRIVAL_TIME, TRANSIT, ROUTES, 
            FLIGHT_DURATION, RATES) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            values = (
                row['JOB_ID'],
                row['PLATFORM'],
                row['DEPARTURE_DATE'],
                row['DEPARTURE_AIRPORT'],
                row['DESTINATION_AIRPORT'],
                row['MARKETING_AIRLINE'],
                row['FLIGHT_CODE'],
                row['CABIN_CLASS'],
                row['DEPARTURE_TIME'],
                row['ARRIVAL_TIME'],
                row['TRANSIT'],
                row['ROUTES'],
                row['FLIGHT_DURATION'],
                row['RATES']
            )
            cursor.execute(query, values)

        # Commit the changes
        mysql.connection.commit()

        cursor.close()

        #delete all data in the data list
        return 'DataFrame inserted into the database successfully.'

    except Exception as e:
        return 'An error occurred: ' + str(e)

#route for fetching the highest job_id in t_flight_rates
@app.route('/ghv', methods=['GET'])
def get_job_id():
    
    app.config['MYSQL_HOST'] = 'localhost'  # MySQL server host
    app.config['MYSQL_USER'] = 'root'  # MySQL username
    app.config['MYSQL_PASSWORD'] = ''  # MySQL password
    app.config['MYSQL_DB'] = 'webscrapper_nusatrip'  # MySQL database name

    try:
        # Get a cursor to execute SQL queries
        cursor = mysql.connection.cursor()

        # Execute the SELECT query to retrieve the highest value
        query = "SELECT MAX(ID) FROM t_job"
        cursor.execute(query)

        # Fetch the result
        result = cursor.fetchone()
        
        # Close the cursor
        cursor.close()

        if result[0] is not None:
            highest_value = result[0]
            #returning highest job_id data
            return int(highest_value)
        else:
            #job id = 0 if there's no job id data in database
            return 0

    except Exception as e:
        #job id = -1 if an exception caught
        return -1


# routes to fetch the progress value from counter
@app.route('/api/progress_value')
def get_progress_value():
    progress_value = c  # Replace with your actual progress value
    return jsonify({'progress_value': str(progress_value) + "/" + str(number_of_flight)})
    # return progress_value

# main driver function
if __name__ == '__main__':
	app.run()
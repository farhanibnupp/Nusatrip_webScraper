import concurrent.futures
import subprocess
import time
from datetime import datetime

import pytz
from ex_connect import insert_jobDateex, get_dataex
from insert_parameter import insert_dataex

from flask import Flask, jsonify,request
from flask_cors import CORS
import mysql.connector

app = Flask(__name__)
CORS(app)





def run_file(file_name):
    # Jalankan file Python
    command = f"python {file_name}"
    subprocess.call(command, shell=True)

@app.route('/scrapper' , methods=['POST', 'GET'])
def param() :
    global START_DATE,formatted_date,  PERIODS, DEPARTURE,DESTINATION, to_labels, PLATFORM
    if request.method == 'POST':
        START_DATE = request.json.get('START_DATE1')
        start_date_obj = datetime.strptime(START_DATE, '%Y-%m-%dT%H:%M:%S.%fZ')

        # Assume the input date is in UTC. If it's in a different timezone, adjust accordingly.
        input_timezone = pytz.timezone('UTC')
        start_date_obj = input_timezone.localize(start_date_obj)

        # Convert the date to a specific timezone (e.g., Asia/Jakarta).
        target_timezone = pytz.timezone('Asia/Jakarta')
        start_date_obj = start_date_obj.astimezone(target_timezone)
        formatted_date = start_date_obj.strftime('%Y-%m-%d')
        PERIODS = request.json.get('PERIODS1')
        DEPARTURE = request.json.get('DEPARTURE1')
        DESTINATION = request.json.get('DESTINATION1')
        to_labels = [item.get("file_name") for item in request.json.get("PLATFORM1", [])]
        PLATFORM = request.json.get('PLATFORM1')
        main()
        return ""


@app.route('/printData' , methods=['GET'])
def table():
    if request.method == 'GET':
        table = get_dataex('t_flight_rates', notif=False)
        t_job = get_dataex('T_JOB', notif=False)
        job_id = list(t_job['ID'])[-1]
        tableData = table[table['JOB_ID'] == job_id].to_dict(orient='records')
        print("ini adalah table data")
        print(tableData)

        # get_dataex("t_flight_rates")
        # print(jsonify(tableData))
        return (jsonify(tableData))

# def getTable():
#     try:
#         print()
#         connection = mysql.connector.connect(host='localhost',
#                                              database="webscrapper_nusatrip",
#                                              user='root',
#                                              password='')
        
#         cursor = connection.cursor()
#         sql_select_query = f"select * from {table}"

#         cursor = connection.cursor()


#     except mysql.connector.Error as error:
#         print("Failed to get record from MySQL table: {}".format(error))
#     print()


def main():
    global job_id
    now = datetime.now()
    print('Start Scraping!\n')
    insert_jobDateex(now, notif=False)
    time.sleep(1)

    start_time = time.time()
    t_job = get_dataex('T_JOB', notif=False)
    job_id = list(t_job['ID'])[-1]
    # data = ["46","01-09-2023", "1", "SIN", "CGK"]
    # insert_dataex(data)
    
    # data = [(job_id, "2023-09-08", "2", "SIN", "YIA")]
    data = [(job_id, formatted_date, PERIODS, DEPARTURE, DESTINATION)]
    insert_dataex(data)

    # insert_dataex({"46","01-09-2023", "1", "SIN", "CGK"})

    # files = ["scraper_agoda.py","scraper_tiket.py","scraper_via.py","scraper_pegi.py","scraper_sky.py"]
    # files = ['nusatrip_webscrapper/scraper_booking.py','nusatrip_webscrapper/scraper_traveloka.py']
    # files = ['nusatrip_webscrapper/scraper_traveloka.py']
    files = to_labels
    with concurrent.futures.ThreadPoolExecutor() as executor:
        executor.map(run_file, files)

    seconds = int(time.time() - start_time)
    minutes = seconds // 60
    seconds = seconds % 60  

    print('\nTotal time of scraping: {} minutes {} seconds'.format(minutes, seconds))
    print('\nFinish!')
    return ""

# if __name__ == "__main__":
#     insert_jobDateex(now, notif=False)
#     time.sleep(1)

#     start_time = time.time()
#     t_job = get_dataex('T_JOB', notif=False)
#     job_id = list(t_job['ID'])[-1]
#     # data = ["46","01-09-2023", "1", "SIN", "CGK"]
#     # insert_dataex(data)
    
#     data = [(job_id, "01-09-2023", "1", "SIN", "CGK")]
#     insert_dataex(data)

#     # insert_dataex({"46","01-09-2023", "1", "SIN", "CGK"})

#     # files = ["scraper_agoda.py","scraper_tiket.py","scraper_via.py","scraper_pegi.py","scraper_sky.py"]
#     files = ['nusatrip_webscrapper/scraper_booking.py']
    
#     with concurrent.futures.ThreadPoolExecutor() as executor:
#         executor.map(run_file, files)

#     seconds = int(time.time() - start_time)
#     minutes = seconds // 60
#     seconds = seconds % 60  

#     print('\nTotal time of scraping: {} minutes {} seconds'.format(minutes, seconds))

if __name__ == '__main__':
	app.run()

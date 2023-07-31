import concurrent.futures
import subprocess
import time
from datetime import datetime
import pandas as pd
import pytz
from ex_connect import insert_jobDateex, get_dataex
from insert_parameter import insert_dataex

from flask import Flask, jsonify,request, url_for, send_file
from flask_cors import CORS
import mysql.connector
import random
import os

app = Flask(__name__)
CORS(app)

def run_file(file_name):
    # Jalankan file Python
    command = f"python {file_name}"
    subprocess.call(command, shell=True)

@app.route('/scrapper' , methods=['POST', 'GET'])
def param() :
    global START_DATE,formatted_date,  PERIODS, DEPARTURE ,DESTINATION, to_labels, PLATFORM, formatted_date, iteration
    global list_departure, list_destination,list_start_date,list_periods,list_platform
    if request.method == 'POST':
        list_departure = []
        list_start_date = []
        list_periods = []
        list_destination = []
        list_platform = []
        iteration = (len(request.json))
        # print(iteration)
        # print(request.json)
        data = request.json
        # START_DATE[1] = request.json.get('START_DATE1')b 
        for i in range(iteration):
            DEPARTURE = data[i][f'DEPARTURE{i+1}']
            DESTINATION = data[i][f'DESTINATION{i+1}']

            # START_DATE = data[i][f'START_DATE{i+1}']
            # target_timezone = pytz.timezone('Asia/Jakarta')
            # start_date_obj = START_DATE.astimezone(target_timezone)
            # formatted_date = start_date_obj.strftime('%Y-%m-%d')
            START_DATE = data[i][f'START_DATE{i+1}']
            # Convert the START_DATE string to a datetime object
            start_date_obj = datetime.fromisoformat(START_DATE[:-1])  # Removing the last 'Z' character

            # Perform the timezone conversion
            target_timezone = pytz.timezone('Asia/Jakarta')
            start_date_obj = start_date_obj.astimezone(target_timezone)

            # Format the date as a string in 'YYYY-MM-DD' format
            formatted_date = start_date_obj.strftime('%Y-%m-%d')
            PERIODS = data[i][f'PERIODS{i+1}']
            PLATFORM = data[i][f'PLATFORM{i+1}']
            if isinstance(PLATFORM, dict):
                PLATFORM_FILE_NAME = PLATFORM['file_name']
            else:
                PLATFORM_FILE_NAME = [item['file_name'] for item in PLATFORM]
           
            list_departure.append(DEPARTURE)
            list_destination.append(DESTINATION)
            list_start_date.append(formatted_date)
            list_periods.append(PERIODS)
            list_platform.append(PLATFORM_FILE_NAME)
        # print(list_platform)
        # start_date_obj = datetime.strptime(START_DATE, '%Y-%m-%dT%H:%M:%S.%fZ')

        # # Assume the input date is in UTC. If it's in a different timezone, adjust accordingly.
        # input_timezone = pytz.timezone('UTC')
        # start_date_obj = input_timezone.localize(start_date_obj)

        # # Convert the date to a specific timezone (e.g., Asia/Jakarta).
        # target_timezone = pytz.timezone('Asia/Jakarta')
        # start_date_obj = start_date_obj.astimezone(target_timezone)
        # formatted_date = start_date_obj.strftime('%Y-%m-%d')

        # PERIODS = request.json.get('PERIODS1')
        # DEPARTURE = request.json.get('DEPARTURE1')
        # # list_departure.append(DEPARTURE)
        # # print(list_departure)
        # DESTINATION = request.json.get('DESTINATION1')
        # to_labels = [item.get("file_name") for item in request.json.get("PLATFORM1", [])]
        # PLATFORM = request.json.get('PLATFORM1')
        main()
        return ""


@app.route('/printData' , methods=['GET'])
def table():
    # global tableData
    if request.method == 'GET':
        table = get_dataex('t_flight_rates', notif=False)
        t_job = get_dataex('T_JOB', notif=False)
        job_id = list(t_job['ID'])[-1]
        tableData = table[table['JOB_ID'] == job_id].to_dict(orient='records')
        # print("ini adalah table data")
        # print(tableData)
        # get_dataex("t_flight_rates")
        # print(jsonify(tableData))
        return (jsonify(tableData))
    

@app.route('/download', methods=['GET'])
def download():   
    if request.method =='GET':
        # css_path = url_for('static', filename='styles.css')
        filename = save()
        print("performing download")
        time.sleep(random.uniform(.1,.5))

        return send_file(filename,as_attachment=True, mimetype='text/csv')

def save():
    print("saving the data...")
    # Get the current date and time
    now = datetime.now()

    # Format the date and time as strings
    formatted_date = now.strftime("%Y%m%d-")  # Format: YYYY-MM-DD
    formatted_time = now.strftime("%H%M%S")  # Format: HH:MM:SS

    # Join the date and time strings
    datetime_string = formatted_date + " " + formatted_time

    table = get_dataex('t_flight_rates', notif=False)
    t_job = get_dataex('T_JOB', notif=False)
    job_id = list(t_job['ID'])[-1]
    tableData = table[table['JOB_ID'] == job_id].to_dict(orient='records')
    

    df = pd.DataFrame(tableData)
    df.columns = df.columns.str.upper()
    global time_temp
    name_temp = f"scraping_result_{formatted_date}_to_{datetime_string}.csv"
    # name_temp = f"scraping_result_{formatted_date}_to_{DESTINATION}_{datetime_string}.csv"
    # df.to_csv(name_temp, index=False)

    output_directory = "D:/web_scrapper_merged/nusatrip_webscrapper/"  # Ganti dengan direktori yang Anda inginkan

    if not os.path.exists(output_directory):
        os.makedirs(output_directory)

    output_file_path = os.path.join(output_directory, name_temp)
    df.to_csv(output_file_path, index=False)

    # name_temp = "scraping_result" + formatted_date + " " +  + " to " + DESTINATION + "-"+ datetime_string + ".csv"
    # df.to_csv("scraping_result" + formatted_date + " " +  + " to " + DESTINATION + "-"+ datetime_string + ".csv", index=False)
    print("data saved")
    print (name_temp)
    return(name_temp)

# def getTable():


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
    # data = [(job_id, formatted_date, PERIODS, DEPARTURE, DESTINATION)]
    for i in range(len(list_departure)):
        data = [(job_id, list_start_date[i], list_periods[i], list_departure[i], list_destination[i])]
        insert_dataex(data)
        files = list_platform[i]
        with concurrent.futures.ThreadPoolExecutor() as executor:
            executor.map(run_file, files)

    # insert_dataex({"46","01-09-2023", "1", "SIN", "CGK"})

    # files = ["scraper_agoda.py","scraper_tiket.py","scraper_via.py","scraper_pegi.py","scraper_sky.py"]
    # files = ['nusatrip_webscrapper/scraper_booking.py','nusatrip_webscrapper/scraper_traveloka.py']
    # files = ['nusatrip_webscrapper/scraper_traveloka.py']
    # files = to_labels
    # with concurrent.futures.ThreadPoolExecutor() as executor:
    #     executor.map(run_file, files)

    # for i in range(len(list_platform)):
    #     files = list_platform[i]
    #     with concurrent.futures.ThreadPoolExecutor() as executor:
    #         executor.map(run_file, files)

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

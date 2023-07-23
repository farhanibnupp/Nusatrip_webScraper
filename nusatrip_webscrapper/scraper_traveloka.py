import pandas as pd
from datetime import datetime
from driver import *
from ex_connect import get_dataex, insert_dataex
from scraper import get_dataTraveloka
import time

# t_mapping = get_data('T_AIRPORT_MAPPING', notif=False)

t_job = get_dataex('T_JOB', notif=False)
job_id = list(t_job['ID'])[-1]

# job_id = 1

t_params = get_dataex('PARAM', notif=False)
params = t_params[t_params['JOB_ID'] == job_id]
print(job_id)
print(params)

for i,j in params.iterrows():
    start_date =j['START_DATE']
    print(start_date)

    start_date = pd.to_datetime(start_date).date()
    periods = j['PERIODS']
    keberangkatan = j['DEPARTURE']
    tujuan = j['DESTINATION']
    date_range = pd.date_range(start=start_date, periods=periods)
    print

    for dt in date_range:
        y,m,d = str(dt.date()).split('-')
        m,d = str(int(m)),str(int(d))
        tanggal = '-'.join([d,m,y])
        print(tanggal)

        try:
            start_time = time.time()

            data_booking = get_dataTraveloka(job_id, date=tanggal, departure=keberangkatan, destination=tujuan)

            seconds = int(time.time() - start_time)
            minutes = seconds // 60
            seconds = seconds % 60  
            print(f'Selesai scrape traveloka {tanggal} dari {keberangkatan} tujuan {tujuan} dalam {minutes} m {seconds} d')
            print(f'Total records: {len(data_booking)}\n')

            if len(data_booking) > 0:
                df = pd.DataFrame(data_booking)
                df = df.drop_duplicates()

                # Store data into database
                data = [tuple(i) for i in df.values]
                insert_dataex(data, notif=False)

        except Exception as e:
            print(f'Error scrape traveloka {tanggal} dari {keberangkatan} menuju {tujuan}')
            print(e)
            print('\n')
            pass
    driver.refresh()
    time.sleep(2)
    
driver.quit()
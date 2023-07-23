import pandas as pd
from datetime import datetime
from driver import *
from db_connect import get_data, insert_data
from scraper import get_dataAgoda
import time

t_mapping = get_data('T_AIRPORT_MAPPING', notif=False)

# t_job = get_data('EX_JOB', notif=False)
# job_id = list(t_job['ID'])[-1]

job_id = 1

t_params = get_data('EX_PARAM', notif=False)
params = t_params[t_params['JOB_ID'] == job_id]

for i,j in params.iterrows():
    start_date =j['START_DATE']
    start_date = pd.to_datetime(start_date).date()
    periods = j['PERIODS']
    keberangkatan = j['DEPARTURE']
    tujuan = j['DESTINATION']
    date_range = pd.date_range(start=start_date, periods=periods)

    for dt in date_range:
        y,m,d = str(dt.date()).split('-')
        m,d = str(int(m)),str(int(d))
        tanggal = '-'.join([d,m,y])

        try:
            start_time = time.time()
            # Validasi Airport Keberangkatan Agoda
            if keberangkatan in list(t_mapping[t_mapping['PLATFORM'] == 'AGODA']['AIRPORT_CODE']):
                keberangkatan_agoda = t_mapping[(t_mapping['PLATFORM'] == 'AGODA') & (t_mapping['AIRPORT_CODE'] == keberangkatan)]['CITY_NAME'].values[0]
            else:
                keberangkatan_agoda = keberangkatan
            # Validasi Airport Tujuan Agoda
            if tujuan in list(t_mapping[t_mapping['PLATFORM'] == 'AGODA']['AIRPORT_CODE']):
                tujuan_agoda = t_mapping[(t_mapping['PLATFORM'] == 'AGODA') & (t_mapping['AIRPORT_CODE'] == tujuan)]['CITY_NAME'].values[0]
            else:
                tujuan_agoda = tujuan
            data_agoda = get_dataAgoda(job_id=job_id, date=tanggal, departure=keberangkatan_agoda, destination=tujuan_agoda)

            seconds = int(time.time() - start_time)
            minutes = seconds // 60
            seconds = seconds % 60  
            print(f'Selesai scrape agoda {tanggal} dari {keberangkatan_agoda} tujuan {tujuan_agoda} dalam {minutes} m {seconds} d')
            print(f'Total records: {len(data_agoda)}\n')

            if len(data_agoda) > 0:
                df = pd.DataFrame(data_agoda)
                df = df.drop_duplicates()

                # Store data into database
                # data = [tuple(i) for i in df.values]
                # insert_data(data, notif=False)

        except Exception as e:
            print(f'Error scrape agoda {tanggal} dari {keberangkatan_agoda} menuju {tujuan_agoda}')
            print(e)
            print('\n')
            pass
    driver.refresh()
    time.sleep(2)
    
driver.quit()  
import pandas as pd
from datetime import datetime
from db_connect import get_data
from ex_connect import insert_dataex
from api_nusatrip import api_nusa
import time

import warnings
warnings.filterwarnings('ignore')

# t_job = get_data('EX_JOB', notif=False)
# job_id = list(t_job['ID'])[-1]

job_id = 1

t_params = get_data('EX_PARAM', notif=False)
params = t_params[t_params['JOB_ID'] == job_id]

for i,j in params.iterrows():
    start_date =j['START_DATE']
    start_date = pd.to_datetime(start_date).date()
    periods = j['PERIODS']
    departure = j['DEPARTURE']
    destination = j['DESTINATION']
    date_range = pd.date_range(start=start_date, periods=periods)

    for date in date_range:
        y,m,d = str(date.date()).split('-')
        m,d = str(int(m)),str(int(d))
        tanggal = '-'.join([d,m,y])

        try:    
            data_nusa = api_nusa(job_id=job_id, date=date, departure=departure, destination=destination, vendor=False)

        except Exception as e:
            print(e)
            pass

        df = pd.DataFrame(data_nusa)
        df = df.drop_duplicates()

        # Store data into database
        data = [tuple(i) for i in df.values]
        insert_dataex(data, notif=False)
 


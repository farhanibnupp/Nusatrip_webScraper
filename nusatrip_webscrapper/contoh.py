from scraper import get_dataVia
from driver import *
import time

job_id = 1
date = "10-8-2023"
departure = "SIN"
destination = "DPS"

# driver.get('https://www.google.com/search?channel=fs&client=ubuntu-sn&q=create+file+scraper+selenium+python')
# driver = initialize_driver()
data_via = get_dataVia(job_id=job_id, date=date, departure=departure, destination=destination)
time.sleep(3)
# finally:
driver.quit()
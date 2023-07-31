import pandas as pd
import numpy as np
from datetime import datetime
import time
import random
from selenium.webdriver.common.by import By
from driver import *
from ex_connect import get_dataex, insert_dataex, insert_jobDateex

#additional import for scraper_booking.py
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import re
from selenium.webdriver.common.action_chains import ActionChains


# Scraper Agoda
def get_dataAgoda(job_id, date, departure, destination, url="https://www.agoda.com/flights"):
    t_airline = get_dataex('T_MST_AIRLINE', database='nusatest', notif=False)
    t_airline = t_airline[['IATA_CODE', 'FULL_NAME']]
    driver.get(url)
    time.sleep(2)

    t_nusa = get_dataex(f'EX_FLIGHT_RATES WHERE JOB_ID = {job_id}', database='data', notif=False)
    t_nusa = t_nusa[(t_nusa['DEPARTURE_AIRPORT'] == departure)
                    & (t_nusa['DESTINATION_AIRPORT'] == destination)]
    t_nusa = t_nusa[['PLATFORM', 'DEPARTURE_AIRPORT', 'DESTINATION_AIRPORT', 'MARKETING_AIRLINE',
                     'FLIGHT_CODE', 'DEPARTURE_TIME','ARRIVAL_TIME','TRANSIT','ROUTES']]
    
    # Close google login popup
    try:
        driver.switch_to.frame(driver.find_element(By.XPATH, '//iframe[@title="Dialog Login dengan Google"]'))
        driver.find_element(By.XPATH, '//*[@id="close"]').click()

        # Back to default page
        driver.switch_to.default_content()
        time.sleep(random.uniform(.5,1))
    except:
        pass
	
    time.sleep(random.uniform(2,4))

    # Fill departure city
    box_from = driver.find_element(By.ID, 'flight-origin-search-input')
    box_from.send_keys(departure)
    time.sleep(random.uniform(1,1.5))

    result_city = driver.find_element(By.CLASS_NAME, 'Suggestion')
    result_city.click()
    time.sleep(random.uniform(2,3))

    # Fill destination city
    box_to = driver.find_element(By.ID, 'flight-destination-search-input')
    box_to.send_keys(destination)
    time.sleep(random.uniform(1,1.5))

    result_city = driver.find_element(By.CLASS_NAME, 'Suggestion')
    result_city.click()
    time.sleep(random.uniform(2,3))
	
    # Select departure date
    d,m,y = date.split('-')
    month_num = {
        '1': 'January',
        '2': 'February',
        '3': 'March',
        '4': 'April',
        '5': 'May',
        '6': 'June',
        '7': 'July',
        '8': 'August',
        '9': 'September',
        '10': 'October',
        '11': 'November',
        '12': 'December'
    }

    bulan = m[:]
    for a,b in month_num.items():
        bulan = bulan.replace(a,b)
    bulan = bulan+' '+y

    num_month = {
    'January': '1',
    'February': '2',
    'March': '3',
    'April': '4',
    'May': '5',
    'June': '6',
    'July': '7',
    'August': '8',
    'September': '9',
    'October': '10',
    'November': '11',
    'December': '12'
    }
	
    month = driver.find_element(By.CLASS_NAME, 'DayPicker-Caption').text
    month_inp = bulan[:]
    for b, a in num_month.items():
        month_inp = month_inp.replace(b,a)
        month = month.replace(b,a)

    range_month = pd.to_datetime(month).month - pd.to_datetime(month_inp).month

    time.sleep(.5)
    if range_month > 0:
        for r in range(range_month):
            btn_prev = driver.find_element(By.XPATH, '//span[@data-selenium="calendar-previous-month-button"]')
            btn_prev.click()
            time.sleep(.5)

    for _ in range(12):
        month = driver.find_element(By.CLASS_NAME, 'DayPicker-Caption').text
        if month == bulan:
            list_tanggal = driver.find_elements(By.XPATH, '//span[@class="PriceSurgePicker-Day__label PriceSurgePicker-Day__label--wide"]')
            for i in list_tanggal:
                if i.text == d:
                    i.click()
                    time.sleep(random.uniform(1,1.5))
                    break
            break
        else:
            btn_next = driver.find_element(By.XPATH, '//span[@data-selenium="calendar-next-month-button"]')
            btn_next.click()
            time.sleep(random.uniform(1.5,2.5))

    # Select cabin class
    kabin = ['Economy','Premium economy','Business','First']

    list_cabin = driver.find_elements(By.XPATH, '//div[contains(@class,"ChipItem Cabin")]')
    for i in list_cabin:
        if i.text == kabin[0]:
            i.click()
            time.sleep(random.uniform(.5,1.5))
            break

    # Click search button
    btn_search = driver.find_element(By.XPATH, '//button[@data-element-name="flight-search"]')
    btn_search.click()
    time.sleep(random.uniform(2,5))
	
    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(random.uniform(1.5, 2.5))

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    time.sleep(random.uniform(4,10))

    # Scraping data
    data = []
    list_air = driver.find_elements(By.XPATH, '//div[@data-component="flight-card-container"]')
    for i in list_air:
        try:  
            maskapai = i.find_element(By.CLASS_NAME, 'FlightSlice__header--1U4S8').text.split('\n')[0]
            rincian = i.find_element(By.CLASS_NAME, 'FlightSlice__schedule--3u2Hf').text.split('\n')
            bandara_awal = rincian[1]
            bandara_akhir = rincian[3]
            waktu_berangkat = rincian[0]
            waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
            waktu_tiba = rincian[4]
            waktu_tiba = pd.to_datetime(waktu_tiba).time()
            durasi = ' '.join(rincian[2].split(' ')[:2])
            transit = ' '.join(rincian[2].split(' ')[2:])
            total_transit = 0 if 'Direct' in transit else int(''.join([i for i in transit if i.isdigit()]))
            try:
                marketing_air = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                (t_nusa['TRANSIT'] == total_transit)]['MARKETING_AIRLINE'])[0]
            except:
                try:
                    mas = maskapai[:maskapai.index('(')] + maskapai[maskapai.index(')')+1:]
                    nusa_code = np.array(t_airline[t_airline['FULL_NAME'] == mas.strip()]['IATA_CODE'])[0]
                    marketing_air = nusa_code
                except:
                    marketing_air = maskapai

            try:
                kode_penerbangan = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                (t_nusa['TRANSIT'] == total_transit)]['FLIGHT_CODE'])[0]
            except:
                kode_penerbangan = maskapai
                
            try:
                rute_penerbangan = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                        (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                        (t_nusa['TRANSIT'] == total_transit)]['ROUTES'])[0]
            except:
                if total_transit == 0:
                    rute_penerbangan = bandara_awal+'-'+bandara_akhir
                else:
                    rute_penerbangan = None
            harga = i.find_element(By.CLASS_NAME, 'FlightPrice__price--3zyU4').text
            harga = float(''.join(t for t in harga if t.isdigit()))

            data.append({
                'job_id': job_id,
                'platform': 'Agoda',
                'date': pd.to_datetime(date, dayfirst=True).date(),
                'departure_airport': bandara_awal,
                'destination_airport': bandara_akhir,
                'marketing_airline': marketing_air,
                'flight_code': kode_penerbangan,
                'cabin_class': kabin[0].upper(),
                'departure_time': waktu_berangkat,
                'arrival_time': waktu_tiba,
                'transit': total_transit,
                'routes': rute_penerbangan,
                'flight_duration': durasi,
                'rates': harga
            }) 
        
        except Exception as e:
            pass
	
    # Get all cabin data
    for kab in kabin[1:]:
        driver.execute_script("window.scrollTo(0, 0);")
        time.sleep(random.uniform(1.5,2.5))

        change_cabin = driver.find_element(By.XPATH, '//div[@data-component="FlightOccupancyPanelComponent"]')
        change_cabin.click()

        time.sleep(1.5)
        
        list_cabin = driver.find_elements(By.XPATH, '//section[@data-section="cabin-class-section"]/div/button')
        for i in list_cabin:
            if i.text == kab:
                i.click()
                time.sleep(random.uniform(.5,1.5))
                break
                
        # Click search button
        btn_search = driver.find_element(By.XPATH, '//button[@data-selenium="searchButton"]')
        btn_search.click()
        time.sleep(random.uniform(6,10))
        
        # Get scroll height
        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            # Scroll down to bottom
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            # Wait to load page
            time.sleep(random.uniform(1.5, 2.5))

            # Calculate new scroll height and compare with last scroll height
            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        time.sleep(random.uniform(4,10))

        # Scraping data
        list_air = driver.find_elements(By.XPATH, '//div[@data-component="flight-card-container"]')
        for i in list_air:         
            try:
                maskapai = i.find_element(By.CLASS_NAME, 'FlightSlice__header--1U4S8').text.split('\n')[0]
                rincian = i.find_element(By.CLASS_NAME, 'FlightSlice__schedule--3u2Hf').text.split('\n')
                bandara_awal = rincian[1]
                bandara_akhir = rincian[3]
                waktu_berangkat = rincian[0]
                waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
                waktu_tiba = rincian[4]
                waktu_tiba = pd.to_datetime(waktu_tiba).time()
                durasi = ' '.join(rincian[2].split(' ')[:2])
                transit = ' '.join(rincian[2].split(' ')[2:])
                total_transit = 0 if 'Direct' in transit else int(''.join([i for i in transit if i.isdigit()]))
                try:
                    marketing_air = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                    (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                    (t_nusa['TRANSIT'] == total_transit)]['MARKETING_AIRLINE'])[0]
                except:
                    try:
                        mas = maskapai[:maskapai.index('(')] + maskapai[maskapai.index(')')+1:]
                        nusa_code = np.array(t_airline[t_airline['FULL_NAME'] == mas.strip()]['IATA_CODE'])[0]
                        marketing_air = nusa_code
                    except:
                        marketing_air = maskapai

                try:
                    kode_penerbangan = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                    (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                    (t_nusa['TRANSIT'] == total_transit)]['FLIGHT_CODE'])[0]
                except:
                    kode_penerbangan = maskapai
                    
                try:
                    rute_penerbangan = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                            (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                            (t_nusa['TRANSIT'] == total_transit)]['ROUTES'])[0]
                except:
                    if total_transit == 0:
                        rute_penerbangan = bandara_awal+'-'+bandara_akhir
                    else:
                        rute_penerbangan = None
                harga = i.find_element(By.CLASS_NAME, 'FlightPrice__price--3zyU4').text
                harga = float(''.join(t for t in harga if t.isdigit()))

                data.append({
                    'job_id': job_id,
                    'platform': 'Agoda',
                    'date': pd.to_datetime(date, dayfirst=True).date(),
                    'departure_airport': bandara_awal,
                    'destination_airport': bandara_akhir,
                    'marketing_airline': marketing_air,
                    'flight_code': kode_penerbangan,
                    'cabin_class': kab.upper(),
                    'departure_time': waktu_berangkat,
                    'arrival_time': waktu_tiba,
                    'transit': total_transit,
                    'routes': rute_penerbangan,
                    'flight_duration': durasi,
                    'rates': harga
                }) 
            except Exception as e:
                print(e)
                pass

    return data

# Scraper Tiket.com
def get_dataTiket(job_id, date, departure, destination, url="https://www.tiket.com/pesawat"):
    driver.get(url)
    time.sleep(random.uniform(2,3))

    t_nusa = get_dataex(f'EX_FLIGHT_RATES WHERE JOB_ID = {job_id}', database='data', notif=False)
    t_nusa = t_nusa[(t_nusa['DEPARTURE_AIRPORT'] == departure)
                    & (t_nusa['DESTINATION_AIRPORT'] == destination)]
    t_nusa = t_nusa[['PLATFORM', 'DEPARTURE_AIRPORT', 'DESTINATION_AIRPORT', 'MARKETING_AIRLINE',
                     'FLIGHT_CODE', 'DEPARTURE_TIME','ARRIVAL_TIME','TRANSIT','ROUTES']]

    # Fill departure city
    box_depart = driver.find_element(By.XPATH, '//input[@placeholder="Kota atau bandara"]')
    box_depart.send_keys(departure)
    driver.execute_script("window.scrollTo(0, 500)")
    time.sleep(random.uniform(1.5, 2))

    result_city = driver.find_element(By.XPATH, '//div[@class="item"]')
    result_city.click()
    time.sleep(random.uniform(.5,1.5))

    # Fill destination city
    box_dest = driver.find_element(By.XPATH, '//input[@placeholder="Mau ke mana?"]')
    box_dest.send_keys(destination)
    driver.execute_script("window.scrollTo(0, 500)")
    time.sleep(random.uniform(1.5, 2))

    result_city = driver.find_element(By.XPATH, '//div[@class="item"]')
    result_city.click()
    time.sleep(random.uniform(.5,1.5))

    d,m,y = date.split('-')

    month_num = {
            '1': 'Januari',
            '2': 'Februari',
            '3': 'Maret',
            '4': 'April',
            '5': 'Mei',
            '6': 'Juni',
            '7': 'Juli',
            '8': 'Agustus',
            '9': 'September',
            '10': 'Oktober',
            '11': 'November',
            '12': 'Desember'
        }

    bulan = m[:]
    for b, a in month_num.items():
        bulan = bulan.replace(b,a)

    bulan = bulan+' '+y

    num_month = {
        'Januari': '1',
        'Februari': '2',
        'Maret': '3',
        'April': '4',
        'Mei': '5',
        'Juni': '6',
        'Juli': '7',
        'Agustus': '8',
        'September': '9',
        'Oktober': '10',
        'November': '11',
        'Desember': '12'
    }

    month = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div/div[1]/div[3]/div[4]/div[2]/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div[2]/div/div[2]/div/div/strong').text
    month_inp = bulan [:]
    for b, a in num_month.items():
        month = month.replace(b,a)
        month_inp = month_inp.replace(b,a)

    range_month = pd.to_datetime(month).month - pd.to_datetime(month_inp).month

    if range_month > 0:
        for r in range(range_month):
            btn_prev = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div/div[1]/div[3]/div[4]/div[2]/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div[1]/div[1]/div')
            btn_prev.click()
            time.sleep(.5)

    thisday = datetime.now()
    thisday = str(thisday.day)+'-'+str(thisday.month)+'-'+str(thisday.year)

    # Select departure date
    for _ in range(12):
        month = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div/div[1]/div[3]/div[4]/div[2]/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div[2]/div/div[2]/div/div/strong').text
        if month == bulan:
            list_days = driver.find_elements(By.XPATH, '//td[@aria-disabled="false"]/div')
            for i in list_days:
                if date == thisday:
                    if d in i.text:
                        i.click()
                        time.sleep(random.uniform(.5,1))
                        break
                else:
                    if d in i.text:
                        i.click()
                        time.sleep(random.uniform(.5,1))
                        break
            break
        else:
            btn_next = driver.find_element(By.XPATH, '/html/body/div[1]/div[2]/div[3]/div[2]/div/div[2]/div/div/div[1]/div[3]/div[4]/div[2]/div[2]/div/div/div[2]/div/div/div[1]/div[2]/div[1]/div[2]')
            btn_next.click()
            time.sleep(random.uniform(1.5,2.5))

    # Select cabin class
    kabin = ['Ekonomi','Premium Ekonomi','Bisnis', 'First']
    cabin = ['ECONOMY', 'PREMIUM_ECONOMY', 'BUSINESS', 'FIRST']
    list_class = driver.find_elements(By.XPATH, '//li[contains(@class, "cabin-class")]/label')
    for i in list_class:
        if i.text == kabin[0]:
            i.click()
            time.sleep(random.uniform(1,2))
            break 

    btn_done = driver.find_element(By.XPATH, '//button[@class="v3-btn btn-done"]')
    btn_done.click()
    time.sleep(random.uniform(.5,1.5))

    # Click search button
    btn_search = driver.find_element(By.XPATH, '//button[@class="v3-btn v3-btn__yellow"]')
    btn_search.click()
    time.sleep(.5)
        
    time.sleep(random.uniform(3,5))

    # Close pop up 'mengerti'
    try:
        popup_close = driver.find_element(By.XPATH, '//div[@class="v3-btn v3-btn__blue list-horizontal__middle btn-action"]')
        popup_close.click()
    except Exception as e:
        pass

    time.sleep(random.uniform(1,1.5))
    try:
        list_airlines = driver.find_element(By.XPATH, '//div[@class="wrapper-flight-list"]')
    except Exception as e:
        driver.refresh()
        time.sleep(2)
        pass

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    scheight = 700
    while True:
        # Scroll down to bottom
        last_height = driver.execute_script("return document.body.scrollHeight")
        driver.execute_script("window.scrollTo(0, {});".format(scheight))
        scheight += 700

        # Wait to load page
        time.sleep(random.uniform(1, 1.5))

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    time.sleep(random.uniform(3,5))

    total_penerbangan = driver.find_elements(By.XPATH, '//div[text()="Detail Penerbangan"]')
    for i in total_penerbangan:
        i.click()
        time.sleep(random.uniform(.5,.8))

    time.sleep(random.uniform(2,3))

    # Scraping data
    data = []
    list_airlines = driver.find_elements(By.XPATH, '//div[@class="wrapper-flight-list"]')
    list_detail = driver.find_elements(By.XPATH, '//div[@class="flight-details-schedule"]')
    for i,j in zip(list_airlines, list_detail):
        try:
            kode_penerbangan = [t.text for t in j.find_elements(By.CLASS_NAME, 'details-info-header')]
            kode_penerbangan = [t.replace(cabin[0],'').replace('-','') for t in kode_penerbangan]
            kode_penerbangan = ','.join(kode_penerbangan)
            waktu_berangkat = j.find_elements(By.CLASS_NAME, 'text-time-fd')[0].text
            waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
            waktu_tiba = j.find_elements(By.CLASS_NAME, 'text-time-fd')[-1].text
            waktu_tiba = pd.to_datetime(waktu_tiba).time()
            total_waktu = i.find_elements(By.CLASS_NAME, 'text-total-time')[0].text
            total_waktu = total_waktu.replace('j','h')
            total_transit = i.find_elements(By.CLASS_NAME, 'text-total-time')[1].text
            total_transit = 0 if total_transit == 'Langsung' else [int(i) for i in total_transit if i.isdigit()][0]
            info = [t.text for t in j.find_elements(By.CLASS_NAME, 'text-airport-fd')]
            info = [t[t.find('(')+1:t.find(')')] for t in info]
            info = info[:1] + info[1::2]
            info = '-'.join(info)
            bandara_awal = i.find_elements(By.CLASS_NAME, 'text-code')[0].text
            bandara_akhir = i.find_elements(By.CLASS_NAME, 'text-code')[1].text
            harga = i.find_element(By.CLASS_NAME, 'priceV2').text.split('/')[0]
            harga = harga.split('\n')[-1]
            harga = float(''.join([i for i in harga if i.isdigit()]))   
            try:
                marketing_air = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                    (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                    (t_nusa['TRANSIT'] == total_transit)]['MARKETING_AIRLINE'])[0]
            except:
                marketing_air = i.find_element(By.CLASS_NAME, 'text-marketing-airline').text

            data.append({
                'job_id': job_id,
                'platform': 'Tiket',
                'date': pd.to_datetime(date, dayfirst=True).date(),
                'departure_airport': bandara_awal,
                'destination_airport': bandara_akhir,
                'marketing_airline': marketing_air,
                'flight_code': kode_penerbangan,
                'cabin_class': cabin[0],
                'departure_time': waktu_berangkat,
                'arrival_time': waktu_tiba,
                'transit': total_transit,
                'routes': info,
                'flight_duration': total_waktu,
                'rates': harga
            })
        except Exception as e:
            print(e)
            pass
        
    # Get all cabin data
    id_cab = 1
    for kab in kabin[1:]:
        try:
            time.sleep(random.uniform(.5,1.5))
        
            btn_change = driver.find_element(By.XPATH, '//button[@class="v3-btn v3-btn__grey"]')
            btn_change.click()
            time.sleep(random.uniform(.5,1))
        
            box_class = driver.find_element(By.XPATH, '//input[@class="input-passengerclass"]')
            box_class.click()
            time.sleep(random.uniform(.5,1))
        
            list_class = driver.find_elements(By.XPATH, '//li[contains(@class, "cabin-class")]/label')
            for i in list_class:
                if i.text == kab:
                    i.click()
                    time.sleep(random.uniform(.5,1))
                    break
        
            btn_done = driver.find_element(By.XPATH, '//button[@class="v3-btn btn-done"]')
            btn_done.click()
            time.sleep(random.uniform(.5,1))
        
            btn_search = driver.find_element(By.XPATH, '//button[@class="v3-btn v3-btn__yellow"]')
            btn_search.click()
            time.sleep(random.uniform(2,3))

            try:
                driver.find_element(By.CLASS_NAME, 'details-info-header')
                driver.refresh()
                time.sleep(1)
                btn_change = driver.find_element(By.XPATH, '//button[@class="v3-btn v3-btn__grey"]')
                btn_change.click()
                time.sleep(random.uniform(.5,1))
            
                box_class = driver.find_element(By.XPATH, '//input[@class="input-passengerclass"]')
                box_class.click()
                time.sleep(random.uniform(.5,1))
            
                list_class = driver.find_elements(By.XPATH, '//li[contains(@class, "cabin-class")]/label')
                for i in list_class:
                    if i.text == kab:
                        i.click()
                        time.sleep(random.uniform(.5,1))
                        break
            
                btn_done = driver.find_element(By.XPATH, '//button[@class="v3-btn btn-done"]')
                btn_done.click()
                time.sleep(random.uniform(.5,1))
            
                btn_search = driver.find_element(By.XPATH, '//button[@class="v3-btn v3-btn__yellow"]')
                btn_search.click()

            except:
                pass

            # Get scroll height
            last_height = driver.execute_script("return document.body.scrollHeight")
            scheight = 700
            while True:
                # Scroll down to bottom
                last_height = driver.execute_script("return document.body.scrollHeight")
                driver.execute_script("window.scrollTo(0, {});".format(scheight))
                scheight += 700
        
                # Wait to load page
                time.sleep(random.uniform(1,1.5))
        
                # Calculate new scroll height and compare with last scroll height
                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    break
                last_height = new_height
        
            time.sleep(random.uniform(1.5,2.5))

            total_penerbangan = driver.find_elements(By.XPATH, '//div[text()="Detail Penerbangan"]')
          
            for i in total_penerbangan:
                i.click()
                time.sleep(random.uniform(.5,1))
                   
            time.sleep(random.uniform(4,6))
            
            list_airlines = driver.find_elements(By.XPATH, '//div[@class="wrapper-flight-list"]')
            list_detail = driver.find_elements(By.XPATH, '//div[@class="flight-details-schedule"]')
            for i,j in zip(list_airlines, list_detail):
                try:
                    kode_penerbangan = [t.text for t in j.find_elements(By.CLASS_NAME, 'details-info-header')]
                    kode_penerbangan = [t.replace(cabin[id_cab],'').replace('-','') for t in kode_penerbangan]
                    kode_penerbangan = ','.join(kode_penerbangan)
                    waktu_berangkat = j.find_elements(By.CLASS_NAME, 'text-time-fd')[0].text
                    waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
                    waktu_tiba = j.find_elements(By.CLASS_NAME, 'text-time-fd')[-1].text
                    waktu_tiba = pd.to_datetime(waktu_tiba).time()
                    total_waktu = i.find_elements(By.CLASS_NAME, 'text-total-time')[0].text
                    total_waktu = total_waktu.replace('j','h')
                    total_transit = i.find_elements(By.CLASS_NAME, 'text-total-time')[1].text
                    total_transit = 0 if total_transit == 'Langsung' else [int(i) for i in total_transit if i.isdigit()][0]
                    info = [t.text for t in j.find_elements(By.CLASS_NAME, 'text-airport-fd')]
                    info = [t[t.find('(')+1:t.find(')')] for t in info]
                    info = info[:1] + info[1::2]
                    info = '-'.join(info)
                    bandara_awal = i.find_elements(By.CLASS_NAME, 'text-code')[0].text
                    bandara_akhir = i.find_elements(By.CLASS_NAME, 'text-code')[1].text
                    harga = i.find_element(By.CLASS_NAME, 'priceV2').text.split('/')[0]
                    harga = harga.split('\n')[-1]
                    harga = float(''.join([i for i in harga if i.isdigit()]))   
                    try:
                        marketing_air = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) & 
                                            (t_nusa['ARRIVAL_TIME'] == waktu_tiba) &
                                            (t_nusa['TRANSIT'] == total_transit)]['MARKETING_AIRLINE'])[0]
                    except:
                        marketing_air = i.find_element(By.CLASS_NAME, 'text-marketing-airline').text
        
                    data.append({
                        'job_id': job_id,
                        'platform': 'Tiket',
                        'date': pd.to_datetime(date, dayfirst=True).date(),
                        'departure_airport': bandara_awal,
                        'destination_airport': bandara_akhir,
                        'marketing_airline': marketing_air,
                        'flight_code': kode_penerbangan,
                        'cabin_class': cabin[id_cab],
                        'departure_time': waktu_berangkat,
                        'arrival_time': waktu_tiba,
                        'transit': total_transit,
                        'routes': info,
                        'flight_duration': total_waktu,
                        'rates': harga
                    })
                except Exception as e:
                    print(e)
                    pass
        except:
            driver.refresh()
            pass
        id_cab += 1
        time.sleep(random.uniform(1.5,3.5))

    return data

# Scraper Pegipegi
def get_dataPegi(job_id, date, departure, destination, url='https://www.pegipegi.com/flight/'):
    driver.get(url)
    time.sleep(random.uniform(2,4))

    # Fill departure city
    box_depart = driver.find_element(By.ID, 'asalKota1')
    box_depart.clear()
    box_depart.send_keys(departure)
    time.sleep(random.uniform(1.5,2.5))

    result = driver.find_elements(By.CLASS_NAME, 'ui-menu-item')
    driver.execute_script("$(arguments[0]).click();", result)

    # Fill destination city
    box_dest = driver.find_element(By.ID, 'tujuanKota1')
    box_depart.clear()
    box_dest.send_keys(destination)
    time.sleep(random.uniform(1.5,2.5))
    result = driver.find_elements(By.CLASS_NAME, 'ui-menu-item')
    driver.execute_script("$(arguments[0]).click();", result)

    # Check inputed date
    input_date = driver.find_element(By.ID, 'tglKeberangkatan').get_attribute('value')
    month_num = {
        'Januari': '1',
        'Februari': '2',
        'Maret': '3',
        'April': '4',
        'Mei': '5',
        'Juni': '6',
        'Juli': '7',
        'Agustus': '8',
        'September': '9',
        'Oktober': '10',
        'November': '11',
        'Desember': '12'
    }

    for a,b in month_num.items():
        input_date = input_date.replace(a,b)
    m_inputed = input_date.split()[1]

    d,m,y = date.split('-')
    month_num = {
        '1': 'Januari',
        '2': 'Februari',
        '3': 'Maret',
        '4': 'April',
        '5': 'Mei',
        '6': 'Juni',
        '7': 'Juli',
        '8': 'Agustus',
        '9': 'September',
        '10': 'Oktober',
        '11': 'November',
        '12': 'Desember'
    }

    bulan = m[:]
    for b, a in month_num.items():
        bulan = bulan.replace(b,a)

    bulan = bulan+' '+y

    # Select departure date
    box_datePicker = driver.find_element(By.XPATH, '//button[@class="ui-datepicker-trigger"]')
    box_datePicker.click()
    time.sleep(random.uniform(.5,1))
    driver.execute_script("window.scrollTo(0, 0);")

    if int(m) < int(m_inputed):
        range_m = int(m_inputed) - int(m)
        for i in range(range_m):
            btn_pref = driver.find_element(By.XPATH, '//a[@data-handler="prev"]')
            btn_pref.click()
            time.sleep(random.uniform(.5,1.5))

    for _ in range(12):
        month = driver.find_element(By.CLASS_NAME, 'ui-datepicker-title').text
        if month == bulan:
            list_tanggal = driver.find_elements(By.XPATH, '//td[@data-handler="selectDay"]')
            for i in list_tanggal:
                if i.text == d:
                    i.click()
                    time.sleep(random.uniform(.5,1))
                    break
            break
        else:
            btn_next = driver.find_element(By.XPATH, '//a[@data-handler="next"]')
            btn_next.click()
            time.sleep(random.uniform(2,4))

    btn_search = driver.find_element(By.ID, 'cari_tiket')
    btn_search.click()
    time.sleep(random.uniform(3,5))

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(random.uniform(.5, 1.5))

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    time.sleep(random.uniform(3,5))
    
    multi_flights = driver.find_elements(By.XPATH, '//div[@class="second" and @onclick="detailDropdown(this);"]')
    for i in multi_flights:
        i.click()
        time.sleep(random.uniform(.2,.8))
        
    #flight code for multiple flights
    kode_pen = [i.text for i in driver.find_elements(By.CLASS_NAME, 'no-maskapai')]

    # Scraping the data
    data = []
    id_kode = 0
    list_air = driver.find_elements(By.XPATH, '//div[contains(@class,"detailOrderList")]')
    for i in list_air:
        if 'penerbangan yang Anda cari tidak tersedia.' in i.text.lower():
                print(i.text)
                break
        try:
            marketing_air = i.find_element(By.TAG_NAME, 'img').get_attribute('alt')
            kode_penerbangan = [i.get_attribute('id').split('_')[3]]
            bandara_awal = i.find_elements(By.CLASS_NAME, 'rute')[0].text.split('\n')[1]
            bandara_awal = bandara_awal[bandara_awal.find("(")+1:bandara_awal.find(")")]
            bandara_akhir = i.find_elements(By.CLASS_NAME, 'rute')[1].text.split('\n')[1]
            bandara_akhir = bandara_akhir[bandara_akhir.find("(")+1:bandara_akhir.find(")")]
            total_transit = i.find_element(By.CLASS_NAME, 'durasi').text.split('\n')[1]
            total_transit = 0 if total_transit == 'Langsung' else [int(i) for i in total_transit if i.isdigit()][0]
            kode_penerbangan = kode_penerbangan if total_transit == 0 else kode_pen[id_kode:id_kode+total_transit+1]
            kode_penerbangan = [i.replace(' ','') for i in kode_penerbangan]
            kode_penerbangan = ','.join(kode_penerbangan)
            if total_transit > 0:
                id_kode = id_kode+total_transit+1
            awal = [t.text for t in i.find_elements(By.CLASS_NAME, 'airport-departure')]
            awal = [t[t.index('(')+1:t.index(')')] for t in awal]
            akhir = [t.text for t in i.find_elements(By.CLASS_NAME, 'airport-arrival')]
            akhir = [t[t.index('(')+1:t.index(')')] for t in akhir]
            rute_penerbangan = awal + akhir[-1:]
            if len(rute_penerbangan) > 0:
                rute_penerbangan = '-'.join(rute_penerbangan)
            else:
                rute_penerbangan = bandara_awal+'-'+bandara_akhir
            waktu_berangkat = i.find_elements(By.CLASS_NAME, 'rute')[0].text.split('\n')[0]
            waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
            waktu_tiba = i.find_elements(By.CLASS_NAME, 'rute')[1].text.split('\n')[0]
            waktu_tiba = pd.to_datetime(waktu_tiba).time()
            total_waktu = i.find_element(By.CLASS_NAME, 'durasi').text.split('\n')[0]
            total_waktu = total_waktu.replace('j','h')
            harga = i.find_elements(By.CLASS_NAME, 'diskonPrice')[0].text.split('\n')[1::-1]
            harga = ''.join(harga)
            harga = float(''.join([i for i in harga if i.isdigit()]))

            data.append({
                'job_id': job_id,           
                'platform': 'Pegipegi',
                'date': pd.to_datetime(date, dayfirst=True).date(),
                'departure_airport': bandara_awal,
                'destination_airport': bandara_akhir,
                'marketing_airline': marketing_air,
                'flight_code': kode_penerbangan,
                'cabin_class': 'ECONOMY',
                'departure_time': waktu_berangkat,
                'arrival_time': waktu_tiba,
                'transit': total_transit,
                'routes': rute_penerbangan,
                'flight_duration': total_waktu,
                'rates': harga
            })
        except Exception as e:
            print(e)
            pass

    return data

# Scraper Via.id
def get_dataVia(job_id, date, departure, destination, url="https://www.via.id/"):
    driver.get(url)
    time.sleep(random.uniform(2,4))

    # Fill departure city
    box_depart = driver.find_element(By.XPATH, '//input[@id="source"]')
    box_depart.clear()
    box_depart.send_keys(departure)
    time.sleep(random.uniform(.5, .8))

    list_result = driver.find_elements(By.CLASS_NAME, 'ui-menu-item')
    list_result[0].click()
    n_result = len(list_result) 

    # Fill destination city
    box_dest = driver.find_element(By.XPATH, '//*[@id="destination"]')
    box_dest.clear()
    box_dest.send_keys(destination)
    time.sleep(random.uniform(.5, .8))

    list_result = driver.find_elements(By.CLASS_NAME, 'ui-menu-item')
    list_result[n_result].click()

    d,m,y = date.split('-')

    month_num = {
            '1': 'Jan',
            '2': 'Feb',
            '3': 'Mar',
            '4': 'Apr',
            '5': 'Mei',
            '6': 'Jun',
            '7': 'Jul',
            '8': 'Agu',
            '9': 'Sept',
            '10': 'Okt',
            '11': 'Nov',
            '12': 'Des'
        }

    bulan = m[:]
    for b, a in month_num.items():
        bulan = bulan.replace(b,a)

    bulan = bulan+' '+y

    num_month = {
        'Jan' : '1',
        'Feb' : '2',
        'Mar' : '3',
        'Apr' : '4',
        'Mei' : '5',
        'Jun' : '6',
        'Jul' : '7',
        'Agu' : '8',
        'Sept' : '9',
        'Okt' : '10',
        'Nov' : '11',
        'Des' : '12'
    }
    
    month = driver.find_element(By.XPATH, '//span[@class="vc-month-box-head-cell "]').text
    month_inp = bulan[:]
    for b, a in num_month.items():
        month_inp = month_inp.replace(b,a)
        month = month.replace(b,a)
        
    range_month = pd.to_datetime(month).month - pd.to_datetime(month_inp).month

    time.sleep(.5)
    if range_month > 0:
        for r in range(range_month):
            btn_prev = driver.find_element(By.XPATH, '//*[@id="depart-cal"]/div[3]/div[1]/span[1]')
            btn_prev.click()
            time.sleep(.5)

    for _ in range(12):
        month = driver.find_element(By.XPATH, '//span[@class="vc-month-box-head-cell "]').text
        if month == bulan:
            list_tanggal = driver.find_elements(By.XPATH, '//div[@class="vc-cell "]')
            for i in list_tanggal:
                if d in i.text:
                    i.click()
                    time.sleep(random.uniform(.5,1))
                    break
            break
        else:
            btn_next = driver.find_element(By.XPATH, '/html/body/div[2]/div[3]/div[1]/div/div/form/div[3]/div[1]/div[4]/div[1]/div[4]/div[1]/span[3]')
            btn_next.click()
            time.sleep(random.uniform(2,4))

    show_more = driver.find_element(By.XPATH, '//div[@class="more"]')
    show_more.click()

    box_class = driver.find_element(By.ID, 'preferredClass')
    box_class.click()
    
    kabin = ['Ekonomi', 'Bisnis', 'Kelas utama']
    list_class = driver.find_elements(By.XPATH, '//option[@data-type="class"]')
    for i in list_class:
        if i.text == kabin[0]:
            i.click()
            time.sleep(random.uniform(.5,1.5))
            break

    btn_search = driver.find_element(By.XPATH, '//div[@class="search-btn"]')
    btn_search.click()
    time.sleep(random.uniform(2,3))
    
    driver.refresh()
    time.sleep(random.uniform(2,3))

    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(random.uniform(1.5, 2.5))

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    time.sleep(random.uniform(5,10))

    # Scraping the data
    data = []
    list_airlines = driver.find_elements(By.XPATH, '//div[@class="name js-toolTip"]')
    for i in range(len(list_airlines)):
        try:
            marketing_air = driver.find_elements(By.XPATH, '//div[@class="airLogo"]/img')[i].get_attribute('alt')
            kode_penerbangan = driver.find_elements(By.XPATH, '//div[@class="fltNum"]')[i].text.split(',')
            kode_penerbangan = [i.replace('-','') for i in kode_penerbangan]
            kode_penerbangan = ','.join(kode_penerbangan)
            bandara = driver.find_elements(By.CLASS_NAME, 'route')[i].text.split()
            bandara_awal = bandara[0]
            bandara_akhir = bandara[-1]
            total_transit = driver.find_elements(By.XPATH, '//div[@class="dur"]/span')[i].text
            rute_penerbangan = '-'.join(bandara)
            total_transit = 0 if total_transit == 'Non-Stop' else [int(i) for i in total_transit if i.isdigit()][0]
            waktu_berangkat = driver.find_elements(By.CLASS_NAME, 'depTime')[i].text.split('\n')[0]
            waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
            waktu_tiba = driver.find_elements(By.CLASS_NAME, 'arrTime')[i].text.split('\n')[0]
            waktu_tiba = pd.to_datetime(waktu_tiba).time()
            total_waktu = (' ').join(driver.find_elements(By.CLASS_NAME, 'fltDur')[i].text.split()[:2])
            harga = driver.find_elements(By.XPATH, '//div[@class="currency js-toolTip"]')[i].text
            harga = float(''.join([i for i in harga if i.isdigit()]))

            data.append({
                'job_id': job_id,
                'platform': 'Via',
                'date': pd.to_datetime(date, dayfirst=True).date(),
                'departure_airport': bandara_awal,
                'destination_airport': bandara_akhir,
                'flight_code': kode_penerbangan,
                'marketing_airline': marketing_air,
                'cabin_class': 'ECONOMY',
                'departure_time': waktu_berangkat,
                'arrival_time': waktu_tiba,
                'transit': total_transit,
                'routes': rute_penerbangan,
                'flight_duration': total_waktu,
                'rates': harga
            })
        except Exception as e:
            print(e)
            pass

    # Get all cabin
    for kab in kabin[1:]:
        driver.execute_script(f"window.scrollTo(0, document.body.scrollHeight*{.25});")
        driver.implicitly_wait(10)
        time.sleep(random.uniform(1.2,1.7))

        btn_change = driver.find_element(By.CLASS_NAME, 'modifySearch')
        btn_change.click()
        time.sleep(random.uniform(.5,1))

        box_class = driver.find_element(By.ID, 'preferredClass')
        box_class.click()

        list_class = driver.find_elements(By.XPATH, '//option[@data-type="class"]')
        for i in list_class:
            if i.text == kab:
                i.click()
                time.sleep(random.uniform(.5,1.5))
                break

        btn_search = driver.find_element(By.XPATH, '//div[@class="search-btn"]')
        btn_search.click()
        time.sleep(random.uniform(5,10))

        last_height = driver.execute_script("return document.body.scrollHeight")
        while True:
            driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

            time.sleep(random.uniform(.5, 1.5))

            new_height = driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        time.sleep(random.uniform(4,10))

        list_airlines = driver.find_elements(By.XPATH, '//div[@class="name js-toolTip"]')
        for i in range(len(list_airlines)):
            try:
                marketing_air = driver.find_elements(By.XPATH, '//div[@class="airLogo"]/img')[i].get_attribute('alt')
                kode_penerbangan = driver.find_elements(By.XPATH, '//div[@class="fltNum"]')[i].text.split(',')
                kode_penerbangan = [i.replace('-','') for i in kode_penerbangan]
                kode_penerbangan = ','.join(kode_penerbangan)
                kelas_kabin =  'BUSINESS' if kab == 'Bisnis' else 'FIRST'
                bandara = driver.find_elements(By.CLASS_NAME, 'route')[i].text.split()
                bandara_awal = bandara[0]
                bandara_akhir = bandara[-1]
                total_transit = driver.find_elements(By.XPATH, '//div[@class="dur"]/span')[i].text
                rute_penerbangan = '-'.join(bandara)
                total_transit = 0 if total_transit == 'Non-Stop' else [int(i) for i in total_transit if i.isdigit()][0]
                waktu_berangkat = driver.find_elements(By.CLASS_NAME, 'depTime')[i].text.split('\n')[0]
                waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
                waktu_tiba = driver.find_elements(By.CLASS_NAME, 'arrTime')[i].text.split('\n')[0]
                waktu_tiba = pd.to_datetime(waktu_tiba).time()
                total_waktu = (' ').join(driver.find_elements(By.CLASS_NAME, 'fltDur')[i].text.split()[:2])
                harga = driver.find_elements(By.XPATH, '//div[@class="currency js-toolTip"]')[i].text
                harga = float(''.join([i for i in harga if i.isdigit()]))

                data.append({
                    'job_id': job_id,
                    'platform': 'Via',
                    'date': pd.to_datetime(date, dayfirst=True).date(),
                    'departure_airport': bandara_awal,
                    'destination_airport': bandara_akhir,
                    'marketing_airline': marketing_air,
                    'flight_code': kode_penerbangan,
                    'cabin_class': kelas_kabin,
                    'departure_time': waktu_berangkat,
                    'arrival_time': waktu_tiba,
                    'transit': total_transit,
                    'routes': rute_penerbangan,
                    'flight_duration': total_waktu,
                    'rates': harga
                })
            except Exception as e:
                print(e)
                pass
        time.sleep(random.uniform(1.5,3.5))

    return data

def get_dataSky(job_id, date, departure, destination, url="https://www.skyscanner.com/transport/flights"):
    d,m,y = date.split('-')
    if len(d)==1: d='0'+d
    if len(m)==1: m='0'+m
    date = y[-2:]+m+d
    
    t_airline = get_dataex('T_MST_AIRLINE', database='nusatest', notif=False)
    t_airline = t_airline[['IATA_CODE', 'FULL_NAME']]

    data = []
    list_cabin = [0,2]
    for cabin in list_cabin:
        driver_sky = webdriver.Firefox()
        cabin_dict = {'0':'economy', '1':'premium_economy', '2':'business', '3':'first'}
        cabin = str(cabin)
        for a,b in cabin_dict.items():
            cabin = cabin.replace(a,b)
        time.sleep(2)
        url= f"{url}/{departure.lower()}/{destination.lower()}/{date}/?adults=1&cabinclass={cabin}&currency=IDR&children=0&qp_prevScreen=HOMEPAGE&ref=home&rtn=0"
        driver_sky.get(url)

        t_nusa = get_dataex(f'EX_FLIGHT_RATES WHERE JOB_ID = {job_id}', database='data', notif=False)
        t_nusa = t_nusa[(t_nusa['PLATFORM'] == 'Nusatrip')
                        & (t_nusa['DEPARTURE_AIRPORT'] == departure)
                        & (t_nusa['DESTINATION_AIRPORT'] == destination)]
        t_nusa = t_nusa[['PLATFORM', 'DEPARTURE_AIRPORT', 'DESTINATION_AIRPORT', 'MARKETING_AIRLINE',
                         'FLIGHT_CODE', 'DEPARTURE_TIME','ARRIVAL_TIME','TRANSIT','ROUTES']]
        
        time.sleep(random.uniform(4,6))
        try:
            list_result = driver_sky.find_elements(By.XPATH, '//button[@class="BpkButtonBase_bpk-button__ZGM2M TicketStub_ctaButton__OTNjO"]')
            total = len(list_result)
            if total == 0:
                print("\nBLOCKED BY CAPTCHA")
                time.sleep(70)
            else:
                total = total if total < 5 else 5
                k = total if total < 4 else 3
                total = random.choices(range(total), k=k)
                for num in total:
                    list_result = driver_sky.find_elements(By.XPATH, '//button[@class="BpkButtonBase_bpk-button__ZGM2M TicketStub_ctaButton__OTNjO"]')
                    list_result[num].click()
                    time.sleep(random.uniform(2,5))
                   
                    try:
                        btn_back = driver_sky.find_element(By.XPATH, '//button[@aria-label="back"]')
                        btn_back.click()
                        time.sleep(random.uniform(2,5))
                    except:
                        parent = driver_sky.window_handles[0]
                        chld = driver_sky.window_handles[1]
                        driver_sky.switch_to.window(chld)
                        driver_sky.close()
                        driver_sky.switch_to.window(parent)
                    
                last_height = driver_sky.execute_script("return document.body.scrollHeight")
                scheight = 300
                while scheight < last_height - 500:
                    scheight += random.choice([50,75,100,125])
                    driver_sky.execute_script(f"window.scrollTo(0, {scheight});")
                    time.sleep(random.uniform(.5,2))
        
                time.sleep(random.uniform(5,12))   
                list_result = driver_sky.find_elements(By.XPATH, '//div[@class="EcoTicketWrapper_itineraryContainer__ZWE4O"]')
                for i in list_result:
                    try:
                        maskapai = i.find_element(By.CLASS_NAME, 'BpkImage_bpk-image__img__MDZkN').get_attribute("alt")
                    except:
                        maskapai = i.text.split('\n')[1]
                    maskapai = ','.join(maskapai.split('+'))
                    elem = i.find_element(By.CLASS_NAME, 'LegInfo_legInfo__ZGMzY').text.split('\n')
                    jam = [i for i in elem if ":" in i]
                    waktu_berangkat = pd.to_datetime(jam[0].strip()).time()
                    waktu_tiba = pd.to_datetime(jam[-1].strip()).time()
                    durasi = elem[2]
                    transit = [i for i in elem[3] if i.isdigit()]
                    transit = int(transit[0]) if len(transit) > 0 else 0
                    rute = '-'.join([i for i in elem if len(i.strip()) == 3 and i.isupper()])

                    try:
                        marketing_air = np.array(t_airline[t_airline['FULL_NAME'] == maskapai]['IATA_CODE'])[0]
                    except:
                        marketing_air = maskapai
                    try:
                        kode_penerbangan = np.array(t_nusa[(t_nusa['DEPARTURE_TIME'] == waktu_berangkat) &
                                                    (t_nusa['ARRIVAL_TIME'] == waktu_tiba)
                                                    (t_nusa['TRANSIT'] == transit)]['FLIGHT_CODE'])[0]
        
                    except:
                        kode_penerbangan = maskapai
                    harga = i.find_element(By.CLASS_NAME, 'Price_mainPriceContainer__MDM3O').text
                    harga = float(''.join([i for i in harga if i.isdigit()]))
                    data.append({
                        "job_id": job_id,
                        "platform": "Skyscanner",
                        "date": pd.to_datetime(date, yearfirst=True).date(),
                        "departure_airport": departure,
                        "destination_airport": destination,
                        "marketing_airline": marketing_air,
                        "flight_code": kode_penerbangan,
                        "cabin_class": ' '.join(cabin.split('_')).upper(),
                        "departure_time": waktu_berangkat,
                        "arrival_time": waktu_tiba,
                        "transit": transit,
                        "routes": rute,
                        "flight_duration": durasi+'m',
                        "rates": harga
                    })
    
        except Exception as e:
            print(e)
            time.sleep(15)
            pass
            
        driver_sky.quit()
        time.sleep(random.uniform(6,10)) 
    
    return data

def get_dataBooking(job_id, date, departure, destination):
    data = []
    # change date format
    # date = datetime.strptime(date, '%Y-%m-%dT%H:%M:%S.%fZ')
    # date = date.strftime('%Y-%m-%d')
    date = datetime.strptime(date, '%d-%m-%Y')
    date = date.strftime('%Y-%m-%d')

    options = webdriver.ChromeOptions()
    # Set the WebDriver to run in headless mode (without opening a browser window)
    # options.add_argument("--headless")
    # Disable GPU acceleration to improve performance in headless mode
    options.add_argument("--disable-gpu")
    # Set the window size for the virtual browser window
    options.add_argument("--window-size=1920,1080")
    # Set a custom user agent for the browser to mimic a specific browser version
    options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.61 Safari/537.36")
    # Disable extensions in the browser
    options.add_argument("--disable-extensions")
    # Ignore certificate errors for HTTPS sites
    options.add_argument("--ignore-certificate-errors")

    # Add additional options for improved scraping performance
    # Disable web security to bypass CORS restrictions
    options.add_argument("--disable-web-security")
    # Disable /dev/shm usage to reduce memory consumption
    options.add_argument("--disable-dev-shm-usage")
    # Disable the sandbox for better performance
    options.add_argument("--no-sandbox")

    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1920, 1080)  # Set window size for consistent behavior

    cabin_class = ["ECONOMY", "BUSINESS", "FIRST"]

    for cabin in range (len(cabin_class)):
        print(len(cabin_class))
        print(cabin)
        print(cabin_class[cabin])
        driver.get("https://flights.booking.com/flights/"+departure+".AIRPORT-"+destination+".AIRPORT/?type=ONEWAY&adults=1&cabinClass="+cabin_class[cabin]+"&children=&from="+departure+".AIRPORT&to="+destination+".AIRPORT&fromCountry=&toCountry=&fromLocationName=Soekarno-Hatta+International+Airport&toLocationName=Changi+Airport&stops=0&depart="+date+"&sort=BEST&travelPurpose=leisure&aid=304142&label=gen173nr-1FEgdmbGlnaHRzKIICOOgHSDNYBGhoiAEBmAExuAEXyAEM2AEB6AEB-AELiAIBqAIDuAL4spmlBsACAdICJDU1MjlmNzk3LTY2ZGYtNDU3ZS05MGQ0LThiNjI5YmUwODA3MNgCBuACAQ")
        c = 0
        current_page_number = 1

        #wait for search button elements visible
        WebDriverWait(driver, .5).until(EC.visibility_of_all_elements_located((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
        # driver.minimize_window()

        # WebDriverWait(driver, .5).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))

        time.sleep(random.uniform(.2,.5))

        search_button = driver.find_element(By.XPATH, '//button[@data-ui-name="button_search_submit"]')
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
        driver.execute_script("arguments[0].scrollIntoView();", search_button)
        WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
        WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CSS_SELECTOR, 'div.css-ev1b4i[data-testid="search_loading_overlay"]')))

        search_button.click()

        #wait for list airlines visible
        time.sleep(random.uniform(.5,1))
        try:
            WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, '//div[@class="css-4o3ibe"]')))
        except:
            break
        list_airlines = driver.find_elements(By.XPATH, '//div[@class="css-4o3ibe"]')

        try:
            WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, 'Pagination-module__pages___wQykF')))
            pagination = driver.find_element(By.CLASS_NAME, 'Pagination-module__pages___wQykF')
            page_buttons = pagination.find_elements(By.TAG_NAME, 'button')
        except Exception as e:
            global number_of_flight
            number_of_flight =  len(list_airlines)
            print(current_page_number,"/",1)
            print((current_page_number/1)*100,"%")
            for i in range(len(list_airlines)):
                
                try:
                    
                    c += 1
                    flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')
                    
                    if i >= len(flight_details):
                        # Index out of range, break out of the loop
                        break
                    
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                    WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))

                    time.sleep(random.uniform(.1,.5))
                    try:       
                        flight_details[i].click()
                    except:
                        search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                        WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                        # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                        search_again_button.click()
                        break

                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')))
                    element = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')
                    text = element.text

                    flight_code_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                    flight_code_list = [element.text.split("·")[0].strip() for element in flight_code_element]
                    flight_code_string = ', '.join(flight_code_list)


                    # flight_cabin_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                    flight_cabin_list = [element.text.split("·")[-1].strip() for element in flight_code_element]
                    flight_cabin= ', '.join(set(flight_cabin_list))

                    # extracting all letter from flight code
                    # marketing_airline_list = [re.sub(r'[^A-Za-z]', '', element.text.split("·")[0].strip()) for element in flight_code_element]
                
                    marketing_airline_list = [element.text.split("·")[0].strip()[:2] for element in flight_code_element]
                    marketing_airline = ', '.join(set(marketing_airline_list))

                    departure_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_departure"]')
                    arrival_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_arrival"]')

                    total_transit_element = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_stops_0"]')[i]
                    if total_transit_element.text == 'Direct':
                        transit_info= "None"
                    else:
                        departure_content = [element.text.split(" · ")[0] for element in departure_elements]
                        arrival_content = [element.text.split(" · ")[0] for element in arrival_elements]
                        truncate_transit_info = departure_content[:-1] + [arrival_content[-2], arrival_content[-1]]
                        transit_info = ", ".join(truncate_transit_info)
                    print("124")

                    flight_details_close = driver.find_element(By.XPATH, '//button[@aria-label="Close"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@aria-label="Close"]')))
                    # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Close"]')))

                    flight_details_close.click()

                    bandara_awal = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_departure_airport_0"]')[i].text.split()[0]
                    bandara_akhir = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_destination_airport_0"]')[i].text.split()[-1]

                    total_transit_element = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_stops_0"]')[i]
                    total_transit = 0 if total_transit_element.text == 'Direct' else int(re.search(r'\d+', total_transit_element.text).group())

                    waktu_berangkat = pd.to_datetime(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_departure_time_0"]')[i].text).time()
                    waktu_tiba = pd.to_datetime(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_destination_time_0"]')[i].text).time()
                    total_waktu = ' '.join(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_duration_0"]')[i].text.split()[:2])

                    harga_element = driver.find_elements(By.XPATH, '//div[@class="css-vxcmzt"]')[i]
                    harga = float(''.join(filter(lambda x: x.isdigit() or x == ',', harga_element.text)).replace(',', '.'))
                    

                    data.append({
                        'job_id': job_id,
                        'platform': 'BOOKING.COM',
                        'date': date,
                        'departure_airport': bandara_awal.upper(),
                        'destination_airport': bandara_akhir.upper(),
                        'marketing_airline' : marketing_airline.upper(),
                        'flight_code': flight_code_string.upper(),
                        'cabin_class': flight_cabin.upper(),
                        'departure_time': waktu_berangkat,
                        'arrival_time': waktu_tiba,
                        'transit': total_transit,
                        #routes ubah transit_info jadi routes
                        'routes': transit_info.upper(),
                        'flight_duration': total_waktu.upper(),
                        'rates': harga
                    })

                    print(c)

                except Exception as e:
                    print(e)
                    break
        try:
            last_page_button = page_buttons[-1]  # Get the last page button
            last_page_label = last_page_button.get_attribute('aria-label').strip()  # Extract the page label
            last_page_number = int(''.join(filter(str.isdigit, last_page_label)))  # Extract the last page number as an integer

            # Loop over each page button
            for page in range(last_page_number):
                number_of_flight =  15*last_page_number
                print(current_page_number,"/",last_page_number)
                print("{:.0f}%".format((current_page_number / last_page_number) * 100))

                current_page_number +=1
                # Perform scraping on each page
                for i in range(len(list_airlines)):
                    try:
                        c += 1
                        try:
                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                            flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')

                            if i >= len(flight_details):
                                # Index out of range, break out of the loop
                                break

                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                            print("bp0")
                            time.sleep(random.uniform(.5, .7))

                            # Scroll the button into view
                            driver.execute_script("arguments[0].scrollIntoView();", flight_details[i])

                            # Perform the click action using ActionChains
                            actions = ActionChains(driver)
                            actions.move_to_element(flight_details[i]).click().perform()

                            print("bp1")
                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')))
                            time.sleep(random.uniform(.1, .2))
                            print("bp2")

                            element = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')

                        except Exception as e:
                            print(e)
                            print("exception 0")
                            print("247")

                            search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                            search_again_button.click()
                            break
                                            

                        
                        text = element.text

                        #delay for 
                        flight_code_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                        flight_code_list = [element.text.split("·")[0].strip() for element in flight_code_element]
                        flight_code_string = ', '.join(flight_code_list)

                        #flight_class = text.split(' · ')[1]
                        # flight_cabin_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                        flight_cabin_list = [element.text.split("·")[-1].strip() for element in flight_code_element]
                        flight_cabin= ', '.join(set(flight_cabin_list))
                        # extracting all letter from flight code
                        # marketing_airline_list = [re.sub(r'[^A-Za-z]', '', element.text.split("·")[0].strip()) for element in flight_code_element]
                        marketing_airline_list = [element.text.split("·")[0].strip()[:2] for element in flight_code_element]

                        marketing_airline = ', '.join(set(marketing_airline_list))


                        departure_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_departure"]')
                        arrival_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_arrival"]')
                        
                        total_transit_element = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_stops_0"]')[i]
                        
                        #MASIH BUG

                        if total_transit_element.text == 'Direct':
                            transit_info= "None"
                        else:
                            departure_content = [element.text.split(" · ")[0] for element in departure_elements]
                            arrival_content = [element.text.split(" · ")[0] for element in arrival_elements]
                            truncate_transit_info = departure_content[:-1] + [arrival_content[-2], arrival_content[-1]]
                            transit_info = ", ".join(truncate_transit_info)
                        
                        #HARUS FIX 
                        # transit_info = "DIRECT"

                        #CLOSE DETAILS
                        print("286")
                        flight_details_close = driver.find_element(By.XPATH, '//button[@aria-label="Close"]')
                        WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@aria-label="Close"]')))
                        # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Close"]')))

                        print("before close")
                        flight_details_close.click()
                        

                        bandara_awal = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_departure_airport_0"]')[i].text.split()[0]
                        bandara_akhir = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_destination_airport_0"]')[i].text.split()[-1]

                        total_transit_element = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_stops_0"]')[i]
                        total_transit = 0 if total_transit_element.text == 'Direct' else int(re.search(r'\d+', total_transit_element.text).group())

                        waktu_berangkat = pd.to_datetime(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_departure_time_0"]')[i].text).time()
                        waktu_tiba = pd.to_datetime(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_destination_time_0"]')[i].text).time()
                        total_waktu = ' '.join(driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_duration_0"]')[i].text.split()[:2])

                        harga_element = driver.find_elements(By.XPATH, '//div[@class="css-vxcmzt"]')[i]
                        harga = float(''.join(filter(lambda x: x.isdigit() or x == ',', harga_element.text)).replace(',', '.'))
                        
                        #market flight info
                        # res = driver.find_elements(By.XPATH,'//div[contains(@class, "css-17m9lv6")]/div[contains(@class, "Text-module__root--variant-small_1___7N9d2")]')
                        # output = [element.text for element in res]
                        # truncated = []
                        # truncated = output  # Initialize the truncated list with the output list
                        # iterate = True
                        # truncate_iteration_temp = 0
                        # while iterate:
                        #     temp = 0
                        #     while temp < len(truncated):
                        #         if temp+2 < len(truncated) and truncated[temp+1] == ", ":
                        #             truncated[temp:temp+3] = [truncated[temp] + ", " + truncated[temp+2]]
                        #             temp += 1
                        #         else:
                                
                        #             temp += 1
                        #     if (truncated[-2] == ", "):
                        #         iterate = True
                        #     else:
                        #         iterate = False
                        # truncated = [element.split(", operated by")[0].strip() for element in truncated]
                        # fligh_marketing = truncated[truncate_iteration_temp]
                        print("after filgh_marketing")


                        data.append({
                            'job_id': job_id,
                            'platform': 'BOOKING.COM',
                            'date': date,
                            'departure_airport': bandara_awal.upper(),
                            'destination_airport': bandara_akhir.upper(),
                            'marketing_airline' : marketing_airline.upper(),
                            'flight_code': flight_code_string.upper(),
                            'cabin_class': flight_cabin.upper(),
                            'departure_time': waktu_berangkat,
                            'arrival_time': waktu_tiba,
                            'transit': total_transit,
                            #routes ubah transit_info jadi routes
                            'routes': transit_info.upper(),
                            'flight_duration': total_waktu.upper(),
                            'rates': harga
                        })
                        print(c)
                        # get_progress_value()
                        # print("passing progress")


                    except Exception as e:
                        try:
                            print(e)
                            print("exception 1")
                            search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                            # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))

                            search_again_button.click()
                        except Exception as e:
                            print(e)
                            print("exception 2")
                            print("365")

                            flight_details_close = driver.find_element(By.XPATH, '//button[@aria-label="Close"]')
                            WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@aria-label="Close"]')))
                            # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Close"]')))

                            flight_details_close.click()
                            break
                        
                        break


                WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@aria-label="Next"]')))
                # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@aria-label="Next"]')))
                next_button = driver.find_element(By.XPATH, '//button[@aria-label="Next"]')
                time.sleep(random.uniform(.5,.75))
                next_button.click()
                time.sleep(random.uniform(.5,.6))
        except:
            pass   
    driver.close()  
           
    return(data)

def get_dataTraveloka(job_id, date, departure, destination):
    driver = webdriver.Chrome()
    # job_id = 2
    # date = '8-7-2023'
    # departure = 'JFK'
    # destination = 'TYOA'
    url = "https://www.traveloka.com/id-id/flight/fullsearch?ap="+departure+"."+destination+"&dt="+date+".NA&ps=1.0.0&sc=ECONOMY"
    # date = "2023-07-08"
    driver.get(url)

    time.sleep(random.uniform(2,4))
    # Get scroll height
    last_height = driver.execute_script("return document.body.scrollHeight")
    while True:
        # Scroll down to bottom
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")

        # Wait to load page
        time.sleep(random.uniform(2,2.5))

        # Calculate new scroll height and compare with last scroll height
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height
    time.sleep(random.uniform(5,6))
    # Scroll to top of the page
    driver.execute_script("window.scrollTo(0, 0);")

    # aman 99,99 %
    data = []
    list_airlines = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-9nbb9w r-otx420 r-1i1ao36 r-1x4r79x"]')
    for i in range(len(list_airlines)):
    # for i in range(len(list_airlines)):
            try:
                details = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-1awozwy r-1xr2vsu r-13awgt0 r-18u37iz r-1w6e6rj r-3mtglp r-1x4r79x"]/div[1]')[i].click()
                # time.sleep(random.uniform(1.5,3.5))
                time.sleep(random.uniform(1,2))
                harga = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-obd0qt r-eqz5dr r-1cmwbt1 r-knv0ih"]/h3')[i].text
                harga = ''.join(filter(str.isdigit, harga))
                harga = float(harga)
                #range perjalanan
                if i != 0:
                    j = i * 2
                    range_perjalanan = driver.find_elements(By.XPATH, '//div[@class="css-901oao r-t1w4ow r-1enofrn r-majxgm r-56xrmm r-s1qlax r-fdjqy7"]')[j].text.split(',')
                    range_perjalanan = [i.replace('-','') for i in range_perjalanan]
                    range_perjalanan = ','.join(range_perjalanan)
                else:
                    range_perjalanan = driver.find_elements(By.XPATH, '//div[@class="css-901oao r-t1w4ow r-1enofrn r-majxgm r-56xrmm r-s1qlax r-fdjqy7"]')[i].text.split(',')
                    range_perjalanan = [i.replace('-','') for i in range_perjalanan]
                    range_perjalanan = ','.join(range_perjalanan)
                
                start_value = i * 4
                airpoteTime = []
                for j in range(4):
                
                    value = start_value + j
                    airpote_time = driver.find_elements(By.XPATH,'//*[@class="css-1dbjc4n r-1awozwy r-eqz5dr r-9aw3ui r-knv0ih"]/div')[value].text
                    # time.sleep(random.uniform(1.5,3.5))
                    airpoteTime.append(airpote_time)
                

                departure_time = airpoteTime[0]
                departure_airport = airpoteTime[1]
                arrival_time = airpoteTime[2]
                destination_airpot = airpoteTime[3]
                
                # kotak = driver.find_elements(By.XPATH,'//*[@class="css-1dbjc4n r-e8mqni r-1habvwh r-18u37iz r-1h0z5md r-11c0sde"]')
                kotak = driver.find_elements(By.XPATH,'//*[@class="css-1dbjc4n r-13awgt0 r-13qz1uu"]')
                # //*[@class="css-1dbjc4n r-13awgt0 r-13qz1uu"]
                # time.sleep(random.uniform(1.5,3.5))
                if len(kotak) <= 1 :
                    transit = 0
                else:
                    transit = len(kotak)-1
                
                
                
                kelas_kode_tampung =  driver.find_elements(By.XPATH,'//*[@class="css-1dbjc4n r-13awgt0 r-eqz5dr"]/div[@class="css-901oao r-t1w4ow r-1b43r93 r-majxgm r-rjixqe r-14gqq1x r-fdjqy7"]')
                kelas_kode = []
                for element in kelas_kode_tampung:
                    value = element.text
                    kelas_kode.append(value)
                print(kelas_kode)
                
                kelas = []
                kabin = []

                for item in kelas_kode:
                    if 'Premium' in item:
                        kabin.append('Premium Economy')
                    elif 'Economy' in item:
                        kabin.append('Economy')
                    elif 'Business' in item:
                        kabin.append('Business')
    
                # Membuat variabel kode yang telah dihapus keterangan kabin
                kode_cleaned = [item.split(' • ')[0] for item in kelas_kode]
                
                hasil_kode = ', '.join(kode_cleaned)
                hasil_kabin = ', '.join(set(kabin))
                
                transitk = []
                for k in range(len(kotak)):
                    transitA = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-e8mqni r-1habvwh r-13awgt0 r-1h0z5md"]/div[1]')[k].text
                    transitB = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-e8mqni r-1habvwh r-13awgt0 r-1h0z5md r-q3we1"]/div[1]')[k].text
                    transitk.append(transitA)
                    transitk.append(transitB)
                transitk.reverse()
                transit_all = '-'.join(set(transitk))
                
                details = driver.find_elements(By.XPATH, '//div[@class="css-1dbjc4n r-1awozwy r-1xr2vsu r-13awgt0 r-18u37iz r-1w6e6rj r-3mtglp r-1x4r79x"]/div[1]')[i].click()
                # time.sleep(random.uniform(1.5,3.5))
                time.sleep(random.uniform(1,2))
    #             # print(hasil_kode)
    #             # print(hasil_kabin)
                
            
                
                data.append({
                'job_id': job_id,
                'platform': 'Traveloka',
                'date': date,
                'departure_airport':departure_airport,
                'destination_airport':destination_airpot,
                'marketing_airline' : hasil_kode[0:2].upper(),
                'flight_code' : hasil_kode,
                'cabin_class' : hasil_kabin.upper(),
                'departure_time' : departure_time,
                'arrival_time' : arrival_time,
                'transit' : transit,
                'transit_info' : transit_all,
                'flight_duration':range_perjalanan.upper(),
                'rate': harga

            })
                
                
            except Exception as e:
                print(e)
            pass
    
    time.sleep(random.uniform(1.5,3.5))
    driver.close
    return(data)


if __name__ == "__main__":
    now = datetime.now()
    insert_jobDateex(now, notif=True)

    t_job = get_dataex('T_JOB', notif=False)

    job_id = list(t_job['ID'])[-1]
    date = "2023-09-01"
    departure = "CGK"
    destination = "SIN"

    # data_agoda = get_dataAgoda(job_id=job_id, date=date, departure=departure, destination=destination)
    # data_tiket = get_dataTiket(job_id=job_id, date=date, departure=departure, destination=destination)
    # data_pegi = get_dataPegi(job_id=job_id, date=date, departure=departure, destination=destination)
    # data_via = get_dataVia(job_id=job_id, date=date, departure=departure, destination=destination)
    # data_sky = get_dataSky(job_id=job_id, date=date, departure=departure, destination=destination)
    data_booking = get_dataSky(job_id=job_id, date=date, departure=departure, destination=destination)


    df = pd.DataFrame(data_booking)
    df = df.drop_duplicates().reset_index(drop=True)

    data = [tuple(i) for i in df.values]
    insert_dataex(data, notif=True)

    
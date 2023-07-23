# Importing flask module in the project is mandatory
# An object of Flask class is our WSGI application.
from flask import Flask, redirect, url_for, request, render_template, send_file
import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from datetime import datetime
import time
import random
import re
import sys

#Initialize data 
data = []
job_id = ""
from_ = ""
to = ""
cabin_class =""
date = ""
time_temp = ""

#scraping function for booking.com
def booking(job_id, from_, to, cabin_class, date):
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless")
    driver = webdriver.Chrome(options=options)
    driver.set_window_size(1920, 1080)  # Set window size for consistent behavior
    driver.get("https://flights.booking.com/flights/"+from_+".AIRPORT-"+to+".AIRPORT/?type=ONEWAY&adults=1&cabinClass="+cabin_class+"&children=&from="+from_+".AIRPORT&to="+to+".AIRPORT&fromCountry=&toCountry=&fromLocationName=Soekarno-Hatta+International+Airport&toLocationName=Changi+Airport&stops=0&depart="+date+"&sort=BEST&travelPurpose=leisure&aid=304142&label=gen173nr-1FEgdmbGlnaHRzKIICOOgHSDNYBGhoiAEBmAExuAEXyAEM2AEB6AEB-AELiAIBqAIDuAL4spmlBsACAdICJDU1MjlmNzk3LTY2ZGYtNDU3ZS05MGQ0LThiNjI5YmUwODA3MNgCBuACAQ")

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
    time.sleep(random.uniform(.5,1.5))

    list_airlines = driver.find_elements(By.XPATH, '//div[@class="css-4o3ibe"]')

    try:
        pagination = driver.find_element(By.CLASS_NAME, 'Pagination-module__pages___wQykF')
        page_buttons = pagination.find_elements(By.TAG_NAME, 'button')
    except Exception as e:
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
                # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))

                time.sleep(random.uniform(.1,.5))
                try:       
                    flight_details[i].click()
                except:
                    search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    search_again_button.click()
                    pass

                WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')))
                element = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')
                text = element.text

                flight_code_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                flight_code_list = [element.text.split("·")[0].strip() for element in flight_code_element]
                flight_code_string = ', '.join(flight_code_list)


                # flight_cabin_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                flight_cabin_list = [element.text.split("·")[-1].strip() for element in flight_code_element]
                flight_cabin= ', '.join(set(flight_cabin_list))

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
                
                #market flight info
                res = driver.find_elements(By.XPATH,'//div[contains(@class, "css-17m9lv6")]/div[contains(@class, "Text-module__root--variant-small_1___7N9d2")]')
                output = [element.text for element in res]
                truncated = []
                truncated = output  # Initialize the truncated list with the output list
                iterate = True
                truncate_iteration_temp = 0
                while iterate:
                    temp = 0
                    while temp < len(truncated):
                        if temp+2 < len(truncated) and truncated[temp+1] == ", ":
                            truncated[temp:temp+3] = [truncated[temp] + ", " + truncated[temp+2]]
                            temp += 1
                        else:
                        
                            temp += 1
                    if (truncated[-2] == ", "):
                        iterate = True
                    else:
                        iterate = False

                truncated = [element.split(", operated by")[0].strip() for element in truncated]
                fligh_marketing = truncated[truncate_iteration_temp]
                truncate_iteration_temp+=1
                data.append({
                    'job_id': job_id,
                    'platform': 'BOOKING.COM',
                    #'date': pd.to_datetime(date, dayfirst=True).date(),
                    'date': date,
                    'departure_airport': bandara_awal.upper(),
                    'destination_airport': bandara_akhir.upper(),
                    'flight_marketing' : fligh_marketing.upper(),
                    'flight_code': flight_code_string.upper(),
                    'cabin_class': flight_cabin.upper(),
                    'departure_time': waktu_berangkat,
                    'arrival_time': waktu_tiba,
                    'transit': total_transit,
                    'transit_info': transit_info.upper(),
                    'flight_duration': total_waktu.upper(),
                    'rates': harga
                })

                #print(c)
            except Exception as e:
                print(e)
                break
            
        return



    last_page_button = page_buttons[-1]  # Get the last page button
    last_page_label = last_page_button.get_attribute('aria-label').strip()  # Extract the page label
    last_page_number = int(''.join(filter(str.isdigit, last_page_label)))  # Extract the last page number as an integer

    # Loop over each page button
    for page in range(last_page_number):
        print(current_page_number,"/",last_page_number)
        print("{:.0f}%".format((current_page_number / last_page_number) * 100))

        current_page_number +=1
        # Perform scraping on each page
        for i in range(len(list_airlines)):
            try:
                c += 1
                # flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')
                
                # if i >= len(flight_details):
                #     # Index out of range, break out of the loop
                #     break
                
                # WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                # # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))

                # time.sleep(random.uniform(.1,.2))

                try:    
                    flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')
                    
                    if i >= len(flight_details):
                        # Index out of range, break out of the loop
                        break
                    
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                    # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))

                    time.sleep(random.uniform(.5,.7))   
                    flight_details[i].click()
                except:
                    search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    search_again_button.click()
                    pass

                WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')))
                time.sleep(random.uniform(.1,.2))

                element = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')
                text = element.text

                #delay for 
                flight_code_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                flight_code_list = [element.text.split("·")[0].strip() for element in flight_code_element]
                flight_code_string = ', '.join(flight_code_list)

                #flight_class = text.split(' · ')[1]
                # flight_cabin_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                flight_cabin_list = [element.text.split("·")[-1].strip() for element in flight_code_element]
                flight_cabin= ', '.join(set(flight_cabin_list))


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
                
                #market flight info
                res = driver.find_elements(By.XPATH,'//div[contains(@class, "css-17m9lv6")]/div[contains(@class, "Text-module__root--variant-small_1___7N9d2")]')
                output = [element.text for element in res]
                truncated = []
                truncated = output  # Initialize the truncated list with the output list
                iterate = True
                truncate_iteration_temp = 0

                while iterate:
                    temp = 0
                    while temp < len(truncated):
                        if temp+2 < len(truncated) and truncated[temp+1] == ", ":
                            truncated[temp:temp+3] = [truncated[temp] + ", " + truncated[temp+2]]
                            temp += 1
                        else:
                        
                            temp += 1
                    if (truncated[-2] == ", "):
                        iterate = True
                    else:
                        iterate = False
                truncated = [element.split(", operated by")[0].strip() for element in truncated]
                fligh_marketing = truncated[truncate_iteration_temp]


                data.append({
                    'job_id': job_id,
                    'platform': 'BOOKING.COM',
                    'departure_date': date,
                    'departure_airport': bandara_awal.upper(),
                    'destination_airport': bandara_akhir.upper(),
                    'flight_marketing' : fligh_marketing.upper(),
                    'flight_code': flight_code_string.upper(),
                    'cabin_class': flight_cabin.upper(),
                    'departure_time': waktu_berangkat,
                    'arrival_time': waktu_tiba,
                    'transit': total_transit,
                    'transit_info': transit_info.upper(),
                    'flight_duration': total_waktu.upper(),
                    'rates': harga
                })

            except Exception as e:
                print(e)
                try:
                    search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))

                    search_again_button.click()
                except Exception as e:
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
    time_temp = "booking.com-" + date + " " + from_ + " to " + to + "-"+ datetime_string + ".csv"
    df.to_csv("booking.com-" + date + " " + from_ + " to " + to + "-"+ datetime_string + ".csv", index=False)
    print("data saved")
    print (time_temp)
    return time_temp



# Flask constructor takes the name of
# current module (__name__) as argument.
app = Flask(__name__)


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
@app.route('/main', methods=['GET'])
def display():
    css_path = request.args.get('css_path')
    filename = request.args.get('filename')
    return render_template("scrapper.html", css_path=css_path, filename=filename)
   

#route for scrapping the data
@app.route('/scrapper', methods=['POST', 'GET'])
def scrapper():
    if request.method == 'POST':
        
        from_ = request.form.get('from')
        to = request.form.get('to')
        depart = request.form.get('depart')
        cabin = request.form.get('cabin')

        css_path = url_for('static', filename='styles.css')
        print(from_, to, cabin, depart)
        booking(1, from_, to, cabin, depart)
        print("srcapper.html")

        df = pd.DataFrame(data)
        html_table = df.to_html()

        return render_template("scrapper.html", css_path = css_path, table=html_table)
        
    else:
        from_ = request.args.get('from')
        to = request.args.get('to')
        depart = request.args.get('depart')
        cabin = request.args.get('cabin')
        platform = request.args.get('platform')

        css_path = url_for('static', filename='styles.css')
        print(from_, to, cabin, depart)
        booking(1, from_, to, cabin, depart)
        print("srcapper.html 1")
        return render_template("scrapper.html", css_path, as_attachment=False)

@app.route('/')
def index():
    # Create a sample DataFrame
    df = pd.DataFrame(data)
    
    # Generate HTML representation of the DataFrame
    html_table = df.to_html()
    
    # Render the template and pass the HTML table
    return render_template('index.html', table=html_table)


# main driver function
if __name__ == '__main__':
	app.run()
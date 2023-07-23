# from test_19_07_2023_11_26 import *
# from test_19_07_2023_11_26 import data, c, number_of_flight
from test_17_07_2023_10_27 import *
from test_17_07_2023_10_27 import data, c, number_of_flight

#scraping function for booking.com
def booking(job_id, from_, to, cabin_class, date):
    global c 
    global number_of_flight
    global data
    # Create Chrome WebDriver options
    options = Options()

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
    driver.get("https://flights.booking.com/flights/"+from_+".AIRPORT-"+to+".AIRPORT/?type=ONEWAY&adults=1&cabinClass="+cabin_class+"&children=&from="+from_+".AIRPORT&to="+to+".AIRPORT&fromCountry=&toCountry=&fromLocationName=Soekarno-Hatta+International+Airport&toLocationName=Changi+Airport&stops=0&depart="+date+"&sort=BEST&travelPurpose=leisure&aid=304142&label=gen173nr-1FEgdmbGlnaHRzKIICOOgHSDNYBGhoiAEBmAExuAEXyAEM2AEB6AEB-AELiAIBqAIDuAL4spmlBsACAdICJDU1MjlmNzk3LTY2ZGYtNDU3ZS05MGQ0LThiNjI5YmUwODA3MNgCBuACAQ")
    
    #counter for scrapping progress (per flights counter)
    global c
    current_page_number = 1

    #wait for search button elements visible
    WebDriverWait(driver, .5).until(EC.visibility_of_all_elements_located((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
    time.sleep(random.uniform(.2,.5))
    search_button = driver.find_element(By.XPATH, '//button[@data-ui-name="button_search_submit"]')
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
    driver.execute_script("arguments[0].scrollIntoView();", search_button)
    WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, '//button[@data-ui-name="button_search_submit"]')))
    WebDriverWait(driver, 10).until(EC.invisibility_of_element_located((By.CSS_SELECTOR, 'div.css-ev1b4i[data-testid="search_loading_overlay"]')))
    search_button.click()

    #wait for list airlines visible
    time.sleep(random.uniform(.5,1.5))
    WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.XPATH, '//div[@class="css-4o3ibe"]')))

    list_airlines = driver.find_elements(By.XPATH, '//div[@class="css-4o3ibe"]')

    try:

        #checking if the web using pagination
        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CLASS_NAME, 'Pagination-module__pages___wQykF')))
        pagination = driver.find_element(By.CLASS_NAME, 'Pagination-module__pages___wQykF')
        page_buttons = pagination.find_elements(By.TAG_NAME, 'button')
    except Exception as e:

        #if the web does not have a pagination (just one page) an exception will be caught and this code will be executed
        global number_of_flight
        number_of_flight =  len(list_airlines)
        print(current_page_number,"/",1)
        print((current_page_number/1)*100,"%")

        #doing a scraping job until the last of airline list
        for i in range(len(list_airlines)):
            try:
                global c
                c += 1
                flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')
                
                if i >= len(flight_details):
                    # Index out of range, break out of the loop
                    break
                
                WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                time.sleep(random.uniform(.1,.5))

                try:    
                    #if the flight is available this block of code will be executed   
                    flight_details[i].click()
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')))
                    element = driver.find_element(By.CSS_SELECTOR, 'div[data-testid="timeline_leg_info_flight_number_and_class"]')
                    text = element.text
                    flight_code_element = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_leg_info_flight_number_and_class"]')
                    flight_code_list = [element.text.split("·")[0].strip() for element in flight_code_element]
                    flight_code_string = ', '.join(flight_code_list)
                    flight_cabin_list = [element.text.split("·")[-1].strip() for element in flight_code_element]
                    flight_cabin= ', '.join(set(flight_cabin_list))
                    marketing_airline_list = [element.text.split("·")[0].strip()[:2] for element in flight_code_element]
                    marketing_airline = ', '.join(set(marketing_airline_list))
                    departure_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_departure"]')
                    arrival_elements = driver.find_elements(By.XPATH, '//div[@data-testid="timeline_location_airport_arrival"]')
                    total_transit_element = driver.find_elements(By.XPATH, '//div[@data-testid="flight_card_segment_stops_0"]')[i]
                    if total_transit_element.text == 'Direct':
                        routes= "None"
                    else:
                        departure_content = [element.text.split(" · ")[0] for element in departure_elements]
                        arrival_content = [element.text.split(" · ")[0] for element in arrival_elements]
                        truncate_routes = departure_content[:-1] + [arrival_content[-2], arrival_content[-1]]
                        routes = ", ".join(truncate_routes)
                    
                    print("124")

                    flight_details_close = driver.find_element(By.XPATH, '//button[@aria-label="Close"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@aria-label="Close"]')))

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
                        'departure_date': date,
                        'departure_airport': bandara_awal.upper(),
                        'destination_airport': bandara_akhir.upper(),
                        'marketing_airline' : marketing_airline.upper(),
                        'flight_code': flight_code_string.upper(),
                        'cabin_class': flight_cabin.upper(),
                        'departure_time': waktu_berangkat,
                        'arrival_time': waktu_tiba,
                        'transit': total_transit,
                        #routes ubah transit_info jadi routes
                        'routes': routes.upper(),
                        'flight_duration': total_waktu.upper(),
                        'rates': harga
                    })
                    print(c)
                except:
                    #if the flight is not available, an exception will be caught and this code will be executed to skip the unavailable flight
                    search_again_button = driver.find_element(By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')
                    WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.XPATH, '//button[@data-testid="Button" and text()="Search again"]')))
                    search_again_button.click()  

            except Exception as e:
                #this code will be executed if any exception has been caught during the scrapping progress
                print(e)
                break
        return
    
    # if the page is more than one page this block of code will be executed
    # Get the last page button
    last_page_button = page_buttons[-1]  
    # Extract the page label
    last_page_label = last_page_button.get_attribute('aria-label').strip()  
    # Extract the last page number as an integer
    last_page_number = int(''.join(filter(str.isdigit, last_page_label)))  

    # Loop over each page button
    for page in range(last_page_number):
        number_of_flight =  15*last_page_number
        print(current_page_number,"/",last_page_number)
        print("{:.0f}%".format((current_page_number / last_page_number) * 100))

        current_page_number +=1
        # Perform scraping on each page
        for i in range(len(list_airlines)):
            try:
                # global c
                c += 1
                # flight_details = driver.find_elements(By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')
                
                # if i >= len(flight_details):
                #     # Index out of range, break out of the loop
                #     break
                
                # WebDriverWait(driver, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))
                # # WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[data-testid="flight_card_bound_select_flight"]')))

                # time.sleep(random.uniform(.1,.2))

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
                    'departure_date': date,
                    'departure_airport': bandara_awal.upper(),
                    'destination_airport': bandara_akhir.upper(),
                    # need an update
                    # 'marketing_airline' : fligh_marketing.upper(),
                    'marketing_airline' : marketing_airline.upper(),
                    'flight_code': flight_code_string.upper(),
                    'cabin_class': flight_cabin.upper(),
                    'departure_time': waktu_berangkat,
                    'arrival_time': waktu_tiba,
                    'transit': total_transit,
                    'transit_info': transit_info.upper(),
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
        next_button = driver.find_element(By.XPATH, '//button[@aria-label="Next"]')
        time.sleep(random.uniform(.5,.75))
        next_button.click()
        time.sleep(random.uniform(.5,.6))


if __name__ == '__main__':
    booking()


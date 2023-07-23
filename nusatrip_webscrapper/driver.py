from selenium import webdriver
from selenium.webdriver.chrome.options import Options

firefox_options = Options()
# firefox_options.add_argument("--headless")
driver = webdriver.Chrome()

# headless mode 
# driver = webdriver.Firefox(options=firefox_options)

# set implicit wait time
driver.implicitly_wait(10) # seconds
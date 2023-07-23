import pandas as pd
import mysql.connector

def insert_dataex(data, notif=True):
    try:
        connection = mysql.connector.connect(host='localhost',
                                                database='webscrapper_nusatrip',
                                                user='root',
                                                password='')

        sql_insert_query = """INSERT INTO PARAM (
                            JOB_ID, START_DATE, PERIODS, DEPARTURE, DESTINATION
                            ) 
                            VALUES 
                            (%s, %s, %s, %s, %s)"""

        cursor = connection.cursor()
        cursor.executemany(sql_insert_query, data)
        connection.commit()
        print(cursor.rowcount, "records inserted successfully into T_FLIGHT_RATES table\n")

    except mysql.connector.Error as error:
        print("Failed to insert record into table {}".format(error))

    finally:
        if connection.is_connected():
            connection.close()
            cursor.close()
            if notif==True:
                print("MySQL connection is closed")

if __name__ == "__main__":
    job_id = 1

    data = [(job_id, pd.to_datetime('10-8-2023', dayfirst=True).date(), 2, 'SIN', 'DPS'), 
            (job_id, pd.to_datetime('10-8-2023', dayfirst=True).date(), 2, 'DPS', 'SIN')]
    insert_dataex(data)
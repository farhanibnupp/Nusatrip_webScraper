import pandas as pd
import mysql.connector

def get_dataex(table, database="webscrapper_nusatrip", notif=True):
    try:
        connection = mysql.connector.connect(host='localhost',
                                             database="webscrapper_nusatrip",
                                             user='root',
                                             password='')

        cursor = connection.cursor()
        sql_select_query = f"select * from {table}"
        # set variable in query
        cursor.execute(sql_select_query)
        # fetch result
        field_names = [i[0] for i in cursor.description]
        record = cursor.fetchall()
        record = pd.DataFrame(record, columns=field_names)
        if notif==True:
            print('Got {} records'.format(len(record)))
    except mysql.connector.Error as error:
        print("Failed to get record from MySQL table: {}".format(error))

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()
        if notif==True:
            print("MySQL connection is closed")
    return record

def insert_dataex(data, notif=True):
    try:
        connection = mysql.connector.connect(host='localhost',
                                                database='webscrapper_nusatrip',
                                                user='root',
                                                password='')

        sql_insert_query = """INSERT INTO T_FLIGHT_RATES (
                            JOB_ID, PLATFORM, DEPARTURE_DATE, DEPARTURE_AIRPORT, DESTINATION_AIRPORT, 
                            MARKETING_AIRLINE, FLIGHT_CODE, CABIN_CLASS, DEPARTURE_TIME, ARRIVAL_TIME, 
                            TRANSIT, ROUTES, FLIGHT_DURATION, RATES
                            ) 
                            VALUES 
                            (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""

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

def insert_jobDateex(date, notif=True):
    try:
        connection = mysql.connector.connect(host='localhost',
                                            database='webscrapper_nusatrip',
                                            user='root',
                                            password='')

        sql_insert_query = "INSERT INTO T_JOB (DATETIME) VALUES ('{}')".format(date)

        cursor = connection.cursor()
        cursor.execute(sql_insert_query)
        connection.commit()
        if notif==True:
            print("Job date inserted successfully into T_JOB table")

    except mysql.connector.Error as error:
        print("Failed to insert date: {}".format(error))

    finally:
        if connection.is_connected():
            connection.close()
            cursor.close()
            if notif==True:
                print("MySQL connection is closed")

if __name__ == "__main__":
    df = get_dataex('T_JOB')
    print(df.head())

import requests
import pandas as pd
import numpy as np

# Scraper Api Nusa
def api_nusa(job_id, date, departure, destination, url='https://www.nusatrip.com',  vendor=True, curr='usd'):
	token='4335ddaf0666569c49194246cfec5af350a5c82c22c6004a745500a427a4ea7d'
	add_str='&customerId=6b4fdb889e90c6a0de3d2ec66de7fdab&entityId=25829cd67aced014f2439ae7dc5f678c'
	platform='NUSATRIPNET'
	if vendor == False:
		token = 'ef60637d8eb345ec15361b9e21efbb3750a5c82c22c6004a745500a427a4ea7d'
		curr = 'idr'
		add_str = ''
		platform = 'Nusatrip'
	data = []
	cabins = [-1, 1]
	date = pd.to_datetime(date, dayfirst=True).date()
	y,m,d = str(date).split('-')
	m = '0'+m if len(m)==1 else m
	d = '0'+d if len(d)==1 else d
	date = y+m+d

	for cab in cabins:
		try:
			resp = requests.get(f'{url}/api/flight_search?token={token}&version=2.0&adultNum=1&childNum=0&departure={departure}&arrival={destination}&currency={curr}&lang=en&format=json&departDate={date}&cabinType={cab}'+add_str)
			result = resp.json()
			result = result['outbounds']
	
			for i in result:
				try:
					bandara_awal = [x['departureAirportCode'] for x in i['segments']]
					bandara_akhir = [x['arrivalAirportCode'] for x in i['segments']]
					rute_penerbangan = bandara_awal + bandara_akhir[-1:]
					bandara_awal = bandara_awal[0]
					bandara_akhir = bandara_akhir[-1]
					marketing_air = i['airlineCode']
					kode_penerbangan = [x['flightNumber'].replace(' ','') for x in i['segments']]
					kode_penerbangan = ','.join(kode_penerbangan)
					kelas_kabin = i['classType'].replace('_','')
					total_transit = len(i['segments']) - 1
					rute_penerbangan = '-'.join(rute_penerbangan)
					waktu_berangkat = [x['departureTime'] for x in i['segments']][0]
					waktu_berangkat = pd.to_datetime(waktu_berangkat).time()
					waktu_tiba = [x['arrivalTime'] for x in i['segments']][-1]
					waktu_tiba = pd.to_datetime(waktu_tiba).time()
					jam = i['duration'] // 60
					menit = i['duration'] % 60
					total_waktu = f'{jam}h {menit}m'
					harga = round(i['oneWayFare'], 2)
					
					data.append({
						'job_id': job_id,
						'platform': platform,
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
	
		except Exception as e:
			pass
	
	return data

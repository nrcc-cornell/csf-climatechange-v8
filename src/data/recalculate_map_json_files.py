from scipy.stats import linregress
import time, json, sys, os
import requests

def get_gridded_data(input_dict):
  try:
    url = 'https://grid2.rcc-acis.org/GridData'
    req = requests.post(url, json = input_dict)
    data_vals = json.loads(req.text)
  except:
    time.sleep(15)
    try:
      req = requests.post(url, json = input_dict)
      data_vals = json.loads(req.text)
    except:
      print('Problem with web service call',input_dict,'; Retrying...')
      sys.exit(0)
  return data_vals['data']

region_info = {
  'name': 'Northeast',
  'stateFips': ['23', '33', '50', '25', '09', '44', '36', '42', '34', '10', '24', '54', '11'],
  'statePostalCodes': ['ME','VT','NH','MA','RI','CT','NY','PA','MD','DE','WV','NJ','DC']
}

all_elems = [{
  "name": "avgt",
  "elems": { "name":"avgt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" }
},{
  "name": "mint",
  "elems": { "name":"mint","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" }
},{
  "name": "maxt",
  "elems": { "name":"maxt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" }
},{
  "name": "maxt_gt_90",
  "elems": { "name":"maxt","interval":[1],"duration":1,"reduce":"cnt_gt_90","area_reduce":"county_mean" }
},{
  "name": "gdd32",
  "elems": { "name":"gdd","base": 32,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "gdd40",
  "elems": { "name":"gdd","base": 40,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "gdd41",
  "elems": { "name":"gdd","base": 41,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "gdd42",
  "elems": { "name":"gdd","base": 42,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "gdd50",
  "elems": { "name":"gdd","base": 50,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "pcpn",
  "elems": { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" }
},{
  "name": "pcpn_gt_1",
  "elems": { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_1","area_reduce":"county_mean" }
},{
  "name": "pcpn_gt_2",
  "elems": { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_2","area_reduce":"county_mean" }
},{
  "name": "pcpn_gt_3",
  "elems": { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_3","area_reduce":"county_mean" }
},{
  "name": "pcpn_gt_4",
  "elems": { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_4","area_reduce":"county_mean" }
# },{
#   "name": "season_length_24",
#   "elems": 
# },{
#   "name": "season_length_28",
#   "elems": 
# },{
#   "name": "season_length_32",
#   "elems": 
}]

grid = 'ncei-clim'
time_periods = [
  { 'num_years': 73, 'start_year': 1951, 'end_year': 2023 },
  { 'num_years': 44, 'start_year': 1980, 'end_year': 2023 },
]

full_range_start_year = min(list([time_period['start_year'] for time_period in time_periods]))
full_range_end_year = min(list([time_period['end_year'] for time_period in time_periods]))

for elem_dict in all_elems:
  # Define ACIS params dict
  input_dict = {
    "state": ','.join(region_info['statePostalCodes']),
    "grid": grid,
    "sdate": str(full_range_start_year),
    "edate": str(full_range_end_year),
    "elems": [elem_dict['elems']]
  }

  # Get data from ACIS
  raw_data = get_gridded_data(input_dict)

  # Extract year list from retrieved data
  year_list = [int(year_data[0]) for year_data in raw_data]
  
  for time_period_dict in time_periods:
    # Find the start and end indices of the time period in the data
    start_year_index = year_list.index(time_period_dict['start_year'])
    end_year_index = year_list.index(time_period_dict['end_year'])

    # Extract the data and years relevant to the time period
    time_period_data = raw_data[start_year_index:end_year_index + 1]
    time_period_years = [int(v[0]) for v in time_period_data]

    # Make sure the data is the correct length
    if len(time_period_data) == time_period_dict['num_years']:
      # Instanstiate results object
      results = { 'slope': {}, 'pvalue': {} }

      # Loop each county
      for fips in time_period_data[0][1]:
        # Only gather data for counties in area of interest
        if fips[:2] in region_info['stateFips']:
          # Extract data for county and make sure it is the correct length
          fips_time_series = [data_list[1][fips] for data_list in time_period_data]
          if len(fips_time_series) == time_period_dict['num_years']:
            # Calculate the slope and pvalue from the county data and add them to the results
            stats = linregress(time_period_years, fips_time_series)
            results['slope'][fips] = stats.slope
            results['pvalue'][fips] = stats.pvalue
      
      # Load existing data if it exists
      f_path = f'/home/ben/Desktop/csf-climatechange-v7/src/data/{grid}-stats-{str(time_period_dict["start_year"])}-{str(time_period_dict["end_year"])}.json'
      if os.path.exists(f_path):
        try:
          with open(f_path, 'r') as f:
            file_data = json.load(f)
        except:
          file_data = {}
      else:
        file_data = {}

      # Combine results with existing data and overwrite the stored data
      file_data[elem_dict['name']] = results
      with open(f_path, 'w') as f:
        json.dump(file_data, f)
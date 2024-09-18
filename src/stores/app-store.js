///////////////////////////////////////////////////////////////////////////////
//
// Climate Smart Farming Climate Change in Your County
// Copyright (c) 2018 Cornell Institute for Climate Smart Solutions
// All Rights Reserved
//
// This software is published under the provisions of the GNU General Public
// License <http://www.gnu.org/licenses/>. A text copy of the license can be
// found in the file 'LICENSE' included with this software.
//
// A text copy of the copyright notice, licensing conditions and disclaimers
// is available in the file 'COPYRIGHT' included with this software.
//
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { observable, computed, action } from 'mobx';
import axios from "axios";
//import moment from 'moment';
import JSZip from 'jszip';

import ncei_clim_stats_1951_2023 from '../data/ncei-clim-stats-1951-2023.json';
import ncei_clim_stats_1980_2023 from '../data/ncei-clim-stats-1980-2023.json';
import county_geojson from '../data/ne_county_with_fips.json';

// const URL_BASE = 'https://nrcc-cornell.github.io/csf-climatechange-v8/data';

export class AppStore {
    // -----------------------------------------------------------------------------------------
    // Display status of Season To Date --------------------------------------------------------
    // For Components: DisplayChart ------------------------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable chart_status=false;
    @action updateChartStatus = (b) => { this.chart_status = b };
    @computed get chartStatus() { return this.chart_status };

    // status of map activation
    @observable mapActiveStatus = true;
    @action updateMapActiveStatus = (s) => { this.mapActiveStatus = s; };
    @computed get getMapActiveStatus() { return this.mapActiveStatus };

    // -----------------------------------------------------------------------------------------
    // Display status for Data Sources and References ------------------------------------------
    // For Components: InfoButton & InfoWindow -------------------------------------------------
    // -----------------------------------------------------------------------------------------
    @observable info_status=false;
    @action updatePopupStatus = () => { this.info_status = !this.info_status };
    @computed get popupStatus() { return this.info_status };
    info_content = 
        <div>
               <h2>Data Sources and methods</h2>
               <h4><br/>&bull; ABOUT THE VARIABLES</h4>
               <p>
               <i>Daily High Temperature</i> : The highest temperature recorded over a 24-hour period, usually in the afternoon. Averaging all daily high temperatures throughout the year results in the annual average high temperature.
               </p>
               <p>
               <i>Daily Low Temperature</i> : The lowest temperature recorded over a 24-hour period, usually just before sunrise. Averaging all daily low temperatures throughout the year results in the annual average low temperature.
               </p>
               <p>
               <i>Daily Average Temperature</i> : The average of the highest and lowest temperatures recorded over a 24-hour period. Averaging all daily average temperatures throughout the year results in the annual average temperature.
               </p>
               <p>
               <i>Total Precipitation</i> : The combined amount of rainfall and snowfall (melted) received over a certain period of time. Adding the amount of precipitation received over an entire year results in total annual precipitation.
               </p>
               <p>
               <i>Heavy Precipitation</i> : In this tool, heavy precipitation is defined as more than one inch of precipitation received during one 24-hour period. The total number of days receiving more than one inch are tallied over an entire year, resulting in an annual frequency of heavy precipitation. Multiple thresholds of heavy precipitation above one inch are provided for exploration.
               </p>
               <p>
               <i>Days with high temperatures above 90°F</i> : The number of days, tallied over an entire year, on which the daily high temperature exceeded 90°F.
               </p>
               <p>
               <i>Growing Season Length</i> : The number of consecutive days on which daily low temperatures remain warmer than freezing. In general, this is the period when agricultural crops are grown. Common freezing thresholds are provided in this tool (32°F, 28°F, 24°F), to accommodate users interested in "light" or "hard" freezes.
               </p>
               <p>
               <i>Growing Degree Days</i> : The annual number of growing degree days (GDDs) is used to estimate the growth and development of plants and insects during the growing season, with a larger number of GDDs indicating warmer growing conditions. Growth occurs only when temperatures exceed a species' base temperature. The most common base temperatures used for annual GDD accumulation are provided in this tool.
               </p>
               <h4><br/>&bull; OBSERVED DATA</h4>
               <p>
               This tool uses data observed at weather stations from 1951-2023, interpolated to a grid of 1/16° spatial resolution by Livneh et al (2013,2015). The use of this dataset allows for direct comparison of observations with model projections that are also downscaled to the same resolution. Charts show these observations as either black dots or black bars, depending on the variable, and are also overlayed on top of climate projections to provide context for climate model simulations.
               </p>
               <p>
               Livneh, B., E. A. Rosenberg, C. Lin, B. Nijssen, V. Mishra, K. M. Andreadis, E. P. Maurer, and D. P. Lettenmaier (2013), A long-term hydrologically based dataset of land surface fluxes and states for the conterminous United States: Update and extensions, J. Clim., 26(23), 9384–9392, doi 10.1175/JCLI-D-12-00508.1.
               </p>
               <p>
               Livneh, B., Bohn, T.J., Pierce, D.W., Munoz-Arriola, F., Nijssen, B., Vose, R., Brekke, L. 2015. A spatially comprehensive, hydrometeorological data set for Mexico, the U.S., and Southern Canada 1951–2023. Scientific Data 2:150042. doi: 10.1038/sdata.2015.42.
               </p>
               <h4><br/>&bull; TRENDS IN OBSERVED DATA OVER TIME</h4>
               <p>
               Changes in all variables over time are calculated for two periods: 1951-2023 and 1980-2023. Simple linear regression is employed to determine the amount of change per decade that has been observed for each county. County maps of the Northeast United States show the magnitude and spatial variability of these changes. Trends for each analyzed period are also shown on the time series charts, if trends are deemed statistically significant at the 90% level.
               </p>
               <h4><br/>&bull; CLIMATE PROJECTIONS</h4>
               <p>
               Localized Constructed Analogs (LOCA, Pierce et al. 2014) downscaled data from 32 independent climate models are used to show simulated (in the past) and projected (into the future) climate conditions. On charts, a green band indicates the range of these model results, and a dark green line represents the weighted average of the model results. These data are available at 1/16° spatial resolution and daily temporal resolution for the period from 1951 to 2100.
               </p>
               <p>
               Climate models project conditions for multiple emissions scenarios. This allows us to understand the magnitude of changes we might expect given the range of possible greenhouse gas emissions, depending on human activity, over the next century. Climate projections for two emissions scenarios are provided in this tool:<br/>
               </p>
               <p>
                   <i>(1) High Emissions</i>: Under this scenario, greenhouse gas emissions and concentrations increase considerably over time, with no mitigation. This is also known as RCP8.5, as defined by the Intergovernmental Panel on Climate Change (IPCC).
               </p>
               <p>
                   <i>(2) Low Emissions</i>: Under this scenario, greenhouse gas emissions peak at year 2040 and then level off. This is also known as RCP4.5, as defined by the IPCC.
               </p>
               <p>
               Pierce, D. W., D. R. Cayan, and B. L. Thrasher, 2014: Statistical Downscaling Using Localized Constructed Analogs (LOCA). Journal of Hydrometeorology, volume 15, 2558-2585. doi: 10.1175/JHM-D-14-0082.1.
               </p>
               <h4><br/>&bull; DATA ACCESS</h4>
               <p>
               The <a href="http://www.rcc-acis.org/docs_webservices.html" target="_blank" rel="noopener noreferrer">Applied Climate Information System</a> powers data requests in this tool. All data are freely available.
               </p>
        </div>;

    // -----------------------------------------------------------------------------------
    // Manage the visible series displayed on the chart
    // -----------------------------------------------------------------------------------
    //@observable display_series = 'gddGrowingSeason';
    @observable display_series = 'avgtGrowingSeason';
    @action updateDisplaySeries = (changeEvent) => {
        if (changeEvent.target.value === 'seasonLength') {
            this.loadObservationsSeasonLength(this.getCountyFips)
        }
        this.display_series = changeEvent.target.value
        this.changeMouseoverCountyAndState(this.getCountyFips,this.getCounty,this.getStateAbbr);
    };
    @computed get getDisplaySeries() { return this.display_series };
    seriesList = ['seasonLength', 'datesOfLastFreeze', 'datesOfFirstFreeze', 'maxtAnnual', 'avgtGrowingSeason',
        'maxtGrowingSeason', 'mintAnnual', 'mintGrowingSeason', 'gddAnnual', 'gddGrowingSeason',
        'daysAboveTemp','pcpnGrowingSeason','daysAbovePcpn']
    @computed get getChartVisibility() {
            let flags = {}
            for (var i=0; i<this.seriesList.length; i++) {
                flags[this.seriesList[i]] = true ? this.getDisplaySeries === this.seriesList[i] : false
            }
            return flags
        };

    // -----------------------------------------------------------------------------------
    // Manage the projection view
    // -----------------------------------------------------------------------------------
    @observable projection_view = false;
    @action updateProjectionView = (changeEvent) => {
        this.projection_view = changeEvent.target.checked
    };
    @action updateProjectionViewFromAccordion = () => {
        this.projection_view = !this.getProjectionView
    };
    @action updateProjectionView_manual = (b) => {
        this.projection_view = b
    };
    @computed get getProjectionView() { return this.projection_view };

    // MODEL SCENARIO
    @observable model_scenario = 'ssp585';
    @action updateModelScenario = (changeEvent) => {
        this.model_scenario = changeEvent.target.value
    };
    @action updateModelScenarioFromCheckbox = (changeEvent) => {
        if (changeEvent.target.checked) {
            this.model_scenario = changeEvent.target.value;
            this.updateProjectionView_manual(true);
        } else {
            this.updateProjectionView_manual(false);
        }
    };
    @computed get getModelScenario() { return this.model_scenario };

    // COUNTY GEOJSON
    //@observable countyGeojson = {"type":"FeatureCollection", "features":[]};
    //@action updateCountyGeojson = (d) => {
    //    this.countyGeojson = d;
    //};
    //@computed get getCountyGeojson() { return this.countyGeojson };
    @computed get getCountyGeojson() { return county_geojson };

    // COUNTY NAMES/IDS
    @observable county_data = [];
    @action updateCountyData = (d) => { this.county_data = d; };
    @computed get getCountyData() { return this.county_data };

    // Location address --------------------------------------
    @observable address='Tompkins County, NY';
    @action updateAddress = (a) => {
            this.address = a;
        }
    @computed get getAddress() {
            return this.address
        }

    // -----------------------------------------------------------------------------------
    // Gdd base selection ----------------------------------------------------------------
    // For Components: GddBaseSelect -----------------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable gdd_base='50';
    @action updateGddBase = (v) => {
            this.gdd_base = v.value
            // download data using new base for GDD
            this.updateProjectionView_manual(false);
            this.loadAnnualData_1951_2023(this.getCountyFips);
            //this.loadProjections(this.getCountyFips)
            this.loadProjectionsGdd(this.getCountyFips)
        }
    @computed get getGddBase() {
        return this.gdd_base
    }

    // -----------------------------------------------------------------------------------
    // Precip threshold selection --------------------------------------------------------
    // For Components: PrecipThresholdSelect ---------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable precip_threshold='1';
    @action updatePrecipThreshold = (v) => {
            this.precip_threshold = v.value
            // download data using new threshold for precip
            this.updateProjectionView_manual(false);
            this.loadAnnualData_1951_2023(this.getCountyFips);
            this.loadProjections(this.getCountyFips)
        }
    @computed get getPrecipThreshold() {
        return this.precip_threshold
    }

    // -----------------------------------------------------------------------------------
    // Temp threshold selection ----------------------------------------------------------
    // For Components: TempThresholdSelect -----------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable temp_threshold='90';
    @action updateTempThreshold = (v) => {
            this.temp_threshold = v.value
            // download data using new threshold for temp
            this.updateProjectionView_manual(false);
            this.loadAnnualData_1951_2023(this.getCountyFips);
            this.loadProjections(this.getCountyFips)
        }
    @computed get getTempThreshold() {
        return this.temp_threshold
    }

    // -----------------------------------------------------------------------------------
    // Season threshold selection --------------------------------------------------------
    // For Components: SeasonThresholdSelect ---------------------------------------------
    // -----------------------------------------------------------------------------------
    @observable season_threshold='32';
    @action updateSeasonThreshold = (v) => {
            this.season_threshold = v.value
            // download data using new threshold for season threshold
            this.updateProjectionView_manual(false);
            this.loadObservationsSeasonLength(this.getCountyFips);
            this.loadProjectionsSeasonLength(this.getCountyFips)
        }
    @computed get getSeasonThreshold() {
        return this.season_threshold
    }

    // -----------------------------------------------------------------------------------
    // Control Loaders (Spinners) --------------------------------------------------------
    // -----------------------------------------------------------------------------------
    // logic for displaying spinner (county geojson)
    @observable loader_county_geojson=false;
    @action updateLoaderCountyGeojson = (l) => {
            this.loader_county_geojson = l;
        }
    @computed get getLoaderCountyGeojson() {
            return this.loader_county_geojson
        }

    // Logic for displaying spinner (observations from ACIS)
    @observable loader_data=false;
    @action updateLoaderData = (l) => {
            this.loader_data = l;
        }
    @computed get getLoaderData() {
            return this.loader_data
        }

    // Logic for displaying spinner (season length observations from tool server)
    @observable loader_season_length_data=false;
    @action updateLoaderSeasonLengthData = (l) => {
            this.loader_season_length_data = l;
        }
    @computed get getLoaderSeasonLengthData() {
            return this.loader_season_length_data
        }

    // Logic for displaying spinner (projections)
    @observable loader_projections=false;
    @action updateLoaderProjections = (l) => {
            this.loader_projections = l;
        }
    @computed get getLoaderProjections() {
            return this.loader_projections
        }

    // Check if a projection is loading
    @computed get isProjectionLoading() {
            if (this.getProjectionData.ssp585.mean.years.length > 0 &&
                this.getProjectionData.ssp585.min.years.length > 0 &&
                this.getProjectionData.ssp585.max.years.length > 0 &&
                this.getProjectionData.ssp370.mean.years.length > 0 &&
                this.getProjectionData.ssp370.min.years.length > 0 &&
                this.getProjectionData.ssp370.max.years.length > 0 &&
                this.getProjectionData.ssp245.mean.years.length > 0 &&
                this.getProjectionData.ssp245.min.years.length > 0 &&
                this.getProjectionData.ssp245.max.years.length > 0 &&
                !this.getLoaderProjections) {
                    return false;
            } else {
                    return true;
            }
        }

    // -------------------------------------------
    // COUNTY GEOJSON STYLE AND ACTIONS
    // -------------------------------------------

    getCountyStateOnMouseover = (feature) => {
            return feature.properties.name+' County, '+feature.properties.state
        };

    getKeyForVar = () => {
            return {
                'avgtGrowingSeason': 'avgt',
                'maxtGrowingSeason': 'maxt',
                'mintGrowingSeason': 'mint',
                'pcpnGrowingSeason': 'pcpn',
                'seasonLength': 'season_length_'+this.getSeasonThreshold,
                'gddGrowingSeason': 'gdd'+this.getGddBase,
                'daysAboveTemp': 'maxt_gt_90',
                'daysAbovePcpn': 'pcpn_gt_'+this.getPrecipThreshold,
            }
        };

    getLegendThresholds = () => {
        let keyForVar = this.getKeyForVar()
        
        // use trends from 1980-2023 to calculate legend thresholds. We will keep thresholds consistent between periods
        //let vList = Object.values(this.getTrends[keyForVar[this.getDisplaySeries]]['slope']);
        let vList = Object.values(this.getTrendsFor1980_2023[keyForVar[this.getDisplaySeries]]['slope']);
        let maxValue = Math.max(...vList);
        let minValue = Math.min(...vList);
        maxValue = Math.max( Math.abs(maxValue), Math.abs(minValue) );
	let thresholds = []
        if (this.getDisplaySeries === 'avgtGrowingSeason' || this.getDisplaySeries === 'maxtGrowingSeason' || this.getDisplaySeries === 'mintGrowingSeason') {
            thresholds.push(-0.07)
            thresholds.push(-0.03)
            thresholds.push(0.0)
            thresholds.push(0.0)
            thresholds.push(0.03)
            thresholds.push(0.07)
        } else if (this.getDisplaySeries === 'seasonLength') {
            thresholds.push(-1.0)
            thresholds.push(-0.5)
            thresholds.push(0)
            thresholds.push(0)
            thresholds.push(0.5)
            thresholds.push(1.0)
        } else if (this.getDisplaySeries === 'pcpnGrowingSeason') {
            thresholds.push(-0.30)
            thresholds.push(-0.15)
            thresholds.push(0)
            thresholds.push(0)
            thresholds.push(0.15)
            thresholds.push(0.30)
        } else {
            thresholds.push(-1.*maxValue*0.65)
            thresholds.push(-1.*maxValue*0.35)
            thresholds.push(0.0)
            thresholds.push(0.0)
            thresholds.push(maxValue*0.35)
            thresholds.push(maxValue*0.65)
        }
        return thresholds
    };

    getPrecision = () => {
        let precision
        if (this.getDisplaySeries === 'avgtGrowingSeason' || this.getDisplaySeries === 'maxtGrowingSeason' || this.getDisplaySeries === 'mintGrowingSeason') {
            precision = 1
        } else if (this.getDisplaySeries === 'seasonLength' || this.getDisplaySeries === 'gddGrowingSeason') {
            precision = 0
        } else {
            precision = 2
        }
        return precision
    }

    getColorPalette = () => {
        // full brown gradient: #402a0d, #79420a, #f0670c, #f6b25b, #f6dea5
        // full green/blue gradient: #1d4040, #035d5d, #318f8f, #8bcbcb, #c4daf4
        if (this.getDisplaySeries==='pcpnGrowingSeason' || this.getDisplaySeries==='daysAbovePcpn') {
            // green to brown for precipitation
            return ["#035d5d","#318f8f","#8bcbcb","#FFFFFF","#f6b25b","#f0670c","#79420a"]
        } else {
            // red to blue for temperatures
            return ["#FF0000","#FF6666","#FF9999","#FFFFFF","#9999FF","#6666FF","#0000FF"]
        }
    }

    getTrendColor = (d) => {
        return d>this.getLegendThresholds()[5] ? this.getColorPalette()[0] :
            d>=this.getLegendThresholds()[4] ? this.getColorPalette()[1] :
            d>this.getLegendThresholds()[3] ? this.getColorPalette()[2] :
            d>=this.getLegendThresholds()[2] ? this.getColorPalette()[3] :
            d>=this.getLegendThresholds()[1] ? this.getColorPalette()[4] :
            d>=this.getLegendThresholds()[0] ? this.getColorPalette()[5] :
            d<this.getLegendThresholds()[0] ? this.getColorPalette()[6] :
                this.getColorPalette()[3]
    }

    getTrendColorFilteredBySig = (v,p,l) => {
        let pthresh = 1-(l/100.)
        if (p<=pthresh) {
            return this.getTrendColor(v);
        } else {
            return '#FFFFFF';
            //return 'transparent';
        }
    }

    simple_linear_regression = (x, y) => {
      let sum_x = 0,
        sum_y = 0,
        sum_xy = 0,
        sum_xx = 0,
        nrow = x.length,
        m = null,
        b = null;

      if ( x.length !== y.length) {
        throw new Error('x and y must be vectors of the same length\n')
      }

      for (var i=0; i<nrow; i++) {
        sum_x += x[i]
        sum_y += y[i]
        sum_xx += Math.pow(x[i], 2)
        sum_xy += x[i] * y[i]
      }

      m = (nrow*sum_xy - sum_x*sum_y) / (nrow*sum_xx - sum_x*sum_x);
      b = (sum_y/nrow) - (m*sum_x)/nrow;
      return [m, b]
    }

    @observable trend_start_year = '1980'
    @action updateTrendStartYear = (l) => {
            this.trend_start_year = l;
        }
    @computed get getTrendStartYear() {
            return this.trend_start_year
        }

    @observable trends = {}
    @action updateTrends = (l) => {
            this.trends = l;
        }
    @computed get getTrends() {
            if (this.getTrendStartYear==='1951') {
                return ncei_clim_stats_1951_2023
            } else if (this.getTrendStartYear==='1980') {
                return ncei_clim_stats_1980_2023
            } else {
                return null
            }
        }

    @computed get getTrendsFor1951_2023() {
            return ncei_clim_stats_1951_2023
        }

    @computed get getTrendsFor1980_2023() {
            return ncei_clim_stats_1980_2023
        }

    findTrendForFips = (fips) => {

        let keyForVar = this.getKeyForVar()
        
        if (this.getTrends[keyForVar[this.getDisplaySeries]]['slope'].hasOwnProperty(fips)) {
            return this.getTrends[keyForVar[this.getDisplaySeries]]['slope'][fips]
        } else {
            return 0.0
        }
    }

    findTrendForFips_1951_2023 = (fips) => {

        let keyForVar = this.getKeyForVar()
    
        if (this.getTrendsFor1951_2023[keyForVar[this.getDisplaySeries]]['slope'].hasOwnProperty(fips)) {
            return this.getTrendsFor1951_2023[keyForVar[this.getDisplaySeries]]['slope'][fips]
        } else {
            return 0.0
        }
    }

    findTrendForFips_1980_2023 = (fips) => {

        let keyForVar = this.getKeyForVar()
    
        if (this.getTrendsFor1980_2023[keyForVar[this.getDisplaySeries]]['slope'].hasOwnProperty(fips)) {
            return this.getTrendsFor1980_2023[keyForVar[this.getDisplaySeries]]['slope'][fips]
        } else {
            return 0.0
        }
    }

    findSigForFips = (fips) => {

        let keyForVar = this.getKeyForVar()

        if (this.getTrends[keyForVar[this.getDisplaySeries]]['pvalue'].hasOwnProperty(fips)) {
            return this.getTrends[keyForVar[this.getDisplaySeries]]['pvalue'][fips]
        } else {
            return 1.0
        }
    }

    findSigForFips_1951_2023 = (fips) => {

        let keyForVar = this.getKeyForVar()

        if (this.getTrendsFor1951_2023[keyForVar[this.getDisplaySeries]]['pvalue'].hasOwnProperty(fips)) {
            return this.getTrendsFor1951_2023[keyForVar[this.getDisplaySeries]]['pvalue'][fips]
        } else {
            return 1.0
        }
    }

    findSigForFips_1980_2023 = (fips) => {

        let keyForVar = this.getKeyForVar()

        if (this.getTrendsFor1980_2023[keyForVar[this.getDisplaySeries]]['pvalue'].hasOwnProperty(fips)) {
            return this.getTrendsFor1980_2023[keyForVar[this.getDisplaySeries]]['pvalue'][fips]
        } else {
            return 1.0
        }
    }

    countyFeatureStyle = (feature) => {
            return {
                weight: 2,
                opacity: 0.2,
                color: 'black',
                dashArray: '1',
                fillColor: this.getTrendColor(this.findTrendForFips(feature.properties.id)),
                fillOpacity: 0.5,
            };
        }

    countyMouseoverStyle = {
            weight: 3,
            opacity: 0.7,
            color: 'black',
            dashArray: '1',
        }

    countyMouseoutStyle = {
            weight: 2,
            opacity: 0.2,
            color: 'black',
            dashArray: '1',
        }

    // CURRENT COUNTY FIPS ID
    @observable county_fips='36109';
    @action updateCountyFips = (c) => { this.county_fips = c };
    @computed get getCountyFips() { return this.county_fips };

    // CURRENT COUNTY NAME
    @observable county='Tompkins';
    @action updateCounty = (c) => { this.county = c };
    @computed get getCounty() { return this.county };

    // CURRENT STATE NAME
    @observable state_abbr='NY';
    @action updateStateAbbr = (s) => { this.state_abbr = s };
    @computed get getStateAbbr() { return this.state_abbr };

    // MOUSEOVER MESSAGE
    @observable mouseover_message='Hover over county & click to select';
    @action updateMouseoverMessage = (c) => { this.mouseover_message = c };
    @computed get getMouseoverMessage() { return this.mouseover_message };

    // MOUSEOVER COUNTY NAME
    @observable mouseover_county='Tompkins';
    @action updateMouseoverCounty = (c) => { this.mouseover_county = c };
    @computed get getMouseoverCounty() { return this.mouseover_county };

    // MOUSEOVER STATE NAME
    @observable mouseover_state_abbr='NY';
    @action updateMouseoverStateAbbr = (s) => { this.mouseover_state_abbr = s };
    @computed get getMouseoverStateAbbr() { return this.mouseover_state_abbr };

    // MOUSEOVER STATE NAME
    @observable mouseover_rate_of_change=null;
    @action updateMouseoverRateOfChange = (r) => { this.mouseover_rate_of_change = r };
    @computed get getMouseoverRateOfChange() { return this.mouseover_rate_of_change };

    @action changeMouseoverCountyAndState = (id,c,s) => {
            let rateOfChange = this.findTrendForFips(id)
            this.updateMouseoverRateOfChange(rateOfChange);
            this.updateMouseoverCounty(c);
            this.updateMouseoverStateAbbr(s);
        }

    @action changeCountyAndState = (c,s) => {
            this.updateCounty(c);
            this.updateStateAbbr(s);
        }

    getUnitSuffix = () => {
        // suffix for values in tooltip
        let unitSuffix = {}
        unitSuffix['seasonLength'] = ' days'
        unitSuffix['gddGrowingSeason'] = ' GDDs'
        unitSuffix['avgtGrowingSeason'] = '°F'
        unitSuffix['maxtGrowingSeason'] = '°F'
        unitSuffix['mintGrowingSeason'] = '°F'
        unitSuffix['daysAboveTemp'] = ' days'
        unitSuffix['pcpnGrowingSeason'] = ' inches'
        unitSuffix['daysAbovePcpn'] = ' days'
        return unitSuffix[this.getDisplaySeries]
    }

    @action countyOnEachFeature = (feature, layer) => {
            layer.on({
                mouseover: () => {
                        let signRateOfChange
                        this.changeMouseoverCountyAndState(feature.properties.id,feature.properties.name,feature.properties.state);
                        signRateOfChange = (this.getMouseoverRateOfChange>0) ? '+' : ''
                        this.updateMouseoverMessage(
                                signRateOfChange + (this.getMouseoverRateOfChange*10.).toFixed(2) + this.getUnitSuffix() + '/Decade '+
                                '@ ' + this.getMouseoverCounty + ' Co, ' + this.getMouseoverStateAbbr
                            );
                        layer.setStyle(this.countyMouseoverStyle);
                    },
                mouseout: () => {
                        this.updateMouseoverMessage('Hover over county & click to select');
                        this.changeMouseoverCountyAndState(this.getCountyFips,this.getCounty,this.getStateAbbr);
                        layer.setStyle(this.countyMouseoutStyle);
                    },
                click: () => {
                        // reset mouseover style and message, ready for next time we view maps
                        layer.setStyle(this.countyMouseoverStyle);
                        this.updateMouseoverMessage('Hover over county & click to select');
                        this.updateCountyFips(feature.properties.id);
                        this.changeCountyAndState(feature.properties.name,feature.properties.state);
                        // download data for this county
                        this.loadAnnualData_1951_2023(this.getCountyFips);
                        this.loadObservationsSeasonLength(this.getCountyFips)
                        this.loadProjections(this.getCountyFips)
                        // close map and display chart
                        this.updateProjectionView_manual(false);
                        this.updateMapActiveStatus(false);
                        this.updateChartStatus(true);
                    },
            });
        }

    // -----------------------------------------------------------------------------------
    // API -------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------

    @observable chart_data = null;
    @action updateChartData = (d) => {
            if (this.getChartData) { this.chart_data = null }
            this.chart_data = d;
        }
    @action initChartData = () => {
            let data = {}
            data['years'] = []
            data['seasonLength'] = []
            data['gddGrowingSeason'] = []
            data['avgtGrowingSeason'] = []
            data['maxtGrowingSeason'] = []
            data['mintGrowingSeason'] = []
            data['daysAboveTemp'] = []
            data['pcpnGrowingSeason'] = []
            data['daysAbovePcpn'] = []
            this.chart_data = data;
        }
    @computed get getChartData() {
            return this.chart_data
        }

    // store downloaded projection data
    @observable chart_projection_min_data = null;
    @action updateChartProjectionMinData = (d) => {
            if (this.getChartProjectionMinData) { this.chart_projection_min_data = null }
            this.chart_projection_min_data = d;
        }
    @computed get getChartProjectionMinData() {
            return this.chart_projection_min_data
        }

    // store downloaded projection data
    @observable chart_projection_data = null;
    @action updateChartProjectionData = (d) => {
            if (this.getChartProjectionData) { this.chart_projection_data = null }
            this.chart_projection_data = d;
        }
    @computed get getChartProjectionData() {
            return this.chart_projection_data
        }

  @action loadAnnualData_1951_2023 = (id) => {

    if (this.getLoaderData === false) { this.updateLoaderData(true); }

    // FOR ANNUAL REQUESTS
    const params = {
      "county":id,
    //   "grid": "livneh",
    //   "sdate": "1950",
    //   "edate": "2013",
      "grid": "ncei-clim",
      "sdate": "1951",
      "edate": "2023",
      "elems": [
        { "name":"gdd","base":this.getGddBase,"interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" },
        { "name":"maxt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
        { "name":"mint","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
        { "name":"maxt","interval":[1],"duration":1,"reduce":"cnt_gt_"+this.getTempThreshold,"area_reduce":"county_mean" },
        { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" },
        { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_"+this.getPrecipThreshold,"area_reduce":"county_mean" },
        { "name":"avgt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
      ]
    };

    return axios
      .post("https://grid2.rcc-acis.org/GridData", params)
      .then(res => {
        let data = {}
        data['years'] = []
        //data['seasonLength'] = []
        data['gddGrowingSeason'] = []
        data['avgtGrowingSeason'] = []
        data['maxtGrowingSeason'] = []
        data['mintGrowingSeason'] = []
        data['daysAboveTemp'] = []
        data['pcpnGrowingSeason'] = []
        data['daysAbovePcpn'] = []
        for (var i=0; i<res.data.data.length; i++) {
            data['years'].push(res.data.data[i][0])
            data['gddGrowingSeason'].push(res.data.data[i][1][params['county']])
            data['maxtGrowingSeason'].push(res.data.data[i][2][params['county']])
            data['mintGrowingSeason'].push(res.data.data[i][3][params['county']])
            data['daysAboveTemp'].push(res.data.data[i][4][params['county']])
            data['pcpnGrowingSeason'].push(res.data.data[i][5][params['county']])
            data['daysAbovePcpn'].push(res.data.data[i][6][params['county']])
            data['avgtGrowingSeason'].push(res.data.data[i][7][params['county']])
        }
        //this.updateChartData(data);
        this.chart_data['years'] = data['years']
        this.chart_data['gddGrowingSeason'] = data['gddGrowingSeason']
        this.chart_data['maxtGrowingSeason'] = data['maxtGrowingSeason']
        this.chart_data['mintGrowingSeason'] = data['mintGrowingSeason']
        this.chart_data['daysAboveTemp'] = data['daysAboveTemp']
        this.chart_data['pcpnGrowingSeason'] = data['pcpnGrowingSeason']
        this.chart_data['daysAbovePcpn'] = data['daysAbovePcpn']
        this.chart_data['avgtGrowingSeason'] = data['avgtGrowingSeason']

        if (this.getLoaderData === true) { this.updateLoaderData(false); }
      })
      .catch(err => {
        console.log("Failed to load ncei-clim data 1951-2023 ", err);
      });
  }

    // store downloaded projection data
    @observable projection_data = null;
    @action updateProjectionData = (d,re,scen) => {
            //this.projection_data[scen][re] = d;
            this.projection_data[scen][re]['years'] = d['years']
            this.projection_data[scen][re]['maxtGrowingSeason'] = d['maxtGrowingSeason']
            this.projection_data[scen][re]['mintGrowingSeason'] = d['mintGrowingSeason']
            this.projection_data[scen][re]['daysAboveTemp'] = d['daysAboveTemp']
            this.projection_data[scen][re]['pcpnGrowingSeason'] = d['pcpnGrowingSeason']
            this.projection_data[scen][re]['daysAbovePcpn'] = d['daysAbovePcpn']
            this.projection_data[scen][re]['avgtGrowingSeason'] = d['avgtGrowingSeason']
        }
    @action emptyProjectionData = (d) => {
            if (this.getProjectionData) { this.projection_data = null }
            let data = {}
            data['years'] = []
            data['seasonLength'] = []
            data['gddGrowingSeason'] = []
            data['maxtGrowingSeason'] = []
            data['mintGrowingSeason'] = []
            data['daysAboveTemp'] = []
            data['pcpnGrowingSeason'] = []
            data['daysAbovePcpn'] = []
            data['avgtGrowingSeason'] = []
            this.projection_data = {
                    'ssp245' : {
                        'mean' : data,
                        'max' : data,
                        'min' : data,
                        },
                    'ssp370' : {
                        'mean' : data,
                        'max' : data,
                        'min' : data,
                        },
                    'ssp585' : {
                        'mean' : data,
                        'max' : data,
                        'min' : data,
                        },
                };
        }
    @computed get getProjectionData() {
            return this.projection_data
        }

    // store downloaded gdd projection data
    @observable gdd_projection_data = null;
    @action updateGddProjectionData = (d) => {
            this.projection_data['ssp585']['mean']['gddGrowingSeason'] = d['wMean_ssp585'];
            this.projection_data['ssp585']['max']['gddGrowingSeason'] = d['allMax_ssp585'];
            this.projection_data['ssp585']['min']['gddGrowingSeason'] = d['allMin_ssp585'];
            this.projection_data['ssp370']['mean']['gddGrowingSeason'] = d['wMean_ssp370'];
            this.projection_data['ssp370']['max']['gddGrowingSeason'] = d['allMax_ssp370'];
            this.projection_data['ssp370']['min']['gddGrowingSeason'] = d['allMin_ssp370'];
            this.projection_data['ssp245']['mean']['gddGrowingSeason'] = d['wMean_ssp245'];
            this.projection_data['ssp245']['max']['gddGrowingSeason'] = d['allMax_ssp245'];
            this.projection_data['ssp245']['min']['gddGrowingSeason'] = d['allMin_ssp245'];
        }
    @action emptyGddProjectionData = () => {
            if (this.getGddProjectionData) {
                this.projection_data['ssp585']['mean']['gddGrowingSeason'] = [];
                this.projection_data['ssp585']['max']['gddGrowingSeason'] = [];
                this.projection_data['ssp585']['min']['gddGrowingSeason'] = [];
                this.projection_data['ssp370']['mean']['gddGrowingSeason'] = [];
                this.projection_data['ssp370']['max']['gddGrowingSeason'] = [];
                this.projection_data['ssp370']['min']['gddGrowingSeason'] = [];
                this.projection_data['ssp245']['mean']['gddGrowingSeason'] = [];
                this.projection_data['ssp245']['max']['gddGrowingSeason'] = [];
                this.projection_data['ssp245']['min']['gddGrowingSeason'] = [];
            }
        }
    @computed get getGddProjectionData() {
            return this.gdd_projection_data
        }

    @action loadProjectionsGdd_1951_2099 = (county_fips,gdd_base) => {
            if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
            fetch(`./data/gdd/${county_fips}/${gdd_base}.zip`)
                .then(res => res.blob())
                .then(blob => JSZip.loadAsync(blob))
                .then(zip => zip.file(`${gdd_base}.json`).async("text"))
                .then(strContents => JSON.parse(strContents))
                .then(data => {
                    console.log('DOWNLOADED GDD PROJECTIONS COMPLETE');
                    this.updateGddProjectionData(data);
                    if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
                });

            // OLD VERSION: Retained in case of new version (above) failure
            // if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
            // const url = 'http://tools.climatesmartfarming.org/changetool/data-change?fips='+county_fips+'&gdd_base='+gdd_base
            // jsonp(url, null, (err,data) => {
            //     if (err) {
            //         console.error(err.message);
            //         return
            //     } else {
            //         console.log('DOWNLOADED GDD PROJECTIONS COMPLETE');
            //         this.updateGddProjectionData(data);
            //         if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
            //         return
            //     }
            // });
        }

    // store downloaded season length observation data
    @observable season_length_observation_data = null;
    @action updateSeasonLengthObservationData = (d) => {
            //this.season_length_observation_data = d['obs'];
            this.chart_data['seasonLength'] = d['obs'];
        }
    @computed get getSeasonLengthObservationData() {
            return this.season_length_observation_data
        }

    // store downloaded season length projection data
    @action updateSeasonLengthProjectionData = (d) => {
            this.projection_data['ssp585']['mean']['seasonLength'] = d['wMean_ssp585'];
            this.projection_data['ssp585']['max']['seasonLength'] = d['allMax_ssp585'];
            this.projection_data['ssp585']['min']['seasonLength'] = d['allMin_ssp585'];
            this.projection_data['ssp370']['mean']['seasonLength'] = d['wMean_ssp370'];
            this.projection_data['ssp370']['max']['seasonLength'] = d['allMax_ssp370'];
            this.projection_data['ssp370']['min']['seasonLength'] = d['allMin_ssp370'];
            this.projection_data['ssp245']['mean']['seasonLength'] = d['wMean_ssp245'];
            this.projection_data['ssp245']['max']['seasonLength'] = d['allMax_ssp245'];
            this.projection_data['ssp245']['min']['seasonLength'] = d['allMin_ssp245'];
        }

    @action loadObservationsSeasonLength_1950_2100 = (county_fips,season_threshold) => {
        if (this.getLoaderSeasonLengthData === false) { this.updateLoaderSeasonLengthData(true); }
        fetch(`./data/seasonObs/${county_fips}.zip`)
            .then(res => res.blob())
            .then(blob => JSZip.loadAsync(blob))
            .then(zip => zip.file(`${county_fips}.json`).async("text"))
            .then(strContents => JSON.parse(strContents))
            .then(data => {
                console.log('DOWNLOADED SEASON LENGTH OBSERVATIONS COMPLETE');
                this.updateSeasonLengthObservationData(data['gt' + season_threshold]);
                if (this.getLoaderSeasonLengthData === true) { this.updateLoaderSeasonLengthData(false); }
            });
        
        
            
        // OLD VERSION: Retained in case of new version (above) failure
        // if (this.getLoaderSeasonLengthData === false) { this.updateLoaderSeasonLengthData(true); }
        // const url = 'http://tools.climatesmartfarming.org/changetool/season-length-obs?fips='+county_fips+'&season_threshold='+season_threshold
        // jsonp(url, null, (err,data) => {
        //     if (err) {
        //         console.error(err.message);
        //         return
        //     } else {
        //         console.log('DOWNLOADED SEASON LENGTH OBSERVATIONS COMPLETE');
        //         this.updateSeasonLengthObservationData(data);
        //         if (this.getLoaderSeasonLengthData === true) { this.updateLoaderSeasonLengthData(false); }
        //         return
        //     }
        // });
    }

    @action loadProjectionsSeasonLength_1950_2100 = (county_fips,season_threshold) => {
        if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
        fetch(`./data/seasonProj/${county_fips}.zip`)
            .then(res => res.blob())
            .then(blob => JSZip.loadAsync(blob))
            .then(zip => zip.file(`${county_fips}.json`).async("text"))
            .then(strContents => JSON.parse(strContents))
            .then(data => {
                console.log('DOWNLOADED SEASON LENGTH PROJECTIONS COMPLETE');
                this.updateSeasonLengthProjectionData(data['gt' + season_threshold]);
                if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
            });
        
        
        // OLD VERSION: Retained in case of new version (above) failure
        // if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
        // const url = 'http://tools.climatesmartfarming.org/changetool/season-length-proj?fips='+county_fips+'&season_threshold='+season_threshold
        // jsonp(url, null, (err,data) => {
        //     if (err) {
        //         console.error(err.message);
        //         return
        //     } else {
        //         console.log('DOWNLOADED SEASON LENGTH PROJECTIONS COMPLETE');
        //         this.updateSeasonLengthProjectionData(data);
        //         if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
        //         return
        //     }
        // });
    }

  @action loadProjections_1951_2099 = (id,scen,re) => {

    if (this.getLoaderProjections === false) { this.updateLoaderProjections(true); }
    let varReduce = ''
    if (re==='mean') { varReduce = 'wMean' }
    if (re==='max') { varReduce = 'allMax' }
    if (re==='min') { varReduce = 'allMin' }

    const params = {
      "grid": "loca2:"+varReduce+":"+scen,
      "county":id,
      "sdate": "1951",
      "edate": "2099",
      "elems": [
        { "name":"gdd","base":"50","interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" },
        { "name":"maxt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
        { "name":"mint","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
        { "name":"maxt","interval":[1],"duration":1,"reduce":"cnt_gt_"+this.getTempThreshold,"area_reduce":"county_mean" },
        { "name":"pcpn","interval":[1],"duration":1,"reduce":"sum","area_reduce":"county_mean" },
        { "name":"pcpn","interval":[1],"duration":1,"reduce":"cnt_gt_"+this.getPrecipThreshold,"area_reduce":"county_mean" },
        { "name":"avgt","interval":[1],"duration":1,"reduce":"mean","area_reduce":"county_mean" },
      ]
    };

    return axios
      .post("https://grid2.rcc-acis.org/GridData", params)
      .then(res => {
        console.log('successful download of projection data : ' + scen + ' ' + re + ' 1951-2099');
        let data = {}
        data['years'] = []
        //data['gddGrowingSeason'] = []
        data['maxtGrowingSeason'] = []
        data['mintGrowingSeason'] = []
        data['daysAboveTemp'] = []
        data['pcpnGrowingSeason'] = []
        data['daysAbovePcpn'] = []
        data['avgtGrowingSeason'] = []
        for (var i=0; i<res.data.data.length; i++) {
            data['years'].push(res.data.data[i][0])
            //data['gddGrowingSeason'].push(res.data.data[i][1][params['county']])
            data['maxtGrowingSeason'].push(res.data.data[i][2][params['county']])
            data['mintGrowingSeason'].push(res.data.data[i][3][params['county']])
            data['daysAboveTemp'].push(res.data.data[i][4][params['county']])
            data['pcpnGrowingSeason'].push(res.data.data[i][5][params['county']])
            data['daysAbovePcpn'].push(res.data.data[i][6][params['county']])
            data['avgtGrowingSeason'].push(res.data.data[i][7][params['county']])
        }
        this.updateProjectionData(data,re,scen);
        if (this.getLoaderProjections === true) { this.updateLoaderProjections(false); }
      })
      .catch(err => {
        console.log("Failed to load projection data 1951-2099 ", err);
      });
  }

    @action loadObservationsSeasonLength = (id) => {
        this.loadObservationsSeasonLength_1950_2100(id,this.getSeasonThreshold);
    }

    @action loadProjectionsSeasonLength = (id) => {
        this.loadProjectionsSeasonLength_1950_2100(id,this.getSeasonThreshold);
    }

    @action loadProjectionsGdd = (id) => {
        this.loadProjectionsGdd_1951_2099(id,this.getGddBase);
    }

    @action loadProjections = (id) => {
        //this.emptySeasonLengthProjectionData()
        this.emptyGddProjectionData()
        this.emptyProjectionData()
        this.loadProjectionsSeasonLength_1950_2100(id,this.getSeasonThreshold);
        this.loadProjectionsGdd_1951_2099(id,this.getGddBase);
        this.loadProjections_1951_2099(id,'ssp585','mean');
        this.loadProjections_1951_2099(id,'ssp585','max');
        this.loadProjections_1951_2099(id,'ssp585','min');
        this.loadProjections_1951_2099(id,'ssp370','mean');
        this.loadProjections_1951_2099(id,'ssp370','max');
        this.loadProjections_1951_2099(id,'ssp370','min');
        this.loadProjections_1951_2099(id,'ssp245','mean');
        this.loadProjections_1951_2099(id,'ssp245','max');
        this.loadProjections_1951_2099(id,'ssp245','min');
    }

    constructor() {
        this.changeMouseoverCountyAndState(this.getCountyFips,this.getCounty,this.getStateAbbr);
        this.initChartData()
        this.loadAnnualData_1951_2023(this.getCountyFips)
        this.loadProjections(this.getCountyFips)
    }

}


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

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer } from 'mobx-react';
import Loader from 'react-loader-advanced';
import ReactHighcharts from 'react-highcharts';

import '../../styles/DisplayChart.css';
import '../../styles/loader.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(ReactHighcharts.Highcharts);

const spinner = <div className="loader"></div>

@inject("store") @observer
class DisplayChart extends Component {

  render() {

    function simple_linear_regression (x, y) {
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

        if ( (this.props.store.app.getChartVisibility !== {}) &&
             (this.props.store.app.getChartData)
           ) {

            var data = this.props.store.app.getChartData
            var pdata = this.props.store.app.getProjectionData
            var chartvis = this.props.store.app.getChartVisibility

            let showLoader = (this.props.store.app.getMapActiveStatus) ?
                                 false :
                                 (this.props.store.app.getDisplaySeries==='seasonLength') ?
                                     this.props.store.app.getLoaderSeasonLengthData :
                                     this.props.store.app.getLoaderData

            // labels of emission type, for legend
            let emissionType = {}
            emissionType['ssp585'] = 'very high'
            emissionType['ssp370'] = 'high'
            emissionType['ssp245'] = 'intermediate'

            // labels for y-axis, dependent on variable
            let yAxisLabel = {}
            yAxisLabel['seasonLength'] = 'Number of days'
            yAxisLabel['gddGrowingSeason'] = 'Cumulative GDD, base '+this.props.store.app.getGddBase
            yAxisLabel['avgtGrowingSeason'] = 'Temperature (°F)'
            yAxisLabel['maxtGrowingSeason'] = 'Temperature (°F)'
            yAxisLabel['mintGrowingSeason'] = 'Temperature (°F)'
            yAxisLabel['daysAboveTemp'] = 'Number of days'
            yAxisLabel['pcpnGrowingSeason'] = 'Precipitation (in)'
            yAxisLabel['daysAbovePcpn'] = 'Number of days'

            // Chart title, dependent on variable
            let chartTitle = {}
            chartTitle['seasonLength'] = 'Growing Season Length (consecutive days > '+this.props.store.app.getSeasonThreshold+'°F)'
            chartTitle['gddGrowingSeason'] = 'Annual Growing Degree Day Accumulation (base '+this.props.store.app.getGddBase+'°F)'
            chartTitle['avgtGrowingSeason'] = 'Annual Average Temperature (°F)'
            chartTitle['maxtGrowingSeason'] = 'Annual Average High Temperature (°F)'
            chartTitle['mintGrowingSeason'] = 'Annual Average Low Temperature (°F)'
            chartTitle['daysAboveTemp'] = 'Number of days with high temp > '+this.props.store.app.getTempThreshold+'°F'
            chartTitle['pcpnGrowingSeason'] = 'Total Annual Precipitation (inches) '
            chartTitle['daysAbovePcpn'] = 'Number of days with precipitation > '+this.props.store.app.getPrecipThreshold+'"'

            // suffix for values in tooltip
            let valueSuffix = {}
            valueSuffix['seasonLength'] = ' days'
            valueSuffix['gddGrowingSeason'] = ' GDDs'
            valueSuffix['avgtGrowingSeason'] = '°F'
            valueSuffix['maxtGrowingSeason'] = '°F'
            valueSuffix['mintGrowingSeason'] = '°F'
            valueSuffix['daysAboveTemp'] = ' days'
            valueSuffix['pcpnGrowingSeason'] = '"'
            valueSuffix['daysAbovePcpn'] = ' days'

            let createRanges = (y,a,b) => {
                let ranges = [];
                if (a && b) {
                    for (var i=0; i<y.length; i++) {
                        ranges.push([y[i],a[i],b[i]])
                    };
                }
                return ranges;
            }

            // run linear regression on current variable 1951-2023
            // fit is var that hold fit[0] = slope, and fit[1] = y-intercept
            let fit;
            let fitData_1951_2023=[];
            let xstep=[];
            for (var i=0; i<data[this.props.store.app.getDisplaySeries].length; i++) {
               xstep.push(i);
            }
            fit = simple_linear_regression(xstep,data[this.props.store.app.getDisplaySeries]);
            for (i=0; i<data[this.props.store.app.getDisplaySeries].length; i++) {
                fitData_1951_2023.push( fit[0]*i + fit[1] )
            }
            let rateOfChangePerDecade_1951_2023 = fit[0]*10.

            // run linear regression on current variable 1980-2023
            // fit is var that hold fit[0] = slope, and fit[1] = y-intercept
            let fitData_1980_2023=[];
            xstep=[];
            for (i=0; i<data[this.props.store.app.getDisplaySeries].slice(30).length; i++) {
               xstep.push(i);
            }
            fit = simple_linear_regression(xstep,data[this.props.store.app.getDisplaySeries].slice(30));
            for (i=0; i<data[this.props.store.app.getDisplaySeries].slice(29).length; i++) {
                fitData_1980_2023.push( fit[0]*i + fit[1] )
            }
            let rateOfChangePerDecade_1980_2023 = fit[0]*10.

            function tooltipFormatter() {
                var i, item, precision;
                var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + this.x + '</span>';
                var tips = "";
                precision = (this.points[0].y > 100) ? 0 : 1
                for (i=0; i<this.points.length; i++) {
                    item = this.points[i];

                    if ( item.series.name.includes('Climate model average') ) {
                        tips += '<br/>' + item.y.toFixed(precision) + ': <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                    if ( item.series.name.includes('Climate model range') ) {
                        tips += '<br/>' + item.point.low.toFixed(precision) + '-' + item.point.high.toFixed(precision) +  ': <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                    if (item.series.name.includes('Observed value')) {
                        tips += '<br/>' + item.y.toFixed(precision) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                    if (item.series.name.includes('1951-2023')) {
                        tips += '<br/>' + rateOfChangePerDecade_1951_2023.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                    if (item.series.name.includes('1980-2023')) {
                        tips += '<br/>' + rateOfChangePerDecade_1980_2023.toFixed(1) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    }
                }
                return header + tips;
            }

            const trendDescriptionText = () => {
                let d
                if (this.props.store.app.getTrendStartYear==='1951') {
                    d = (this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips) < 0.10) ?
                        (this.props.store.app.findTrendForFips_1951_2023(this.props.store.app.getCountyFips) > 0) ?
                              "increasing "
                            : "decreasing "
                        : ""
                } else if (this.props.store.app.getTrendStartYear==='1980') {
                    d = (this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips) < 0.10) ?
                        (this.props.store.app.findTrendForFips_1980_2023(this.props.store.app.getCountyFips) > 0) ?
                              "increasing "
                            : "decreasing "
                        : ""
                } else {
                    d = ""
                }
                return d
            }

            const afterRender = (chart) => {
                let series;
                if (this.props.store.app.getProjectionView) {

                    series = chart.get('series3');
                    series.setVisible(true);
                    series = chart.get('series4');
                    series.setVisible(true);

                    // try by showing series
                    // hide trendline on projection view
                    series = chart.get('series1');
                    series.setVisible(false);
                    series = chart.get('series1b');
                    series.setVisible(false);
                } else {
                    series = chart.get('series3');
                    if (series) { series.hide(); }
                    series = chart.get('series4');
                    if (series) { series.hide(); }

                    series = chart.get('series1');
                    series.setVisible(this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips)<0.10);
                    series = chart.get('series1b');
                    series.setVisible(this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips)<0.10);

                }
            };

            var chartConfig = {
                 plotOptions: {
                     line: {
                         animation: false,
                         //animation: !this.props.store.app.isProjectionLoading && this.props.store.app.getProjectionView,
                     },
                     series: {
                         type: 'line',
                         showCheckbox: false,
                         pointStart: parseInt(data.years[0],10),
                         pointInterval: 1,
                         animation: false,
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                             states: {
                                 hover: {
                                     enabled: false
                                 }
                             }
                         },
                         states: {
                             hover: {
                                 enabled: false,
                                 halo: {
                                     size: 0
                                 }
                             }
                         },
                         events: {
                             checkboxClick: function(event) {
                                 if (event.checked) {
                                     this.show();
                                     //this.legendSymbol.show();
                                 } else {
                                     this.hide();
                                     //this.legendSymbol.hide();
                                 }
                             }
                         }
                     }
                 },
                 chart: {
                     animation: false,
                     height: 460, width: 724, marginTop: 60, backgroundColor: null },
                 title: {
                     text: chartTitle[this.props.store.app.getDisplaySeries]
                 },
                 subtitle: {
                     text: '@ ' + this.props.store.app.getCounty + ' County, ' + this.props.store.app.getStateAbbr,
                     style:{"font-size":"14px",color:"#000000"},
                 },
                 exporting: {
                   chartOptions: {
                     chart: {
                       backgroundColor: '#ffffff'
                     }
                   }
                 },
                 credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
                 legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
                 tooltip: { useHtml:true, shared:true, shadow:false, borderWidth:0, backgroundColor:'rgba(255,255,255,1.0)',
                   xDateFormat:"%Y", positioner:function(){return {x:80, y:60}}, shape: 'rect',
                   crosshairs: { width:1, color:"#ff0000", snap:true, zIndex: 0 },
                   formatter: tooltipFormatter
                 },
                 xAxis: { startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     tickInterval: 10,
                     dateTimeLabelFormats:{ year:'%Y' },
                 },
                 yAxis: [{ 
                     min: (pdata && this.props.store.app.getProjectionView) ? Math.min(...pdata['ssp585']['min'][this.props.store.app.getDisplaySeries]) : null,
                     max: (pdata && this.props.store.app.getProjectionView) ? Math.max(...pdata['ssp585']['max'][this.props.store.app.getDisplaySeries]) : null,
                     title:{ text:yAxisLabel[this.props.store.app.getDisplaySeries],
                     style:{"font-size":"14px", color:"#000000"}},
                     gridZIndex:1,
                     labels:{style:{color:"#000000"}}},
                 ],
                 series: [{
                     id: "series0",
                     selected: true,
                     name: "Observed value",
                     data: data[this.props.store.app.getDisplaySeries],
                     visible:chartvis[this.props.store.app.getDisplaySeries],
                     showInLegend:chartvis[this.props.store.app.getDisplaySeries],
                     type: (!this.props.store.app.getDisplaySeries.includes("days") || this.props.store.app.getProjectionView) ? "line" : "column",
                     zIndex: 24,
                     lineWidth: this.props.store.app.getProjectionView ? 0 : 1,
                     color: "#000000",
                     shadow: false,
                     marker: { enabled: true, fillColor: "#000000", lineWidth: 2, lineColor: "#000000", radius:2, symbol:"circle" }
                   }, {
                     id: "series1",
                     selected: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     name: data.years[0]+"-"+data.years[data.years.length-1]+", "+trendDescriptionText()+"trend ("+rateOfChangePerDecade_1951_2023.toFixed(1)+valueSuffix[this.props.store.app.getDisplaySeries]+"/Decade)",
                     data: fitData_1951_2023,
                     visible: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     showInLegend: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     type: "line",
                     zIndex: 24,
                     lineWidth: 4,
                     color: (this.props.store.app.findSigForFips_1951_2023(this.props.store.app.getCountyFips) < 0.10) ? 
                         (this.props.store.app.findTrendForFips_1951_2023(this.props.store.app.getCountyFips) > 0) ? this.props.store.app.getColorPalette()[0] : this.props.store.app.getColorPalette()[6]
                         : "#000000",
                     shadow: false,
                     marker: { enabled: false, fillColor: "#000000", lineWidth: 2, lineColor: "#000000", radius:2, symbol:"circle" },
                     enableMouseTracking: true
                   }, {
                     id: "series1b",
                     selected: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     name: data.years[30]+"-"+data.years[data.years.length-1]+", "+trendDescriptionText()+"trend ("+rateOfChangePerDecade_1980_2023.toFixed(1)+valueSuffix[this.props.store.app.getDisplaySeries]+"/Decade)",
                     data: fitData_1980_2023,
                     pointStart: (data) ? parseInt(data.years[30],10) : null,
                     visible: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     showInLegend: (!this.props.store.app.getProjectionView && this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips) < 0.10) ? true : false,
                     type: "line",
                     zIndex: 24,
                     lineWidth: 4,
                     color: (this.props.store.app.findSigForFips_1980_2023(this.props.store.app.getCountyFips) < 0.10) ?
                         (this.props.store.app.findTrendForFips_1980_2023(this.props.store.app.getCountyFips) > 0) ? this.props.store.app.getColorPalette()[0] : this.props.store.app.getColorPalette()[6]
                         : "#000000",
                     shadow: false,
                     marker: { enabled: false, fillColor: "#000000", lineWidth: 2, lineColor: "#000000", radius:2, symbol:"circle" },
                     enableMouseTracking: true
                   }, {
                     id: "series3",
                     selected: this.props.store.app.getProjectionView,
                     name: "Climate model average ("+emissionType[this.props.store.app.getModelScenario]+" emissions)",
                     data: (pdata) ? pdata[this.props.store.app.getModelScenario]['mean'][this.props.store.app.getDisplaySeries] : [],
                     pointStart: (pdata) ? parseInt(pdata[this.props.store.app.getModelScenario]['mean'].years[0],10) : null,
                     showInLegend: !this.props.store.app.isProjectionLoading && this.props.store.app.getProjectionView,
                     type: "line",
                     zIndex: 24,
                     lineWidth: 1,
                     color: "#006600",
                     shadow: false,
                     marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" }
                   }, {
                     id: "series4",
                     selected: this.props.store.app.getProjectionView,
                     name: "Climate model range ("+emissionType[this.props.store.app.getModelScenario]+" emissions)",
                     data: (pdata) ? createRanges(toJS(pdata)[this.props.store.app.getModelScenario]['min']['years'],toJS(pdata)[this.props.store.app.getModelScenario]['min'][this.props.store.app.getDisplaySeries],toJS(pdata)[this.props.store.app.getModelScenario]['max'][this.props.store.app.getDisplaySeries]): [],
                     pointStart: (pdata) ? parseInt(pdata[this.props.store.app.getModelScenario]['min'].years[0],10) : null,
                     showInLegend: !this.props.store.app.isProjectionLoading && this.props.store.app.getProjectionView,
                     marker : {symbol: 'square', radius: 12 },
                     type: "arearange",
                     linkedTo: ':previous',
                     lineWidth:0,
                     color: 'rgba(0,102,0,0.4)',
                     fillColor: 'rgba(0,102,0,0.4)',
                     fillOpacity: 0.1,
                     zIndex: 0
                   }
                 ]
            };

            return (
                <div className='chart-display-active'>
                  <Loader message={spinner} show={showLoader} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={true}>
                    <div className="chart-display-content">
                      <ReactHighcharts config={ chartConfig } callback={ afterRender } isPureConfig />
                    </div>
                  </Loader>
                </div>
            )

        } else {
            return(false)
        }
  }

};

export default DisplayChart;

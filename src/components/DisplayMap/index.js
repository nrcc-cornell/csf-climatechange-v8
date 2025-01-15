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
import { inject, observer } from "mobx-react";
import Loader from 'react-loader-advanced';

import 'leaflet/dist/leaflet.css';
import Control from 'react-leaflet-control';
//import { Map, GeoJSON, LayersControl, TileLayer } from 'react-leaflet';
import { Map, GeoJSON, TileLayer } from 'react-leaflet';

import '../../styles/DisplayMap.css';
import '../../styles/loader.css';

const mapContainer = 'map-container';
const mapCenter = [42.8, -75.5];
const zoomLevel = 5;
const minZoomLevel = 5;
const maxZoomLevel = 8;
const spinner = <div className="loader"></div>
var app;

@inject("store") @observer
export default class DisplayMap extends Component {

  constructor(props) {
    super(props);
    app = this.props.store.app;
  }

  render() {

            if (app.getMapActiveStatus) {

                // Chart title, dependent on variable
                let mapTitle = {}
                mapTitle['seasonLength'] = 'Growing Season Length (consecutive days > '+this.props.store.app.getSeasonThreshold+'°F)'
                mapTitle['gddGrowingSeason'] = 'Annual Growing Degree Days, base '+this.props.store.app.getGddBase+'°F'
                mapTitle['avgtGrowingSeason'] = 'Annual Average Temperature'
                mapTitle['maxtGrowingSeason'] = 'Annual Average High Temperature'
                mapTitle['mintGrowingSeason'] = 'Annual Average Low Temperature'
                mapTitle['daysAboveTemp'] = 'Number of days w/ high temp > '+this.props.store.app.getTempThreshold+'°F'
                mapTitle['pcpnGrowingSeason'] = 'Total Annual Precipitation'
                mapTitle['daysAbovePcpn'] = 'Number of days w/ precipitation > '+this.props.store.app.getPrecipThreshold+'"'

                // suffix for values in tooltip
                let valueSuffix = {}
                valueSuffix['seasonLength'] = ' days'
                valueSuffix['gddGrowingSeason'] = ' GDDs'
                valueSuffix['avgtGrowingSeason'] = '°F'
                valueSuffix['maxtGrowingSeason'] = '°F'
                valueSuffix['mintGrowingSeason'] = '°F'
                valueSuffix['daysAboveTemp'] = ' days'
                valueSuffix['pcpnGrowingSeason'] = ' inches'
                valueSuffix['daysAbovePcpn'] = ' days'

                let precision = app.getPrecision()

                return (
                  <div className="csftool-display-map">
                    <Loader message={spinner} show={app.getLoaderCountyGeojson} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={false}>
                    <Map
                        center={mapCenter}
                        zoom={zoomLevel}
                        minZoom={minZoomLevel}
                        maxZoom={maxZoomLevel}
                        attributionControl={true}
                        className={mapContainer}
                        style={{ height:460, width:724 }}
                    >
                        <TileLayer
                            attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <GeoJSON
                            data={app.getCountyGeojson}
                            style={app.countyFeatureStyle}
                            onEachFeature={app.countyOnEachFeature}
                        />

                        <Control position="bottomleft">
                            <div className="map-year-range">
                                <button
                                    className={(app.getTrendStartYear==='1951') ? "map-year-range-button-active" : "map-year-range-button-inactive"}
                                    onClick={() => {app.updateTrendStartYear('1951')}}
                                >   
                                    {'1951-2023'}
                                </button> 
                                &nbsp;
                                <button
                                    className={(app.getTrendStartYear==='1980') ? "map-year-range-button-active" : "map-year-range-button-inactive"}
                                    onClick={() => {app.updateTrendStartYear('1980')}}
                                >   
                                    {'1980-2023'}
                                </button> 
                            </div>
                        </Control>

                        <Control position="bottomright">
                            <div className="map-legend">
                                <div className="map-legend-title">{valueSuffix[app.getDisplaySeries]}/Decade</div>
				<div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "green3":"red4")}></div><span className="map-legend-label">{'> '+(app.getLegendThresholds()[5]*10.).toFixed(precision)}</span><br/>
                                <div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "green2":"red3")}></div><span className="map-legend-label">{(app.getLegendThresholds()[4]*10.).toFixed(precision)} - {(app.getLegendThresholds()[5]*10.).toFixed(precision)}</span><br/>
                                <div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "green1":"red2")}></div><span className="map-legend-label">{(app.getLegendThresholds()[3]*10.).toFixed(precision)} - {(app.getLegendThresholds()[4]*10.).toFixed(precision)}</span><br/>
                                <div className="color-box white"></div><span className="map-legend-label">{(0.00).toFixed(precision)}</span><br/>
                                <div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "brown1":"blue2")}></div><span className="map-legend-label">{(app.getLegendThresholds()[1]*10.).toFixed(precision)} - {(app.getLegendThresholds()[2]*10.).toFixed(precision)}</span><br/>
                                <div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "brown2":"blue3")}></div><span className="map-legend-label">{(app.getLegendThresholds()[0]*10.).toFixed(precision)} - {(app.getLegendThresholds()[1]*10.).toFixed(precision)}</span><br/>
                                <div className={"color-box "+ ((app.getDisplaySeries==="pcpnGrowingSeason" || app.getDisplaySeries==="daysAbovePcpn") ? "brown3":"blue4")}></div><span className="map-legend-label">{'< '+(app.getLegendThresholds()[0]*10.).toFixed(precision)}</span><br/>
                            </div>
                        </Control>
                        <Control position="topright">
                            <div className="map-tooltip">
                                <div className="map-tooltip-title">{mapTitle[app.getDisplaySeries]}, {app.getTrendStartYear}-2023 Trend</div>
                                <div className="map-tooltip-content">
                                    {app.getMouseoverMessage}
                                </div>
                            </div>
                        </Control>
                    </Map>
                    </Loader>
                  </div>
                )

            } else {
                return (false)
            }
  }

}


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
import { inject, observer} from 'mobx-react';
import ReactHighcharts from 'react-highcharts';

// Components
import CountyPicker from '../../components/CountyPicker';
import ChartRadioSelect from '../../components/ChartRadioSelect';
import MapRadioSelect from '../../components/MapRadioSelect';
//import ProjectionCheckbox from '../../components/ProjectionCheckbox';
import DisplayButtonGroup from '../../components/DisplayButtonGroup';
import DisplayChart from '../../components/DisplayChart';
import DisplayMap from '../../components/DisplayMap';
import InfoWindow from '../../components/InfoWindow';

// Styles
import '../../styles/App.css';

var HighchartsExporting = require('highcharts-exporting');
HighchartsExporting(ReactHighcharts.Highcharts);

@inject('store') @observer
class App extends Component {

    render() {

        return (
            <div className="App">
                <div className="csftool-input">
                    <CountyPicker />
                    { !this.props.store.app.getMapActiveStatus && (<ChartRadioSelect />)}
                    { this.props.store.app.getMapActiveStatus && (<MapRadioSelect />)}
                    <DisplayButtonGroup />
                </div>
                <div className="csftool-display">
                    <DisplayMap />
                    <DisplayChart />
                    <InfoWindow
                      content={this.props.store.app.info_content}
                      button_label="Back to tool"
                    />
                </div>
                <div className="csftool-location-dialog">
                </div>
            </div>
        );
    }
}

export default App;

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
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import '../../styles/SeasonThresholdSelect.css';

// selectable values: 32, 28, 24 degrees F
const selectValues = ['32','28','24']

var disabled
var selectOptions = []
for(var idx=0; idx<selectValues.length; idx++){
    disabled = false
    selectOptions.push({ value: selectValues[idx].toString(), label: selectValues[idx].toString()+'°F', clearableValue: false, disabled: disabled })
}

@inject("store") @observer
class SeasonThresholdSelect extends Component {

  render() {
        return (
            <div className='season-threshold-div'>
            <div className='season-threshold-select-div'>
                <table><tbody><tr>
                <td>
                Above:
                </td>
                <td>
                <Select
                    name="season_threshold"
                    value={this.props.store.app.getSeasonThreshold}
                    menuStyle={{background:'#4ca20b', borderColor:'#4ca20b' }}
                    clearable={false}
                    options={selectOptions}
                    onChange={this.props.store.app.updateSeasonThreshold}
                />
                </td>
                </tr></tbody></table>
            </div>
            </div>
        )
  }

};

export default SeasonThresholdSelect;


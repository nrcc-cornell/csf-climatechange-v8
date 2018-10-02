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

import '../../styles/TempThresholdSelect.css';

// selectable values: 80 - 105 degrees F
//const selectValues = Array.from(new Array(71), (x,i) => i + 70)
const selectValues = ['80','85','90','95','100','105']

var disabled
var selectOptions = []
for(var idx=0; idx<selectValues.length; idx++){
    disabled = false
    selectOptions.push({ value: selectValues[idx].toString(), label: selectValues[idx].toString()+'°F', clearableValue: false, disabled: disabled })
}

@inject("store") @observer
class TempThresholdSelect extends Component {

  render() {
        return (
            <div className='temp-threshold-div'>
            <div className='temp-threshold-select-div'>
                <table><tbody><tr>
                <td>
                Days >
                </td>
                <td>
                <Select
                    name="temp_threshold"
                    value={this.props.store.app.getTempThreshold}
                    menuStyle={{background:'#4ca20b', borderColor:'#4ca20b' }}
                    clearable={false}
                    options={selectOptions}
                    onChange={this.props.store.app.updateTempThreshold}
                />
                </td>
                </tr></tbody></table>
            </div>
            </div>
        )
  }

};

export default TempThresholdSelect;


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

import '../../styles/PrecipThresholdSelect.css';

// selectable values: 1-4 inches
//const selectValues = ['4','3','2','1']
const selectValues = ['2','1']

var disabled
var selectOptions = []
for(var idx=0; idx<selectValues.length; idx++){
    disabled = false
    selectOptions.push({ value: selectValues[idx].toString(), label: selectValues[idx].toString()+' in', clearableValue: false, disabled: disabled })
}

@inject("store") @observer
class PrecipThresholdSelect extends Component {

  render() {
        return (
            <div className='precip-threshold-div'>
            <div className='precip-threshold-select-div'>
                <table><tbody><tr>
                <td>
                Days >
                </td>
                <td>
                <Select
                    name="precip_threshold"
                    value={this.props.store.app.getPrecipThreshold}
                    menuStyle={{background:'#4ca20b', borderColor:'#4ca20b' }}
                    clearable={false}
                    options={selectOptions}
                    onChange={this.props.store.app.updatePrecipThreshold}
                />
                </td>
                </tr></tbody></table>
            </div>
            </div>
        )
  }

};

export default PrecipThresholdSelect;


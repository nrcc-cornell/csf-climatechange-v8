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

import '../../styles/GddBaseSelect.css';

// selectable values: 32 - 50 degrees F
//const selectValues = Array.from(new Array(19), (x,i) => i + 32)
const selectValues = [50,42,41,40,32]

var disabled
var selectOptions = []
for(var idx=0; idx<selectValues.length; idx++){
    disabled = false
    selectOptions.push({ value: selectValues[idx].toString(), label: selectValues[idx].toString()+'°F', clearableValue: false, disabled: disabled })
}
// include 86/50 method
//selectOptions.push({ value: '86/50', label: '86/50', clearableValue: false, disabled: disabled })

@inject("store") @observer
class GddBaseSelect extends Component {

  render() {
        return (
            <div className='base-div'>
            <div className='select-div'>
                <table><tbody><tr>
                <td>
                Base:
                </td>
                <td>
                <Select
                    name="gdd_base"
                    value={this.props.store.app.getGddBase}
                    menuStyle={{background:'#4ca20b', borderColor:'#4ca20b' }}
                    clearable={false}
                    options={selectOptions}
                    onChange={this.props.store.app.updateGddBase}
                />
                </td>
                </tr></tbody></table>
            </div>
            </div>
        )
  }

};

export default GddBaseSelect;


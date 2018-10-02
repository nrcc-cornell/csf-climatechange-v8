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
import Icon from 'react-icons-kit';
import { arrowLeft } from 'react-icons-kit/fa/arrowLeft';

import '../../styles/CountyPicker.css';

@inject("store") @observer
class CountyPicker extends Component {


  render() {
      let buttonLabel = "Back to map"
      if (!this.props.store.app.getMapActiveStatus) {

        return (
            <div className="location-input-div">
              <div className="location-input-label">
                  <label><b>Current Location</b></label>
              </div>
              <div className="location-text">
                <span className="address-text">{this.props.store.app.getCounty} Co, {this.props.store.app.getStateAbbr}</span>
              </div>
              <div className="location-button">
                  <button
                      className="return-to-map-button"
                      onClick={() => {
                          this.props.store.app.updateChartStatus(false);
                          this.props.store.app.updateMapActiveStatus(true);
                          if (this.props.store.app.popupStatus) { this.props.store.app.updatePopupStatus(); };
                        }
                      }
                  >
                      <Icon size={14} icon={arrowLeft} className="location-icon" />
                      {buttonLabel}
                  </button>
              </div>
            </div>
        )

      } else {

        return (
            <div className="location-input-div">
              <div className="location-input-label">
                  <label><b>Current Location</b></label>
              </div>
              <div className="location-text">
                <span className="no-county-selected-text">Click map to select county</span>
              </div>
            </div>
        )

      }

    }

};

export default CountyPicker;

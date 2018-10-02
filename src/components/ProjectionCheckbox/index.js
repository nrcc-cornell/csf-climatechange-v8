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
import Loader from 'react-loader-advanced';

import '../../styles/ProjectionCheckbox.css';

@inject("store") @observer
class ProjectionCheckbox extends Component {

  render() {
        return (
            <div className='checkbox-input-div'>
            <Loader message={'Loading Projections...'} messageStyle={{color:'#ff0000', fontWeight:'bold'}} show={this.props.store.app.isProjectionLoading} priority={10} backgroundStyle={{backgroundColor: null}} hideContentOnLoad={true}>
            <div className='checkbox-div'>
                <form>
                  <div className="checkbox">
                    <label className="label-for-check">
                      <input
                          type="checkbox"
                          value={this.props.store.app.getProjectionView}
                          disabled={this.props.store.app.isProjectionLoading}
                          checked={this.props.store.app.getProjectionView} 
                          onChange={this.props.store.app.updateProjectionView}
                      />
                      Future Projections
                    </label>
                  </div>
                </form>
              <div className={(this.props.store.app.getProjectionView) ? "projection-type-select" : "hide-projection-type-select"}>
              <div className='projection-radio-input-div'>
              <div className='projection-radio-div'>
                <form>
                  <div className="radio">
                    <label>
                      <input type="radio" value="rcp85"
                          checked={this.props.store.app.getModelScenario === "rcp85"}
                          onChange={this.props.store.app.updateModelScenario} />
                      <span>high emissions</span>
                    </label>
                  </div>
                  <div className="radio">
                    <label>
                      <input type="radio" value="rcp45"
                          checked={this.props.store.app.getModelScenario === "rcp45"}
                          onChange={this.props.store.app.updateModelScenario} />
                      <span>low emissions</span>
                    </label>
                  </div>
                </form>
              </div>
              </div>
              </div>
            </div>
            </Loader>
            </div>
        )
  }

};

export default ProjectionCheckbox;

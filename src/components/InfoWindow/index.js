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
import { string, any } from 'prop-types'
import Icon from 'react-icons-kit';
import { close } from 'react-icons-kit/fa/close';

import '../../styles/InfoWindow.css';

@inject("store") @observer
class InfoWindow extends Component {

  static propTypes = {
    content: any,
    button_label: string,
  }

  static defaultProps = {
    content: <h2>Popup Content</h2>,
    button_label: "Back",
  }

  render() {
    const className = this.props.store.app.popupStatus ? 'data-sources' : 'data-sources-display-none';
    return (
        <div className={className}>
           <div className="close-info-button">
               <Icon icon={close} size={20} className="close-icon" onClick={this.props.store.app.updatePopupStatus}/>
           </div>
           <div className="data-sources-content">
               {this.props.content}
           </div>
        </div>
    );
  }

}

export default InfoWindow;

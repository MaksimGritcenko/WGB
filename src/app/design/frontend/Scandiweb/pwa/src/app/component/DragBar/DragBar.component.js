/* eslint-disable no-else-return */
/**
 * ScandiPWA - Progressive Web App for Magento
 *
 * Copyright © Scandiweb, Inc. All rights reserved.
 * See LICENSE for license details.
 *
 * @license OSL-3.0 (Open Software License ("OSL") v. 3.0)
 * @package scandipwa/base-theme
 * @link https://github.com/scandipwa/base-theme
 */

import { Component } from 'react';
import Draggable from 'Component/Draggable';
import CSS from 'Util/CSS/CSS';

import './DragBar.style';

class DragBar extends Component {
    state = {
        areDetailsOpen: false
    };

    constructor(props) {
        super(props);

        this.touchActionEnabled = false;
        this.animatedTransitionOnce = false;

        this.dragBarRef = React.createRef();
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    onDrag({ translateY }) {
        const { areDetailsOpen } = this.state;

        if (!areDetailsOpen && translateY < 0) {
            CSS.setVariable(this.dragBarRef, 'draggable-y', `${translateY}px`);
        } else if (areDetailsOpen && this.dragBarRef.current.scrollTop === 0 && translateY > 0) {
            if (!this.animatedTransitionOnce) {
                this._animateAutoMove();
                this.animatedTransitionOnce = true;
            }

            CSS.setVariable(this.dragBarRef, 'overflow', 'hidden');
            CSS.setVariable(this.dragBarRef, 'draggable-y', `calc(-100% + ${180 + translateY}px)`);
        }
    }

    closeDetails(cb) {
        cb({
            originalY: 0,
            lastTranslateY: 0
        });

        this.setState({
            ...this.state,
            areDetailsOpen: false
        })

        this._animateAutoMove();
        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '500ms');
        CSS.setVariable(this.dragBarRef, 'draggable-y', '0');
    }

    openDetails(cb) {
        cb({
            originalY: 0,
            lastTranslateY: this._getScreenSizeWithAdjustment()
        });

        this.setState({
            ...this.state,
            areDetailsOpen: true
        })

        this._animateAutoMove();
        CSS.setVariable(this.dragBarRef, 'overflow', 'scroll');
        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '0');
        CSS.setVariable(this.dragBarRef, 'draggable-y', 'calc(-100% + 110px)');
    }
    
    onDragEnd(state, callback) {
        const { translateY } = state;
        const { areDetailsOpen } = this.state;
        this.animatedTransitionOnce = false;

        if (!areDetailsOpen) {
            if (translateY > -150) {
                // details are close and drag is higher than -150px => we close it back
                this.closeDetails(callback);
            } else {
                // details are closed, but drag is lower than -150px => we open it completely
                this.openDetails(callback);
            }
        } else if (translateY > 50 && this.dragBarRef.current.scrollTop === 0) {
            // details are open and drag is higher than 150px => we close it
            this.closeDetails(callback);
        } else {
            // details are open and drag is lower than 150px => we open it back
            this.openDetails(callback);
        }
    }

    _getScreenSizeWithAdjustment() {
        return document.getElementsByTagName('main')[0].clientHeight;
    }

    _animateAutoMove() {
        CSS.setVariable(this.dragBarRef, 'animation-speed', '150ms');
        setTimeout(() => CSS.setVariable(this.dragBarRef, 'animation-speed', '0'), 150);
    }

    render() {
        const { children } = this.props;
        const touchActionEnabled = this.state;

        return (
            <article block="DragBar">
                <Draggable
                  onDrag={ this.onDrag }
                  onDragEnd={ this.onDragEnd }
                  draggableRef={ this.dragBarRef }
                  mix={ {
                      block: 'DragBar',
                      elem: 'Draggable',
                      mods: touchActionEnabled
                  } }
                >
                    { children }
                </Draggable>
            </article>
        );
    }
}

export default DragBar;

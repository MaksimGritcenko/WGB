/* eslint-disable no-magic-numbers */
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

import PropTypes from 'prop-types';
import { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Draggable from 'Component/Draggable';
import CSS from 'Util/CSS/CSS';
import { changeNavigationState, goToPreviousNavigationState } from 'Store/Navigation';
import { TOP_NAVIGATION_TYPE } from 'Store/Navigation/Navigation.reducer';
import { DRAGBAR_OPEN } from 'Component/Header/Header.component';

import './DragBar.style';

export const mapDispatchToProps = dispatch => ({
    changeHeaderState: state => dispatch(changeNavigationState(TOP_NAVIGATION_TYPE, state)),
    goToPreviousHeaderState: () => dispatch(goToPreviousNavigationState(TOP_NAVIGATION_TYPE))
});

export class DragBar extends Component {
    static propTypes = {
        location: PropTypes.object.isRequired,
        changeHeaderState: PropTypes.func.isRequired,
        goToPreviousHeaderState: PropTypes.func.isRequired,
        children: PropTypes.array.isRequired
    };

    state = {
        areDetailsOpen: false
    };

    constructor(props) {
        super(props);

        this.touchActionEnabled = false;
        this.animatedTransitionOnce = false;

        this.dragBarRef = createRef();
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.areDetailsOpen) {
            // eslint-disable-next-line react/destructuring-assignment
            if (prevProps.location.pathname !== this.props.location.pathname) {
                this.closeDetails(true);
            }
        }
    }

    onDrag({ translateY }) {
        const { areDetailsOpen } = this.state;

        if (!areDetailsOpen && translateY < 0) {
            CSS.setVariable(this.dragBarRef, 'draggable-y', `${translateY}px`);
        } else if (areDetailsOpen && this.dragBarRef.current.scrollTop === 0 && translateY > 0) {
            CSS.setVariable(this.dragBarRef, 'overflow', 'hidden');
            CSS.setVariable(this.dragBarRef, 'draggable-y', `calc(-100% + ${110 + translateY}px)`);
        }
    }

    onDragEnd(state, callback) {
        const { translateY } = state;
        const { areDetailsOpen } = this.state;
        this.animatedTransitionOnce = false;
        this.cb = callback;

        if (!areDetailsOpen) {
            if (translateY > -150) {
                // details are close and drag is higher than -150px => we close it back
                this.closeDetails();
            } else {
                // details are closed, but drag is lower than -150px => we open it completely
                this.openDetails();
            }
        } else if (translateY > 50 && this.dragBarRef.current.scrollTop === 0) {
            // details are open and drag is higher than 150px => we close it
            this.closeDetails(true);
        } else {
            // details are open and drag is lower than 150px => we open it back
            this.openDetails();
        }
    }

    openDetails() {
        const { changeHeaderState } = this.props;

        this.cb({
            originalY: 0,
            lastTranslateY: this._getScreenSizeWithAdjustment()
        });

        this.setState(() => ({ areDetailsOpen: true }));

        this._animateAutoMove();
        CSS.setVariable(this.dragBarRef, 'overflow', 'scroll');
        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '0');
        CSS.setVariable(this.dragBarRef, 'draggable-y', 'calc(-100% + 110px)');

        changeHeaderState({ name: DRAGBAR_OPEN, onCloseClick: () => this.closeDetails() });
    }

    closeDetails(isManualChange = false) { // is manual && is changed
        const { goToPreviousHeaderState } = this.props;

        this.cb({
            originalY: 0,
            lastTranslateY: 0
        });

        this.setState(() => ({ areDetailsOpen: false }));

        this._animateAutoMove();
        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '500ms');
        CSS.setVariable(this.dragBarRef, 'overflow', 'visible');
        CSS.setVariable(this.dragBarRef, 'draggable-y', '0');

        if (isManualChange) {
            goToPreviousHeaderState();
        }
    }

    _getScreenSizeWithAdjustment() {
        return document.getElementsByTagName('main')[0].clientHeight;
    }

    _animateAutoMove() {
        CSS.setVariable(this.dragBarRef, 'animation-speed', '150ms');
        this.timedOutAnimation = setTimeout(() => CSS.setVariable(this.dragBarRef, 'animation-speed', '0'), 150);
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

export const DragBarWrapper = connect(null, mapDispatchToProps)(DragBar);
export default withRouter(DragBarWrapper);

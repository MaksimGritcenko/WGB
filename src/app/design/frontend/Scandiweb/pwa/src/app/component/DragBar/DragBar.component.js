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

const DRAGBAR_OPEN_OFFSET = -150;
const DRAGBAR_CLOSE_OFFSET = 50;

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

    componentDidMount() {
        document.addEventListener('openDragbar', () => this.openDetails());
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.areDetailsOpen) {
            // eslint-disable-next-line react/destructuring-assignment
            if (prevProps.location.pathname !== this.props.location.pathname) {
                setTimeout(() => {
                    this.closeDetails(true);
                }, 0);
            }
        }
    }

    componentWillUnmount() {
        document.removeEventListener('openDragbar');
    }

    onDrag({ translateY }) {
        const { areDetailsOpen } = this.state;

        if (!areDetailsOpen && translateY < 0) {
            setTimeout(() => {
                CSS.setVariable(this.dragBarRef, 'draggable-y', `${translateY}px`);
            }, 0);
        } else if (areDetailsOpen && this.dragBarRef.current.scrollTop <= 0 && translateY > 0) {
            setTimeout(() => {
                CSS.setVariable(this.dragBarRef, 'overflow', 'hidden');
                CSS.setVariable(
                    this.dragBarRef,
                    'draggable-y',
                    `calc(-100% + ${110 + translateY}px)`
                );
            }, 0);
        }
    }

    onDragEnd(state) {
        const { translateY } = state;
        const { areDetailsOpen } = this.state;
        this.animatedTransitionOnce = false;

        if (!areDetailsOpen) { // details are closed
            if (translateY > DRAGBAR_OPEN_OFFSET) {
                // drag is higher than x => we close it back
                setTimeout(() => {
                    this.closeDetails();
                }, 0);
            } else {
                // drag is lower than x => we open it completely
                setTimeout(() => {
                    this.openDetails();
                }, 0);
            }
        } else if (translateY > DRAGBAR_CLOSE_OFFSET && this.dragBarRef.current.scrollTop <= 0) {
            // details are open and drag is higher than 150px => we close it
            setTimeout(() => {
                this.closeDetails(true);
            }, 0);
        } else {
            // details are open and drag is lower than 150px => we open it back
            setTimeout(() => {
                this.openDetails();
            }, 0);
        }
    }

    openDetails() {
        const { changeHeaderState } = this.props;

        this.setState(() => ({ areDetailsOpen: true }));

        this._animateAutoMove();
        CSS.setVariable(this.dragBarRef, 'overflow', 'scroll');
        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '0');
        setTimeout(() => {
            CSS.setVariable(this.dragBarRef, 'draggable-y', 'calc(-100% + 110px)');
        }, 0);

        changeHeaderState({ name: DRAGBAR_OPEN, onCloseClick: () => this.closeDetails() });
    }

    closeDetails(isManualChange = false) { // is manual && is changed
        const { goToPreviousHeaderState } = this.props;

        this.setState(() => ({ areDetailsOpen: false }));

        CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '500ms');
        CSS.setVariable(this.dragBarRef, 'overflow', 'visible');

        setTimeout(() => {
            this._animateAutoMove();
            CSS.setVariable(this.dragBarRef, 'draggable-y', '0');
        }, 0);

        if (isManualChange) {
            goToPreviousHeaderState();
        }
    }

    _getScreenSizeWithAdjustment() {
        return document.getElementsByTagName('main')[0].clientHeight;
    }

    _animateAutoMove() {
        CSS.setVariable(this.dragBarRef, 'animation-speed', '150ms');
        setTimeout(
            () => CSS.setVariable(this.dragBarRef, 'animation-speed', 'var(--initial-animation-speed)'),
            150
        );
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

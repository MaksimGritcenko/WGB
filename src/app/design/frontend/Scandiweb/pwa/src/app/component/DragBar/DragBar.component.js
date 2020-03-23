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
    constructor(props) {
        super(props);

        this.areDetailsOpen = false;
        this.animatedTransitionOnce = false;

        this.dragBarRef = React.createRef();
        this.onDragEnd = this.onDragEnd.bind(this);
        this.onDrag = this.onDrag.bind(this);
    }

    onDrag({ translateY }) {
        if (!this.areDetailsOpen && translateY < 0) {
            CSS.setVariable(this.dragBarRef, 'draggable-y', `${translateY}px`);
        } else if (this.areDetailsOpen && this.dragBarRef.current.scrollTop === 0 && translateY > 0) {
            if (!this.animatedTransitionOnce) {
                this._animateAutoMove();
                this.animatedTransitionOnce = true;
            }

            CSS.setVariable(this.dragBarRef, 'overflow', 'hidden');
            CSS.setVariable(this.dragBarRef, 'draggable-y', `calc(-100% + ${180 + translateY}px)`);
        }
    }

    onDragEnd(state, callback) {
        const { translateY } = state;

        this.animatedTransitionOnce = false;

        if (!this.areDetailsOpen) {
            if (translateY > -150) {
                // details are close and drag is higher than -150px => we close it back
                callback({
                    originalY: 0,
                    lastTranslateY: 0
                });

                this._animateAutoMove();
                CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '500ms');
                CSS.setVariable(this.dragBarRef, 'draggable-y', '0');
            } else {
                // details are closed, but drag is lower than -150px => we open it completely
                callback({
                    originalY: 0,
                    lastTranslateY: this._getScreenSizeWithAdjustment()
                });

                this.areDetailsOpen = true;

                this._animateAutoMove();
                CSS.setVariable(this.dragBarRef, 'overflow', 'scroll');
                CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '0');
                CSS.setVariable(this.dragBarRef, 'draggable-y', 'calc(-100% + 180px)');
            }
        } else if (translateY > 50 && this.dragBarRef.current.scrollTop === 0) {
            // details are open and drag is higher than 150px => we close it
            callback({
                originalY: 0,
                lastTranslateY: 0
            });

            this.areDetailsOpen = false;

            this._animateAutoMove();
            CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '500ms');
            CSS.setVariable(this.dragBarRef, 'draggable-y', '0');
        } else {
            // details are open and drag is lower than 150px => we open it back
            callback({
                originalY: 0,
                lastTranslateY: this._getScreenSizeWithAdjustment()
            });

            this._animateAutoMove();
            CSS.setVariable(this.dragBarRef, 'overflow', 'scroll');
            CSS.setVariable(this.dragBarRef, 'open-bounce-speed', '0');
            CSS.setVariable(this.dragBarRef, 'draggable-y', 'calc(-100% + 180px)');
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
        return (
            <article block="DragBar">
                <Draggable
                  onDrag={ this.onDrag }
                  onDragEnd={ this.onDragEnd }
                  draggableRef={ this.dragBarRef }
                  mix={ {
                      block: 'DragBar',
                      elem: 'Draggable'
                  } }
                >
                    <header block="DragBar" elem="Header">
                        <h1 block="DragBar" elem="Heading">TEXTURED WEAVE BERMUDA SHORTS</h1>
                        <span aria-label="Product price" block="DragBar" elem="Price">29.95 EUR</span>
                        <button block="DragBar" elem="CTA" onClick={ () => alert('added to cart') }>Add to cart</button>
                    </header>
                    <div block="DragBar" elem="Details">
                        <p>We are wrapping the children with a simple Div (styled-components) that gets from the state the x and y translation. We are also passing an indication for dragging and adding a mouse event that will let us do the magic.</p>
                        <p>We are wrapping the children with a simple Div (styled-components) that gets from the state the x and y translation. We are also passing an indication for dragging and adding a mouse event that will let us do the magic.</p>
                        <p>We are wrapping the children with a simple Div (styled-components) that gets from the state the x and y translation. We are also passing an indication for dragging and adding a mouse event that will let us do the magic.</p>
                        <p>We are wrapping the children with a simple Div (styled-components) that gets from the state the x and y translation. We are also passing an indication for dragging and adding a mouse event that will let us do the magic.</p>
                        <p>We are wrapping the children with a simple Div (styled-components) that gets from the state the x and y translation. We are also passing an indication for dragging and adding a mouse event that will let us do the magic.</p>
                    </div>
                </Draggable>
            </article>
        );
    }
}

export default DragBar;

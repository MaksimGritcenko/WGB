import SourceDraggable from 'SourceComponent/Draggable/Draggable.component';
import isMobile from 'Util/Mobile';

class Draggable extends SourceDraggable {
    handleMouseDown = (event) => {
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        if (!isMobile.any()) {
            event.preventDefault();
        }
        this._handleDragStart(event);
    };
}

export default Draggable;
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';

import DnDType from 'constants/dndType';

const memberTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }

    const { data: dragItem, index: dragIndex } = monitor.getItem();
    const { data: hoverItem, index: hoverIndex } = props;

    if (dragItem.id === hoverItem.id || !monitor.canDrop()) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientX = clientOffset.x - hoverBoundingRect.left;

    // Dragging left/right
    if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
    if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

    props.moveDnD(dragIndex, hoverIndex);

    // Prevents trashing
    monitor.getItem().index = hoverIndex;
  },
  canDrop(props) {
    return !props.data.isEmpty;
  }
};

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

const withDropTarget = DropTarget(
  DnDType.teamMember,
  memberTarget,
  collectTarget
);
export default withDropTarget;

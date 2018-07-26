import { DragSource } from 'react-dnd';

import DnDType from 'constants/dnd-type';

const memberSource = {
  beginDrag(props) {
    return { ...props };
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

const withDragSource = DragSource(
  DnDType.teamMember,
  memberSource,
  collectSource
);
export default withDragSource;

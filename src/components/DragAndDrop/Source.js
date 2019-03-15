import { DragSource } from 'react-dnd';

import DnDType from 'constants/dndType';

const memberSource = {
  beginDrag(props) {
    return { ...props };
  },
  canDrag(props) {
    return !props.data.isEmpty;
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

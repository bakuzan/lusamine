/* eslint-disable react/prop-types */
import React, { useRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { useDrag, useDrop } from 'react-dnd';

import DnDType from 'constants/dndType';
import isTouchDevice from './supportsTouch';
import { hover } from './useDropUtils';

export function getBackend() {
  if (isTouchDevice()) {
    return TouchBackend;
  } else {
    return HTML5Backend;
  }
}

export function withDragAndDropHooks(WrappedComponent) {
  return function DragAndDropWrapper(props) {
    const draggableItemData = {
      index: props.index,
      data: props.data,
      moveDnD: props.moveDnD
    };

    const ref = useRef(null);
    const [dropProps, drop] = useDrop(
      () => ({
        accept: DnDType.teamMember,
        hover: (itemHolding, monitor) =>
          hover(monitor, itemHolding, draggableItemData, ref),
        canDrop(item) {
          return !item.data.isEmpty;
        },
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
          handlerId: monitor.getHandlerId()
        })
      }),
      [draggableItemData]
    );

    const [dragProps, drag, _dragPreview] = useDrag(
      () => ({
        type: DnDType.teamMember,
        item: draggableItemData,
        canDrag() {
          return !draggableItemData.isEmpty;
        },
        collect: (monitor) => ({
          isDragging: !!monitor.isDragging()
        })
      }),
      [draggableItemData]
    );

    drag(drop(ref));

    return (
      <WrappedComponent {...props} {...dragProps} {...dropProps} ref={ref} />
    );
  };
}

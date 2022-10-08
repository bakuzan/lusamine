export function hover(monitor, heldItem, hoveredItem, hoveredRef) {
  if (!hoveredRef.current) {
    return;
  }

  const { data: dragItem, index: dragIndex } = heldItem;
  const { data: hoverItem, index: hoverIndex } = hoveredItem;

  if (
    dragItem.id === hoverItem.id ||
    dragIndex === hoverIndex ||
    !monitor.canDrop()
  ) {
    return;
  }

  const hoverBoundingRect = hoveredRef.current.getBoundingClientRect();
  const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
  const clientOffset = monitor.getClientOffset();
  const hoverClientX = clientOffset.x - hoverBoundingRect.left;

  // Dragging right
  if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    return;
  }

  // Dragging left
  if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    return;
  }

  // Perform the move if all conditions pass
  heldItem.moveDnD(dragIndex, hoverIndex);

  // Prevents thrashing
  heldItem.index = hoverIndex;
}

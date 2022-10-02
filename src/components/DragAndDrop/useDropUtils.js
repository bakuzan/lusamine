export function hover(monitor, heldItem, hoveredItem, hoveredRef) {
  if (!hoveredRef.current) {
    return;
  }

  const { data: dragItem, index: dragIndex } = heldItem;
  const { data: hoverItem, index: hoverIndex } = hoveredItem;
  console.log(`HAS ELEMENT > `, { dragItem, dragIndex, hoverIndex, hoverItem });
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
  console.log(`CAN DO > `, {
    dragIndex,
    hoverIndex,
    hoverClientX,
    hoverMiddleX
  });

  // Dragging right
  if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
    return;
  }

  // Dragging left
  if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
    return;
  }
  console.log(`MOVE > `, dragIndex, hoverIndex);
  heldItem.moveDnD(dragIndex, hoverIndex);

  // Prevents thrashing
  heldItem.index = hoverIndex;
}

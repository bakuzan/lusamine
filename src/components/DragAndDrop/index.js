import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import withDropTarget from './Target';
import withDragSource from './Source';

export default DragDropContext(HTML5Backend);

export function withDragAndDrop(WrappedComponent) {
  class DragAndDropWrapper extends React.Component {
    render() {
      const { connectDropTarget, connectDragSource, ...props } = this.props;

      return (
        <WrappedComponent
          {...props}
          ref={(instance) => {
            const element = findDOMNode(instance);
            connectDragSource(element);
            connectDropTarget(element);
          }}
        />
      );
    }
  }

  return withDragSource(withDropTarget(DragAndDropWrapper));
}

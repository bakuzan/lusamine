import React from 'react';
import { findDOMNode } from 'react-dom';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

import withDropTarget from './Target';
import withDragSource from './Source';
import isTouchDevice from './supportsTouch';

export function getBackend() {
  if (isTouchDevice()) {
    return TouchBackend;
  } else {
    return HTML5Backend;
  }
}

export function withDragAndDrop(WrappedComponent, PlaceholderComponent) {
  class DragAndDropWrapper extends React.Component {
    render() {
      const {
        connectDropTarget,
        connectDragSource,
        connectDragPreview,
        ...props
      } = this.props;

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

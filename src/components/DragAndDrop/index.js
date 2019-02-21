import React from 'react';
import { findDOMNode } from 'react-dom';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { default as TouchBackend } from 'react-dnd-touch-backend';

import withDropTarget from './Target';
import withDragSource from './Source';
import isTouchDevice from './supportsTouch';

const HTML5DND = DragDropContext(HTML5Backend);
const TouchDND = DragDropContext(TouchBackend);

export default function DnDBackend(WrappedComponent) {
  class HTML5DragDrop extends React.Component {
    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  if (isTouchDevice()) {
    return TouchDND(HTML5DragDrop);
  } else {
    return HTML5DND(HTML5DragDrop);
  }
}

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

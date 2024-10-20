'use client'

import { useMemo, Context } from "react";
import { UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from "@dnd-kit/sortable";
import { RowContextProps } from "@/utilities/interfaces/drag/row";

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': UniqueIdentifier;
	rowcontext: Context<RowContextProps>;
}

const DragRow: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners],
  );

  return (
    <props.rowcontext.Provider value={contextValue}>
      <div {...props} ref={setNodeRef} style={style} {...attributes} />
    </props.rowcontext.Provider>
  );
};

export default DragRow;
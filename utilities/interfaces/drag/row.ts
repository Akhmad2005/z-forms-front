import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";

export interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}
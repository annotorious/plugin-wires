import { useMemo } from 'react';
import { ImageAnnotation, useSelection } from '@annotorious/react';
import { ConnectionAnnotation, isConnectionAnnotation, Point } from '@annotorious/plugin-wires';
import { useWiresPlugin } from './useWiresPlugin';

export interface WireSelection {

  annotation?: ConnectionAnnotation;

  editable?: boolean;

  midpoint?: Point;

  event?: Event;

}

export const useWireSelection = () => {

  const plugin = useWiresPlugin();

  const selection = useSelection<ImageAnnotation | ConnectionAnnotation>();

  const connectionSelection: WireSelection = useMemo(() => {
    if (!plugin) return {};

    const { selected, event } = selection;
    
    const selectedConnections = selected.filter(({ annotation }) => isConnectionAnnotation(annotation));
    if (selectedConnections.length > 0) {
      const { annotation, editable } = selectedConnections[0];
      
      const midpoint = plugin.getMidpoint(annotation.id);

      return { annotation: annotation as ConnectionAnnotation, midpoint, editable, event };
    } else {
      return {};
    }
  }, [selection, plugin]);

  return connectionSelection;

}
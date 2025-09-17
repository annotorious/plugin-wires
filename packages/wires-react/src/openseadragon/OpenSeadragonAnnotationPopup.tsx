import { useMemo, type ReactNode } from 'react';
import type { FloatingArrowProps, Placement } from '@floating-ui/react';
import { useSelection, OpenSeadragonAnnotationPopup as WrappedPopup } from '@annotorious/react';
import type { PopupProps } from '@annotorious/react';
import { isConnectionAnnotation } from '@annotorious/plugin-wires';

interface OpenSeadragonAnnotationPopupProps {

  arrow?: boolean;

  arrowProps?: Omit<FloatingArrowProps, 'context' | 'ref'> & { padding?: number };

  placement?: Placement;

  popup: (props: PopupProps) => ReactNode;

}

export const OpenSeadragonAnnotationPopup = (props: OpenSeadragonAnnotationPopupProps) => {
  
  const { selected } = useSelection();

  const isOpen = useMemo(() => {
    if (selected.length === 0) return false;

    const annotation = selected[0].annotation;
    if (annotation)
      return !isConnectionAnnotation(annotation);
    else 
      return false;
  }, [selected.map(s => s.annotation.id).join(':')]);

  return isOpen ? (
    <WrappedPopup {...props} />
  ) : null;

}
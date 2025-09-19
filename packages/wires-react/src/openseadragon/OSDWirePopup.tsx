import { ReactNode, useEffect, useRef, useState } from 'react';
import OpenSeadragon from 'openseadragon';
import { AnnotoriousOpenSeadragonAnnotator, useAnnotator, useViewer } from '@annotorious/react';
import { useWireSelection, usePopupCallbacks } from '../hooks';
import { WirePopupProps } from '../WirePopupProps';
import {
  useFloating,
  arrow,
  shift,
  inline,
  autoUpdate,
  flip,
  offset,
  FloatingArrow,
  FloatingArrowProps
} from '@floating-ui/react';

interface OSDWirePopupProps {

  arrow?: boolean;

  arrowProps?: Omit<FloatingArrowProps, 'context' | 'ref'> & { padding?: number };

  popup(props: WirePopupProps): ReactNode;

}

export const OSDWirePopup = (props: OSDWirePopupProps) => {

  const anno = useAnnotator<AnnotoriousOpenSeadragonAnnotator>();

  const [isOpen, setIsOpen] = useState(false);

  const viewer = useViewer();

  const arrowRef = useRef(null);

  const { annotation, midpoint } = useWireSelection();

  const { onCreateBody, onDeleteBody, onUpdateBody } = usePopupCallbacks(annotation);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    middleware: [
      inline(), 
      offset(10),
      flip({ crossAxis: true }),
      shift({ 
        crossAxis: true,
        boundary: viewer?.element,
        padding: { right: 5, left: 5, top: 10, bottom: 10 }
      }),
      arrow({
        element: arrowRef,
        padding: props.arrowProps?.padding ||  5
      })
    ],
    whileElementsMounted: autoUpdate
  });

  useEffect(() => {
    if (annotation) {  
      const setPosition = () => { 
        const { left, top } = viewer.element.getBoundingClientRect();

        const pt = viewer.viewport.imageToViewerElementCoordinates(new OpenSeadragon.Point(midpoint.x, midpoint.y));

        const x = pt.x + left;
        const y = pt.y + top;

        const rect = {
          x,
          y,
          width: 0,
          height: 0,
          top: y,
          right: x,
          bottom: y,
          left: x
        }
        
        refs.setReference({
          getBoundingClientRect: () => rect,
          getClientRects: () => [rect]
        });
      }

      window.addEventListener('scroll', setPosition, true);
      window.addEventListener('resize', setPosition);
      viewer.addHandler('update-viewport', setPosition);

      setPosition();

      setIsOpen(true);

      return () => {
        window.removeEventListener('scroll', setPosition, true);
        window.removeEventListener('resize', setPosition);
        viewer.removeHandler('update-viewport', setPosition);
      };
    } else {
      setIsOpen(false);
    }
  }, [anno, annotation, midpoint, viewer]);

  return isOpen && annotation && (
    <div 
      className="a9s-wire-popup a9s-openseadragon-wire-popup"
      ref={refs.setFloating}
      style={floatingStyles}>

      {props.arrow && (
        <FloatingArrow 
          ref={arrowRef} 
          context={context} />
      )}

      {props.popup({
        annotation,
        onCreateBody,
        onDeleteBody,
        onUpdateBody
      })}
    </div>
  )

}
import { AnnotationBody } from '@annotorious/react';
import { ConnectionAnnotation } from '@annotorious/plugin-wires';

export interface WiresPopupProps {

  annotation: ConnectionAnnotation;

  onCreateBody(body: Partial<AnnotationBody>): void;

  onDeleteBody(id: string): void;

  onUpdateBody(current: Partial<AnnotationBody>, next: Partial<AnnotationBody>): void;
}
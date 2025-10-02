export * from './components';
export * from './hooks';
export * from './openseadragon';
export * from './WirePopupProps';
export * from './WiresPlugin';
export * from './WiresPluginProvider';

// Re-publish the stylesheet
import '@annotorious/plugin-wires/annotorious-wires.css';

// Essential re-rexports from base package
export type {
  ConnectionAnnotation,
  ConnectionAnnotationTarget,
  Point,
  W3CRelationLinkAnnotation,
  W3CRelationMetaAnnotation,
  Wire,
  WiresVisibility
} from '@annotorious/plugin-wires';

export {
  isConnectionAnnotation,
  isW3CRelationLinkAnnotation,
  isW3CRelationMetaAnnotation,
  W3CImageRelationFormat
} from '@annotorious/plugin-wires';
import type { ImageAnnotation } from '@annotorious/annotorious';
import type { Point } from './Point';

export type Direction = 'N' | 'E' | 'S' | 'W';

export interface FloatingWireHandle {

  point: Point;

}

export interface PinnedWireHandle extends FloatingWireHandle {

  annotation: ImageAnnotation;

  direction: Direction;

}

export type WireHandle = FloatingWireHandle | PinnedWireHandle;
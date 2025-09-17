import type { WireHandle, PinnedWireHandle } from './WireHandle';

export interface Wire {

  start: PinnedWireHandle;

  layout: string;

  end: WireHandle;

}
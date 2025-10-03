import type { ConnectionAnnotation } from './model';

export type WiresVisibility = 'ALWAYS' | 'HOVER_ONLY' | 'SELECTED_ONLY' | 'HOVER_OR_SELECT';

export interface WiresPluginOpts {

  label?: string | ((c: ConnectionAnnotation) => string | undefined);

  showWires?: WiresVisibility;

}
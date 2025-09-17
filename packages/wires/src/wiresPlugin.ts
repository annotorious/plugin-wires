import type { ImageAnnotation, ImageAnnotator, ImageAnnotatorState } from '@annotorious/annotorious';
import type { Point } from './model';
import { WiresLayer } from './components/WiresLayer';
import { createConnectionGraph } from './state';

export interface WiresPluginInstance {

  getMidpoint(id: string): Point | undefined;

  setEnabled(enabled: boolean): void;

  unmount(): void;

}

export const mountPlugin = (anno: ImageAnnotator<ImageAnnotation>): WiresPluginInstance => {

  let isEnabled = false;

  const graph = createConnectionGraph(anno.state.store);

  const connectorLayer = new WiresLayer({
    target: anno.element,
    props: {
      enabled: isEnabled,
      graph,
      state: anno.state as ImageAnnotatorState<ImageAnnotation>
    }
  });

  /** API **/

  const getMidpoint = (id: string) =>
    connectorLayer.getMidpoint(id);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ enabled: isEnabled });
  }

  const unmount = () => {
    graph.destroy();
  }

  return { 
    getMidpoint,
    setEnabled,
    unmount
  }

}
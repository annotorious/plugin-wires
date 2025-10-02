import type OpenSeadragon from 'openseadragon';
import type { ImageAnnotation, ImageAnnotator, ImageAnnotatorState } from '@annotorious/annotorious';
import { UserSelectAction } from '@annotorious/openseadragon';
import type { WiresPluginInstance } from './wiresPlugin';
import { OSDWiresLayer } from './components/OSDWiresLayer';
import { createConnectionGraph } from './state';
import type { WiresPluginOpts, WiresVisibility } from './WiresPluginOpts';

export const mountOSDPlugin = (
  anno: ImageAnnotator<ImageAnnotation>, 
  viewer: OpenSeadragon.Viewer,
  opts: WiresPluginOpts = {}
): WiresPluginInstance  => {

  const graph = createConnectionGraph(anno.state.store);

  let isEnabled = false;

  let connectorLayer: OSDWiresLayer

  // Note that Annotorious OSD may take longer to initialize than the
  // plugin! Ensure that everything is properly set up before we init the
  // wires layer, because it will attach listeners to the annotation layer!
  const mountOSDWiresLayer = (retries = 10) => {
    const isReady = Boolean(viewer.element?.querySelector('.a9s-gl-canvas'));
    if (isReady) {
      connectorLayer = new OSDWiresLayer({
        target: viewer.element.querySelector('.openseadragon-canvas')!,
        props: {
          opts,
          enabled: isEnabled,
          graph,
          state: anno.state as ImageAnnotatorState<ImageAnnotation>,
          viewer
        }
      })
    } else if (retries > 0) {
      setTimeout(() => mountOSDWiresLayer(retries - 1), 100)
    } else {
      throw new Error('Failed to initialize Annotorious Wires plugin: no annotation layer')
    }
  }

  /** API **/

  const getMidpoint = (id: string) =>
    connectorLayer.getMidpoint(id);

  const setEnabled = (enabled: boolean) => {
    isEnabled = enabled;
    connectorLayer.$set({ enabled: isEnabled });

    // TODO this should actually revert to the last
    // action set by the host application. (But how?)
    if (enabled) {
      anno.cancelSelected();
      anno.setUserSelectAction(UserSelectAction.SELECT);
    } else {
      anno.setUserSelectAction(UserSelectAction.EDIT);
    }
  }

  const setVisibility = (visibility?: WiresVisibility) => {
    connectorLayer.$set({ opts: { ...opts, showWires: visibility }});
  }

  const unmount = () => {
    graph.destroy();
  }

  return { 
    getMidpoint,
    setEnabled,
    setVisibility,
    unmount
  }

}
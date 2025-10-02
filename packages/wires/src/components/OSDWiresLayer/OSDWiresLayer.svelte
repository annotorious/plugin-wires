<script lang="ts">
  import OpenSeadragon from 'openseadragon';
  import type { ImageAnnotatorState } from '@annotorious/annotorious';
  import type { ImageAnnotation } from '@annotorious/openseadragon';
  import { WiresLayer } from '../WiresLayer';
  import OSDSVGLayer from './OSDSVGLayer.svelte';
  import type { Point } from '../../model';
  import type { ConnectionGraph } from '../../state';
  import type { WiresPluginOpts } from '../../WiresPluginOpts';

  /** Props **/
  export let opts: WiresPluginOpts;
  export let enabled: boolean;
  export let graph: ConnectionGraph;
  export let state: ImageAnnotatorState<ImageAnnotation>;
  export let viewer: OpenSeadragon.Viewer;

  let connectorLayer: WiresLayer;

  export const getMidpoint = (id: string) => connectorLayer.getMidpoint(id);

  const pointerTransform = (point: Point): Point => {
    const {x, y} = viewer.viewport.viewerElementToImageCoordinates(new OpenSeadragon.Point(point.x, point.y));
    return { x, y };
  }
</script>

<OSDSVGLayer 
  viewer={viewer} 
  let:transform 
  let:scale>

  <WiresLayer 
    bind:this={connectorLayer}
    opts={opts}
    enabled={enabled}
    graph={graph}
    scale={scale}
    state={state} 
    layerTransform={transform} 
    pointerTransform={pointerTransform}
    on:create />
</OSDSVGLayer>
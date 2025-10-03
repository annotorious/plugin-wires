<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { Annotation, ImageAnnotation, ImageAnnotatorState, StoreChangeEvent } from '@annotorious/annotorious';
  import { getWire } from '../../layout';
  import { isConnectionAnnotation } from '../../model';
  import type { ConnectionAnnotation, PinnedWireHandle, Point, Wire, WireHandle } from '../../model';
  import type { ConnectionGraph } from '../../state';
  import type { WiresPluginOpts } from '../../WiresPluginOpts';
  import { Emphasis } from './emphasis';
  import WireView from './Wire.svelte';
  import RubberbandConnector from './RubberbandWire.svelte';

  const dispatch = createEventDispatcher<{ create: ConnectionAnnotation }>();

  /** Props */
  export let opts: WiresPluginOpts;
  export let enabled: boolean;
  export let graph: ConnectionGraph;
  export let layerTransform: string | undefined = undefined;
  export let pointerTransform: ((point: Point) => Point) | undefined = undefined;
  export let scale = 1;
  export let state: ImageAnnotatorState<ImageAnnotation | ConnectionAnnotation>;

  let source: ImageAnnotation | undefined;

  let hovered: ImageAnnotation | undefined;

  let connections: ConnectionAnnotation[] = [];

  let wireRefs: { [key: string]: WireView } = {};

  let floatingWire: Wire | undefined;

  $: if (!enabled) source = undefined;

  $: if (!source) floatingWire = undefined;

  let svgEl: SVGSVGElement;

  const { selection, store } = state;

  export const getMidpoint = (id: string) => {
    const component = wireRefs[id];
    if (component)
      return component.getMidpoint();
  }

  const isPinned = (handle?: WireHandle): handle is PinnedWireHandle => 
    handle !== undefined && 'direction' in handle;

  const onPointerDown = (evt: PointerEvent) => {
    if (!enabled) return;

    selection.clear();

    if (!source && hovered) {
      source = hovered;
    } else if (isPinned(floatingWire?.end)) {
      evt.preventDefault();
      evt.stopPropagation();

      const from = floatingWire.start.annotation.id;
      const to = floatingWire.end.annotation.id;

      const id = uuidv4();

      const annotation: ConnectionAnnotation = {
        id,
        motivation: 'linking',
        bodies: [],
        target: {
          annotation: id,
          selector: { from, to }
        }
      }

      store.addAnnotation(annotation);

      source = undefined;

      dispatch('create', annotation);

      selection.setSelected(annotation.id);
    } else if (source) {
      source = undefined;
    }
  }

  const onPointerMove = (evt: PointerEvent) => {
    const pt: Point = pointerTransform 
        ? pointerTransform({ x: evt.offsetX, y: evt.offsetY })
        : getSVGPoint(evt, svgEl);

    hovered = store.getAt(pt.x, pt.y) as ImageAnnotation;

    if (enabled && source) {
      // Source defined - pick target
      if (hovered && !graph.isConnected(source.id, hovered.id)) {
        // A target shape that's not yet connected - pin the
        // connection and hover emphasise the target shape
        floatingWire = getWire(source, hovered);
      } else {
        // No hovered shape, or already connected
        floatingWire = getWire(source, { point: pt });
        hovered = undefined;
      }
    }
  }

  onMount(() => {
    const annotationLayer = 
      svgEl.parentElement?.querySelector('.a9s-gl-canvas') as HTMLElement ||
      svgEl.parentElement?.querySelector('.a9s-annotationlayer') as HTMLElement;

    if (!annotationLayer)
      throw new Error('No Annotorious annotation layer found');
    
    annotationLayer.addEventListener('pointermove', onPointerMove);
    annotationLayer.addEventListener('pointerdown', onPointerDown);

    const onChange = (event: StoreChangeEvent<Annotation>) => {
      const { created, deleted } = event.changes;

      const addedConnections = 
        (created || []).filter(isConnectionAnnotation);

      const deletedIds =
        new Set((deleted || []).filter(isConnectionAnnotation).map(c => c.id));

      connections = [...connections, ...addedConnections].filter(c => !deletedIds.has(c.id));
    }

    store.observe(onChange);

    return () => {
      annotationLayer.removeEventListener('pointermove', onPointerMove);
      annotationLayer.removeEventListener('pointerdown', onPointerDown);

      store.unobserve(onChange);
    }
  });

  // Shorthand
  $: isSelected = (id: string) => $selection.selected.some(s => s.id === id);

  // Test if this annotation should be shown with wires attached
  $: getVisibleConnections = () => {
    if ((opts.showWires || 'ALWAYS') === 'ALWAYS') {
      return connections;
    } else {
      const selectedIds = $selection.selected.map(s => s.id);

      const activeIds: string[] = 
        opts.showWires === 'HOVER_ONLY' ? (hovered ? [hovered.id] : []) :
        opts.showWires === 'SELECTED_ONLY' ? selectedIds :
        [...selectedIds, hovered?.id!].filter(Boolean);

      return connections.filter(c => {
        const { from, to } = c.target.selector;
        return activeIds.includes(from) || activeIds.includes(to) || activeIds.includes(c.id);
      });
    }
  }
</script>

<svg 
  bind:this={svgEl}
  class="a9s-wires-layer"
  class:hover={hovered}>
  <g class="a9s-wires-layer" transform={layerTransform}>
    <g class="a9s-wire-emphasis">
      {#if enabled}
        {#if source}
          <Emphasis annotation={source} />
        {/if}

        {#if hovered && hovered !== source}
          <Emphasis annotation={hovered} />
        {/if}
      {/if}

      {#if floatingWire?.end && 'annotation' in floatingWire.end}
        <Emphasis annotation={floatingWire.end.annotation} />
      {/if}
    </g>

    <g class="a9s-wires">
      {#each getVisibleConnections() as connection}
        <WireView
          bind:this={wireRefs[connection.id]}
          annotation={connection}
          opts={opts}
          scale={scale}
          state={state} 
          isSelected={isSelected(connection.id)}/>
      {/each}
    </g>

    {#if floatingWire}
      <g class="a9s-floating">
        <RubberbandConnector 
          wire={floatingWire} 
          scale={scale} />
      </g>
    {/if}
  </g>
</svg>

<style>
  svg {
    height: 100%;
    left: 0px;
    pointer-events: none;
    position: absolute;
    top: 0px;
    width: 100%;
  }

  svg.hover {
    cursor: pointer;
  }
</style>

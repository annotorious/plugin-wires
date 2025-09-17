<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { v4 as uuidv4 } from 'uuid';
  import { getSVGPoint } from '@annotorious/annotorious';
  import type { Annotation, ImageAnnotation, ImageAnnotatorState, StoreChangeEvent } from '@annotorious/annotorious';
  import { getWire } from '../../layout';
  import { isConnectionAnnotation } from '../../model';
  import type { ConnectionAnnotation, PinnedWireHandle, Point, Wire, WireHandle } from '../../model';
  import type { ConnectionGraph } from '../../state';
  import { Emphasis } from './emphasis';
  import Connector from './Wire.svelte';
  import RubberbandConnector from './RubberbandWire.svelte';

  const dispatch = createEventDispatcher<{ create: ConnectionAnnotation }>();

  /** Props */
  export let enabled: boolean;
  export let graph: ConnectionGraph;
  export let layerTransform: string | undefined = undefined;
  export let pointerTransform: ((point: Point) => Point) | undefined = undefined;
  export let scale = 1;
  export let state: ImageAnnotatorState<ImageAnnotation>;

  let source: ImageAnnotation | undefined;

  let hovered: ImageAnnotation | undefined;

  let connections: ConnectionAnnotation[] = [];

  let connectionRefs: { [key: string]: Connector } = {};

  let floatingWire: Wire | undefined;

  $: if (!enabled) source = undefined;

  $: if (!source) floatingWire = undefined;

  let svgEl: SVGSVGElement;

  const { selection, store } = state;

  export const getMidpoint = (id: string) => {
    const component = connectionRefs[id];
    if (component)
      return component.getMidpoint();
  }

  const isPinned = (handle?: WireHandle): handle is PinnedWireHandle => 
    handle !== undefined && 'direction' in handle;

  const onPointerDown = (evt: PointerEvent) => {
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

      // @ts-ignore
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

    const h = store.getAt(pt.x, pt.y);

    if (source) {
      // Source defined - pick target
      if (h && !graph.isConnected(source.id, h.id)) {
        // A target shape that's not yet connected - pin the
        // connection and hover emphasise the target shape
        floatingWire = getWire(source, h);
        hovered = h;
      } else {
        // No hovered shape, or already connected
        floatingWire = getWire(source, { point: pt });
        hovered = undefined;
      }
    } else {
      // No source shape - hover the current, if any
      hovered = h;
    }
  }

  onMount(() => {
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
      store.unobserve(onChange);
    }
  });

  // Shorthand
  $: isSelected = (id: string) => $selection.selected.some(s => s.id === id);
</script>

<svg 
  bind:this={svgEl}
  class="a9s-connector-layer"
  class:enabled={enabled}
  class:hover={hovered}
  on:pointermove={onPointerMove}
  on:pointerdown={onPointerDown}>
  <g class="a9s-connectors-layer" transform={layerTransform}>
    <g class="a9s-connectors-shape-emphasis">
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

    <g class="a9s-connectors">
      {#each connections as connection}
        <Connector
          bind:this={connectionRefs[connection.id]}
          annotation={connection}
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
    position: absolute;
    top: 0px;
    pointer-events: none;
    width: 100%;
  }

  svg.enabled {
    pointer-events: all;
  }

  svg.hover {
    cursor: pointer;
  }
</style>

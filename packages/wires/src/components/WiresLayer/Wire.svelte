<script lang="ts">
  import { onMount } from 'svelte';
  import type { ImageAnnotation, ImageAnnotatorState } from '@annotorious/annotorious';
  import { computePath, getWire } from '../../layout';
  import type { ConnectionAnnotation, Wire } from '../../model';
  import type { WiresPluginOpts } from '../../WiresPluginOpts';
  import WireLabel from './WireLabel.svelte';

  /** Props */
  export let opts: WiresPluginOpts;
  export let annotation: ConnectionAnnotation;
  export let state: ImageAnnotatorState<ImageAnnotation | ConnectionAnnotation>;
  export let isSelected: boolean;
  export let scale: number;

  $: console.log('annotation', annotation);
  
  export const getMidpoint = () => midPoint ? { x: midPoint.x, y: midPoint.y } : undefined;

  let pathElement: SVGPathElement;

  const { selection, store } = state;

  $: r = 5 / scale;
  
  $: connection = computeConnection(annotation);

  $: midPoint = connection && computeMidPoint(pathElement, connection);

  $: label = getLabel(annotation, opts.label);

  const getLabel = (a: ConnectionAnnotation, label?: string | ((c: ConnectionAnnotation) => string | undefined)): string | undefined => {
    if (!label)
      return;
    else if (typeof label === 'string')
      return label;
    else
      return label(a);
  }

  const computeConnection = (annotation: ConnectionAnnotation) => {
    const from = store.getAnnotation(annotation.target.selector.from);
    const to = store.getAnnotation(annotation.target.selector.to);

    // Note that annotations might have been deleted meanwhile!
    if (from && to) 
      return getWire(
        store.getAnnotation(annotation.target.selector.from) as ImageAnnotation, 
        store.getAnnotation(annotation.target.selector.to) as ImageAnnotation);
  }

  const computeMidPoint = (el: SVGPathElement, wire: Wire) => {
    if (el && wire) {
      const length = el.getTotalLength();
      return el.getPointAtLength(length / 2);
    }
  }

  const onPointerDown = (evt: PointerEvent) => {
    // Stop the event, so the underlying annotation canvas
    // doesn't register an empty click, and de-selects.
    evt.stopImmediatePropagation();
    evt.preventDefault();

    selection.userSelect(annotation.id, evt);
  }

  onMount(() => {
    const onChange = () => connection = computeConnection(annotation);

    // Observe changes to start- and end-annotation
    const { from , to } = annotation.target.selector;
    store.observe(onChange, { annotations: [from, to]});

    return () => {
      store.unobserve(onChange);
    }
  });
</script>

<g 
  class="a9s-wire"
  class:selected={isSelected}>
  {#if connection}
    {@const path = computePath(connection, 10)}

    <path 
      bind:this={pathElement}
      class="a9s-wire-path-buffer"

      d={path.d} 
      on:pointerdown={onPointerDown} />

    <path class="a9s-wire-path-outer" d={path.d} />  
    <path class="a9s-wire-path-inner" d={path.d} />

    <circle class="a9s-wire-handle-outer" cx={path.start.x} cy={path.start.y} r={r} />
    <circle class="a9s-wire-handle-inner" cx={path.start.x} cy={path.start.y} r={r} />

    <circle class="a9s-wire-handle-outer" cx={path.end.x} cy={path.end.y} r={r} />
    <circle class="a9s-wire-handle-inner" cx={path.end.x} cy={path.end.y} r={r} />

    {#if (label && midPoint)}
      <WireLabel 
        label={label} 
        center={midPoint}
        scale={scale} />
    {/if}
  {/if}
</g>

<style>
  .a9s-wire path {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  path.a9s-wire-path-buffer {
    cursor: pointer;
    pointer-events: all;
    stroke: rgba(255, 255, 255, 0);
    stroke-width: 8px;
    transition: stroke 125ms ease-in-out;
  }

  .selected path.a9s-wire-path-buffer {
    stroke: rgba(255, 255, 255, 0.5);
  }

  path.a9s-wire-path-buffer:hover:not(.selected) {
    stroke: rgba(255, 255, 255, 0.25);
  }

  path.a9s-wire-path-outer {
    pointer-events: none;
    stroke: #00000040;
    stroke-width: 3.5px;
  }

  path.a9s-wire-path-inner {
    pointer-events: none;
    stroke: #fff;
    stroke-width: 1.5px;
    stroke-dasharray: 3 3;
  }

  circle.a9s-wire-handle-outer {
    fill: #00000040;
    stroke: #00000040;
    stroke-width: 3;
    vector-effect: non-scaling-stroke;
  }

  circle.a9s-wire-handle-inner {
    fill: #000;
    stroke: #fff;
    stroke-width: 1.5;
    vector-effect: non-scaling-stroke;
  }
</style>
<script lang="ts">
  import { computePath } from '../../layout';
  import type { Wire } from 'src/model/Wire';

  export let wire: Wire;
  export let scale = 1;

  $: r = 5 / scale;

  $: path = computePath(wire, 10);
</script>

<g class="a9s-wire a9s-rw">
  {#if path}
    <path class="a9s-rw-path-outer" d={path.d} />  
    <path class="a9s-rw-path-inner" d={path.d} />

    <circle class="a9s-rw-handle-outer" cx={path.start.x} cy={path.start.y} r={r} />
    <circle class="a9s-rw-handle-inner" cx={path.start.x} cy={path.start.y} r={r} />

    <circle class="a9s-rw-handle-outer" cx={path.end.x} cy={path.end.y} r={r} />
    <circle class="a9s-rw-handle-inner" cx={path.end.x} cy={path.end.y} r={r} />
  {/if}
</g>

<style>
  .a9s-rw path {
    fill: transparent;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }

  path.a9s-rw-path-outer {
    stroke: #ffffff40;
    stroke-width: 2.5px;
  }

  path.a9s-rw-path-inner {
    stroke: #cc23cc;
    stroke-width: 2.5px;
    stroke-dasharray: 3 3;
  }

  circle.a9s-rw-handle-outer {
    fill: #ffffff40;
    stroke: #ffffff40;
    stroke-width: 3;
    vector-effect: non-scaling-stroke;
  }

  circle.a9s-rw-handle-inner {
    fill: #fff;
    stroke: #cc23cc;
    stroke-width: 2;
    vector-effect: non-scaling-stroke;
  }
</style>
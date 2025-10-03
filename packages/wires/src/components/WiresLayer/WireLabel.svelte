<script lang="ts">
  const H_PADDING = 4;
  const V_PADDING = 2;
  const BORDER_RADIUS = 3;

  export let label: string;
  export let center: DOMPoint; 
  export let scale = 1;

  let textEl: SVGTextElement | undefined;
  
  $: bbox = textEl?.getBBox();
</script>

<g class="a9s-wire-label" transform="translate({center.x}, {center.y}) scale({1 / scale})">
  {#if bbox}
    <rect
      class="a9s-wire-label-bg"
      x={- bbox.width / 2 - H_PADDING}
      y={- bbox.height / 2 - V_PADDING}
      width={bbox.width + H_PADDING * 2}
      height={bbox.height + V_PADDING * 2}
      rx={BORDER_RADIUS}
      ry={BORDER_RADIUS} />
  {/if}

  <text
    bind:this={textEl}
    class="a9s-wire-label-text"
    x={0}
    y={0}
    text-anchor="middle"
    dominant-baseline="central">
    {label}
  </text>
</g>

<style>
  rect {
    fill: white;
    stroke: #595959;
    stroke-width: 1;
  }

  text {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 11px;
  }
</style>
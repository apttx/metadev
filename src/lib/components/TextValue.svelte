<script>
  let className = ''
  export { className as class }
  export let value = undefined

  $: isUndefined = value === undefined
</script>

<p
  class={className}
  class:block={!value}
  class:italic={!value}
  class:text-confident={!value}
  class:font-normal={!value}
  class:bg-confident={isUndefined}
  class:animate-pulse={isUndefined}
  class:pr-1={isUndefined}
>
  {#if value}
    <slot>
      {value}
    </slot>
  {:else}
    <slot name="no-value">No value</slot>
  {/if}
</p>

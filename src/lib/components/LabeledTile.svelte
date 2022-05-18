<script>
  import ExclamationCircle from './heroicons/ExclamationCircle.svelte'
  import ExclamationTriangle from './heroicons/ExclamationTriangle.svelte'

  export let label
  export let danger = false
  export let warn = false
</script>

<div class="relative">
  <span
    class="inline-flex items-center transition border-primary border-2 rounded-md text-primary px-1 font-bold text-sm mb-2 space-x-1
      dark:text-primer dark:bg-primary dark:border-primary"
    class:warn
    class:danger
  >
    <span class="inline-block">
      {label}
    </span>

    {#if warn}
      <ExclamationTriangle />
    {/if}

    {#if danger}
      <ExclamationCircle />
    {/if}
  </span>

  <slot />
</div>

<style lang="postcss">
  .warn {
    @apply bg-warn border-warn text-primer;
  }

  .danger {
    @apply bg-danger border-danger text-primer;
  }
</style>

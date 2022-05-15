<script>
  import ExclamationCircle from './heroicons/ExclamationCircle.svelte'
  import ExclamationTriangle from './heroicons/ExclamationTriangle.svelte'

  export let label
  export let danger = false
  export let warn = false
</script>

<div class="relative">
  <span
    class="inline-flex items-center transition border-primary border-2 rounded-md text-primary bg-primer px-1 font-bold text-sm mb-2 space-x-1"
    class:text-primer={warn || danger}
    class:border-warn={warn}
    class:bg-warn={warn}
    class:border-danger={danger}
    class:bg-danger={danger}
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

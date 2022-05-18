<script context="module">
  const languageDisplayName = new Intl.DisplayNames(['en'], {
    type: 'language',
  })
</script>

<script>
  import InlineCode from '$lib/components/InlineCode.svelte'

  export let language
</script>

{languageDisplayName.of(language)}
<InlineCode>
  {language}
</InlineCode>

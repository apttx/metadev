<script context="module">
  const languageDisplayName = new Intl.DisplayNames(['en'], {
    type: 'language',
  })
</script>

<script>
  export let language
</script>

{languageDisplayName.of(language)}
<span class="font-mono bg-confident/10 px-2 py-1 rounded-md text-sm">
  {language}
</span>

<script>
  import { onMount } from 'svelte'
  import { parse } from 'parse5'

  import { page } from '$app/stores'

  import Refresh from '$lib/components/heroicons/Refresh.svelte'
  import Globe from '$lib/components/heroicons/Globe.svelte'
  import Annotation from '$lib/components/heroicons/Annotation.svelte'
  import Share from '$lib/components/heroicons/Share.svelte'
  import LabeledTile from '$lib/components/LabeledTile.svelte'
  import TextValue from '$lib/components/TextValue.svelte'
  import Language from '$lib/components/Language.svelte'
  import ExternalLink from '$lib/components/heroicons/ExternalLink.svelte'
  import InlineCode from '$lib/components/InlineCode.svelte'
  import Suggestion from '$lib/components/Suggestion.svelte'

  const initialData = () => ({ html: {}, og: {} })

  const getMetaContentFinder = metas => name =>
    metas
      .find(({ attrs }) =>
        attrs.find(
          attribute =>
            ['name', 'property'].includes(attribute.name) &&
            attribute.value === name
        )
      )
      ?.attrs.find(({ name }) => name === 'content')?.value ?? null

  const getLinkFinder = links => rel =>
    links
      .filter(({ attrs }) =>
        attrs.find(({ name, value }) => name === 'rel' && value === rel)
      )
      ?.map(({ attrs }) =>
        Object.fromEntries(attrs.map(({ name, value }) => [name, value]))
      )

  let data = initialData()
  let loading = false
  let error

  const getMeta = async () => {
    loading = true
    error = null
    data = initialData()

    try {
      const parsedUrl = new URL(uri)

      const response = await fetch(parsedUrl, { mode: 'cors' })

      const responseHtml = await response.text()
      const document = parse(responseHtml)

      const html = document.childNodes.find(({ tagName }) => tagName === 'html')
      data.html.lang = html.attrs.find(({ name }) => name === 'lang')?.value
      data.html.prefix = Object.fromEntries(
        html.attrs
          .filter(({ name }) => name === 'prefix')
          .map(({ name, value }) => [name, value])
      )

      const head = html.childNodes.find(({ tagName }) => tagName === 'head')

      const headChildren = Array.from(head.childNodes)
      const metas = headChildren.filter(({ tagName }) => tagName === 'meta')
      const links = headChildren.filter(({ tagName }) => tagName === 'link')

      const findMetaContent = getMetaContentFinder(metas)
      const findLinks = getLinkFinder(links)

      const titleTag = headChildren.find(({ tagName }) => tagName === 'title')
      data.title = titleTag?.childNodes[0].value ?? null
      data.description = findMetaContent('description')

      data.favicons = findLinks('icon').map(iconLink => {
        const absoluteHref = iconLink.href.startsWith('http')
          ? iconLink.href
          : `${parsedUrl.origin}${iconLink.href}`
        return { ...iconLink, href: absoluteHref }
      })

      data.og.image = findMetaContent('og:image')
      data.og.imageAlt = findMetaContent('og:image:alt')
      data.og.url = findMetaContent('og:url')
      data.og.title = findMetaContent('og:title')
      data.og.description = findMetaContent('og:description')
      data.html.prefix.og = data.html.prefix.og ?? null
      data.og._has = Object.values(data.og).filter(truthy => truthy).length > 0

      data.alternates = findLinks('alternate')
    } catch (error_) {
      error = error_
    }

    loading = false
  }

  let uri = $page.url.href
  let checkeredImages = false
  let borderedImages = false

  onMount(getMeta)
</script>

<main class="relative items-start p-4 space-y-12 pb-64">
  <div
    class="sticky top-4 max-w-3xl mx-auto z-50 px-4 py-3 space-y-2 bg-primer shadow-lg rounded-md
      dark:bg-primary"
  >
    <div class="grid grid-cols-[1fr_auto] gap-4">
      <label
        class="grid grid-cols-[auto_1fr] gap-2 items-center border-2 rounded-sm transition pl-3"
        class:border-danger={error}
        class:border-secondary={loading}
      >
        <span class="text-sm font-bold">URI</span>
        <input
          class="py-1 pl-1 pr-3
            dark:text-confident"
          bind:value={uri}
          on:input={getMeta}
        />
      </label>
      <button
        class="transition"
        class:text-secondary={loading}
        class:animate-spin={loading}
        on:click={getMeta}
      >
        <Refresh />
      </button>
    </div>

    {#if error}
      <p class="text-danger col-span-2">
        {error.message}
      </p>
    {/if}

    <label class="inline-block">
      <input type="checkbox" bind:checked={checkeredImages} />
      Checkered images
    </label>

    <label class="inline-block">
      <input type="checkbox" bind:checked={borderedImages} />
      Image borders
    </label>
  </div>

  <!-- Basic metadata -->
  <section class="max-w-2xl mx-auto space-y-6">
    <h2 class="text-1xl font-bold flex items-center space-x-2">
      <Annotation />
      <span>Basic metadata</span>
    </h2>

    <LabeledTile label="favicon" danger={data.favicons === null}>
      {#if data.favicons}
        <ul class="grid grid-flow-col gap-4 justify-start items-end">
          {#each data.favicons as favicon}
            <li class="grid gap-1">
              <img
                src={favicon.href}
                alt="favicon"
                class="inline"
                class:text-primer={checkeredImages}
                class:checkered={checkeredImages}
                class:border-2={borderedImages}
                class:border-confident={borderedImages}
              />
              <span>
                {favicon.sizes}
              </span>
              <span>
                {favicon.type?.replace('image/', '')}
              </span>
            </li>
          {/each}
        </ul>
      {/if}
    </LabeledTile>

    <LabeledTile label="title" danger={data.title === null}>
      <TextValue value={data.title} class="text-3xl font-bold" />
    </LabeledTile>

    <LabeledTile label="description" danger={data.description === null}>
      <TextValue value={data.description} />
    </LabeledTile>
  </section>

  <!-- Internationalisation -->
  <section class="max-w-2xl mx-auto space-y-6">
    <h2 class="text-1xl font-bold flex items-center space-x-2">
      <Globe />
      <span>Internationalisation</span>
    </h2>
    <LabeledTile label="lang" warn={data.html.lang === null}>
      <TextValue value={data.html.lang}>
        <Language language={data.html.lang} />
      </TextValue>
    </LabeledTile>

    <LabeledTile label="alternate">
      {#if data.alternates?.length}
        <ul class="space-y-4">
          {#each data.alternates as alternate}
            <li>
              <Language language={alternate.hreflang} />
              <a
                class="block space-x-2 transition hover:text-secondary"
                taget="_blank"
                rel="noreferrer nofollow"
                href={alternate.href}
              >
                {alternate.href}
                <ExternalLink />
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="italic">No other languages are linked</p>
      {/if}
    </LabeledTile>
  </section>

  <!-- Open Graph protocol -->
  <section class="max-w-2xl mx-auto space-y-6">
    <h2 class="text-1xl font-bold flex items-center space-x-2">
      <Share />
      <span>Open Graph protocol</span>
    </h2>

    <LabeledTile label="prefix" danger={data.og._has && !data.html.prefix?.og}>
      <TextValue value={data.html.prefix?.og}>
        <svelte:fragment slot="no-value">
          HTML tag is missing
          <InlineCode>prefix</InlineCode>
          attribute for
          <InlineCode>og</InlineCode>
          namespace even though it has meta information using it.

          <Suggestion>
            Add a
            <InlineCode>prefix="og: https://ogp.me/ns#"</InlineCode>
            attribute to your <InlineCode>html</InlineCode> tag.
          </Suggestion>
        </svelte:fragment>
      </TextValue>
    </LabeledTile>

    <LabeledTile label="og:url">
      <TextValue value={data.og.url}>
        <a
          class="space-x-2 transition hover:text-secondary"
          taget="_blank"
          rel="noreferrer nofollow"
          href={data.og.url}
        >
          {data.og.url}
          <ExternalLink />
        </a>
      </TextValue>
    </LabeledTile>

    <LabeledTile label="og:title">
      <TextValue value={data.og.title} />
    </LabeledTile>

    <LabeledTile label="og:description">
      <TextValue value={data.og.description} />
    </LabeledTile>

    <LabeledTile label="og:image" warn={data.og.image === null}>
      <img
        src={data.og.image}
        alt={data.og.imageAlt}
        class="mb-2"
        class:text-primer={checkeredImages}
        class:checkered={checkeredImages}
        class:border-2={borderedImages}
      />
    </LabeledTile>

    <LabeledTile label="og:image:alt" warn={data.og.imageAlt === null}>
      <TextValue value={data.og.imageAlt} />
    </LabeledTile>
  </section>
</main>

<style>
  .checkered {
    background-image: url('$lib/assets/checkers.svg');
    background-size: 10%;
  }
</style>

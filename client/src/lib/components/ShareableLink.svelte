<script lang="ts">
  export let matchID: string;

  // TODO: update with production URL
  const baseURL = 'localhost:5173/match/';
  let isCopied = false;

  async function copyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      isCopied = true;
      setTimeout(() => {
        isCopied = false;
      }, 1000);
    } catch (err) {
      throw new Error('Could not copy link');
    }
  }
</script>

<div class="place-self-center max-w-prose h-full">
  <p class="message-text">Share this link with a friend to start the game.</p>
  <p class="bg-gray-200 font-mono flex justify-between py-1 rounded-lg text-base px-1 leading-7 lg:leading-8 xl:text-xl xl:px-2 xl:my-3 xl:leading-8 2xl:text-2xl 2xl:px-3 2xl:my-4 fhd:text-3xl fhd:py-2 fhd:my-6 fhd:rounded-xl">
    {baseURL + matchID}
    <button
      on:click={() => copyLink(baseURL + matchID)}
      disabled={isCopied}
      class="grid inline p-2 bg-gray-300 hover:bg-gray-400 rounded-md fhd:rounded-xl fhd:h-10"
    >
      {#if !isCopied}
        <img src="/images/content-copy.svg" alt="copy" class="inline place-items-center h-4 fhd:h-6" />
      {:else}
        <img src="/images/check.svg" alt="copied" class="inline place-items-center h-4 fhd:h-6" />
      {/if}
    </button>
  </p>
</div>

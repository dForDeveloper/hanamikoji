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
  <p class="text-3xl my-6">Share this link with a friend to start the game.</p>
  <p class="text-3xl my-6 font-mono bg-gray-200 px-4 py-2 rounded-xl flex justify-between">
    {baseURL + matchID}
    <button
      on:click={() => copyLink(baseURL + matchID)}
      disabled={isCopied}
      class="bg-gray-300 hover:bg-gray-400 grid inline h-10 rounded-xl p-2"
    >
      {#if !isCopied}
        <img src="/images/content-copy.svg" alt="copy" class="h-6 inline place-items-center" />
      {:else}
        <img src="/images/check.svg" alt="copied" class="h-6 inline place-items-center" />
      {/if}
    </button>
  </p>
</div>

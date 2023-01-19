<script lang="ts">
  export let status: number;
  export let errorMessage: string;
</script>

<main class="h-screen bg-purple-100 font-nunito text-black/[.87] flex flex-col items-center gap-10 pt-10">
  <h1 class="text-4xl">{status}: {errorMessage}</h1>
  <a href="/" class="text-2xl underline">return to main page</a>
</main>

<script lang="ts">
  export let buttonText: string;
  export let getIsDisabled: (name: string) => boolean;
  export let handleClick: (name: string) => any;
  export let name: string;
</script>

<form class="grid grid-rows-3 gap-2 w-64">
  <label for="nickname">Choose a nickname</label>
  <input id="nickname" type="text" name="nickname" class="border-2 w-full" bind:value={name} />
  <button
    on:click={handleClick(name)}
    disabled={getIsDisabled(name)}
    class="border-2 w-full hover:cursor-pointer bg-sky-500 disabled:bg-slate-500"
  >
    {buttonText}
  </button>
</form>

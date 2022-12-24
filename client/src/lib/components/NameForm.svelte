<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let name: string;
  export let getIsDisabled: (name: string) => boolean;

  const dispatch = createEventDispatcher();

  function handleClick() {
    dispatch('clickEvent', { name });
  }
</script>

<form class="grid grid-rows-3 gap-2 w-64">
  <label for="nickname">Choose a nickname</label>
  <input
    id="nickname"
    type="text"
    name="nickname"
    class="border-2 w-full"
    bind:value={name}
  />
  <button
    on:click={handleClick}
    disabled={getIsDisabled(name)}
    class="border-2 w-full hover:cursor-pointer bg-sky-500 disabled:bg-slate-500" 
  >
    New Match
  </button>
</form>

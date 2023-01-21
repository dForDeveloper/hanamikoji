<script lang="ts">
  export let buttonText: string;
  export let extraClasses = '';
  export let handleClick: () => void;
  export let isSecondary = false;
</script>

<button
  on:click={() => handleClick()}
  class={`text-xl h-12 w-32 rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 disabled:bg-gray-300 disabled:shadow-none ${isSecondary ? 'bg-pink-200' : 'bg-violet-300'} ${extraClasses}`}
>
  {buttonText}
</button>

<script lang="ts">
  export let buttonText: string;
  export let extraClasses = '';
  export let handleClick: () => void;
  export let isSecondary = false;

  function composeCssClasses(): string {
    let cssClasses =  `rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 ${extraClasses}`;
    if (isSecondary) {
      cssClasses = cssClasses + ' bg-pink-200';
    } else {
      cssClasses = cssClasses + ' bg-violet-300';
    }
    return cssClasses;
  }
</script>

<button
  on:click={() => handleClick()}
  class={`${composeCssClasses()} h-10 w-28 text-lg fhd:h-12 fhd:w-32 fhd:text-xl`}
>
  {buttonText}
</button>

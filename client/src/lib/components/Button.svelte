<script lang="ts">
  export let extraClasses = '';
  export let isSecondary = false;
  export let isWide = false;
  export let handleClick: () => void;
  export let getIsDisabled: () => boolean = () => false;

  function composeCssClasses(): string {
    let cssClasses =  `rounded-full shadow-sm shadow-gray-600 hover:shadow hover:shadow-gray-600 text-lg h-10 fhd:h-12 fhd:text-xl ${extraClasses}`;
    if (isSecondary) {
      cssClasses = cssClasses + ' bg-pink-200';
    } else {
      cssClasses = cssClasses + ' bg-violet-300';
    }
    if (isWide) {
      cssClasses = cssClasses + ' w-36 fhd:w-40';
    } else {
      cssClasses = cssClasses + ' w-28 fhd:w-32';
    }
    return cssClasses;
  }
</script>

<!-- The confirm button in SharedInterface does not use this component. -->
<button
  on:click={() => handleClick()}
  disabled={getIsDisabled()}
  class={composeCssClasses()}
>
  <slot />
</button>

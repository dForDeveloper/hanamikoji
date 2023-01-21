<script lang="ts">
  export let index: number;
  export let isEnabled: boolean;
  export let isHoverable: boolean;

  function getAlt(index: number): string {
    return isEnabled ? `action ${index} marker` : `disabled action ${index + 1} marker`;
  }

  function composeCssClasses(isEnabled: boolean, isHoverable: boolean): string {
    let cssClass = 'block object-fill object-center h-[8vh] w-[8vh] rounded 2xl:rounded-md';
    if (!isEnabled) {
      cssClass = cssClass + ' grayscale';
    }
    if (isHoverable) {
      cssClass = cssClass + ' hover:shadow hover:shadow-black';
    }
    return cssClass;
  }
</script>

<img
  srcset={`/images/1080/action${index}.webp 87w, /images/1440/action${index}.webp 116w, /images/4k/action${index}.webp 179w`}
  sizes="(max-width: 1920px) 87px, (max-width: 2560px) 116px, (max-width: 3840px) 179px"
  alt={getAlt(index)}
  class={composeCssClasses(isEnabled, isHoverable)}
/>

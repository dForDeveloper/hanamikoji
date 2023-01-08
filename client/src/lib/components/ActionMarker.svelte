<script lang="ts">
  export let index: number;
  export let isEnabled: boolean;
  export let isHoverable: boolean;

  function getAlt(index: number): string {
    return isEnabled ? `action ${index} marker` : `disabled action ${index + 1} marker`;
  }

  function getCssClasses(isEnabled: boolean, isHoverable: boolean): string {
    let cssClass = 'block object-fill object-center rounded-md';
    if (!isEnabled) {
      cssClass = cssClass + ' grayscale';
    }
    if (isHoverable) {
      cssClass = cssClass + ' hover:shadow hover:shadow-black';
    }
    return cssClass;
  }
</script>

<img src={`/images/action${index}.webp`} alt={getAlt(index)} class={getCssClasses(isEnabled, isHoverable)} />

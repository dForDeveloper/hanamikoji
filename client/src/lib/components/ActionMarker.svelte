<script lang="ts">
  export let index: number;
  export let isEnabled: boolean;
  export let isHoverable: boolean;

  function getAlt(index: number): string {
    switch (index) {
      case 1:
        return 'pictogram of one card covered by a checkmark';
      case 2:
        return 'pictogram of two cards covered by an X';
      case 3:
        return 'pictogram of three cards with an arrow on one card pointing up and an arrow on each of the other two cards pointing down';
      case 4:
        return 'pictorgram of two pairs of cards with an arrow on one pair pointing up and an arrow on the other pair pointing down';
      default:
        return `pictogram of action ${index}`;
    }
  }

  function getClass(): string {
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

<img src={`/images/action${index}.webp`} alt={getAlt(index)} class={getClass()} />

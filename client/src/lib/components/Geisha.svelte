<script lang="ts">
  import { Color } from "game-logic";

  export let color: Color;

  const colorToSource = {
    [Color.PINK]: '/images/pink-geisha.webp',
    [Color.GREEN]: '/images/green-geisha.webp',
    [Color.ORANGE]: '/images/orange-geisha.webp',
    [Color.BLUE]: '/images/blue-geisha.webp',
    [Color.YELLOW]: '/images/yellow-geisha.webp',
    [Color.RED]: '/images/red-geisha.webp',
    [Color.PURPLE]: '/images/purple-geisha.webp',
  };
</script>

<img
  src={colorToSource[color]}
  alt={`${color} geisha card`}
  class="block h-[20vh] object-fill object-center rounded-xl"
/>
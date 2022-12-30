<script lang="ts">
  import { Color } from "game-logic";

  export let color: Color;

  const colorToSource = {
    [Color.PINK]: '/images/pink-item.webp',
    [Color.GREEN]: '/images/green-item.webp',
    [Color.ORANGE]: '/images/orange-item.webp',
    [Color.BLUE]: '/images/blue-item.webp',
    [Color.YELLOW]: '/images/yellow-item.webp',
    [Color.RED]: '/images/red-item.webp',
    [Color.PURPLE]: '/images/purple-item.webp',
  };
</script>

<img
  src={colorToSource[color]}
  alt={`${color} item card`}
  class="block h-[16.2vh] object-fill object-center rounded-xl"
/>
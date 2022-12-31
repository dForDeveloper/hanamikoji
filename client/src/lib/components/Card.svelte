<script lang="ts">
  import { Color } from 'game-logic';

  export let type: 'item' | 'geisha' | 'back' | 'empty';
  export let color: Color = Color.PINK;
  export let isSelected: boolean = false;
  export let isHoverable: boolean = false;

  const colorToGeishaSource = {
    [Color.PINK]: '/images/pink-geisha.webp',
    [Color.GREEN]: '/images/green-geisha.webp',
    [Color.ORANGE]: '/images/orange-geisha.webp',
    [Color.BLUE]: '/images/blue-geisha.webp',
    [Color.YELLOW]: '/images/yellow-geisha.webp',
    [Color.RED]: '/images/red-geisha.webp',
    [Color.PURPLE]: '/images/purple-geisha.webp',
  };

  const colorToGeishaAlt = {
    [Color.PINK]: 'pink geisha card - 5 points',
    [Color.GREEN]: 'green geisha card - 4 points',
    [Color.ORANGE]: 'orange geisha card - 3 points',
    [Color.BLUE]: 'blue geisha card - 3 points',
    [Color.YELLOW]: 'yellow geisha card - 2 points',
    [Color.RED]: 'red geisha card - 2 points',
    [Color.PURPLE]: 'purple geisha card - 2 points',
  };

  const colorToItemSource = {
    [Color.PINK]: '/images/pink-item.webp',
    [Color.GREEN]: '/images/green-item.webp',
    [Color.ORANGE]: '/images/orange-item.webp',
    [Color.BLUE]: '/images/blue-item.webp',
    [Color.YELLOW]: '/images/yellow-item.webp',
    [Color.RED]: '/images/red-item.webp',
    [Color.PURPLE]: '/images/purple-item.webp',
  };

  const colorToItemAlt = {
    [Color.PINK]: 'pink item card - 5 points',
    [Color.GREEN]: 'green item card - 4 points',
    [Color.ORANGE]: 'orange item card - 3 points',
    [Color.BLUE]: 'blue item card - 3 points',
    [Color.YELLOW]: 'yellow item card - 2 points',
    [Color.RED]: 'red item card - 2 points',
    [Color.PURPLE]: 'purple item card - 2 points',
  };

  function getItemClass() {
    let itemClass = 'block h-[16.2vh] object-center rounded-xl shadow-sm shadow-black w-full';
    if (isSelected) {
      itemClass = itemClass + ' -translate-y-6';
    }
    if (isHoverable) {
      itemClass = itemClass + ' hover:shadow hover:shadow-black';
    }
    return itemClass;
  }
</script>

{#if type === 'geisha'}
  <img
    src={colorToGeishaSource[color]}
    alt={colorToGeishaAlt[color]}
    class="block h-[20vh] object-fill object-center rounded-xl shadow-sm shadow-black"
  />
{:else if type === 'item'}
  <img src={colorToItemSource[color]} alt={colorToItemAlt[color]} class={getItemClass()} />
{:else if type === 'back'}
  <img src="/images/item-back.webp" alt="back side of an item card" class={getItemClass()} />
{:else if type === 'empty'}
  <div class="aspect-[8/11] h-[16.2vh] border-2 border-black border-dashed rounded-xl" />
{/if}

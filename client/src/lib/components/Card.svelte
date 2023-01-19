<script lang="ts">
  import { Color } from 'game-logic';

  export let type: 'item' | 'geisha' | 'back' | 'empty';
  export let color: Color = Color.PINK;
  export let isSelected = false;
  export let isHoverable = false;
  export let isTranslatedDown = false;
  export let isUpsideDown = false;
  export let victoryMarkerDirection = 0;
  export let backAlt = 'back side of an item card';

  const colorToGeishaSource = {
    [Color.PURPLE]:
      '/images/1080/purple-geisha.webp 144w, /images/1440/purple-geisha.webp 192w, /images/4k/purple-geisha.webp 298w',
    [Color.RED]:
      '/images/1080/red-geisha.webp 144w, /images/1440/red-geisha.webp 192w, /images/4k/red-geisha.webp 298w',
    [Color.YELLOW]:
      '/images/1080/yellow-geisha.webp 144w, /images/1440/yellow-geisha.webp 192w, /images/4k/yellow-geisha.webp 298w',
    [Color.BLUE]:
      '/images/1080/blue-geisha.webp 144w, /images/1440/blue-geisha.webp 192w, /images/4k/blue-geisha.webp 298w',
    [Color.ORANGE]:
      '/images/1080/orange-geisha.webp 144w, /images/1440/orange-geisha.webp 192w, /images/4k/orange-geisha.webp 298w',
    [Color.GREEN]:
      '/images/1080/green-geisha.webp 144w, /images/1440/green-geisha.webp 192w, /images/4k/green-geisha.webp 298w',
    [Color.PINK]:
      '/images/1080/pink-geisha.webp 144w, /images/1440/pink-geisha.webp 192w, /images/4k/pink-geisha.webp 298w',
    [Color.NULL]: '',
  };

  const colorToGeishaAlt = {
    [Color.PURPLE]: 'purple geisha card - 2 points',
    [Color.RED]: 'red geisha card - 2 points',
    [Color.YELLOW]: 'yellow geisha card - 2 points',
    [Color.BLUE]: 'blue geisha card - 3 points',
    [Color.ORANGE]: 'orange geisha card - 3 points',
    [Color.GREEN]: 'green geisha card - 4 points',
    [Color.PINK]: 'pink geisha card - 5 points',
    [Color.NULL]: '',
  };

  const colorToItemSource = {
    [Color.PURPLE]:
      '/images/1080/purple-item.webp 125w, /images/1440/purple-item.webp 167w, /images/4k/purple-item.webp 258w',
    [Color.RED]: '/images/1080/red-item.webp 125w, /images/1440/red-item.webp 167w, /images/4k/red-item.webp 258w',
    [Color.YELLOW]:
      '/images/1080/yellow-item.webp 125w, /images/1440/yellow-item.webp 167w, /images/4k/yellow-item.webp 258w',
    [Color.BLUE]: '/images/1080/blue-item.webp 125w, /images/1440/blue-item.webp 167w, /images/4k/blue-item.webp 258w',
    [Color.ORANGE]:
      '/images/1080/orange-item.webp 125w, /images/1440/orange-item.webp 167w, /images/4k/orange-item.webp 258w',
    [Color.GREEN]:
      '/images/1080/green-item.webp 125w, /images/1440/green-item.webp 167w, /images/4k/green-item.webp 258w',
    [Color.PINK]: '/images/1080/pink-item.webp 125w, /images/1440/pink-item.webp 167w, /images/4k/pink-item.webp 258w',
    [Color.NULL]: '',
  };

  const colorToItemAlt = {
    [Color.PURPLE]: 'purple item card - 2 points',
    [Color.RED]: 'red item card - 2 points',
    [Color.YELLOW]: 'yellow item card - 2 points',
    [Color.BLUE]: 'blue item card - 3 points',
    [Color.ORANGE]: 'orange item card - 3 points',
    [Color.GREEN]: 'green item card - 4 points',
    [Color.PINK]: 'pink item card - 5 points',
    [Color.NULL]: '',
  };

  function composeVictoryMarkerClasses(victoryMarkerDirection: number | null): string {
    let cssClasses = 'absolute z-10 h-[4vh] w-[4vh] shadow-sm shadow-black rounded-full';
    if (victoryMarkerDirection === -1) {
      return cssClasses + ' top-0';
    } else if (victoryMarkerDirection === 1) {
      return cssClasses + ' bottom-0';
    } else {
      return cssClasses + ' align-self-center';
    }
  }

  function getItemCardAlt(color: Color): string {
    return isSelected ? `selected ${colorToItemAlt[color]}` : colorToItemAlt[color];
  }

  function composeCssClasses() {
    let cssClasses = 'block h-[16.2vh] w-[11.53vh] object-center rounded-xl shadow-black w-full';
    if (isSelected) {
      if (isTranslatedDown) {
        cssClasses = cssClasses + ' translate-y-6';
      } else {
        cssClasses = cssClasses + ' -translate-y-6';
      }
    }
    if (isHoverable) {
      cssClasses = cssClasses + ' hover:shadow hover:shadow-black';
    }
    if (isUpsideDown) {
      cssClasses = cssClasses + ' shadow-[0_-1px_2px_0_rgb(0,0,0,0.05)]';
    } else {
      cssClasses = cssClasses + ' shadow-sm';
    }
    return cssClasses;
  }
</script>

{#if type === 'geisha'}
  <div class="relative h-[20vh] w-[13.31vh] grid place-items-center">
    <img
      srcset={colorToGeishaSource[color]}
      sizes="(max-width: 1920px) 144px, (max-width: 2560px) 192px, (max-width: 3840px) 298px"
      alt={colorToGeishaAlt[color]}
      class="block h-[20vh] w-[13.31vh] object-fill object-center rounded-xl shadow-sm shadow-black"
    />
    <img
      srcset="/images/1080/victory-marker.webp 44w, /images/1440/victory-marker.webp 58w, /images/4k/victory-marker.webp 90w"
      sizes="(max-width: 1920px) 44px, (max-width: 2560px) 58px, (max-width: 3840px) 90px"
      alt="victory marker"
      class={composeVictoryMarkerClasses(victoryMarkerDirection)}
    />
  </div>
{:else if type === 'item'}
  <img
    srcset={colorToItemSource[color]}
    sizes="(max-width: 1920px) 125px, (max-width: 2560px) 167px, (max-width: 3840px) 258px"
    alt={getItemCardAlt(color)}
    class={composeCssClasses()}
  />
{:else if type === 'back'}
  <img
    srcset="/images/1080/item-back.webp 125w, /images/1440/item-back.webp 167w, /images/4k/item-back.webp 258w"
    sizes="(max-width: 1920px) 125px, (max-width: 2560px) 167px, (max-width: 3840px) 258px"
    alt={backAlt}
    class={composeCssClasses()}
  />
{:else if type === 'empty'}
  <div class="h-[16.2vh] w-[11.53vh] border-2 border-gray-600 border-dashed rounded-xl" />
{/if}

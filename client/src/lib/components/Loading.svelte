<script lang="ts">
  export let size: string;
  export let color: string;
  export let strokeWidth: number;
</script>

<svg class="spin inline" height={size} width={size} viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg">
  <circle
    class="trail"
    cx="33"
    cy="33"
    fill="none"
    r="27"
    stroke={color}
    stroke-linecap="round"
    stroke-width={strokeWidth}
  />
</svg>

<style>
  .spin {
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  .trail {
    animation: trail 2s ease-in-out infinite;
    stroke-dasharray: 187;
    stroke-dashoffset: 0;
    transform-origin: center;
  }

  @keyframes trail {
    0% {
      stroke-dashoffset: 187;
    }
    50% {
      stroke-dashoffset: 46.75;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: 187;
      transform: rotate(450deg);
    }
  }
</style>

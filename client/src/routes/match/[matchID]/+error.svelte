<script>
  import ErrorPage from '$lib/components/ErrorPage.svelte';
  import { page } from '$app/stores';
</script>

<ErrorPage status={$page.status} errorMessage={$page.error ? $page.error.message : 'An error occurred'} />

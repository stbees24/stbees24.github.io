<script>
  import InboxScreen from './components/InboxScreen.svelte';
  import { taskStore } from './store';
</script>

<InboxScreen error={$taskStore.error} />

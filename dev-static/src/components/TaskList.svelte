<script>
  import PureTaskList from './PureTaskList.svelte';
  import { taskStore } from '../store';

  function onPinTask(event) {
    taskStore.pinTask(event.detail.id);
  }
  function onArchiveTask(event) {
    taskStore.archiveTask(event.detail.id);
  }
</script>

<PureTaskList
  tasks={$taskStore.tasks}
  on:onPinTask={onPinTask}
  on:onArchiveTask={onArchiveTask}
/>

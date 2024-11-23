<script>
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  /** Event handler for the Pin Task */
  function PinTask() {
    dispatch('onPinTask', { id: task.id });
  }

  /** Event handler for the Archive Task */
  function ArchiveTask() {
    dispatch('onArchiveTask', { id: task.id });
  }

  /** Composition of the task */
  export let task = {
    id: '',
    title: '',
    state: ''
  };

  /* Reactive declaration (computed prop in other frameworks) */
  $: isChecked = task.state === "TASK_ARCHIVED";

</script>

<div class="list-item {task.state}">
  <label
    for={`checked-${task.id}`}
    class="checkbox"
    aria-label={`archiveTask-${task.id}`}
  >
    <input
      type="checkbox"
      checked={isChecked}
      disabled
      name={`checked-${task.id}`}
      id={`archiveTask-${task.id}`}
    />
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <span
      class="checkbox-custom"
      role="button"
      on:click={ArchiveTask}
      tabindex="-1"
      aria-label={`archiveTask-${task.id}`}
    />
  </label>
  <label for={`title-${task.id}`} aria-label={task.title} class="title">
    <input
      type="text"
      value={task.title}
      readonly
      name="title"
      id={`title-${task.id}`}
      placeholder="Input title"
    />
  </label>
  {#if task.state !== 'TASK_ARCHIVED'}
    <button
      class="pin-button"
      on:click|preventDefault={PinTask}
      id={`pinTask-${task.id}`}
      aria-label={`pinTask-${task.id}`}
    >
      <span class="icon-star">PIN</span>
    </button>
  {/if}
</div>

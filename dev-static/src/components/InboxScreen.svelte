<script>
  import TaskList from "./TaskList.svelte";
  export let error = false;
</script>

<div>
  {#if error}
    <div class="page lists-show">
      <div class="wrapper-message">
        <span class="icon-face-sad" />
        <p class="title-message">Oh no!</p>
        <p class="subtitle-message">Something went wrong</p>
      </div>
    </div>
  {:else}
    <div class="page lists-show">
      <nav>
        <h1 class="title-page">Taskbox</h1>
      </nav>
      <TaskList />
    </div>
  {/if}
</div>

<script>

  import { selectedPanel } from '@lib/stores';
  import { getLabelForKey } from "@lib/formatters";
  import { LOADING_ICON } from "@lib/icons";

  export let columns;
  export let isLoading;
  export let isEmpty;

  // get full grid template
  let gridTemplate;
  function setGridTemplate(_columns) {
    gridTemplate = "";
    for (const col of _columns) {
      gridTemplate += ` ${col.gridTemplate}`;
    }
  }

  $: setGridTemplate(columns);


</script>

<div class="table" style={`--grid-template: ${gridTemplate};`}>
  <div class={$selectedPanel == 'history' ? 'columns short' : 'columns'} id="tableColumns">
    {#each columns as column}
      {#if column.key == "tools"}
        <div />
      {:else}
        <div style={column.rightAlign ? "justify-content: flex-end" : ""}>
          {getLabelForKey(column.key)}
        </div>
      {/if}
    {/each}
  </div>

  <div id="infinite-scroll-container" class={$selectedPanel == 'history' ? 'data-wrapper short-width' : 'data-wrapper normal-width'}>
    {#if isLoading}
      <div class="loading">{@html LOADING_ICON}</div>
    {:else if isEmpty}
      <div class="empty">Nothing to show.</div>
    {:else}
      <slot />
    {/if}
  </div>
</div>

<style>
  .table {
    height: 100%;
  }

  .columns {
    display: grid;
    align-items: center;
    height: 38px;
    padding: 0 25px;
    font-size: 85%;
    border-bottom: 1px solid var(--layer100);
    grid-template-columns: var(--grid-template);
  }

  @media (max-width: 799px) {
    .columns {
      width: 750px;
    }
  }

  @media (max-width: 650px) {
    .columns {
      width: 780px;
      padding: 0 10px;
    }

    .short {
      width: calc(100vw - 20px);
    }
  }

  .columns > div {
    height: 100%;
    display: flex;
    align-items: center;
    text-transform: capitalize;
    color: var(--text1);
  }

  .data-wrapper {
    height: calc(100% - 39px);
    overflow-y: auto;
    overflow-x: auto;
    scrollbar-color: var(--layer200);
    scrollbar-width: thin;
  }
  @media (max-width: 799px) {
    .normal-width {
      width: 800px;
    }
    .short-width {
      width: 100vw;
    }
  }

  .data-wrapper::-webkit-scrollbar-track {
    background-color: transparent;
    border-radius: 6px;
  }
  .data-wrapper::-webkit-scrollbar {
    width: 5px;
    background-color: transparent;
  }
  .data-wrapper::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: var(--layer200);
  }

  .empty {
    padding: var(--base-padding);
    text-align: center;
    color: var(--text2);
    font-size: 85%;
  }

  .loading {
    padding: var(--base-padding);
    text-align: center;
    color: var(--text2);
  }
  .loading :global(svg) {
    width: 20px;
  }
</style>

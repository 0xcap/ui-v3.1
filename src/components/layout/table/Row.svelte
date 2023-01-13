<script>

  export let height = 52;
  export let hasScrollbar;

  const isMobileDevice = /Mobi/i.test(window.navigator.userAgent)

</script>

{#if hasScrollbar && !isMobileDevice}
  <div class="row scrollbar" id='tableRow' style={`height:${height}px`}><slot /></div>
{:else}
  <div class="row no-scrollbar" id='tableRow' style={`height:${height}px`}><slot /></div>
{/if}

<style>
  .row {
    display: grid;
    align-items: center;
    grid-template-columns: var(--grid-template);
    border-bottom: 1px solid var(--layer0-hover);
  }

  .scrollbar {
    padding-left: 25px;
    padding-right: 15px; 
  }

  .no-scrollbar {
    padding: 0 25px;
  }

  @media (max-width: 650px) {
    .no-scrollbar {
      padding: 0 10px;
    }

    .scrollbar {
      padding: 0 10px;
    }
  }

</style>

<script>
  import Icon from '$lib/components/ui/Icon.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let { open = false, form } = $props();

  let dialog

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    } else if (!open && dialog.open) {
      dialog.close();
      document.body.style.overflow = '';
    }
  });

  function close() {
    dispatch('close');
  }
</script>

<dialog bind:this={dialog} onclick={close}>
    <p class:success={form?.success} class:error={form?.error}>
      <Icon name="message" />
      {form?.message}
    </p>
</dialog>

<style>
  dialog {
    border-radius: .5rem;
    padding: 2rem;
    background: rgba(255, 255, 255, .8);
    border: 1px solid var(--default-color);
    outline: none;
    width: fit-content;
  }

  dialog p {
    font-size: 1.5em;
    position: relative;
    padding-left: 2.5rem;
  }

  dialog p svg {
    position: absolute;
    left: 0;
  }
</style>
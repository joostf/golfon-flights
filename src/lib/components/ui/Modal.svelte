<script>
  import { onMount, onDestroy } from 'svelte';

  let { open, onClose } = $props(); // parent controls open/close
  let dialogEl = null;

  let isOpen = $state(open); // internal state to drive animation

  // sync internal state with parent prop
  $effect(() => {
    isOpen = open;
  });

  // body scroll lock
  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // Escape key closes modal
  const handleKeydown = (event) => {
    if (event.key === 'Escape' && isOpen) {
      handleClose();
    }
  };

  onMount(() => {
    window.addEventListener('keydown', handleKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  });

  function handleClose() {
    isOpen = false;
    onClose?.(); // notify parent
  }

  function handleBackdropClick(event) {
    if (event.target === dialogEl) {
      handleClose();
    }
  }
</script>

<dialog
  bind:this={dialogEl}
  open={isOpen}
  class="modal"
  onclick={handleBackdropClick}
>
  <div class="modal-content">
    {@render children()}
  </div>
</dialog>

<style>
  dialog.modal {
    border: none;
    padding: 0;
    background: transparent;
    width: 100%;
    height: 100%;
  }

  .modal-content {
    background: white;
    border-radius: 0.5rem;
    padding: 1.5rem;
    max-width: 40rem;
    margin: auto;
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }

  dialog[open] .modal-content {
    transform: translateY(0);
  }

  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.8);
  }
</style>

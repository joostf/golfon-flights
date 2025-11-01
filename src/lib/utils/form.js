export function confirmFormSubmit(message, onConfirm) {
  return async (formEvent) => {
    const confirmed = window.confirm(message)
    if (!confirmed) {
      formEvent.preventDefault()
      return
    }

    if (onConfirm) {
      await onConfirm(formEvent)
    }
  }
}
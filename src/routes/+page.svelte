<script>
  import { enhance } from '$app/forms';

  import FlightCard from '$lib/components/flights/FlightCard.svelte';
  import FlightForm from '$lib/components/flights/FlightForm.svelte';
  import Icon from '$lib/components/ui/Icon.svelte';
  import GolfCourseInfo from '$lib/components/widgets/MemoryLane.svelte';
  import RandomGiphy from '$lib/components/widgets/RandomGiphy.svelte';
  import Modal from '$lib/components/ui/Modal.svelte';

  // Props from server
  const { data, form } = $props();
  const flights = $derived(data.flights);
  const allUsers = $state(data.users || []);
  const golfCourses = $state(data.golf_courses || []);
  const golfCourse = $state(data.golfcourse.course || {});
  const randomGiphy = $state(data.randomGiphy);

  let selectedFlight = $state(null);
  let modalOpen = $state(false);
  let mode = $state('create'); // create | edit

  // Edit flight
  function openEdit(flight) {
    selectedFlight = JSON.parse(JSON.stringify(flight));
    mode = 'edit';
    modalOpen = true;
  }

  function openCreate() {
    selectedFlight = null;
    mode = 'create';
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    selectedFlight = null;
    mode = 'create';
  }

  function removeUser(flight, fu) {
    console.log('Remove user:', fu.user_id, 'from flight', flight.id);
  }
</script>

<div class="wrapper">
  <header>
    <h1>Golfon flights</h1>

    <button onclick={openCreate}>
      <span>Nieuwe flight</span>
      <i>⛳️</i>
    </button>
  </header>

  <main>
    <h2 class="visually-hidden">Flights</h2>

    {#each flights as flight (flight.id)}
      <FlightCard {flight} {mode} onEdit={openEdit} onRemoveUser={removeUser} />
    {/each}
  </main>

  <aside>
    <RandomGiphy {randomGiphy} />
    <GolfCourseInfo {golfCourse} />
  </aside>

  {#if modalOpen}
    <Modal {open} onClose={closeModal}>
      <FlightForm
        {mode}
        flight={selectedFlight}
        users={allUsers}
        golf_courses={golfCourses}
        onClose={closeModal}
      />
    </Modal>
  {/if}
</div>

<style>
  .wrapper { display:grid; gap:1rem; grid-template-columns: 1fr; padding:1rem; }
  header { display:flex; justify-content: space-between; align-items:center; }
  main { display:flex; flex-direction: column; gap:1rem; }
  aside { display:flex; flex-direction: column; gap:2rem; }
</style>

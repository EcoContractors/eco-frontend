<script lang="ts">
  let firstName = "";
  let lastName = "";
  let phone = "";
  let address = "";
  let equipmentType = "";
  let equipmentCount = "";
  let hireCount = "";
  let fromDate = "";
  let toDate = "";
</script>

<div class="w-full">
  <!-- Header -->
  <div class="flex items-center justify-between mb-6">
    <h1 class="text-lg lg:text-2xl font-semibold text-gray-900">
      Inspection Form
    </h1>

    <button class="text-gray-400 hover:text-gray-600">
      ←
    </button>
  </div>

  <form class="space-y-4 lg:space-y-6">
    <!-- Name -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <input
        type="text"
        placeholder="First Name"
        bind:value={firstName}
        class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />

      <input
        type="text"
        placeholder="Last Name"
        bind:value={lastName}
        class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </div>

    <!-- Phone -->
    <input
      type="tel"
      placeholder="+234"
      bind:value={phone}
      class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <!-- Address -->
    <input
      type="text"
      placeholder="Address"
      bind:value={address}
      class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <!-- Equipment Type -->
    <input
      type="text"
      placeholder="Equipment Type"
      bind:value={equipmentType}
      class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <!-- Number of Equipment -->
    <input
      type="number"
      placeholder="Number of Equipment"
      bind:value={equipmentCount}
      class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
    />

    <!-- Duration -->
    <div>
      <p class="text-xs text-gray-500 mb-2">Day of Appointment</p>

      <div class="grid grid-cols-2 gap-3">
        <input
          type="date"
          bind:value={fromDate}
          class="w-full rounded-lg bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary"
        />

      </div>
    </div>

    <!-- Submit -->
    <div class="pt-6 flex justify-center">
      <button
        type="submit"
        class="w-48 lg:w-64 py-3 rounded-full
               bg-primary text-white font-semibold
               shadow-md hover:bg-green-600 transition"
      >
        Submit
      </button>
    </div>
  </form>
</div>

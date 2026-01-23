<script lang="ts">
  import { image15, logo2, image17 } from "$lib/assets/images";


</script>

<section>
    <div class="relative my-6 flex justify-end md:justify-between">
      <div>
        <img src={image17} alt="" class=" absolute left-2 -top-14 md:-top-10 w-44 lg:w-sm h-60 lg:h-76 z-1">
      </div>
    <div class="w-32 md:w-md">
        <p class="text-2xl md:text-4xl lg:text-6xl font-semibold">Our work team is our <span class="text-primary font-bold">Strength</span></p>
        <p class="md:text-xl">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
    </div>
</div>
 <div class="relative rounded-lg overflow-hidden shadow-lg z-10 md:mt-14 lg:mt-20">
    <img
      src={image15}
      alt="Eco Contractors"
      class="w-full h-56 md:h-96 object-cover"
    />

    <div class="absolute inset-0 bg-primary/50"></div>

    <div class="absolute inset-0 flex items-center justify-center">
      <img
        src={logo2}
        alt="Eco Contractors Logo"
        class="md:w-xl lg:w-2xl "
      />
    </div>
  </div>
</section>
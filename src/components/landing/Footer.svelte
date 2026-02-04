<script lang="ts">
  import { Facebook, Linkedin, Twitter, Youtube, MapPin } from "lucide-svelte";
  import image15 from "$lib/assets/images/image15.png";
  import logo2 from "$lib/assets/images/logo2.png";

  const company = [
    { label: "About Us", href: "/about" },
    { label: "Our Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Careers", href: "/careers" },
  ];

  const support = [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/help" },
    { label: "FAQ", href: "/help" },
    { label: "Terms of Service", href: "#" },
  ];

  const resources = [
    { label: "Privacy Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
    { label: "Sitemap", href: "#" },
    { label: "Data Protection", href: "#" },
  ];

  const socials = [
    { icon: Facebook, href: "#" },
    { icon: Linkedin, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Youtube, href: "#" },
  ];
</script>

<footer class="relative w-full mt-12 md:mt-14 lg:mt-20 overflow-hidden shadow-lg">

  <!-- Background Image -->
  <img
    src={image15}
    alt="Eco Contractors"
    class="w-full object-cover absolute inset-0 h-full"
  />

  <!-- Primary Color Overlay -->
  <div class="absolute inset-0 bg-secondary/85"></div>

  <!-- Footer Content -->
  <div class="relative z-10 px-6 sm:px-10 py-10">

    <!-- Top Row: Logo + Social Icons -->
    <div class="flex items-start justify-between mb-10">
      <img
        src={logo2}
        alt="Eco Contractors Logo"
        class="w-36 md:w-48"
      />
      <div class="flex items-center gap-3">
        {#each socials as social}
          <a
            href={social.href}
            class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-secondary transition"
          >
            <svelte:component this={social.icon} size={18} />
          </a>
        {/each}
      </div>
    </div>

    <!-- Links Columns -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/20">

      <!-- Head Office -->
      <div>
        <h3 class="text-white font-bold text-sm mb-4">Head Office</h3>
        <p class="text-white/60 text-xs leading-relaxed">
          123 Construction Lane,<br />
          Victoria Island,<br />
          Lagos, Nigeria
        </p>
        <a href="#" class="flex items-center gap-1 text-primary text-xs mt-3 hover:underline">
          <MapPin size={12} />
          Branch Location
        </a>
      </div>

      <!-- Company -->
      <div>
        <h3 class="text-white font-bold text-sm mb-4">Company</h3>
        <div class="flex flex-col gap-2">
          {#each company as link}
            <a href={link.href} class="text-white/60 text-xs hover:text-primary transition">
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- Support -->
      <div>
        <h3 class="text-white font-bold text-sm mb-4">Support</h3>
        <div class="flex flex-col gap-2">
          {#each support as link}
            <a href={link.href} class="text-white/60 text-xs hover:text-primary transition">
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- Resources -->
      <div>
        <h3 class="text-white font-bold text-sm mb-4">Resources</h3>
        <div class="flex flex-col gap-2">
          {#each resources as link}
            <a href={link.href} class="text-white/60 text-xs hover:text-primary transition">
              {link.label}
            </a>
          {/each}
        </div>
      </div>

    </div>

    <!-- Bottom Copyright Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
      <p class="text-white/50 text-xs">
        © 2026 Eco Contractors Limited. All rights reserved.
      </p>
      <div class="flex flex-wrap justify-center sm:justify-end gap-4">
        <a href="#" class="text-white/50 text-xs hover:text-primary transition">Terms of Use</a>
        <a href="#" class="text-white/50 text-xs hover:text-primary transition">Privacy Policy</a>
        <a href="#" class="text-white/50 text-xs hover:text-primary transition">Cookie Policy</a>
      </div>
    </div>

  </div>
</footer>
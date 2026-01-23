export interface EquipmentItem {
  id: number;
  slug: string;
  name: string;
  images: string[];
  available: boolean;
  type: "sale" | "lease"
}

import {
  vibratingRollers,
  motorGrades,
  dozerD6,
  airCompressor,
  wheelLoader,
  backhoe,
  dozerD8,
  dumpTrucks,
  waterPumps,
  weldingMachine,
  tippingTrucks,
  transitMixers,
  excavator,
  flatTractor,
  bitumenSpray,
  mobileCranes,
  generator
} from "$lib/assets/images";

export const equipmentList: EquipmentItem[] = [
    {
        id: 1,
        slug: "vibrating-rollers",
        name: "Vibrating Rollers",
        images: [vibratingRollers,motorGrades,dozerD6,backhoe],
        available:true,
        type: "lease"
    },
    {
        id: 2,
        slug: "motor-graders",
        name: "Motor Graders",
        images: [motorGrades,vibratingRollers,airCompressor,wheelLoader],
        available:true,
        type: "lease"
    },
    {
        id: 3,
        slug: "dozer-d6",
        name: "Dozer D6",
        images: [dozerD6,motorGrades,airCompressor,vibratingRollers],
        available:true,
        type: "sale"
    },
    {
        id: 4,
        slug: "air-compressor",
        name: "Air Compressor",
        images: [airCompressor,dozerD6,backhoe,motorGrades],
        available:true,
        type: "lease"
    },
    {
        id: 5,
        slug: "wheel-loader",
        name: "Wheel Loader",
        images: [wheelLoader,vibratingRollers,airCompressor,motorGrades],
        available:true,
        type: "sale"
    },
    {
        id: 6,
        slug: "back-hoe",
        name: "Back Hoe",
        images: [backhoe,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 7,
        slug: "bitumen-spray",
        name: "Bitumen Sprayer",
        images: [bitumenSpray,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "lease"
    },
    {
        id: 8,
        slug: "dozer-d8",
        name: "Dozer D8",
        images: [dozerD8,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 9,
        slug: "dump-trucks",
        name: "Dump Trucks",
        images: [dumpTrucks,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 10,
        slug: "excavator",
        name: "Excavator",
        images: [excavator,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 11,
        slug: "flat-tractor",
        name: "Flat Tractor",
        images: [flatTractor,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "lease"
    },
    {
        id: 12,
        slug: "generator",
        name: "Generator",
        images: [generator,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "lease"
    },
    {
        id: 13,
        slug: "mobile-cranes",
        name: "Mobile Cranes",
        images: [mobileCranes,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "lease"
    },
    {
        id: 14,
        slug: "tipping-trucks",
        name: "Tipping Trucks",
        images: [tippingTrucks,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 15,
        slug: "transit-mixers",
        name: "Transit Mixers",
        images: [transitMixers,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 16,
        slug: "water-pumps",
        name: "Water Pumps",
        images: [waterPumps,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
    {
        id: 17,
        slug: "welding-machine",
        name: "Welding Machine",
        images: [weldingMachine,wheelLoader,vibratingRollers,airCompressor],
        available:true,
        type: "sale"
    },
]


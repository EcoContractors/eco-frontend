import backdrop from '$lib/assets/images/backdrop.jpg';
import construction from '$lib/assets/images/construction.jpg';
import backdrop3 from '$lib/assets/images/backdrop3.jpg';
import construction2 from '$lib/assets/images/construction2.jpg';
import backdrop2 from '$lib/assets/images/backdrop2.jpg';


export interface CarouselSlide {
	id: number;
	image: string;
	title: string;
	description: string;
	alt: string;
}

export const servicesCarouselData: CarouselSlide[] = [
	{
		id: 1,
		image: backdrop,
		title: 'Excavation Services',
		description: 'Professional excavation and earthmoving solutions',
		alt: 'Excavator at construction site'
	},
	{
		id: 2,
		image: construction,
		title: 'Heavy Equipment Operations',
		description: 'Expert dozer and grading services',
		alt: 'Bulldozer equipment'
	},
	{
		id: 3,
		image: backdrop3,
		title: 'Material Transportation',
		description: 'Efficient hauling and material delivery',
		alt: 'Dump trucks for construction'
	},
	{
		id: 4,
		image: construction2,
		title: 'Site Preparation',
		description: 'Complete land clearing and preparation',
		alt: 'Flat tractor for site work'
	},
	{
		id: 5,
		image: backdrop2,
		title: 'Power Solutions',
		description: 'Reliable generator and power services',
		alt: 'Construction site generator'
	}
];
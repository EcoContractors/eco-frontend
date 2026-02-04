export interface Testimonial {
	id: number;
	name: string;
	position: string;
	company: string;
	image?: string;
	rating: number;
	text: string;
}

export const testimonials: Testimonial[] = [
	{
		id: 1,
		name: "John Anderson",
		position: "CEO",
		company: "Anderson Enterprises",
		rating: 5,
		text: "Working with this construction company has been an absolute pleasure. Their professionalism, attention to detail, and commitment to quality exceeded our expectations. They delivered our commercial project on time and within budget."
	},
	{
		id: 2,
		name: "Sarah Mitchell",
		position: "Project Manager",
		company: "Urban Development Corp",
		rating: 5,
		text: "The team's expertise in real estate development is unmatched. They guided us through every step of the process, from land acquisition to final handover. Highly recommend their services!"
	},
	{
		id: 3,
		name: "Michael Chen",
		position: "Director",
		company: "Chen Industries",
		rating: 5,
		text: "Exceptional service! Their equipment leasing solutions helped us complete our project efficiently. The machinery was top-notch and the support team was always available when we needed them."
	},
	{
		id: 4,
		name: "Emily Rodriguez",
		position: "Operations Manager",
		company: "Rodriguez Holdings",
		rating: 5,
		text: "From consultation to execution, everything was handled professionally. Their agricultural infrastructure expertise transformed our farming operations. We couldn't be happier with the results."
	},
	{
		id: 5,
		name: "David Williams",
		position: "Facility Manager",
		company: "Williams Petroleum",
		rating: 5,
		text: "Safety and compliance were top priorities throughout our petroleum facility construction. The team demonstrated deep industry knowledge and delivered a world-class facility."
	},
	{
		id: 6,
		name: "Lisa Thompson",
		position: "Owner",
		company: "Thompson Builders",
		rating: 5,
		text: "Their import/export services streamlined our material procurement process. Great communication, reliable delivery, and competitive pricing. A trusted partner for our business."
	}
];
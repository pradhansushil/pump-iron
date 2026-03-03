import { useState } from "react";

import Hero from "../components/home/Hero";
import Features from "../components/home/features/Features";
import MembershipPlans from "../components/home/MembershipPlans/MembershipPlans";
import Testimonials from "../components/home/testimonials/Testimonials";
import BookTourModal from "../components/BookTourModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <main>
      <Hero onBookTour={() => setIsModalOpen(true)} />
      <Features />
      <MembershipPlans />
      <Testimonials />

      <BookTourModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </main>
  );
}

import HeroCarousel from "@/components/HeroCarousel";
import BentoGrid from "@/components/BentoGrid";
import ProductGrid from "@/components/ProductGrid";
import FruitWisdom from "@/components/FruitWisdom";
import prisma from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany({
    include: { variants: true },
  });

  return (
    <div className="flex flex-col gap-0 overflow-hidden">
      <HeroCarousel />
      <BentoGrid />
      <ProductGrid products={products} />
      <FruitWisdom />

      {/* Newsletter / CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-organic-green rounded-[3rem] p-8 md:p-16 relative overflow-hidden text-center md:text-left">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Join the Fresh Revolution. Get 10% Off!
                </h2>
                <p className="text-emerald-100/70 text-lg mb-8">
                  Subscribe to our Fruit Wisdom newsletter and be the first to know about seasonal harvests and exclusive offers.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:bg-primary-dark transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="hidden lg:block relative w-80 h-80">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <img
                  src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?q=80&w=500&auto=format&fit=crop"
                  alt="Fresh Fruit"
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
    </div>
  );
}

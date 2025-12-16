import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function HiddenPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4 bg-[#0a0a14]">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#16162a] border border-white/10 rounded-2xl p-6 sm:p-8">
            <p className="text-xs font-bold text-[#00f5ff] bg-[#00f5ff]/10 px-3 py-1 rounded-full w-fit mb-4">
              [PLACEHOLDER]
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              Hidden Page
            </h1>
            <p className="text-gray-400 leading-relaxed">
              This route isn’t linked anywhere in the site navigation and is only accessible via a direct URL.
            </p>
            <p className="text-gray-400 leading-relaxed mt-3">
              We’ll build this page later.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

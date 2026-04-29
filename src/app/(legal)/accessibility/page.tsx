export const unstable_instant = { prefetch: "static" };
import Navbar from "@/components/Navbar";
import { Eye, Accessibility, Palette } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center pt-24 px-6 md:px-12 w-full mx-auto pb-32">
      <Navbar user={null} />

      <main className="w-full max-w-4xl flex flex-col gap-12 mt-8">
        <header className="border-b-8 border-primary pb-8">
          <div className="flex items-center gap-4 mb-4">
            <Accessibility className="text-primary" size={48} />
            <h1 className="font-headline text-5xl md:text-7xl font-black text-on-surface tracking-tighter uppercase leading-none">Accessibility</h1>
          </div>
          <p className="font-label font-bold text-on-surface-variant text-xl uppercase tracking-wider">Inclusive Exploration in the Noir Universe</p>
        </header>

        <article className="prose prose-p:font-body prose-headings:font-headline prose-p:text-lg prose-p:leading-relaxed max-w-none w-full bg-white p-8 md:p-12 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-[#171717]">
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Palette className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">1. Our Design Philosophy</h2>
            </div>
            <p>
              SOULPAD utilizes a high-contrast <strong>"Noir Aesthetic"</strong> designed for focus and immersion. 
              While this style is core to our identity, we recognize that extreme contrast and dark themes can present challenges for 
              readers with visual impairments or photosensitivity.
            </p>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="text-primary" size={28} />
              <h2 className="m-0 uppercase italic font-black">2. Visual Adjustments</h2>
            </div>
            <p>We are committed to making the SOULPAD universe accessible to everyone. We recommend the following tools for an optimized experience:</p>
            <ul>
                <li><strong>Browser Zoom:</strong> Our layout is built with responsive units and supports zooming up to 200% without loss of functionality.</li>
                <li><strong>Screen Readers:</strong> We use semantic HTML tags to ensure that our stories and navigation elements are identifiable by assistive technologies.</li>
                <li><strong>Contrast Control:</strong> If our Noir theme is too intense, we recommend using browser extensions like <em>Dark Reader</em> to adjust grayscale or brightness levels to your comfort.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="m-0 uppercase italic font-black">3. Continuous Improvement</h2>
            <p>
              Accessibility is an ongoing journey. We are constantly auditing our components to meet <strong>WCAG 2.1 Level AA</strong> standards. 
              If you encounter any barriers while navigating SOULPAD, please reach out to our team.
            </p>
          </section>

          <hr className="border-t-2 border-on-surface my-8" />
          
          <div className="bg-surface border-2 border-on-surface p-6 font-headline text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="font-black uppercase tracking-widest text-sm mb-2">Feedback Loop</p>
            <p className="text-base font-bold italic underline decoration-primary underline-offset-4">
                accessibility@soulpad.app
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}


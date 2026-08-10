import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OurTeam = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 pb-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center pb-6">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Meet the Committee</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              The driving force behind UIY 2026. A dedicated team of professionals and students working together to inspire innovation.
            </p>
          </div>

          {/* Highest Dominancy: engexcom.png */}
          <section className="animate-fade-up">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-2 md:p-4">
              <img
                src="/images/committee/engexcom.png"
                alt="Engineering Executive Committee"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </section>

          {/* Next Dominancy: ugexcom.jpg */}
          <section className="animate-fade-up" style={{ animationDelay: '100ms' }}>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-2 md:p-4">
              <img
                src="/images/committee/ugexcom.jpg"
                alt="Undergraduate Executive Committee"
                className="w-full h-auto object-contain rounded-xl"
              />
            </div>
          </section>

          {/* Least Dominancy: pil1.jpg - pil4.jpg */}
          <section className="animate-fade-up" style={{ animationDelay: '200ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={`/images/committee/pil${num}.jpg`}
                    alt={`Project Implementation Leader ${num}`}
                    className="w-full h-auto aspect-square object-cover"
                  />
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurTeam;


import React from 'react';
import { Camera, ExternalLink } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

// Placeholder images - in a real application these would be actual event photos
const galleryImages1 = [
  {
    src: "/images/img1.jpg",
    alt: "Students collaborating on a project",
    caption: "Engineering students collaborating on innovative solutions"
  },
  {
    src: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80&w=500",
    alt: "Award ceremony",
    caption: "Award ceremony from previous year"
  },
  {
    src: "https://images.unsplash.com/photo-1581092160607-ee22731c552f?auto=format&fit=crop&q=80&w=500",
    alt: "Engineering prototype",
    caption: "Engineering prototype demonstration"
  },
  {
    src: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?auto=format&fit=crop&q=80&w=500",
    alt: "Student presentation",
    caption: "Student presenting their innovation"
  },
  {
    src: "https://images.unsplash.com/photo-1581092918086-741eba724f38?auto=format&fit=crop&q=80&w=500",
    alt: "Workshop session",
    caption: "Workshop session for participants"
  }
];

const Gallery = () => {
  const galleryImages = Array.from({ length: 5 }).map((_, index) => ({
    src: `/images/img${index + 1}.jpg`,
    alt: `Image ${index + 1}`,
    caption: `Image ${index + 1
    }`,
  }));
  return (
    <section id="gallery" className="py-24 bg-uiy-gray">
      <div className="section-container">
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <div className="flex justify-center mb-3">
            <Camera className="w-8 h-8 text-uiy-blue" />
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Event Gallery</h2>
          <p className="text-lg text-gray-600">
            Explore highlights from previous UIY events and competitions.
          </p>
        </div>

        <div className="reveal-animation">
          <Carousel
            opts={{ loop: true }}
            className="w-full max-w-5xl mx-auto"
          >
            <CarouselContent>
              {galleryImages.map((image, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden border-0 card-hover">
                      <CardContent className="p-0">
                        <div className="relative group">
                          <img 
                            src={image.src} 
                            alt={image.alt} 
                            className="w-full h-64 object-cover rounded-t-lg"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-uiy-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <p className="text-white font-medium text-sm">{image.caption}</p>
                            <a href={image.src} target="_blank" rel="noopener noreferrer" className="text-uiy-accent flex items-center gap-1 text-sm mt-2">
                              <span>View full size</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-2 mt-8">
              <CarouselPrevious className="relative static left-0 right-auto top-auto translate-y-0 -translate-x-0" />
              <CarouselNext className="relative static right-0 left-auto top-auto translate-y-0 translate-x-0" />
            </div>
          </Carousel>
        </div>

        <div className="mt-8 flex w-full text-center">
          <img src="/images/img23.jpg" alt="" className='max-w-[600px] mx-auto' />
        </div>
      </div>
    </section>
  );
};

export default Gallery;

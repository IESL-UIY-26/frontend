import React from "react";
import { Camera, ExternalLink } from "lucide-react";
import AutoScroll from "embla-carousel-auto-scroll";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Card, CardContent } from "@/components/ui/card";

const Gallery = () => {

  const images = [
    "/images/img1.jpg",
    "/images/img2.jpg",
    "/images/img3.jpg",
    "/images/img4.jpg",
    "/images/img5.jpg",
  ];

  // duplicate images for smoother infinite loop
  const galleryImages = [...images, ...images];

  return (
    <section id="gallery" className="py-24 bg-uiy-gray">
      <div className="section-container">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 reveal-animation">
          <div className="flex justify-center mb-3">
            <Camera className="w-8 h-8 text-uiy-blue" />
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Event Gallery
          </h2>

          <p className="text-lg text-gray-600">
            Explore highlights from previous UIY events and competitions.
          </p>
        </div>

        {/* Carousel */}
        <div className="reveal-animation">
          <Carousel
            opts={{
              loop: true,
              dragFree: true,
            }}
            plugins={[
              AutoScroll({
                speed: 0.8,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }),
            ]}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent>
              {galleryImages.map((src, index) => (
                <CarouselItem
                  key={index}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="overflow-hidden border-0 card-hover">
                      <CardContent className="p-0">
                        <div className="relative group">

                          <img
                            src={src}
                            alt={`Image ${index + 1}`}
                            className="w-full h-64 object-cover"
                          />

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-uiy-dark/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">

                            <p className="text-white font-medium text-sm">
                              Image {index + 1}
                            </p>

                            <a
                              href={src}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-white flex items-center gap-1 text-sm mt-2"
                            >
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

          </Carousel>
        </div>

        {/* Large Image */}
        <div className="mt-12 flex w-full text-center">
          <img
            src="/images/img23.jpg"
            alt="UIY - The grand finale"
            className="max-w-[700px] mx-auto w-full rounded-lg shadow-lg"
          />
        </div>

      </div>
    </section>
  );
};

export default Gallery;
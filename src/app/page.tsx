"use client";

import type { ChangeEvent } from "react";
import Image from 'next/image';
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { HeartPulse, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useSessionContext } from '@/context/session-context';
import { useDialogContext } from '@/context/dialog-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function HomePage() {
  const [message, setMessage] = useState<string>("Hola, Mundo!");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [petImages, setPetImages] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState<number>(0);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setAnimationKey(prevKey => prevKey + 1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    async function fetchPetImages() {
      try {
        const response = await fetch('/api/pets');
        const data = await response.json();
        if (data.imageUrls) {
          setPetImages(data.imageUrls);
        }
      } catch (error) {
        console.error('Error fetching pet images:', error);
      }
    }
    fetchPetImages();
  }, []);

  const { showDialog, closeDialog, dialogState } = useDialogContext();
  const { isSessionActive, setIsSessionActive } = useSessionContext();
  const router = useRouter();

  const handleVeterinarianClick = () => {
    showDialog({
      title: '¿Deseas registrarte?',
      description: '',
      buttons: [
        {
          label: 'No',
          onClick: () => closeDialog(),
        },
        {
          label: 'Si',
          onClick: () => {
            closeDialog();
            router.push('/veterinarian-register');
          },
        },
      ],
    });
  }

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://doctorpet.onrender.com/auth/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Logout: ", data.message);
        showDialog({
          title: 'Sesión cerrada',
          description: 'Vuelve pronto',
          buttons: [
            {
              label: 'Ok',
              onClick: () => {
                setIsSessionActive(false);
                closeDialog();
                router.push('/');
              },
            },
          ],
        })
      } else if (response.status === 401) {
        console.error("Error: ", data.error + '. ' +data.details);
        showDialog({
          title: data.error,
          description: data.details,
          buttons: [
            {
              label: 'Ok',
              onClick: () => closeDialog(),
            },
          ],
        })
      } else {
        console.error("Unexpected error:", data);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
    ]
  };

  // Add a style block for the carousel navigation arrows
  const carouselArrowStyles = `
    .slick-prev:before,
    .slick-next:before {
      color: #1e3a8a; /* Replace with your primary blue color value */
      font-size: 30px; /* Adjust size if needed */
      opacity: 1; /* Ensure visibility */
    }
  `;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Add the style tag at the top of the component */}
      <style dangerouslySetInnerHTML={{ __html: carouselArrowStyles }} />
      
      <header className="p-4 sm:p-6 border-b">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <HeartPulse className="h-8 w-8 text-primary" />
              <span className="font-semibold text-xl sm:text-2xl text-primary">
                PetDoctor
              </span>
            </div>
            <div className="relative hidden md:block md:w-64 lg:w-80 xl:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full rounded-full border-input bg-background px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                aria-label="Search PetWell"
              />
            </div>
          </div>
          <div className="flex items-center ml-auto space-x-2">
            <div>
              <Button
                type="button"
                variant="secondary"
                className="text-sm"
                onClick={handleVeterinarianClick}
              >
                ¿Sos Veterinario?
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="secondary"
                className="text-sm"
              >
                ¿Sos Centro Médico Veterinario?
              </Button>
            </div>
            <div>
              <Button
                type="button"
                variant="secondary"
                className="text-sm"
              >
                ¿Ofreces algún servicio para mascotas?
              </Button>
            </div>
            {!isSessionActive ? (
              <div>
                <Button
                  type="button"
                  className="text-sm"
                  onClick={() => {
                    router.push("/login")
                  }}
                >
                  ¿Iniciar Sessión?
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  type="submit"
                  className="text-sm"
                  onClick={handleLogout}
                >
                  ¿Cerrar Sessión?
                </Button>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {/* Future header items can go here */}
          </div>
        </div>

        {/* Mobile Search Bar (below logo/actions row, visible on <md screens) */}
        <div className="mt-4 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full rounded-full border-input bg-background px-10 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="Search PetWell"
            />
          </div>
        </div>
      </header>

      {/* Pet Images Carousel */}
      {petImages.length > 0 && (
        <div className="w-full max-w-3xl mt-8 mx-auto">
          <Slider {...settings} className="carousel-slider">
            {petImages.map((imageUrl, index) => (
              <div key={index} className="carousel-image-container">
                <Image
                  src={imageUrl} 
                  alt={`Mascota ${index + 1}`}
                  width={400}
                  height={300}
                  objectFit="cover"
                  className="carousel-image rounded-md"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Animal Type Cards Section */}
      <section className="w-full py-12 md:py-16 lg:py-20">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Mascotas</h2>
        <div className="flex justify-center gap-6 flex-wrap">
          <div className="w-40 h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Image src="/images/dog-icon.png" alt="Dog Icon" width={60} height={60} className="mb-2" />
            <span className="text-lg font-medium text-gray-700">Dogs</span>
          </div>
          <div className="w-40 h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Image src="/images/cat-icon.png" alt="Cat Icon" width={60} height={60} className="mb-2" />
            <span className="text-lg font-medium text-gray-700">Cats</span>
          </div>
          <div className="w-40 h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Image src="/images/bird-icon.png" alt="Bird Icon" width={60} height={60} className="mb-2" />
            <span className="text-lg font-medium text-gray-700">Birds</span>
          </div>
          <div className="w-40 h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <Image src="/images/reptile-icon.png" alt="Reptile Icon" width={60} height={60} className="mb-2" />
            <span className="text-lg font-medium text-gray-700">Reptiles</span>
          </div>
          {/* Add more animal types as needed */}
        </div>
      </section>

      {/* Add placeholder images for the animal type cards */}
      <div style={{ display: 'none' }}>
        <Image src="/images/dog-icon.png" alt="Dog Icon Placeholder" width={1} height={1} />
        <Image src="/images/cat-icon.png" alt="Cat Icon Placeholder" width={1} height={1} />
        <Image src="/images/bird-icon.png" alt="Bird Icon Placeholder" width={1} height={1} />
        <Image src="/images/reptile-icon.png" alt="Reptile Icon Placeholder" width={1} height={1} />
      </div>
      {/* End of placeholder images */}

      {/* Rest of your main content */}
      <main className="flex-grow flex flex-col items-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Tu contenido aquí */}
          </div>
        </div>
      </main>
    </div>
  );
}

// Add a style block for the carousel-image class
const styles = `
  .carousel-image-container {
    width: 300px;
    height: 200px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
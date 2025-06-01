"use client";

import type { ChangeEvent } from "react";
import Image from 'next/image';
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { HeartPulse, Search, Menu, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [petImages, setPetImages] = useState<string[]>([]);
  const [animationKey, setAnimationKey] = useState<number>(0);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setAnimationKey(prevKey => prevKey + 1);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    console.log(`Buscando: ${searchTerm} en categoría: ${selectedCategory}`);
    // Aquí puedes agregar la lógica de búsqueda
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
        breakpoint: 1200,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          arrows: false
        }
      }
    ]
  };

  const carouselArrowStyles = `
    .slick-prev:before,
    .slick-next:before {
      color: #1e3a8a;
      font-size: 24px;
      opacity: 1;
    }
    
    @media (max-width: 768px) {
      .slick-prev:before,
      .slick-next:before {
        font-size: 18px;
      }
    }
  `;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <style dangerouslySetInnerHTML={{ __html: carouselArrowStyles }} />
      
      <header className="p-3 sm:p-4 lg:p-6 border-b">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <HeartPulse className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="font-semibold text-lg sm:text-xl lg:text-2xl text-primary">
              PetDoctor
            </span>
          </div>

          {/* Desktop Search - Estilo Amazon Corregido */}
          <div className="relative hidden lg:flex w-48 xl:w-96 bg-white rounded-md border border-gray-300 overflow-hidden shadow-sm">
            {/* Dropdown de categorías */}
            <div className="flex-shrink-0 bg-gray-100 border-r border-gray-300 relative">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-20 xl:w-28 h-10 border-0 bg-transparent rounded-none focus:ring-0 text-xs xl:text-sm px-2 [&>svg]:hidden flex items-center justify-between">
                  <span className="truncate">
                    {selectedCategory === "all" ? "Todos" : 
                     selectedCategory === "veterinarios" ? "Veterinarios" :
                     selectedCategory === "clinicas" ? "Clínicas" :
                     selectedCategory === "servicios" ? "Servicios" :
                     selectedCategory === "productos" ? "Productos" :
                     selectedCategory === "emergencias" ? "Emergencias" :
                     selectedCategory === "especialistas" ? "Especialistas" :
                     selectedCategory === "farmacias" ? "Farmacias" :
                     selectedCategory === "grooming" ? "Grooming" :
                     selectedCategory === "entrenamiento" ? "Entrenamiento" :
                     selectedCategory === "guarderia" ? "Guardería" :
                     selectedCategory === "adopcion" ? "Adopción" : "Todos"}
                  </span>
                  <ChevronDown className="h-3 w-3 xl:h-4 xl:w-4 flex-shrink-0" />
                </SelectTrigger>
                <SelectContent className="w-56">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="veterinarios">Veterinarios</SelectItem>
                  <SelectItem value="clinicas">Clínicas Veterinarias</SelectItem>
                  <SelectItem value="servicios">Servicios para Mascotas</SelectItem>
                  <SelectItem value="productos">Productos</SelectItem>
                  <SelectItem value="emergencias">Emergencias</SelectItem>
                  <SelectItem value="especialistas">Especialistas</SelectItem>
                  <SelectItem value="farmacias">Farmacias Veterinarias</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
                  <SelectItem value="guarderia">Guardería</SelectItem>
                  <SelectItem value="adopcion">Adopción</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo de búsqueda expandido */}
            <div className="flex-1 min-w-0">
              <Input
                type="search"
                placeholder="Buscar veterinarios, servicios, productos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-10 border-0 rounded-none focus:ring-0 focus:outline-none focus-visible:ring-0 text-sm px-3 bg-white"
                aria-label="Search PetDoctor"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {/* Botón de búsqueda con color corporativo */}
            <Button 
              type="button"
              className="flex-shrink-0 w-10 xl:w-12 h-10 bg-primary hover:bg-primary/90 rounded-none border-0 p-0"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 xl:h-5 xl:w-5 text-white" />
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-2">
            <Button
              type="button"
              variant="secondary"
              className="text-xs lg:text-sm whitespace-nowrap"
              onClick={() => router.push("/login")}
            >
              ¿Sos Veterinario?
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="text-xs lg:text-sm whitespace-nowrap"
            >
              ¿Centro Médico?
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="text-xs lg:text-sm whitespace-nowrap"
            >
              ¿Ofreces servicios?
            </Button>
            {!isSessionActive ? (
              <Button
                type="button"
                className="text-xs lg:text-sm whitespace-nowrap"
                onClick={() => router.push("/login")}
              >
                Iniciar Sesión
              </Button>
            ) : (
              <Button
                type="button"
                className="text-xs lg:text-sm whitespace-nowrap"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="xl:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Search - Estilo Amazon Corregido */}
        <div className="mt-3 lg:hidden">
          <div className="flex bg-white rounded-md border border-gray-300 overflow-hidden shadow-sm">
            {/* Dropdown móvil */}
            <div className="flex-shrink-0 bg-gray-100 border-r border-gray-300">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-16 sm:w-20 h-10 border-0 bg-transparent rounded-none focus:ring-0 text-xs px-1 [&>svg]:hidden flex items-center justify-between">
                  <span className="truncate text-xs">
                    {selectedCategory === "all" ? "Todos" : 
                     selectedCategory === "veterinarios" ? "Vets" :
                     selectedCategory === "clinicas" ? "Clínicas" :
                     selectedCategory === "servicios" ? "Servicios" :
                     selectedCategory === "productos" ? "Productos" :
                     "Todos"}
                  </span>
                  <ChevronDown className="h-3 w-3 flex-shrink-0" />
                </SelectTrigger>
                <SelectContent className="w-56">
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="veterinarios">Veterinarios</SelectItem>
                  <SelectItem value="clinicas">Clínicas Veterinarias</SelectItem>
                  <SelectItem value="servicios">Servicios para Mascotas</SelectItem>
                  <SelectItem value="productos">Productos</SelectItem>
                  <SelectItem value="emergencias">Emergencias</SelectItem>
                  <SelectItem value="especialistas">Especialistas</SelectItem>
                  <SelectItem value="farmacias">Farmacias Veterinarias</SelectItem>
                  <SelectItem value="grooming">Grooming</SelectItem>
                  <SelectItem value="entrenamiento">Entrenamiento</SelectItem>
                  <SelectItem value="guarderia">Guardería</SelectItem>
                  <SelectItem value="adopcion">Adopción</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Campo de búsqueda móvil expandido */}
            <div className="flex-1 min-w-0">
              <Input
                type="search"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-10 border-0 rounded-none focus:ring-0 focus:outline-none focus-visible:ring-0 text-sm px-3 bg-white"
                aria-label="Search PetDoctor"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {/* Botón de búsqueda móvil con color corporativo */}
            <Button 
              type="button"
              className="flex-shrink-0 w-10 h-10 bg-primary hover:bg-primary/90 rounded-none border-0 p-0"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4 text-white" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="xl:hidden mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
            <Button
              type="button"
              variant="secondary"
              className="w-full text-sm"
              onClick={() => {
                router.push("/login");
                setShowMobileMenu(false);
              }}
            >
              ¿Sos Veterinario?
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full text-sm"
              onClick={() => setShowMobileMenu(false)}
            >
              ¿Centro Médico Veterinario?
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="w-full text-sm"
              onClick={() => setShowMobileMenu(false)}
            >
              ¿Ofreces servicios para mascotas?
            </Button>
            {!isSessionActive ? (
              <Button
                type="button"
                className="w-full text-sm"
                onClick={() => {
                  router.push("/login");
                  setShowMobileMenu(false);
                }}
              >
                Iniciar Sesión
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full text-sm"
                onClick={() => {
                  handleLogout();
                  setShowMobileMenu(false);
                }}
              >
                Cerrar Sesión
              </Button>
            )}
          </div>
        )}
      </header>

      {/* Pet Images Carousel */}
      {petImages.length > 0 && (
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mt-4 sm:mt-6 lg:mt-8 mx-auto px-4">
          <Slider {...settings} className="carousel-slider">
            {petImages.map((imageUrl, index) => (
              <div key={index} className="carousel-image-container">
                <Image
                  src={imageUrl} 
                  alt={`Mascota ${index + 1}`}
                  width={400}
                  height={300}
                  className="carousel-image rounded-md"
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {/* Animal Type Cards Section */}
      <section className="w-full py-8 sm:py-12 lg:py-16 xl:py-20 px-4">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8">Mascotas</h2>
        <div className="flex justify-center gap-3 sm:gap-4 lg:gap-6 flex-wrap max-w-6xl mx-auto">
          {[
            { src: "/images/dog-icon.png", alt: "Dog Icon", label: "Dogs" },
            { src: "/images/cat-icon.png", alt: "Cat Icon", label: "Cats" },
            { src: "/images/bird-icon.png", alt: "Bird Icon", label: "Birds" },
            { src: "/images/reptile-icon.png", alt: "Reptile Icon", label: "Reptiles" }
          ].map((animal, index) => (
            <div 
              key={index}
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 flex flex-col items-center justify-center bg-white rounded-full shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <Image 
                src={animal.src} 
                alt={animal.alt} 
                width={40} 
                height={40} 
                className="mb-1 sm:mb-2 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" 
              />
              <span className="text-xs sm:text-sm lg:text-base font-medium text-gray-700 text-center">
                {animal.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Hidden placeholder images */}
      <div style={{ display: 'none' }}>
        <Image src="/images/dog-icon.png" alt="Dog Icon Placeholder" width={1} height={1} />
        <Image src="/images/cat-icon.png" alt="Cat Icon Placeholder" width={1} height={1} />
        <Image src="/images/bird-icon.png" alt="Bird Icon Placeholder" width={1} height={1} />
        <Image src="/images/reptile-icon.png" alt="Reptile Icon Placeholder" width={1} height={1} />
      </div>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <div className="text-center">
            {/* Tu contenido aquí */}
          </div>
        </div>
      </main>

      {/* Custom styles */}
      <style jsx>{`
        .carousel-image-container {
          width: 100%;
          height: 150px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        @media (min-width: 640px) {
          .carousel-image-container {
            height: 200px;
          }
        }
        
        @media (min-width: 768px) {
          .carousel-image-container {
            height: 250px;
          }
        }
        
        @media (min-width: 1024px) {
          .carousel-image-container {
            height: 300px;
          }
        }
        
        @media (min-width: 1280px) {
          .carousel-image-container {
            height: 350px;
          }
        }
        
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
}
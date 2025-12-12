import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const RMCarousel = (Carousel as any).default ? (Carousel as any).default : Carousel;

export default function CarouselHeader() {
  return (
    <RMCarousel
      additionalTransfrom={0}
      arrows={false}
      autoPlay={true}
      autoPlaySpeed={3000}
      centerMode={false}
      className="carousel-header"
      containerClass="container"
      dotListClass="carousel-dots"
      draggable={false}
      focusOnSelect={false}
      infinite
      itemClass=""
      keyBoardControl={true}
      ssr={true}
      minimumTouchDrag={80}
      pauseOnHover={true}
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 1024,
          },
          items: 1,
        },
        mobile: {
          breakpoint: {
            max: 464,
            min: 0,
          },
          items: 1,
        },
        tablet: {
          breakpoint: {
            max: 1024,
            min: 464,
          },
          items: 1,
        },
      }}
      rewind={false}
      rewindWithAnimation={false}
      rtl={false}
      shouldResetAutoplay
      showDots
      sliderClass=""
      slidesToSlide={1}
      swipeable
    >
      <div
        style={{
          backgroundImage: "url('/manticore/core-character-splash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: "url('/splash/auravale.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: "url('/splash/vampire_screen_2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: "url('/splash/splash6.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: "url('/splash/splash2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
      <div
        style={{
          backgroundImage: "url('/splash/splash5.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100%",
          width: "100%",
        }}
      />
    </RMCarousel>
  );
}



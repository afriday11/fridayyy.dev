import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const RMCarousel = (Carousel as any).default
  ? (Carousel as any).default
  : Carousel;

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
      draggable={true}
      focusOnSelect={false}
      infinite
      itemClass="carousel-item"
      keyBoardControl={true}
      ssr={true}
      minimumTouchDrag={80}
      pauseOnHover={true}
      renderArrowsWhenDisabled={false}
      renderButtonGroupOutside={false}
      renderDotsOutside={false}
      responsive={{
        wide: {
          breakpoint: {
            max: 10000,
            min: 3000,
          },
          items: 3,
        },
        narrow: {
          breakpoint: {
            max: 3000,
            min: 0,
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

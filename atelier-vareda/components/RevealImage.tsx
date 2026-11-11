import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  /**
   * scroll:  GSAP reveals it when it enters the viewport.
   * gallery: GSAP reveals it as the horizontal track brings it in.
   * hero:    pure CSS reveal on first paint (no JS wait, protects LCP).
   */
  reveal?: "scroll" | "gallery" | "hero";
  /** y: vertical parallax. x: horizontal (gallery). hero: starts at rest. */
  parallax?: "y" | "x" | "hero" | false;
  preload?: boolean;
  quality?: number;
  objectPosition?: string;
};

// Layers: frame > mask (slides up) > inner (slides down, cancels the mask, so the
// picture stays still while its visible window grows from the bottom edge) >
// parallax (oversized) > zoom (scale settles) > image. Only transforms animate.
export function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  reveal = "scroll",
  parallax = "y",
  preload = false,
  quality = 70,
  objectPosition = "50% 50%",
}: Props) {
  const layer = parallax === "x" ? "parallax-x" : parallax ? "parallax" : "absolute inset-0";
  return (
    <div
      className={`reveal ${reveal === "hero" ? "hero-img" : ""} ${className}`}
      data-reveal={reveal === "hero" ? undefined : reveal}
    >
      <div className="reveal-mask">
        <div className="reveal-inner">
          <div className={layer} data-parallax={parallax || undefined}>
            <div className="zoom" data-zoom>
              <Image
                src={src}
                alt={alt}
                fill
                sizes={sizes}
                quality={quality}
                preload={preload}
                fetchPriority={preload ? "high" : undefined}
                className="object-cover"
                style={{ objectPosition }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

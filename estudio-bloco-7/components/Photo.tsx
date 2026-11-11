import Image from 'next/image';

type Props = {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  colorize?: boolean;
  parallax?: boolean;
};

/**
 * Black and white photo with the same image in color stacked on top.
 * Hover (or scroll on touch) fades the color layer in, so only opacity animates.
 * Both layers share one URL, so the browser downloads it once.
 */
export default function Photo({ src, alt, sizes, className = '', priority, quality = 65, colorize = true, parallax }: Props) {
  const layer = parallax ? 'absolute inset-x-0 -inset-y-[7%]' : 'absolute inset-0';
  return (
    <div className={`photo ${className}`} data-colorize={colorize ? '' : undefined} data-parallax={parallax ? '' : undefined}>
      <div className={layer} data-parallax-inner={parallax ? '' : undefined}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          preload={priority}
          fetchPriority={priority ? 'high' : undefined}
          loading={priority ? 'eager' : undefined}
          className="bw"
        />
        {/* same URL as above, so it comes from cache */}
        <Image src={src} alt="" aria-hidden fill sizes={sizes} quality={quality} loading={priority ? 'eager' : undefined} className="color" />
      </div>
    </div>
  );
}

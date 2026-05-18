import rspcbLogo from '../assets/rspcb-logo.jpeg';

type RspcbLogoProps = {
  className?: string;
  imageClassName?: string;
};

export const RspcbLogo = ({ className = '', imageClassName = '' }: RspcbLogoProps) => (
  <span
    className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-white ${className}`}
    aria-label="RSPCB"
  >
    <img
      src={rspcbLogo}
      alt="RSPCB logo"
      className={`h-full w-full object-contain ${imageClassName}`}
    />
  </span>
);

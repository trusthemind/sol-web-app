export const getParticleAnimation = (type: string) => {
  switch (type) {
    case "sunshine":
      return {
        animate: {
          y: [-20, -40, -20],
          x: [-10, 10, -10],
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        },
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "gentle":
      return {
        animate: {
          y: [-10, -30, -10],
          opacity: [0.3, 0.8, 0.3],
        },
        transition: {
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "electric":
      return {
        animate: {
          x: [-5, 5, -5],
          y: [-5, 5, -5],
          scale: [0.8, 1.2, 0.8],
        },
        transition: {
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "rain":
      return {
        animate: {
          y: [0, window.innerHeight + 50],
          x: [-20, 20],
        },
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        },
      };
    case "fire":
      return {
        animate: {
          y: [-30, -60, -30],
          x: [-15, 15, -15],
          scale: [0.8, 1.3, 0.8],
          rotate: [-10, 10, -10],
        },
        transition: {
          duration: 1,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "sparkle":
      return {
        animate: {
          scale: [0, 1.5, 0],
          rotate: [0, 180, 360],
          opacity: [0, 1, 0],
        },
        transition: {
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "dreamy":
      return {
        animate: {
          y: [-50, -100, -50],
          opacity: [0.2, 0.6, 0.2],
          scale: [0.5, 1, 0.5],
        },
        transition: {
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    default:
      return {
        animate: { y: [-20, -40, -20] },
        transition: { duration: 4, repeat: Number.POSITIVE_INFINITY },
      };
  }
};

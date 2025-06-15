export const getMoodAnimation = (animationType: string) => {
  switch (animationType) {
    case "bounce":
      return {
        animate: { y: [0, -10, 0] },
        transition: { duration: 0.6, repeat: Number.POSITIVE_INFINITY },
      };
    case "float":
      return {
        animate: { y: [0, -5, 0], x: [0, 2, 0] },
        transition: {
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "pulse":
      return {
        animate: { scale: [1, 1.05, 1] },
        transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
      };
    case "shake":
      return {
        animate: { x: [0, -2, 2, 0] },
        transition: { duration: 0.5, repeat: Number.POSITIVE_INFINITY },
      };
    case "vibrate":
      return {
        animate: { x: [0, -1, 1, 0], y: [0, -1, 1, 0] },
        transition: { duration: 0.1, repeat: Number.POSITIVE_INFINITY },
      };
    case "drift":
      return {
        animate: { x: [0, -3, 3, 0], y: [0, -2, 2, 0] },
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    case "slow":
      return {
        animate: { scale: [1, 1.02, 1] },
        transition: {
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        },
      };
    default:
      return {
        animate: { scale: [1, 1.02, 1] },
        transition: { duration: 2, repeat: Number.POSITIVE_INFINITY },
      };
  }
};

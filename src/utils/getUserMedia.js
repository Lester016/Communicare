export const getUserMedia = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

export const getFormattedTime = (date) => {
  const minute = date.getMinutes();
  const hour = date.getHours();

  return `${hour}:${minute}`;
};

import { month } from "../constants/month";

export const getFormattedDate = (date) => {
  return `${month[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

export const findContact = (array, item) => {
  for (let index = 0; index < array.length; index++) {
    const element = array[index].userID;

    if (element === item) {
      return true;
    }
  }
};

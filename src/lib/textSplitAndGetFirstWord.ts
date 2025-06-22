export const textSplitAndGetFirstWord = (text: string) => {
  const array = text.split(" ");
  const firstWord = array[0];
  return firstWord.toLowerCase();
};

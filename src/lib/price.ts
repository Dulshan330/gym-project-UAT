export const getFormattedPrice = (price: number | undefined | null) => {
  if (!price) return "0";
  return price.toLocaleString("en-US");
};

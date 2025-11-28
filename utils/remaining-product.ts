export const remainingProduct = (
  qtySack: number,
  qtyDozens: number,
  fillPerSack: number
) => {
  const remainingSacks = qtySack;
  const remainingDozens =
    qtySack > 0 && qtyDozens % fillPerSack !== 0
      ? Math.floor(qtyDozens % fillPerSack)
      : 0;

  return { remainingSacks, remainingDozens };
};

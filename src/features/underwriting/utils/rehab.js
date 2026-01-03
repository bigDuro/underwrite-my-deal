export function calcRehab(inputs) {
  const items = inputs.rehabItems || [];

  const subtotal = items.reduce((sum, i) => sum + (Number(i.cost) || 0), 0);
  const contingency = subtotal * (Number(inputs.rehabContingencyPct) || 0) / 100;

  return {
    rehabSubtotal: subtotal,
    rehabContingency: contingency,
    rehabTotal: subtotal + contingency,
  };
}

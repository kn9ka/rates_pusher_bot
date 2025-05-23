export const Currency = {
  CASHUSD: '568',
  ETH: '355',
  WIREUAH: '537',
  ZELLE: '578',
  WIREKZT: '539',
  USDTBEP20: '369',
  USDTERC20: '367',
  TRX: '385',
  WIRERUB: '535',
  LYUBOYBANK: '581',
  USDCERC20: '371',
  USDTTRC20: '368',
  BTC: '348',
} as const;

export type Currency = (typeof Currency)[keyof typeof Currency];

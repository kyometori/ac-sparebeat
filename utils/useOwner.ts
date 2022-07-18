export enum PageOwner {
  AC, MeowRim
}

export function useOwner(route: string): PageOwner {
  if (route.startsWith('/mrsr')) return PageOwner.MeowRim

  return PageOwner.AC
}
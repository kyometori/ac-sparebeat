export interface MapData {
  name: string,
  title: string,
  artist: string,
  level: MapDiffData,
  in?: boolean
}

export interface MapDiffData {
  easy: string,
  normal: string,
  hard: string
}
import type { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { readdirSync } from 'fs'

interface MapData {
  name: string,
  title: string,
  artist: string,
  level: MapDiffData,
  in?: boolean
}

interface MapDiffData {
  easy: string,
  normal: string,
  hard: string
}

interface HomepageProps {
  data: Array<MapData>
}

const Home: NextPage<HomepageProps> = ({ data }: HomepageProps) => {
  return (
    <>
      <h1>Maps</h1>
      <table className={styles.list}>
        <thead>
          <tr><th>Title</th><th>Artist</th><th>Easy</th><th>Normal</th><th>Hard</th></tr>
        </thead>
        <tbody>
        {
          data.map((d, i) => (
            <tr key={d.name} className={d.in ? styles.in : ''}>
              <td><Link href={`/play/${d.name}`}><a>{d.title}</a></Link></td>
              <td>{d.artist}</td>
              <td>{d.level.easy || "-"}</td>
              <td>{d.level.normal || "-"}</td>
              <td>{d.level.hard || "-"}</td>
            </tr>
          ))
        }
        </tbody>
        {/*<tbody>
          <tr><td><a href="穢れなき薔薇十字">穢れなき薔薇十字</a></td><td>Ariabl{`'`}eyeS</td><td> -</td><td> -</td><td>  13</td></tr>
          <tr><td><a href="失礼しますが、RIP♡  (Ðáren Remix)">失礼しますが、RIP♡  (Ðáren Remix)</a></td><td>暗雨Ðáren</td><td> -</td><td> -</td><td> 14</td></tr>
          <tr><td><a href="カラフル">カラフル</a></td><td>H△G</td><td> -</td><td> -</td><td>14</td></tr>
          <tr><td><a href="六兆年と一夜物語">六兆年と一夜物語</a></td><td>kemu</td><td> -</td><td> -</td><td>14+</td></tr>
          <tr><td><a href="MARENOL">MARENOL</a></td><td>LeaF</td><td> -</td><td> -</td><td>14+</td></tr>
          <tr><td><a href="TEmPTaTiON">TEmPTaTiON</a></td><td>かねこちはる</td><td> -</td><td> -</td><td>15</td></tr>
          <tr><td><a href="封焔の135秒">封焔の135秒</a></td><td>大国奏音</td><td>9+</td><td> -</td><td>15</td></tr>
          <tr><td><a href="QZKago Requiem">QZKago Requiem</a></td><td>t+pazolite</td><td> -</td><td> -</td><td>16</td></tr>
          <tr><td><a href="Glorious Crown">Glorious Crown</a></td><td>xi</td><td> -</td><td> -</td><td>18</td></tr>
          <tr className="in"><td><a href="【裏】Glorious Crown">【裏】Glorious Crown</a></td><td>xi</td><td> -</td><td> -</td><td>-1</td></tr>
        </tbody>*/}
      </table>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const mapNames = readdirSync('./public/maps').filter(file => file.endsWith('.json'))
  const mapData = []

  for (const mapName of mapNames) {
    const { default: map } = await import(`../public/maps/${mapName}`)

    mapData.push({
      name: mapName.slice(0, -5),
      title: map.title,
      artist: map.artist,
      level: map.level,
      in: map.in ?? false
    });
  }

  const a = mapData.sort((a, b) => {
    return compareDiff(a.level, b.level)
  })

  return {
    props: { data: a }
  }
}

enum Compare {
  LESS, EQUAL, GREATER, INDETERMINATE
}

function cmpToNumber(cmp: Compare) {
  if (cmp === Compare.LESS) return -1
  if (cmp === Compare.EQUAL) return 0
  if (cmp === Compare.GREATER) return 1
  throw new Error('RESULT_IS_INDETERMINATE')
}

function compareDiff(a: MapDiffData, b: MapDiffData): number {
  const dH = compareDiffSingle(a.hard, b.hard)
  return cmpToNumber(dH)
}

function compareDiffSingle(a: string, b: string): Compare {
  const compare = removeNullDiff(a, b)
  if (compare !== Compare.INDETERMINATE) return compare

  const diff_a = +a.toString().replace('+', '.5')
  const diff_b = +b.toString().replace('+', '.5')

  if (diff_a < diff_b) return Compare.LESS
  if (diff_a === diff_b) return Compare.EQUAL
  if (diff_a > diff_b) return Compare.GREATER
  return Compare.INDETERMINATE
}

function removeNullDiff(a: string, b: string): Compare {
  if ((!a || a === "-") && (!b || b === "-")) return Compare.INDETERMINATE
  if (!a || a === "-") return Compare.LESS
  if (!b || b === "-") return Compare.GREATER
  return Compare.INDETERMINATE
}
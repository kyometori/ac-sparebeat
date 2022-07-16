import type { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { readdirSync } from 'fs'
import { compareDiff } from '../utils/mapDiffCompare'
import type { MapData } from '../utils/mapType'

interface HomePageProps {
  data: Array<MapData>
}

const Home: NextPage<HomePageProps> = ({ data }: HomePageProps) => {
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
      </table>
    </>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const mapNames = readdirSync('./public/maps/main').filter(file => file.endsWith('.json')).map(n => n.slice(0, -5))
  const mapData = []

  for (const mapName of mapNames) {
    const { default: map } = await import(`../public/maps/main/${mapName}.json`)

    mapData.push({
      name: mapName,
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
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import styles from '../../../styles/Play.module.css'
import { useEffect } from 'react'
import { readdirSync } from 'fs'
import Head from '../../../components/head'
import { useScript } from '../../../utils/useScript'

interface PlaygroundProps {
  name: string,
  title: string
}

const Playground: NextPage<PlaygroundProps> = ({ name, title }) => {
  useScript("https://sparebeat.com/embed/api.js", () => {
    // @ts-ignore
    window.Sparebeat.load(`../../maps/mrsr/${name}.json`, `../../maps/mrsr/${name}.mp3`)
  })

  useEffect(() => {
    document.getElementById('sparebeat')!.style.height = window.outerWidth < 990 ? '1280px' : '640px'
  }, [])

  return (
    <>
      <Head title={title} />
      <h1>{title}</h1>
      <iframe id="sparebeat" width="960" src="https://sparebeat.com/embed/" style={{ border: 'none' }} />
      <Link href="../" passHref><a><span id={styles.back}>Back</span></a></Link>
    </>
  )
}

export default Playground

export const getStaticPaths: GetStaticPaths = async () => {
  const mapNames = readdirSync(`./public/maps/mrsr`).filter(file => file.endsWith('.json'));

  return {
    paths: mapNames.map(mapName => {
      return { params: { name: mapName.slice(0, -5) } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const name = context.params!.name
  const { default: mapData } = await import(`../../../public/maps/mrsr/${name}.json`)

  return {
    props: {
      name: context.params!.name,
      title: mapData.title
    }
  }
}
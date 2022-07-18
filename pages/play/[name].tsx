import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Link from 'next/link'
import styles from '../../styles/Play.module.css'
import Script from 'next/script'
import { useEffect } from 'react'
import { readdirSync } from 'fs'
import Head from '../../components/head'

interface PlaygroundProps {
  name: string,
  title: string
}

const Playground: NextPage<PlaygroundProps> = ({ name, title }) => {
  useEffect(() => {
    document.getElementById('sparebeat')!.style.height = window.outerWidth < 990 ? '1280px' : '640px'
    // @ts-ignore
    window.Sparebeat && window.Sparebeat.load(`../maps/main/${name}.json`, `../maps/main/${name}.mp3`)
  }, [name])

  return (
    <>
      <Head title={title} />
      <Script src="https://sparebeat.com/embed/api.js" 
        // @ts-ignore
        onLoad={() => window.Sparebeat.load(`../maps/main/${name}.json`, `../maps/main/${name}.mp3`)}
        onError={console.error}
      />
      <h1>{title}</h1>
      <iframe id="sparebeat" width="960" src="http://sparebeat.com/embed/" style={{ border: 'none' }} />
      <Link href="../" passHref><a><span id={styles.back}>Back</span></a></Link>
    </>
  )
}

export default Playground

export const getStaticPaths: GetStaticPaths = async () => {
  const mapNames = readdirSync(`./public/maps/main`).filter(file => file.endsWith('.json'));

  return {
    paths: mapNames.map(mapName => {
      return { params: { name: mapName.slice(0, -5) } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const name = context.params!.name
  const { default: mapData } = await import(`../../public/maps/main/${name}.json`)

  return {
    props: {
      name: context.params!.name,
      title: mapData.title
    }
  }
}
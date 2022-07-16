import type { NextPage, GetStaticProps, GetStaticPaths } from 'next'
import Head from 'next/head'
import Script from 'next/script'
import { useEffect, useState } from 'react'
import { readdirSync } from 'fs'

interface PlaygroundProps {
  name: string,
  title: string
}

const Playground: NextPage<PlaygroundProps> = ({ name, title }) => {
  const [ready, setReady] = useState<boolean>(false)

  useEffect(() => {
    document.getElementById('sparebeat')!.style.height = window.outerWidth < 990 ? '1280px' : '640px'
  }, [])

  return (
    <>
      <Script src="https://sparebeat.com/embed/api.js" 
        // @ts-ignore
        onReady={() => window.Sparebeat.load(`../maps/${name}.json`, `../music/${name}.mp3`)}
        onError={console.error}
      />
      <h1>{title}</h1>
      <iframe id="sparebeat" width="960" src="http://sparebeat.com/embed/" style={{ border: 'none' }} />
    </>
  )
}

export default Playground

export const getStaticPaths: GetStaticPaths = async () => {
  const mapNames = readdirSync(`./public/maps`).filter(file => file.endsWith('.json'));

  return {
    paths: mapNames.map(blog => {
      return { params: { name: blog.slice(0, -5) } }
    }),
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const name = context.params!.name
  const { default: mapData } = await import(`../../public/maps/${name}.json`)

  return {
    props: {
      name: context.params!.name,
      title: mapData.title
    }
  }
}
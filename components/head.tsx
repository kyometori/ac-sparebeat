import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useOwner, PageOwner } from '../utils/useOwner'
import Head from 'next/head'

interface HeadProps {
  title?: string,
  description?: string
}

const Header: NextPage<HeadProps> = (props) => {
  const { route } = useRouter()
  const owner = useOwner(route)

  const title = `${PageOwner[owner]} Sparebeat Room｜${props.title ?? 'Home'}`;
  const {
    description = `${PageOwner[owner]} Sparebeat Room`
  } = props;
  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta charSet="UTF-8" />
      <meta name="author" content="AC0xRPFS001" />
      <meta name="description" content={description} />
      <meta name="keywords" content="AC,Sparebeat" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="http://acspb.vercel.app" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:url" content="http://acspb.vercel.app" />
    </Head>
  )
}


export default Header;

import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useOwner, PageOwner } from '../utils/useOwner'
import { ReactElement } from 'React'

export const Layout: NextPage<{ children: ReactElement }> = (props) => {
  const { route } = useRouter()
  const owner = useOwner(route)

	return (
		<>
      <div id="title"><h1>{PageOwner[owner]} Sparebeat Room</h1></div>

      <div className="nav">
        {
          owner === PageOwner.AC ?  <MainHeaderNav /> 
            : <MrsrHeaderNav />
        }
      </div>

      <div className="main">
      	{props.children}

        <div style={{ height: '200px' }} />
      </div>
    </>
	)
}

function MainHeaderNav() {
  return (
    <ul>
      <Link href="/"><a><li>Main Page</li></a></Link>
      <Link href="/mrsr"><a id="friend"><li>MeowRim</li></a></Link>
    </ul>
  )
}

function MrsrHeaderNav() {
  return (
    <ul>
      <Link href="/mrsr"><a><li>Main Page</li></a></Link>
      <Link href="/"><a id="friend"><li>AC</li></a></Link>
    </ul>
  )
}
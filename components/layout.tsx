import type { NextPage } from 'next'
import Link from 'next/link'
import { ReactElement } from 'React'

export const Layout: NextPage<{ children: ReactElement }> = (props) => {
	return (
		<>
      <div id="title"><h1>AC Sparebeat Room</h1></div>

      <div className="nav">
        <ul>
          <Link href="/"><a><li>Main Page</li></a></Link>
          <Link href="/mrsr"><a id="friend"><li>MeowRim</li></a></Link>
        </ul>
      </div>

      <div className="main">
      	{props.children}
      </div>
    </>
	)
}
import type { NextPage } from 'next'
import Head from '../components/head'
import { useState, useEffect, useReducer } from 'react'
import styles from '../styles/Rating.module.css'

const SparebeatConstant = {
	MaxScore: 1_000_000,
	PassScore: 650_000,
	MaxDifficulty: 20 // This is only true in AC Sparebeat Room
}

interface RatingDataStruct {
  score: number
  justCount: number
  rushCount: number
  coolCount: number
  missCount: number
  diff: number
  plus: boolean
}

interface RatingData {
  rating: number
  basicRating: number
  multiplier: number
  accuracy: number
}

const RatingCalc: NextPage = () => {
  const [data, updateData] = useReducer((prev: RatingDataStruct, update: Partial<RatingDataStruct>): RatingDataStruct => {
    if (update.score) {
      const value = +update.score
      if (isNaN(value) || value > SparebeatConstant.MaxScore || value < 0) return prev
    }

    if (update.justCount) {
      const value = +update.justCount
      if (isNaN(value) ||  value < 0) return prev
    }

    if (update.rushCount) {
      const value = +update.rushCount
      if (isNaN(value) ||  value < 0) return prev
    }

    if (update.coolCount) {
      const value = +update.coolCount
      if (isNaN(value) ||  value < 0) return prev
    }

    if (update.missCount) {
      const value = +update.missCount
      if (isNaN(value) ||  value < 0) return prev
    }

    if (update.diff) { 
      const value = +update.diff
      if (isNaN(value) || value > SparebeatConstant.MaxDifficulty || value < 0) return prev
    }

    return { ...prev, ...update }
  }, {
    score: 0, 
    justCount: 0, rushCount: 0, coolCount: 0, missCount: 0,
    diff: 0, plus: false
  })

  const [performance, updatePerformance] = useReducer((prev: RatingData, next: Partial<RatingData>) => ({ ...prev, ...next }), 
    { rating: 0, basicRating: 0, multiplier: 1, accuracy: 0 })

	const [hide, setHide] = useState(true)

	const handleScoreChange = (value: string) => {
	  updateData({ score: +value })	
	}

	const handleJustChange = (value: string) => {
    updateData({ justCount: +value })
	}

	const handleRushChange = (value: string) => {
    updateData({ rushCount: +value })
	}

	const handleCoolChange = (value: string) => {
    updateData({ coolCount: +value })
	}

	const handleMissChange = (value: string) => {
    updateData({ missCount: +value })
	}

	const handleDiffChange = (value: string) => {
    updateData({ diff: +value })
	}

	const handlePlusChange = (value: boolean) => {
	  updateData({ plus: value })
	}

	useEffect(() => {
    const { score, justCount, rushCount, coolCount, missCount, diff, plus} = data
		const maxCombo = justCount + rushCount + coolCount + missCount
		const realDiff = diff + ((diff < 20 && plus && 0.5) as number)

		const scoreFactor = score / SparebeatConstant.MaxScore
		const justFactor = justCount / maxCombo
		const diffFactor = realDiff / SparebeatConstant.MaxDifficulty

		const passed = score >= SparebeatConstant.PassScore
		const isFullCombo = missCount === 0
		const isAllJust = justCount === maxCombo

		const accuracy = ~~((justCount + rushCount * 0.5 + coolCount * 0.5) / maxCombo * 1e4) / 1e4

		let basicRating = 1000 * scoreFactor * justFactor * diffFactor

		let multiplier = 1

		if (!passed) multiplier *= 0.6

		if (isAllJust) multiplier *= 1.5
		else if (isFullCombo) multiplier *= 1.05

		multiplier *= Math.min(accuracy * 1.05, 1)
		multiplier = fixed(multiplier)

		const rating = ~~(basicRating * multiplier) / 100
		basicRating = ~~(basicRating) / 100
    
    updatePerformance({
      rating, basicRating, multiplier, accuracy
    })
	}, [data])
  
  const { score, justCount, rushCount, coolCount, missCount, diff, plus} = data
  const { rating, basicRating, multiplier, accuracy } = performance

	return (
		<>
			<Head title="Rating Calculator" />
			<h1>Rating Calculator</h1>
			<div id={styles.input}>
				<InputArea title="Score" handleChange={handleScoreChange} value={score} />
				<InputArea title="Just" handleChange={handleJustChange} value={justCount} />
				<InputArea title="Rush" handleChange={handleRushChange} value={rushCount} />
				<InputArea title="Cool" handleChange={handleCoolChange} value={coolCount} />
				<InputArea title="Miss" handleChange={handleMissChange} value={missCount} />
				<DiffInputArea 
					title="Map Difficulty" 
					handleChange={handleDiffChange} 
					handlePlusSelect={handlePlusChange}
					value={diff} 
				/>
			</div>
			<span id={styles.show}>Your Rating: {rating}</span>
			<h2 id={styles['detail-button']} onClick={() => {setHide(h => !h)}}>
				{ hide ? '▲' : '▼' } Details { hide ? '▲' : '▼' }
			</h2>
			<div id={styles.detail} style={{ display: hide ? 'none' : 'inherit' }}>
				<table id={styles['detail-table']}>
					<thead>
						<tr> <th>Item</th> <th>Value</th> </tr>
					</thead>
					<tbody>
						<tr> <td>Score Factor</td> <td>{fixed(score / SparebeatConstant.MaxScore)}</td> </tr>
						<tr> <td>Just Factor</td> <td>{fixed(justCount / (justCount + rushCount + coolCount + missCount))}</td> </tr>
						<tr> <td>Difficulty Factor</td> <td>{fixed((diff + ((diff < 20 && plus && 0.5) as number)) / SparebeatConstant.MaxDifficulty)}</td> </tr>
						<tr> <td>Basic Rating</td> <td>{basicRating}</td> </tr>
						<tr> <td>Accuracy</td> <td>{accuracy * 1e4 / 1e2}%</td> </tr>
						<tr> <td>Multiplier</td> <td>{multiplier}</td> </tr>
					</tbody>
				</table>
				<p>
					Rating Formula: <br />
					Point = 1000 * Score Factor * Just Factor * Difficulty Factor<br />
					BasicRating = Floor(Point) / 100<br />
					Rating = BasicRating * Multiplier
				</p>
			</div>
		</>
	)
}

function fixed(num: number) {
	return ~~(num * 1e3) / 1e3
}

interface InputAreaProps {
	title: string
	handleChange: (e: string) => unknown
	value: number
}

interface DiffInputAreaProps {
	title: string
	handleChange: (e: string) => unknown
	value: number
	handlePlusSelect: (e: boolean) => unknown
}

function InputArea({ title, handleChange, value }: InputAreaProps) {
	return (
		<div>
			<h2>{title}</h2>
			<input type="text" onChange={e => handleChange(e.target.value)} value={value} />
		</div>
	)
}

function DiffInputArea({ title, handleChange, value, handlePlusSelect }: DiffInputAreaProps) {
	return (
		<div>
			<h2>{title}</h2>
			<input type="text" onChange={e => handleChange(e.target.value)} value={value} />
			<input type="checkbox" onChange={e => handlePlusSelect(e.target.checked)} />+
		</div>
	)
}

export default RatingCalc

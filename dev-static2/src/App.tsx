import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Page } from './stories/Page';
import { SbsHomePage } from './stories/SbsHomePage';

function App() {
  const [count, setCount] = useState(0)

  return (
      <>
	  <SbsHomePage />
    </>
  )
}

export default App

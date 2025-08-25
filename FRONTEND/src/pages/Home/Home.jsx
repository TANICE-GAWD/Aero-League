import Header from './Header'
import Challenges from './Challenges'
import Timeline from './Timeline'
import Prizes from './Prizes'
import Organizers from './Organizers'
import Contact from './Contact'
import Guidelines from './Guidelines'

function Home() {
  return (
    <div>
      <Header />
      <Challenges />
      <Timeline />
      <Prizes />
      <Guidelines />
      <Organizers />
      <Contact />
    </div>
  )
}

export default Home
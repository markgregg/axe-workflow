import CommandBar from './elements/CommandBar'
import Window from './elements/Window'
import ActivityBlotter from './elements/ActivityBlotter'
import Bonds from './elements/Bonds'
import ClientHoldings from './elements/ClientHoldings'
import './App.css'
import BondChart from './elements/BondChart'


const App = () => {

  return (
    <>
      <div
        className='mainBody'
      >
        <h2>Credit Sales Story board</h2>
        <div
          className='mainContentDiv'
        >
          <div className='mainCommandBarDiv'>
            <label>Filter:</label>
            <div style={{ flexGrow: 1 }}>
              <CommandBar />
            </div>
          </div>
          <div className='mainConttentArea'>
            <div className='MainContentLeft'>
              <div className='MainContentClients'>
                <Window title='Products'>
                  <Bonds />
                </Window>
              </div>
              <div className='MainContentBonds'>
                <Window title='Clients'>
                  <ClientHoldings />
                </Window>
              </div>
              <div className='mainContentActivity'>
                <Window title='Activity'>
                  <ActivityBlotter />
                </Window>
              </div>
            </div>
            <div className='MainContentRv'>
              <Window title='Relative Value'>
                <BondChart />
              </Window>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

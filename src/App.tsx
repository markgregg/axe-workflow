import CommandBar from './elements/CommandBar'
import Window from './elements/Window'
import ActivityBlotter from './elements/ActivityBlotter'
import Bonds from './elements/Bonds'
import ClientInsight from './elements/ClientInsight'
import './App.css'
import BondChart from './elements/BondChart'


const App = () => {

  return (
    <>
      <div
        className='mainBody'
      >
        <div
          className='mainContentDiv'
        >
          <div>
            <Window title='TES Sales'>
              <div className='mainTesBar'>
                <div className='mainTitleBar'>
                  <div className='mainTitle'>TES - Neo Credit</div>
                  <div className='mainPerspective'>Product</div>
                </div>
                <div className='mainCommandBarDiv'>
                  <label>Action:</label>
                  <div style={{ flexGrow: 1 }}>
                    <CommandBar />
                  </div>
                </div>
              </div>
            </Window>
          </div>
          <div className='mainConttentArea'>
            <div className='mainContentLeft'>
              <div className='mainContentBonds'>
                <Window title='Credit Blotter'>
                  <Bonds />
                </Window>
              </div>
              <div className='mainContentClients'>
                <Window title='Client Insight'>
                  <ClientInsight />
                </Window>
              </div>
            </div>
            <div className='mainContentRight'>
              <div className='mainContentRightTop'>
                <div className='mainContentMktActivity'>
                  <Window title='Activity'>
                  </Window>
                </div>
                <div className='mainContentRV'>
                  <Window title='Activity'>
                  </Window>
                </div>
              </div>
              <div className='mainContentActivity'>
                <Window title='Internal Activity'>
                  <ActivityBlotter />
                </Window>
              </div>
              <div className='mainContentRefPrice'>
                <Window title='Reference Pricing'>
                </Window>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App

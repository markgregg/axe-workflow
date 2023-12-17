import * as React from 'react'
import CommandBar from './elements/CommandBar'
import Window from './elements/Window'
import ActivityBlotter from './elements/ActivityBlotter'
import Bonds from './elements/Bonds'
import ClientInsight from './elements/ClientInsight'
import './App.css'
import BondChart from './elements/BondChart'
import ReferencePrice from './elements/ReferencePrice/ReferencePrice'
import MktActivityBlotter from './elements/MktActivityBlotter'
import ClientProfile from './elements/ClientProfile'
import ClientActivity from './elements/ClientActivity'
import ClientHoldings from './elements/ClientHoldings'
import ClientInterests from './elements/ClientInterests'
import { Matcher } from 'multi-source-select'


const App = () => {
  const [persepective, setPerspective] = React.useState<'Product' | 'Client'>('Product')
  const [interest, setInterest] = React.useState<Matcher[] | null>(null)

  return (
    <>
      <div
        className='mainBody'
      >
        <div
          className='mainContentDiv'
        >
          <div>
            <Window title='TES - Neo Credit'>
              <div className='mainTesBar'>
                <div className='mainTitleBar'>
                  <label className='mainTesTitle'>TES -</label>
                  <div className='mainCommandBarDiv'>
                    <div style={{ flexGrow: 1 }}>
                      <CommandBar onClientChanged={matchers => {
                        setPerspective('Client')
                        if (matchers) {
                          setInterest(matchers)
                        }
                      }} />
                    </div>
                  </div>
                  <div
                    className='mainPerspective'
                    onClick={() => setPerspective(persepective === 'Product' ? 'Client' : 'Product')}
                  >{persepective === 'Product' ? 'Client' : 'Product'}</div>
                </div>
              </div>
            </Window>
          </div>
          <div className='mainConttentArea'>
            {
              persepective === 'Product'
                ? <>
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
                        <Window title='Reference Pricing'>
                          <ReferencePrice />
                        </Window>
                      </div>
                      <div className='mainContentRV'>
                        <Window title='Relative Value'>
                          <BondChart />
                        </Window>
                      </div>
                    </div>
                    <div className='mainContentActivity'>
                      <Window title='Internal Activity'>
                        <ActivityBlotter />
                      </Window>
                    </div>
                    <div className='mainContentRefPrice'>
                      <Window title='Market Activity'>
                        <MktActivityBlotter />
                      </Window>
                    </div>
                  </div>
                </>
                : <>
                  <div className='mainContentLeft'>
                    <div className='mainContentClientProfile'>
                      <Window title='Client Profile'>
                        <ClientProfile />
                      </Window>
                    </div>
                  </div>
                  <div className='mainContentRight'>
                    <div className='mainContentClientInterests'>
                      <Window title='Interests'>
                        <ClientInterests enterInterest={interest} />
                      </Window>
                    </div>
                    <div className='mainContentClientHoldings'>
                      <Window title='Holdings'>
                        <ClientHoldings />
                      </Window>
                    </div>
                    <div className='mainContentClientActivity'>
                      <Window title='Activity'>
                        <ClientActivity />
                      </Window>
                    </div>
                  </div>
                </>
            }

          </div>
        </div>
      </div>
    </>
  )
}

export default App

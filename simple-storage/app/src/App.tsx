import './App.css';
import React from 'react';
import { PolywrapClient } from '@polywrap/client-js';
import { setupPolywrapClient } from './wrapper/setupClient';
import { setData, deployContract } from './wrapper/simplestorage';
import Logo from './logo.png';

interface Set {
  txReceipt: string;
  value: number;
}

function App() {
  const [client, setClient] = React.useState<PolywrapClient | undefined>(
    undefined
  );
  const [contract, setContract] = React.useState<string | undefined>(undefined);
  const [value, setValue] = React.useState<number>(0);
  const [sets, setSets] = React.useState<Set[]>([]);
  const addSet = (set: Set) => setSets([...sets, set]);

  const [inputValue, setInputValue] = React.useState<number>(0);

  const getClient = async () => {
    if (client) {
      return client;
    }

    const newClient = await setupPolywrapClient();
    setClient(newClient);
    return newClient;
  };

  const tab = () => <>&nbsp;&nbsp;&nbsp;&nbsp;</>;

  const link = (url: string, children: () => JSX.Element) => (
    <a target='_blank' rel='noopener noreferrer' href={url}>
      {children()}
    </a>
  );

  const emoji = (symbol: string) => (
    <span role='img' aria-label={symbol}>
      {symbol}
    </span>
  );

  const codeSyntax = (type: string) => (children: () => JSX.Element) =>
    <text className={type}>{children()}</text>;

  const syntax = {
    class: codeSyntax('Code-Class'),
    prop: codeSyntax('Code-Prop'),
    value: codeSyntax('Code-Value'),
    string: codeSyntax('Code-String'),
    variable: codeSyntax('Code-Variable'),
  };

  return (
    <div className='App'>
      {link('https://polywrap.io/', () => (
        <img src={Logo} className='App-logo' />
      ))}
      <header className='App-body'>
        <h3 className='App-title'>
          Polywrap Demo:
          <br />
          {link('https://app.ens.domains/name/api.simplestorage.eth', () => (
            <>api.simplestorage.eth</>
          ))}
          {link(
            'https://wrappers.io/v/ipfs/QmSpiQhe8xptgYmmpgmkmEnfzr8GEvNnW1zNT1sKkqH8EE',
            () => (
              <> -&gt; IPFS</>
            )
          )}
        </h3>
        <br />
        <br />
        {!contract ? (
          <>
            Let's get started...
            <br />
            <br />
            {emoji('🔌')} Set Metamask to Goerli
            <br />
            <button
              className='App-btn'
              onClick={async () =>
                deployContract(await getClient())
                  .then((address) => setContract(address))
                  .catch((err) => console.error(err))
              }
            >
              {emoji('🚀')} Deploy SimpleStorage.sol
            </button>
            <div className='Code-Block'>
              {syntax.class(() => (
                <>client</>
              ))}
              .
              {syntax.prop(() => (
                <>invoke</>
              ))}
              {'({'}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;uri: </>
              ))}
              {syntax.string(() => (
                <>"ens/goerli/api.simplestorage.eth"</>
              ))}
              ,<br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;method: </>
              ))}
              {syntax.string(() => (
                <>"deployContract"</>
              ))}
              ,<br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;args: </>
              ))}
              {"{"}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;connection: </>
              ))}
              {"{"}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;networkNameOrChainId: </>
              ))}
              {syntax.string(() => (
                <>"goerli"</>
              ))}
              <br />
              <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</>
              <br />
              <>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</>
              <br />
              {'})'}
            </div>
            <br />
          </>
        ) : (
          <>
            <p>
              {emoji('✔️')} Deployed SimpleStorage (
              {link(`https://goerli.etherscan.io/address/${contract}`, () => (
                <>{contract.substr(0, 7)}...</>
              ))}
              )
            </p>
            <br />
          </>
        )}
        {contract && (
          <>
            Storage Value: {value}
            <br />
            <input
              type='number'
              min='0'
              value={inputValue}
              style={{ width: '75px' }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setInputValue(Number(e.target.value))
              }
            />
            <button
              onClick={async () =>
                setData(contract, inputValue, await getClient())
                  .then((result) => {
                    addSet({
                      txReceipt: result,
                      value: inputValue,
                    });
                    setValue(inputValue);
                  })
                  .catch((err) => console.error(err))
              }
            >
              {emoji('📝')} Set Value
            </button>
            <div className='Code-Block'>
              {syntax.class(() => (
                <>client</>
              ))}
              .
              {syntax.prop(() => (
                <>invoke</>
              ))}
              {'({'}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;uri: </>
              ))}
              {syntax.string(() => (
                <>"ens/goerli/api.simplestorage.eth"</>
              ))}
              ,<br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;method: </>
              ))}
              {syntax.string(() => (
                <>"setData"</>
              ))}
              ,<br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;args: </>
              ))}
              {"{"}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;address: </>
              ))}
              {syntax.value(() => (
                <>{contract.substring(0, 5)}...{contract.substring(37, 42)}</>
              ))}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;value: </>
              ))}
              {syntax.value(() => (
                <>{inputValue}</>
              ))}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;connection: </>
              ))}
              {"{"}
              <br />
              {syntax.value(() => (
                <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;networkNameOrChainId: </>
              ))}
              {syntax.string(() => (
                <>"goerli"</>
              ))}
              <br />
              <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</>
              <br />
              <>&nbsp;&nbsp;&nbsp;&nbsp;{"}"}</>
              <br />
              {'})'}
            </div>
            <p>
              {sets.length ? (
                <>
                  Storage History:
                  <br />
                </>
              ) : (
                <></>
              )}
              {sets
                .map((set, index) => (
                  <>
                    #{index} | value: {set.value} | tx:{' '}
                    {link(
                      `https://goerli.etherscan.io/tx/${set.txReceipt}`,
                      () => (
                        <>{set.txReceipt.substr(0, 7)}...</>
                      )
                    )}
                    <br />
                  </>
                ))
                .reverse()}
            </p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;

import * as React from 'react';

// import Humberger from './humberger';
import Barnav from './appbar'
import Form from './form';
import Download from './download';
import Tabel from './tabel';
import { useState } from 'react';

export default function MyApp() {

  const [check, setCheck] = useState(false);
  return (
    <>
    
     <div>
      <Barnav/>
    </div>
    <main xs = {{marginTop : 20}}>
      <Form style = {{position : "fixed"}} setCheck={setCheck}/>


      <Download/>
      <Tabel setCheck={setCheck} check = {check}/>
    </main>
    </>
  );
}


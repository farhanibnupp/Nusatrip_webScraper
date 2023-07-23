import * as React from 'react';

// import Humberger from './humberger';
import Barnav from './appbar'
import Form from './form';
import Download from './download';
import Tabel from './tabel';


export default function MyApp() {
  return (
    <>
     <div>
      <Barnav/>
    </div>
    <main xs = {{marginTop : 20}}>
      <Form style = {{position : "fixed"}}/>
      <Download/>
      <Tabel/>
    </main>
    </>
  );
}


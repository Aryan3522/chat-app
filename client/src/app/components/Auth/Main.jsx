import React, { useState } from 'react'
import { SignUp } from './SignUp'
import { SignIn } from './SignIn'
import ForgotPass from './ForgotPass';


export const Main = () => {
  const [mode, setMode] = useState("signin"); // Single state for all modes

  return (
    <>
      <div className='' style={{ height: "100vh",  backgroundColor: "#f7f7f7"}}>
        {mode === "signin" ? <SignIn setMode={setMode}/> :mode==="signup"?<SignUp setMode={setMode}/>:<ForgotPass setMode={setMode}/> }
        
      </div>
    </>
  );
}

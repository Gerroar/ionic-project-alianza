import { IonPage } from "@ionic/react";
import { useState } from "react";
import LoginCard from "../components/LoginCard";
import SignUpCard from "../components/SignUpCard";
import { motion } from "framer-motion";

const UserManagment = () => {
  const [goSignUp, setGoSignUp] = useState(false);

  return (
    <IonPage>
      {
        goSignUp ?
        <SignUpCard setGoSignUp={setGoSignUp} />
      :
        <LoginCard setGoSignUp={setGoSignUp} />
      }
    </IonPage>
  );
};

export default UserManagment;

import { Redirect, Route} from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IonApp, IonRouterOutlet,setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import LogIn from './pages/UserManagment';

/* Firebase */
import { getAuth, onAuthStateChanged} from "firebase/auth";
import { doc, getDoc, getDocs, increment, onSnapshot, updateDoc, where } from "firebase/firestore";

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import UserManagment from './pages/UserManagment';
import { newUser, usersRef } from './firebaseConfigs/firebase-config';
import { query } from "firebase/database";


setupIonicReact();

function PrivateRoutes() {
  return(
    <IonRouterOutlet>
    <Route path={`/:id`} component={Home}/>
  </IonRouterOutlet>
  );
}

function PublicRoutes(){
  return(
    <IonRouterOutlet>
      <Route exact path={"/login"} component={UserManagment}/>
    </IonRouterOutlet>
  )
}

function App() {
  const [id, setId] = useState("");
  const [userIsAtuhenticated, setUserIsAuthenticated] = useState(localStorage.getItem("userIsAtuhenticated"));
  const auth = getAuth();


  useEffect(function () {

    onAuthStateChanged(auth, async user => {
      if (user) {
        const q = query(usersRef, where("email", "==", user.email));
        let querySnapshot = await getDocs(q);

        if(querySnapshot.empty){
          newUser(user.uid, user.displayName, user.email, user.photoURL);
        }
        setUserIsAuthenticated(true);
        setId(user.uid);
        localStorage.setItem("userIsAtuhenticated", true);
      } else {
        setUserIsAuthenticated(false);
        localStorage.removeItem("userIsAtuhenticated", false);
      }
    });
  }, [auth]);

  return (
    <IonApp>
    <IonReactRouter>
      {userIsAtuhenticated ? <PrivateRoutes id={id}/> : <PublicRoutes />}
      <Route>{userIsAtuhenticated ? <Redirect to={`/${id}`} /> : <Redirect to="/login" />}</Route>
    </IonReactRouter>
  </IonApp>
  )
}

export default App;

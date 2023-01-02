import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonCardTitle
} from "@ionic/react";
import {googleAuth} from "../firebaseConfigs/firebase-config";
import googleIcon from "../icons/google.svg";
import alianzaIcon from "../icons/alianza-icon.svg";
import { useHistory } from "react-router";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebase from "../firebaseConfigs/firebase-config";

const LoginCard = ({ setGoSignUp }) => {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");

  const [colorEmail, setColorEmail] = useState("dark");
  const [colorPassword, setColorPassword] = useState("dark");

  const [placeHolderEmail, setPlaceHolderEmail] = useState("Enter your email");
  const [placeHolderPassword, setPlaceHolderPassword] = useState(
    "Enter your password"
  );
  const auth = getAuth();

  const googleProvider = new firebase.auth.GoogleAuthProvider();

  const handleOnClick = async () => {
      googleAuth(googleProvider);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, mail, password)
      .then((userCredential) => {
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/user-not-found":
            setColorEmail("danger");
            setMail("");
            setPlaceHolderEmail("User not found");
            break;

          case "auth/wrong-password":
            setColorPassword("danger");
            setPassword("");
            setPlaceHolderPassword("Wrong Password");
            break;

          default:
            setColorEmail("dark");
            setColorPassword("dark");
            setPlaceHolderEmail("Enter your email");
            setPlaceHolderPassword("Enter your password");
            break;
        }
      });
  };
  return (
    <IonContent>
      <IonCard class="gradient-card"></IonCard>
      <IonCard className="user-card">
        <IonCardHeader className="user-card-header">
          <IonRow>
            <IonCol>
              <IonIcon src={alianzaIcon} className="alianza-icon-user" />
            </IonCol>
            <IonCol>
              <IonCardTitle className="ion-margin-top">LOG IN</IonCardTitle>
            </IonCol>
          </IonRow>
        </IonCardHeader>
        <IonCardContent className="buttons-container">
          <IonGrid className="ion-justify-content-center">
            <IonRow>
              <IonCol className="">
                <IonButton
                  onClick={() => handleOnClick()}
                  color="google"
                  size="large"
                  className="align-button-log-in"
                >
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonIcon src={googleIcon} className="google-icon" />
                      </IonCol>
                      <IonCol>Log In</IonCol>
                    </IonRow>
                  </IonGrid>
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonCard className="card-email" color={"medium"}>
                  <IonCardContent>
                    <IonCardHeader className="card-email-header">
                      Email
                    </IonCardHeader>
                    <IonGrid>
                      <IonRow>
                        <IonCol size="auto">
                          <form onSubmit={handleSubmit}>
                            <IonItem
                              color={colorEmail}
                              className="ion-margin-bottom ion-margin-top input-email"
                            >
                              <IonLabel position="stacked">Mail</IonLabel>
                              <IonInput
                                value={mail}
                                type="email"
                                placeholder={placeHolderEmail}
                                onIonChange={(e) => setMail(e.target.value)}
                              />
                            </IonItem>
                            <IonItem
                              color={colorPassword}
                              className="input-email"
                            >
                              <IonLabel position="stacked">Password</IonLabel>
                              <IonInput
                                value={password}
                                type="password"
                                placeholder={placeHolderPassword}
                                onIonChange={(e) => setPassword(e.target.value)}
                              />
                            </IonItem>
                            <IonButton
                              type="submit"
                              expand="block"
                              color={"dark"}
                              className="card-email-button"
                            >
                              Log In With Email
                            </IonButton>
                          </form>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonButton
              className="align-button-log-in"
              onClick={() => setGoSignUp(true)}
            >
              Go to Sign Up
            </IonButton>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default LoginCard;

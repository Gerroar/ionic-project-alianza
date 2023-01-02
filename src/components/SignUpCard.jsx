import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
} from "@ionic/react";
import { useHistory } from "react-router";
import alianzaIcon from "../icons/alianza-icon.svg";
import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const SignUpCard = ({ setGoSignUp }) => {
  const [mail, setMail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [colorEmail, setColorEmail] = useState("dark");
  const [placeHolderEmail, setPlaceHolderEmail] = useState("Type an email");

  const [colorPass1, setColorPass1] = useState("dark");
  const [placeHolderPass1, setPlaceHolderPass1] = useState("Type the password");

  const [colorPass2, setColorPass2] = useState("dark");
  const [placeHolderPass2, setPlaceHolderPass2] = useState(
    "Re-Type the password"
  );
  const auth = getAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password1 === password2) {
      setColorPass2("dark");
      setPlaceHolderPass2("Re-Type the password");
      createUserWithEmailAndPassword(auth, mail, password1)
        .then((userCredential) => {
          const user = userCredential.user;
          return user;
        })
        .catch((error) => {
          switch (error.code) {
            case "auth/email-already-in-use":
              setColorEmail("danger");
              setMail("");
              setPlaceHolderEmail("Email already in use");
              break;
            case "auth/invalid-email":
              setColorEmail("danger");
              setMail("");
              setPlaceHolderEmail("Invalid Email");
              break;
            case "auth/operation-not-allowed":
              setColorEmail("danger");
              setMail("");
              setPlaceHolderEmail("Operation not allowed");
              break;
            case "auth/weak-password":
              document.getElementById("pass1").classList.add("error-pass1");
              setColorPass1("danger");
              setColorPass2("danger");
              setPassword1("");
              setPassword2("");
              setPlaceHolderPass1("Minimum length 6 characters");
              break;
            default:
              if (
                document
                  .getElementById("pass1")
                  .classList.contains("error-pass1")
              ) {
                document
                  .getElementById("pass1")
                  .classList.remove("error-pass1");
              }
              setColorEmail("dark");
              setPlaceHolderEmail("Type an email");
              break;
          }
        });
    } else {
      setColorPass2("danger");
      setPassword2("");
      setPlaceHolderPass2("This one doesn't match");
    }
  };
  return (
    <IonContent>
      <IonCard class="gradient-card"></IonCard>
      <IonCard className="user-card">
        <IonCardHeader className="user-card-header">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonIcon src={alianzaIcon} className="alianza-icon-user"/>
              </IonCol>
              <IonCol>
                <IonCardTitle className="ion-margin-top">SIGN UP</IonCardTitle>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardHeader>
        <IonCardContent className="buttons-container">
          <IonGrid className="ion-justify-content-center">
            <IonRow>
              <IonCol>
                <IonCard className="signup-email-card" color={"medium"}>
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
                              color={colorPass1}
                              id="pass1"
                              className="input-email"
                            >
                              <IonLabel position="stacked">Password</IonLabel>
                              <IonInput
                                value={password1}
                                type="password"
                                placeholder={placeHolderPass1}
                                onIonChange={(e) =>
                                  setPassword1(e.target.value)
                                }
                              />
                            </IonItem>
                            <IonItem
                              color={colorPass2}
                              className="ion-margin-bottom ion-margin-top input-email"
                            >
                              <IonLabel position="stacked">
                                Repeat Password
                              </IonLabel>
                              <IonInput
                                value={password2}
                                type="password"
                                placeholder={placeHolderPass2}
                                onIonChange={(e) =>
                                  setPassword2(e.target.value)
                                }
                              />
                            </IonItem>
                            <IonButton
                              type="submit"
                              expand="block"
                              color={"dark"}
                              className="card-email-button"
                            >
                              Sign Up With Email
                            </IonButton>
                          </form>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCardContent>
                </IonCard>
                <IonButton
                  onClick={() => setGoSignUp(false)}
                  className="align-button-sign-up"
                >
                  Back to Log In
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default SignUpCard;

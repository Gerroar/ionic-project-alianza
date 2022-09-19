import React from "react";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
} from "@ionic/react";

const LoginSignCard = () => {
  return (
    <IonContent>
      <IonCard className="siglog-card-1">
        <IonCardHeader>Card Header</IonCardHeader>
        <IonCardContent>
            <p>content</p>
        </IonCardContent>
      </IonCard>
    </IonContent>
  );
};

export default LoginSignCard;

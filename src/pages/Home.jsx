import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonMenu,
  IonMenuToggle,
  IonItem,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonLabel,
  IonIcon,
  IonFab,
  IonFabButton,
  IonList,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonModal,
  IonButtons,
  IonCheckbox,
  IonImg,
  IonInput,
  IonCardHeader,
  IonSearchbar,
  IonCardContent,
} from "@ionic/react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import {
  signOut,
  getUser,
  usersRef,
} from "../firebaseConfigs/firebase-config";
import { query } from "firebase/database";

//Icons
import alianzaIcon from "../icons/alianza-icon.svg";

//Menu Icons
import closeIcon from "../icons/close-icon.svg";
import powerOff from "../icons/power-off-line-icon.svg";
import settingsIcon from "../icons/settings-gear-icon.svg";
import menuIcon from "../icons/menu.svg";
//Menu Icons

//ToolBar Icons
import goalsIcon from "../icons/goals.svg";
import participantsIcon from "../icons/participants.svg";
import trashICon from "../icons/trash-icon.svg";
import addIcon from "../icons/plus-line-icon.svg";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getDocs, increment, onSnapshot, updateDoc, where } from "firebase/firestore";
import { db } from "../firebaseConfigs/firebase-config";
//ToolBar Icons

//Icons

const Home = () => {
  const [user, setUser] = useState({});
  const auth = getAuth();
  const params = useParams();
  const userId = params.id;
  //Page ref

  const page = useRef(null);

  //Page ref

  //Main user object

  const mainUserParticipant = {
    userId: {
      partipantId: 5,
      email: user.email,
      username: user.username,
      picture: user.profile_picture,
    },
  };
  //Main user object

  //Modals

  const modalSettings = useRef(null);

  const modalNewProject = useRef(null);

  const modalGoals = useRef(null);
  const modalParticipants = useRef(null);
  const modalDelete = useRef(null);

  //Modals

  //States

  const [openNewProject, setOpenNewProject] = useState(false);

  const [openGoals, setOpenGoals] = useState(false);
  const [openParticipants, setOpenParticipants] = useState(false);
  const [openThrash, setOpenTrash] = useState(false);
  const [photoUser, setPhotoUser] = useState("");
  const [presentingElement, setPresentingElement] = useState(null);

  //state for enable or disable Confirm button
  const [confirmStatus, setConfirmStatus] = useState(true);

  //state for search bar participants
  const [emailExists, setEmailExists] = useState();
  const [searchedUser, setSearchedUser] = useState();

  //state for requests
  const [requests, setRequests] = useState();

  //states for create a new project
  const [projectName, setProjectName] = useState("");
  const [userRol, setUserRol] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [userColor, setUserColor] = useState("");

  //state for rol of requested user
  const [requestURol, setRequestURol] = "";

  /**
   * For the next two statements we will to arrays of objects that will store
   * temporary users and viewers, that will pass to be real in the database
   * at the moment the main user confirms the creation of the project, the
   * object mainUser will be stored in one these depending of the rol that
   * choses
   */

  /*This are supposed participants , expect the one that is first ( mainUser ) all of
  them are removable, only when the creator of the project decides to confirm the project
  the requests will be send, the creator user will have to option to delete the user from 
  the list before confirm the creation of the project, the limit for this array it's of 
  5 participants ( including the main user that is there by default )
  */

  const [preParticipants, setPreParticipants] = useState([]);

  /**This are the supposed viewers,  unlike the preParticipants here there is no limit of
   * members and no default
   */

  const [preViewers, setPreViewers] = useState([]);

  //state for able or disable color selection for the creator if choses viewer rol

  const [selectColorOwner, setSelectColorOwener] = useState(false);

  //state for able or disable search bar

  const [searchIsDisable, setSearchIsDisable] = useState(true);

  //counter for available collaborators/admins for message
  const [collabAdmin, setCollabAdmin] = useState(
    5 - Object.keys(preParticipants).length
  );

  //state for message of how many collaborators/admins you can still send a request
  const [howManyMsg, setHowManyMsg] = useState("");

  //States

  //Functions

  /**With this function we search if the main user it's in an array or not */
  const mainUserThere = (array) => {
    let isThere = false;

    return isThere;
  };

  //Functions

  useEffect(() => {
    async function getUserDataOnce() {
      const docSnap = await getDoc(getUser(userId));
      if (docSnap.exists()) {
        setUser({
          id: userId,
          ...docSnap.data(),
        });

        return docSnap.data();
      } else {
        console.error("No such document!");
      }
    }

    //requests listener
    onSnapshot(getUser(userId), (snapshot) => {
      setRequests(snapshot.data().requests.requestsCount);
    });

    /**detects if the first three fields of create new project are filled first
     * and then enable the search bar , if the user choses viewer color is disabled*/
    if (projectName != "" && userRol != "" && userColor != "") {
      setSearchIsDisable(false);
      setConfirmStatus(false);
      if (userRol == "administrator") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      if (!mainUserThere(preParticipants)) {
        const mainUserParticipant = {
          userId: {
            partipantId: 1,
            email: user.email,
            username: user.username,
            picture: user.profile_picture,
            rol: userRol,
          },
        };
        if (preParticipants.length >= 1) {
          preParticipants.splice(0, 0, mainUserParticipant);
        } else {
          preParticipants.push(mainUserParticipant);
        }
      }
    } else if (projectName != "" && userRol == "viewer") {
      setSelectColorOwener(true);
      setSearchIsDisable(false);
    } else {
      setSearchIsDisable(true);
    }

    //switch-case to create a custom message everytime the user sends a new request
    switch (collabAdmin) {
      case 5:
        setHowManyMsg(
          "You can still request for 5 collaborators/administrators"
        );
        break;

      case 4:
        setHowManyMsg(
          "You can still request for 4 collaborators/administrators"
        );
        break;

      case 3:
        setHowManyMsg(
          "You can still request for 3 collaborators/administrators"
        );
        break;

      case 2:
        setHowManyMsg(
          "You can still request for 2 collaborators/administrators"
        );
        break;

      case 1:
        setHowManyMsg(
          "You can still request for 1 collaborators/administrators"
        );
        break;

      case 0:
        setHowManyMsg(
          "You can't request for more collaborators/administrators"
        );
        break;

      default:
        break;
    }

    getUserDataOnce();
    setPresentingElement(page.current);
  }, [
    projectName,
    userRol,
    userColor,
    userId,
    collabAdmin,
    preParticipants,
    user.email,
    user.username,
    user.profile_picture,
  ]);

  const cancelNewProject = () => {
    setOpenNewProject(false);
    setProjectName("");
    setUserRol("");
    setUserColor("");
  };

  /**userId: {
      
    }, */

  const handleRequest = async (e) => {
    let docId;
    const q = query(usersRef, where("username", "==", searchedUser.username));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id);
      docId = doc.id;
    })
    const specificUser = doc(db, "users", docId);
    await updateDoc(specificUser, {
      "requests.requestsCount": increment(1)
    });
    
  };

  const handleCreateProject = (e) => {};

  //handle SearchBar Participants change
  const handleParticipantsSearch = async (event) => {
    const value = event.target.value;
    const q = query(usersRef, where("email", "==", value));
    onSnapshot(q, (snapshot) => {
      let result = "";
      snapshot.docs.forEach((doc) => {
        result = doc.data();
      });

      if (result == "") {
        setEmailExists(false);
        setSearchedUser();
      } else {
        setEmailExists(true);
        setSearchedUser(result);
        console.log(result);
      }
    });
  };
  return (
    <>
      <IonMenu contentId="user-details">
        <IonHeader>
          <IonToolbar className="menu-toolbar">
            <IonTitle className="menu-title">Welcome, {user.username}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonMenuToggle>
            <IonFab horizontal="end">
              <IonFabButton color="light">
                <IonIcon icon={closeIcon} className="exit-menu-icon" />
              </IonFabButton>
            </IonFab>
            <IonItem className="menu-item-avatar">
              <IonAvatar className="menu-avatar">
                <IonImg
                  src={user.profile_picture}
                  className="profile-picture"
                />
              </IonAvatar>
            </IonItem>
            <IonGrid>
              <IonRow className="requests-button">
                <IonCol>
                  <IonButton shape="round" color={"light"}>
                    <IonItem color="light">
                      <IonBadge slot="end" color="warning">
                        {requests}
                      </IonBadge>
                      <IonLabel>Requests</IonLabel>
                    </IonItem>
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow className="align-menu-items">
                <IonCol>
                  <IonButton onClick={signOut} color="light">
                    <IonIcon icon={powerOff} />
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton color="light">
                    <IonIcon icon={settingsIcon} />
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonMenuToggle>
        </IonContent>
      </IonMenu>
      <IonPage id="user-details">
        <IonHeader>
          <IonToolbar>
            <IonIcon src={alianzaIcon} className="alianza-icon-user" />
            <IonTitle className="home-title">HOME</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent class="ion-padding" fullscreen>
          <IonMenuToggle>
            <IonFab>
              <IonFabButton color={"light"}>
                <IonIcon src={menuIcon} />
              </IonFabButton>
            </IonFab>
          </IonMenuToggle>
          <IonList className="projects-list">
            <IonItem>
              <IonSelect
                interface="action-sheet"
                placeholder="Choose a Project"
              >
                <IonSelectOption>ProjectA</IonSelectOption>
                <IonSelectOption>ProjectB</IonSelectOption>
              </IonSelect>
              <IonButton
                shape="round"
                className="add-project-button"
                color={"dark"}
                onClick={() => setOpenNewProject(true)}
                id="open-new-project"
              >
                <IonIcon icon={addIcon} />
              </IonButton>
            </IonItem>
          </IonList>
          <IonCard className="project-container" color="light"></IonCard>
          <IonFab horizontal="start" vertical="bottom">
            <IonFabButton color="light" className="toolBar">
              <IonFabButton
                color="dark"
                className="tool-left"
                id="open-goals"
                onClick={() => setOpenGoals(true)}
              >
                <IonIcon icon={goalsIcon} className="goals-icon" />
              </IonFabButton>
              <IonFabButton
                color="dark"
                className="tool-middle"
                onClick={() => setOpenParticipants(true)}
                id="open-participants"
              >
                <IonIcon
                  icon={participantsIcon}
                  className="participants-icon"
                />
              </IonFabButton>
              <IonFabButton color="dark" className="tool-right">
                <IonIcon icon={trashICon} />
              </IonFabButton>
            </IonFabButton>
          </IonFab>
          <IonModal
            ref={modalNewProject}
            presentingElement={presentingElement}
            isOpen={openNewProject}
          >
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton onClick={() => cancelNewProject()}>
                    Cancel
                  </IonButton>
                </IonButtons>
                <IonTitle className="ion-text-center">New Project</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    disabled={confirmStatus}
                    strong={true}
                    onClick={() => {
                      console.log("im working");
                    }}
                  >
                    Confirm
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <form onSubmit={handleCreateProject}>
                <IonItem>
                  <IonLabel className="project-name-label">
                    Project Name
                  </IonLabel>
                  <IonItem className="project-name-item">
                    <IonInput
                      value={projectName}
                      type="text"
                      className="ion-text-end"
                      placeholder="Type a project name"
                      onIonChange={(e) => setProjectName(e.target.value)}
                    />
                  </IonItem>
                </IonItem>
                <IonItem>
                  <IonLabel>Rol</IonLabel>
                  <IonList>
                    <IonItem>
                      <IonSelect
                        onIonChange={(e) => {
                          setUserRol(e.detail.value);
                        }}
                        placeholder="Chose your rol"
                      >
                        <IonSelectOption value="administrator">
                          Administrator
                        </IonSelectOption>
                        <IonSelectOption value="collaborator">
                          Collaborator
                        </IonSelectOption>
                        <IonSelectOption value="viewer">Viewer</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonList>
                </IonItem>
                <IonItem>
                  <IonLabel>Your Color</IonLabel>
                  <IonList>
                    <IonItem>
                      <IonSelect
                        onIonChange={(e) => {
                          setUserColor(e.detail.value);
                        }}
                        placeholder="Select color"
                        disabled={selectColorOwner}
                      >
                        <IonSelectOption value="red">Red</IonSelectOption>
                        <IonSelectOption value="orange">Orange</IonSelectOption>
                        <IonSelectOption value="yellow">Yellow</IonSelectOption>
                        <IonSelectOption value="green">Green</IonSelectOption>
                        <IonSelectOption value="blue">Blue</IonSelectOption>
                        <IonSelectOption value="indigo">Indigo</IonSelectOption>
                        <IonSelectOption value="violet">Violet</IonSelectOption>
                      </IonSelect>
                    </IonItem>
                  </IonList>
                </IonItem>
                <IonItem>
                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <IonLabel className="ion-padding ion-text-center">
                          Participants
                        </IonLabel>
                      </IonCol>
                    </IonRow>
                    <IonRow>
                      <IonCol>
                        <IonCard className="participants-card" color={"dark"}>
                          <IonCardHeader>
                            <IonSearchbar
                              inputMode="email"
                              disabled={searchIsDisable}
                              animated={true}
                              placeholder="example@example.com"
                              color="light"
                              class="participants-search"
                              onIonChange={(ev) => handleParticipantsSearch(ev)}
                            ></IonSearchbar>
                          </IonCardHeader>
                          <IonCardContent>
                            {emailExists ? (
                              <IonCard
                                color={"success"}
                                className="participants-search-card"
                              >
                                <IonCardContent>
                                  <IonAvatar className="searched-user-avatar">
                                    <IonImg
                                      src={searchedUser.profile_picture}
                                      alt="profile_user_picture"
                                      className="searched-user-img"
                                    />
                                  </IonAvatar>
                                  <IonLabel className="searched-user-name">
                                    {searchedUser.username}
                                  </IonLabel>
                                  <IonItem
                                    className="searched-user-rol"
                                    color={"dark"}
                                  >
                                    <IonSelect
                                      onIonChange={(ev) => {
                                        setRequestURol(ev.detail.value);
                                      }}
                                      placeholder="Give a rol"
                                      className="searched-rol-txt"
                                    >
                                      {isAdmin ? (
                                        <>
                                          <IonSelectOption value="collaborator">
                                            Collaborator
                                          </IonSelectOption>
                                          <IonSelectOption value="viewer">
                                            Viewer
                                          </IonSelectOption>
                                        </>
                                      ) : (
                                        <>
                                          <IonSelectOption value="administrator">
                                            Administrator
                                          </IonSelectOption>
                                          <IonSelectOption value="collaborator">
                                            Collaborator
                                          </IonSelectOption>
                                          <IonSelectOption value="viewer">
                                            Viewer
                                          </IonSelectOption>
                                        </>
                                      )}
                                    </IonSelect>
                                  </IonItem>
                                  <IonButton
                                    color="primary"
                                    className="request-button"
                                    onClick={handleRequest}
                                  >
                                    Send request ?
                                  </IonButton>
                                </IonCardContent>
                              </IonCard>
                            ) : (
                              <IonCard
                                color={"danger"}
                                className="participants-search-card"
                              >
                                <IonCardContent>
                                  <IonLabel className="error-search-label">
                                    User not found
                                  </IonLabel>
                                </IonCardContent>
                              </IonCard>
                            )}
                            <IonItem
                              color={"light"}
                              className="search-available-item"
                            >
                              <IonGrid>
                                <IonRow className="align-lists">
                                  <IonCol>
                                    <IonItem
                                      color="tertiary"
                                      className="participants-headers"
                                    >
                                      Participants Requested
                                    </IonItem>
                                    <IonContent
                                      className="colaborators-admins"
                                      id="colad-list"
                                    >
                                      <IonItem color={"primary"}>
                                        <IonLabel className="colad-item">
                                          <IonGrid>
                                            <IonRow>
                                              <IonCol>
                                                <IonAvatar></IonAvatar>
                                              </IonCol>
                                              <IonCol>
                                                <IonRow>
                                                  <IonLabel>a</IonLabel>
                                                </IonRow>
                                                <IonRow>
                                                  <IonLabel>b</IonLabel>
                                                </IonRow>
                                              </IonCol>
                                              <IonCol></IonCol>
                                            </IonRow>
                                          </IonGrid>
                                        </IonLabel>
                                      </IonItem>
                                      <IonItem>a</IonItem>
                                      <IonItem>a</IonItem>
                                      <IonItem>a</IonItem>
                                    </IonContent>
                                  </IonCol>
                                </IonRow>
                                <IonRow>
                                  <IonCol>
                                    <IonLabel className="ion-text-wrap search-available-coladmin">
                                      {howManyMsg}
                                    </IonLabel>
                                  </IonCol>
                                </IonRow>
                                <IonRow className="align-lists">
                                  <IonCol>
                                    <IonItem
                                      color={"medium"}
                                      className="participants-headers"
                                    >
                                      Viewers
                                    </IonItem>
                                    <IonContent className="colaborators-admins">
                                      <IonItem color={"warning"}>a</IonItem>
                                      <IonItem>a</IonItem>
                                      <IonItem>a</IonItem>
                                      <IonItem>a</IonItem>
                                    </IonContent>
                                  </IonCol>
                                </IonRow>
                              </IonGrid>
                            </IonItem>
                          </IonCardContent>
                        </IonCard>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              </form>
            </IonContent>
          </IonModal>
          <IonModal
            ref={modalGoals}
            isOpen={openGoals}
            presentingElement={presentingElement}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>My Project Goals</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setOpenGoals(false)}>
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonItem className="ion-margin-top ion-margin-bottom project-goal">
                <IonCheckbox slot="start"></IonCheckbox>
                <IonLabel>This is a Goal</IonLabel>
              </IonItem>
            </IonContent>
          </IonModal>
          <IonModal
            ref={modalParticipants}
            isOpen={openParticipants}
            presentingElement={presentingElement}
          >
            <IonHeader>
              <IonToolbar>
                <IonTitle>Participants</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => setOpenParticipants(false)}>
                    Close
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
          </IonModal>
        </IonContent>
      </IonPage>
    </>
  );
};

export default Home;

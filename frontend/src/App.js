import React from "react";
import "./App.css"
import { Routes, Route } from "react-router-dom";
import Auth from "./components/auth/Auth";
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import SetProfile from "./components/auth/SetProfile"
import PreCategory from "./components/auth/PreCategory";
import ChallengeDetail from "./components/challengeDetail/ChallengeDetail";
import ChallengeSearch from "./components/challengeSearch/ChallengeSearch";
import ChallengeShot from "./components/challengeShot/ChallengeShot";
import ChallengeCertify from "./components/challengeCertify/ChllengeCertify";
import CertificationPhotos from "./components/challengeCertify/CertificationPhotos";
import Main from "./components/main/Main";
import MyPage from "./components/myPage/MyPage";
import MyProfile from "./components/myPage/MyProfile";
import EditProfile from "./components/myPage/EditProfile";
import MyShotZip from "./components/myPage/MyShotZip";
import CreateChallenge from "./components/myPage/CreateChallenge";
import MyFavorite from "./components/myPage/MyFavorite";
import MyWallet from "./components/myWallet/MyWallet";
import Menu from "./components/Menu";
import Alarm from "./components/alarm/Alarm";
import Voting from './components/voting/Voting';
import VotingHome from './components/voting/VotingHome';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/loginresult" element={<Login />} />
        <Route path="/logoutresult" element={<Logout />} />
        <Route path="/setprofile" element={<SetProfile />} />
        <Route path="/precategory" element={<PreCategory />} />
        <Route path="/challenge-detail" element={<ChallengeDetail />} />
        {/* <Route path="/challenge-detail:id" element={<ChallengeDetail />} /> */}
        <Route path="/challenge-search" element={<ChallengeSearch />} />
        <Route path="/challenge-shot" element={<ChallengeShot />} />
        <Route path="/challenge-certify" element={<ChallengeCertify />} />
        <Route path="/certification-photos" element={<CertificationPhotos />} />
        <Route path="/my-page" element={<MyPage />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/my-shot-zip" element={<MyShotZip />} />
        <Route path="/create-challenge" element={<CreateChallenge />} />
        <Route path="/my-favorite" element={<MyFavorite />} />
        <Route path="/my-wallet" element={<MyWallet />} />
        <Route path="/alarm" element={<Alarm />} />
        <Route path="/votinghome" element={<VotingHome />} />
        <Route path="/voting:id" element={<Voting />} />

      </Routes>
      <Menu />
    </div>
  );
}

export default App;
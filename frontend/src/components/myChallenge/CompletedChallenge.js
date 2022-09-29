import React, { useState, useEffect } from "react";
import styles from "./CompletedChallenge.module.css";
import { useNavigate } from "react-router-dom";
import MyChallengeCard from "../common/MyChallengeCard";
import test from "../../img/test-back.jpg";
import ContractAPI from "../../api/ContractAPI";
import { useSelector } from "react-redux";
import { selectUser, setUserInfo } from "./../../app/redux/userSlice";
import UserAPI from "../../api/UserAPI";
import { useDispatch } from "react-redux";
import { challengeList } from "./../../app/redux/allChallengeSlice";
import * as getInterestStr from "../main/Main.js";
import * as getDayGap from "../main/Main.js";

function Header() {
  const navigate = useNavigate();
  return (
    <div style={{ position: "sticky", top: "0px", backgroundColor: "white" }}>
      <div className={styles.header}>
        <svg
          style={{ margin: "auto" }}
          onClick={() => navigate(-1)}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-chevron-left"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
          />
        </svg>
        <p style={{ fontSize: "20px", margin: "auto" }}>완료된 챌린지</p>
        <div></div>
      </div>
    </div>
  );
}

function AchieveRateBox() {
  const Contract = new ContractAPI();
  const dispatch = useDispatch();
  const [user, setUser] = useState(useSelector(selectUser));
  const [edChal, setEdChal] = useState("");
  const [totalReward, setTotalReward] = useState("");
  const selector = useSelector(challengeList);
  useEffect(() => {
    UserAPI.mypage(user.email).then((response) => {
      dispatch(setUserInfo(response.data.body));
      setUser(response.data.body);
    });
  }, [user.email, dispatch]);
  useEffect(() => {
    async function load() {
      await Contract.getMyChallenge(user.id).then((result) => {
        const join = result[1];
        let edCount = 0;
        for (let i = 0; i < join.length; i++) {
          if (selector[join[i]].complete ===true) {
            edCount += 1;
          }
        }
        setEdChal(edCount);
      });
    }
    load();
  }, [user.id]);

  useEffect(() => {
    async function load() {
      await Contract.getChallengersByUserId(user.id).then((result) => {
        let tmpReward = 0;
        const myChallengeInfo = result;
        for (let i = 0; i < myChallengeInfo.length; i++) {
          let tmpInfo = myChallengeInfo[i];
          if (tmpInfo.complete !== true) {
            tmpReward += (tmpInfo.reward / 1e18);
          }
        }
        setTotalReward(tmpReward);
      });
    }
    load();
  }, []);
  return (
    <div className={styles.achRateBox}>
      <div className={styles.boxLeft}>
        <p>챌린지</p>
        <p>
          <span>{edChal}</span>개
        </p>
      </div>
      <div className={styles.boxRight}>
        <p>총 환급금</p>
        <span>
          {totalReward} <span style={{ fontSize: "14px" }}>ETH</span>{" "}
        </span>
      </div>
    </div>
  );
}

function ChallengeList() {
  const Contract = new ContractAPI();
  const [user, setUser] = useState(useSelector(selectUser));
  const [userid, setUserid] = useState("");
  const infos = [];
  const counts = [];
  const challengeIds = [];
  const dispatch = useDispatch();
  const selector = useSelector(challengeList);

  useEffect(() => {
    UserAPI.mypage(user.email).then((response) => {
      dispatch(setUserInfo(response.data.body));
      setUser(response.data.body);
      setUserid(response.data.body.id);
    });
  }, [user.email, dispatch]);
  useEffect(() => {
    async function load() {
      await Contract.getMyChallenge(userid).then((result) => {
        const join = result[1];
        if (join.length !== 0) {
          for (let i = 0; i < join.length; i++) {
            if (join[i].complete === true) {
              challengeIds.push(join[i]);
            }
          }
        }
        for (let i = 0; i < challengeIds.length; i++) {
          let id = challengeIds[i];
          let challengers = Contract.getChallengers(id);
          for (let j = 0; j < challengers.length; j++) {
            if (challengers[j].id === userid) {
              counts.push(challengers[j].totalCount);
            }
          }
          infos.push(selector[id]);
        }
      });
    }
    load();
  }, [user.id]);

  return (
    <div className={styles.listBox}>
      {infos.map(function (info, index) {
        let week = Math.floor(
          getDayGap.getDayGapFromDates(info.startDate, info.endDate) / 7
        );
        let perWeek = Math.floor(info.authTotalTimes / week);
        return (
          <MyChallengeCard
            type={getInterestStr.interestIdToName(info.interestId)}
            title={info.name}
            times={perWeek}
            period={info.startDate + "~" + info.endDate}
            img={info.mainPicURL}
            count={counts[index]}
          ></MyChallengeCard>
        );
      })}
    </div>
  );
}

function CompletedChallenge() {
  return (
    <div>
      <Header></Header>
      <AchieveRateBox></AchieveRateBox>
      <ChallengeList></ChallengeList>
    </div>
  );
}

export default CompletedChallenge;

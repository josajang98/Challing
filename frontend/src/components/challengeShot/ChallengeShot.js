import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./ChallengeShot.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  setChallengeList,
  challengeList,
} from "../../app/redux/allChallengeSlice";
import * as getDayGab from "../main/Main.js";
import moment from "moment";
import { selectUser } from "../../app/redux/userSlice";
import ContractAPI from "../../api/ContractAPI";
import tick from "../../img/tick.png";
import calender from "../../img/calender.png";
import megaphone from "../../img/megaphone.png";

function ChallengeShot() {
  const [setMyChallenge] = useState("");
  const onChange = (event) => setMyChallenge(event.target.value);
  const allChallenge = useSelector(challengeList);
  const user = useSelector(selectUser);
  const [challengers, setChallegers] = useState();
  const dispatch = useDispatch();
  const Contract = new ContractAPI();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      // let allChallengeList = {};
      // await Contract.getAllChallenge().then((result) => {
      //   allChallengeList = result;
      // });
      // dispatch(setChallengeList(allChallengeList));
      const challengers = await Contract.getChallengersByUserId(user.id);

      setChallegers(challengers);
    }
    load();
  }, []);

  function ChallengeCard(props) {
    const today = moment(new Date()).format("YYYY-MM-DD");
    const NoIng = getDayGab.getDayGapFromToday(props.challengeInfo.startDate);
    const dayGab = getDayGab.getDayGapFromDates(
      today,
      props.challengeInfo.endDate
    );

    let userCount = 0;

    if (challengers) {
      userCount = challengers.filter(
        (el) => el.challengeId === props.challengeInfo.challengeId
      )[0].totalCount;
    }
    const percentage = (
      (userCount / props.challengeInfo.authTotalTimes) *
      100
    ).toFixed(0);

    return (
      <div>
        {NoIng > 0 ? (
          <div
            className={styles.CardBox}
            onClick={() => {
              navigate(`/challenge-detail/${props.challengeInfo.challengeId}`);
            }}
          >
            <img
              style={{ borderRadius: "10px 0 0 10px" }}
              src={props.challengeInfo.mainPicURL}
              height="120"
              width="160"
              alt=""
            ></img>
            <div className={styles.cardbody}>
              <p className={styles.CardTitle}>{props.challengeInfo.name}</p>
              <p
                style={{
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={calender} height="12" width="12" alt="" />
                {NoIng}??? ??? ??????
              </p>
            </div>
            {/* {console.log(NoIng)} */}
          </div>
        ) : dayGab>0? (
          <div
            className={styles.CardBox}
            onClick={() => {
              navigate(
                `/challenge-certify/${props.challengeInfo.challengeId}`,
                {
                  state: {
                    challengeInfo: props.challengeInfo,
                  },
                }
              );
            }}
          >
            <img
              style={{ borderRadius: "10px 0 0 10px" }}
              src={props.challengeInfo.mainPicURL}
              height="120"
              width="160"
              alt=""
            ></img>
            <div className={styles.cardbody}>
              <p className={styles.CardTitle}>{props.challengeInfo.name}</p>
              <p
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={megaphone} height="14" width="14" alt="" />
                ?????? {percentage}%??????
              </p>
              <p
                style={{
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img src={calender} height="14" width="14" alt="" />
                {dayGab}??? ??? ??????
              </p>
              {/* {console.log(NoIng)} */}
            </div>
          </div>
        ):null}
      </div>
    );
  }
  function NoChallenging() {
    return (
      <div className={styles.NoContents}>
        <p className={styles.NoContent}>???????????? ???????????? ????????????.????</p>
        <Link to="/">
          <button className={styles.AroundButton}>????????? ????????????</button>
        </Link>
      </div>
    );
  }
  function YesChallenge() {
    let flag = false;
    if (challengers) {
      const result = (
        <div className={styles.Contents}>
          {Object.values(allChallenge)
            .filter((challenge) => {
              return challengers.filter(
                (el) => el.challengeId === challenge.challengeId
              )[0];
            })
            .map((challenge, index) => {
              flag = true;
              return (
                <ChallengeCard
                  key={index}
                  challengeInfo={challenge}
                  challengerInfo={
                    challengers.filter(
                      (c) => c.challengeId === challenge.challengeId
                    )[0]
                  }
                ></ChallengeCard>
              );
            })}
        </div>
      );
      return flag ? result : NoChallenging();
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <p>????????? ??????</p>
      </div>
      <div className={styles.Content}>
        {Object.values(allChallenge).length === 0 ? (
          <NoChallenging />
        ) : (
          <YesChallenge />
        )}
      </div>
    </div>
  );
}

export default ChallengeShot;

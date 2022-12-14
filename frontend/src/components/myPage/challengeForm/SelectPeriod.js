import { useEffect, useState } from "react";
import styles from "./challengeForm.module.css";
import Calender from "../../../img/calender.png";
import DatePicker from "react-datepicker";
import addMonths from "date-fns/addMonths";
import addDays from "date-fns/addDays";
import { ko } from "../../../../node_modules/date-fns/esm/locale";
import "../../../../node_modules/react-datepicker/dist/react-datepicker.css";
import tick from "../../../img/tick.png";
import moment from "moment";

function SelectPeriod({
  formCnt,
  setFormCnt,
  period,
  setPeriod,
  setChallengeStart,
  setChallengeEnd,
}) {
  const [list, setList] = useState({
    Njoo: null,
    startD: null,
    endD: null,
  });
  const [day, setDay] = useState(0);
  const [endDate, setEndDate] = useState(new Date());
  const [startDate, setStartDate] = useState(addDays(new Date(), 1));
  useEffect(() => {
    setStartDate(addDays(new Date(), 1));
    // console.log("startDate", startDate);
  }, []);
  useEffect(() => {
    setChallengeEnd(moment(endDate).format("YYYY-MM-DD"));
  }, [endDate]);
  useEffect(() => {
    const ddate = new Date(startDate);
    setChallengeStart(moment(startDate).format("YYYY-MM-DD"));
    setEndDate(new Date(ddate.setDate(ddate.getDate() + day)));
    setList((list) => ({ ...list, startD: startDate, endD: endDate }));
  }, [day]);
  function NextButton() {
    return (
      <div className={styles.buttonBox}>
        <button
          className={styles.NextButton}
          onClick={() => {
            setFormCnt(formCnt + 1);
          }}
        >
          Next( {formCnt} / 8)
        </button>
      </div>
    );
  }
  function NextButtonX() {
    return (
      <div className={styles.buttonBox}>
        <button className={styles.NextButtonX}>Next( {formCnt} / 8)</button>
      </div>
    );
  }
  function Header() {
    return (
      <div style={{ position: "sticky", top: "0px", backgroundColor: "white" }}>
        <div className={styles.header}>
          <svg
            onClick={() => {
              setFormCnt(formCnt - 1);
            }}
            style={{ margin: "16px" }}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-chevron-left"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
            />
          </svg>
          <p style={{ fontSize: "20px", margin: "auto" }}>????????? ????????????</p>
          <div></div>
        </div>
      </div>
    );
  }
  // console.log("list", list);
  return (
    <div>
      <Header />
      <div style={{ marginTop: "64px" }}>
        <div style={{ padding: "16px" }}>
          <p className={styles.FormHeader} style={{ marginBottom: "16px" }}>
            ???????????? ????????? ??????????????????.
          </p>
          <p className={styles.FormEx} style={{ marginBottom: "8px" }}>
            ???????????? ??????????????? ????????? ??????????????????.
            <br />
            ????????? ?????? ??? ????????? ???????????????.
            <br />
          </p>
          <p style={{ marginTop: "16px", marginBottom: "16px" }}>
            <img src={tick} alt="tick" style={{ width: "16px" }} /> ????????? ??????
          </p>
          <div className={styles.Weeks}>
            <div
              className={day === 7 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(7);
                setDay(7);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>1???</p>
            </div>
            <div
              className={day === 14 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(14);
                setDay(14);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>2???</p>
            </div>
            <div
              className={day === 21 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(21);
                setDay(21);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>3???</p>
            </div>
            <div
              className={day === 28 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(28);
                setDay(28);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>4???</p>
            </div>
            <div
              className={day === 35 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(35);
                setDay(35);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>5???</p>
            </div>
            <div
              className={day === 42 ? styles.SelectWeeks : styles.SelectWeekX}
              value={period}
              onClick={() => {
                setPeriod(42);
                setDay(42);
                setList((list) => ({ ...list, Njoo: 1 }));
              }}
            >
              <p>6???</p>
            </div>
          </div>
          <p style={{ marginTop: "16px", marginBottom: "16px" }}>
            <img src={tick} alt="tick" style={{ width: "16px" }} /> ?????????
            ?????????
          </p>
          <div className={styles.SelectDate}>
            <img
              style={{ width: "24px", height: "24px" }}
              src={Calender}
              alt="calenderIcon"
            />
            <DatePicker
              className={styles.DatePicker}
              dateFormat="yyyy/MM/dd"
              locale={ko}
              selected={startDate}
              onChange={(date) => {
                const start = new Date(date);
                const startData = moment(date).format("YYYY-MM-DD");
                setStartDate(start);
                setChallengeStart(startData);
                setEndDate(new Date(date.setDate(date.getDate() + day)));
                setList((list) => ({ ...list, startD: start, endD: start }));
              }}
              minDate={addDays(new Date(), 1)}
              maxDate={addMonths(new Date(), 5)}
              showDisabledMonthNavigation
            />
          </div>
          <div>
            <p style={{ marginTop: "16px", marginBottom: "16px" }}>
              <img src={tick} alt="tick" style={{ width: "16px" }} /> ??????
              ????????? ??????
            </p>
            <div className={styles.Periods}>
              <p>{moment(startDate).format("YYYY??? MM??? DD???")}</p>
              <p>~</p>
              <p>{moment(endDate).format("YYYY??? MM??? DD???")}</p>
            </div>
          </div>
        </div>
        {Object.values(list).includes(null) ? <NextButtonX /> : <NextButton />}
      </div>
    </div>
  );
}

export default SelectPeriod;

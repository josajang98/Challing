import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ContractAPI from "../../api/ContractAPI";
import { useSelector } from "react-redux";
import { selectUser } from "../../app/redux/userSlice";
import Loading from "../common/Loading";

function JoinLoading() {
  const { id } = useParams();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [check, setCheck] = useState(0);

  useEffect(() => {
    async function load() {
      const Contract = new ContractAPI();

      await Contract.checkChallenger(Number(id), user.id).then((response) => {
        setCheck(check + 1);
        if (response) {
          navigate(`/success-register/${id}`);
        }
      });
    }
    load();
  });

  return (
    <div>
      <Loading></Loading>
    </div>
  );
}

export default JoinLoading;

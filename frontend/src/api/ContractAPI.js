import Web3 from "web3";
import moment from "moment";

class ContractAPI {
  constructor(address) {
    this.init(address);
  }
  async init(address) {
    this.Cartifact = require("../contracts/ChallengeContract.json");
    this.Vartifact = require("../contracts/VoteContract.json");
    const ropstenUrl =
      "https://ropsten.infura.io/v3/" + process.env.REACT_APP_INFURA_API_KEY;
    const goerliUrl =
      "https://goerli.infura.io/v3/" + process.env.REACT_APP_INFURA_API_KEY;
    const local = "http://localhost:7545";

    this.web3 = new Web3(
      new Web3.providers.HttpProvider(process.env.REACT_APP_DEMO_URL)
    );

    if (address !== undefined) {
      this.account = address;
    }
    // console.log("init: ", this.account);
    this.networkId = await this.web3.eth.net.getId();
    this.Cabi = this.Cartifact.abi;
    if (this.Cartifact.networks[this.networkId].address === undefined) {
      alert("Goerli 네트워크의 계정으로 접속해주세요");
    } else {
      this.Caddress = this.Cartifact.networks[this.networkId].address;
      //로컬에 저장
      window.localStorage.setItem("Caddress", this.Caddress);
      this.Ccontract = new this.web3.eth.Contract(this.Cabi, this.Caddress);
      this.Vabi = this.Vartifact.abi;
      this.Vaddress = this.Vartifact.networks[this.networkId].address;
      window.localStorage.setItem("Vaddress", this.Caddress);
      this.Vcontract = new this.web3.eth.Contract(this.Vabi, this.Vaddress);
    }
  }

  // ChallengeContract
  async getAllChallenge() {
    await this.init();
    const challengeList = await this.Ccontract.methods
      .getAllChallenge()
      .call({
        from: this.account,
      })
      .catch(console.error);

    // 일상 챌린지
    const challenges = {};
    challengeList[0].forEach((id, index) => {
      const challenge = Object.assign({}, challengeList[2][index]);
      const size = Object.keys(challenge).length;
      for (let i = 0; i < size / 2; i++) {
        delete challenge[i];
      }
      challenges[Number(id)] = challenge;
    });
    // 기부 챌린지
    challengeList[1].forEach((id, index) => {
      const challenge = Object.assign({}, challengeList[3][index]);
      const size = Object.keys(challenge).length;
      for (let i = 0; i < size / 2; i++) {
        delete challenge[i];
      }
      challenges[Number(id)] = challenge;
    });
    return challenges;
  }

  async joinChallenge(challengeId, userId, today, value) {
    await this.init();

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              value: this.web3.utils.toHex(
                this.web3.utils.toWei(value, "ether")
              ),
              data: this.Ccontract.methods
                .joinChallenge(challengeId, userId, today)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }
  async getMyChallenge(userId) {
    await this.init();

    const challenges = await this.Ccontract.methods
      .getMyChallenge(userId)
      .call({
        from: this.account,
      })
      .catch(console.error);
    challenges[0] = challenges[0].filter((challenge) => challenge !== "0");

    return challenges;
  }
  async findingChallenger(challengeId, userId) {
    await this.init();
    return this.Ccontract.methods
      .findingChallenger(challengeId, userId)
      .call({ from: this.account })
      .catch(console.error);
  }
  async checkChallenger(challengeId, userId) {
    await this.init();
    return this.Ccontract.methods
      .checkChallenger(challengeId, userId)
      .call({ from: this.account })
      .catch(console.error);
  }
  async findByChallengerId(challengerId) {
    await this.init();
    return this.Ccontract.methods
      .findByChallengerId(challengerId)
      .call({
        from: this.account,
      })
      .catch(console.error);
  }
  async authenticate(challengeId, userId, today, picURL) {
    await this.init();
    // 챌린저 정보 가져오기
    const info = await this.Ccontract.methods
      .findingChallenger(challengeId, userId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const challengerId = info[0];
    const userIdIndex = info[1];
    const challengeIdIndex = info[2];
    const timestamp = moment(new Date()).format().substring(0, 19);

    if (this.account !== undefined && this.account !== "") {
      // 사진 저장
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Vaddress,
              data: this.Vcontract.methods
                .addPhoto(challengerId, userId, picURL, timestamp)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);

      //인증
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              data: this.Ccontract.methods
                .authenticate(
                  challengeId,
                  userId,
                  challengerId,
                  userIdIndex,
                  challengeIdIndex,
                  today
                )
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }

  async getChallengers(challengeId) {
    await this.init();
    const challengers = await this.Ccontract.methods
      .getChallengers(challengeId)
      .call({
        from: this.account,
      })
      .catch(console.error);
    const result = challengers.map((el) => {
      const challenge = Object.assign({}, el);
      const size = Object.keys(challenge).length;
      for (let i = 0; i < size / 2; i++) {
        delete challenge[i];
      }
      return challenge;
    });

    return result;
  }
  async getChallengersByUserId(userId) {
    await this.init();

    const challengers = await this.Ccontract.methods
      .getChallengersByUserId(userId)
      .call({
        from: this.account,
      })
      .catch(console.error);
    const result = challengers.map((el) => {
      const challenge = Object.assign({}, el);
      const size = Object.keys(challenge).length;
      for (let i = 0; i < size / 2; i++) {
        delete challenge[i];
      }
      return challenge;
    });

    return result;
  }

  // ChallengerContract
  async refund(challengeId, userId) {
    await this.init();
    // 챌린저 정보 가져오기
    const info = await this.Ccontract.methods
      .findingChallenger(challengeId, userId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const challengerId = info[0];
    const userIdIndex = info[1];
    const challengeIdIndex = info[2];
    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              data: this.Ccontract.methods
                .refund(
                  challengeId,
                  userId,
                  challengerId,
                  userIdIndex,
                  challengeIdIndex
                )
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }
  async usePasscoin(challengeId, userId) {
    await this.init();
    // 챌린저 정보 가져오기
    const info = await this.Ccontract.methods
      .findingChallenger(challengeId, userId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const challengerId = info[0];
    const userIdIndex = info[1];
    const challengeIdIndex = info[2];

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              data: this.Ccontract.methods
                .usePasscoin(
                  challengeId,
                  userId,
                  challengerId,
                  userIdIndex,
                  challengeIdIndex
                )
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }
  async applyVoteResult(challengeId, userId) {
    await this.init();
    // 챌린저 정보 가져오기
    const info = await this.Ccontract.methods
      .findingChallenger(challengeId, userId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const challengerId = info[0];
    const userIdIndex = info[1];
    const challengeIdIndex = info[2];

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              data: this.Ccontract.methods
                .applyVoteResult(
                  challengeId,
                  userId,
                  challengerId,
                  userIdIndex,
                  challengeIdIndex
                )
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }
  async getVote(voteId) {
    await this.init();
    const vote = await this.Vcontract.methods
      .getVote(voteId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const result = Object.assign({}, vote);
    const size = Object.keys(result).length;
    for (let i = 0; i < size / 2; i++) {
      delete result[i];
    }
    return result;
  }
  async receivePasscoin(userIdList) {
    await this.init();

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              data: this.Ccontract.methods
                .receivePasscoin(userIdList)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }

  // DailyChallengeContract
  async createDailyChallenge(dailyChallenge) {
    await this.init();
    // console.log("daily - 111", dailyChallenge);
    const deposit = dailyChallenge.deposit.toString();
    dailyChallenge.deposit = 1;
    dailyChallenge.totalDeposit = 1;
    // console.log("daily - 222", dailyChallenge);
    // console.log(dailyChallenge);
    if (this.account !== undefined && this.account !== "") {
      const txHash = await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              value: this.web3.utils.toHex(
                this.web3.utils.toWei(deposit, "ether")
              ),
              data: this.Ccontract.methods
                .createDailyChallenge(dailyChallenge)
                .encodeABI(),
            },
          ],
        })
        .catch((error) => console.error);
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);

      const event = this.web3.eth.abi.decodeLog(
        this.Cabi[2].inputs,
        receipt.logs[0].data,
        receipt.logs[0].topics
      );
      return event["challengeId"];
    }
  }

  async endDailyChallenge(challengeId) {
    await this.init();
    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              data: this.Ccontract.methods
                .endDailyChallenge(challengeId)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }

  // DonationChallengeContract
  async createDonationChallenge(donationChallenge) {
    await this.init();

    const setDonation = donationChallenge.setDonation.toString();
    donationChallenge.setDonation = 1;
    donationChallenge.totalDonation = 1;

    if (this.account !== undefined && this.account !== "") {
      const txHash = await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Caddress,
              value: this.web3.utils.toHex(
                this.web3.utils.toWei(setDonation, "ether")
              ),
              data: this.Ccontract.methods
                .createDonationChallenge(donationChallenge)
                .encodeABI(),
            },
          ],
        })
        .catch((error) => console.error);

      const receipt = await this.web3.eth.getTransactionReceipt(txHash);

      const event = this.web3.eth.abi.decodeLog(
        this.Cabi[2].inputs,
        receipt.logs[0].data,
        receipt.logs[0].topics
      );
      return event["challengeId"];
    }
  }

  async endDonationChallenge(challengeId) {
    await this.init();

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              data: this.Ccontract.methods
                .endDonationChallenge(challengeId)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }

  async getAllDonation() {
    await this.init();

    const donations = await this.Ccontract.methods
      .getAllDonation()
      .call({
        from: this.account,
      })
      .catch(console.error);
    const result = donations.map((el) => {
      const donation = Object.assign({}, el);
      const size = Object.keys(donation).length;
      for (let i = 0; i < size / 2; i++) {
        delete donation[i];
      }
      return donation;
    });

    return result;
  }

  // PhotoContract
  async getChallengerPhoto(challengerId) {
    await this.init();

    const photos = await this.Vcontract.methods
      .getChallengerPhoto(challengerId)
      .call({
        from: this.account,
      })
      .catch(console.error);
    const result = photos
      .map((el) => {
        const photo = Object.assign({}, el);
        const size = Object.keys(photo).length;
        for (let i = 0; i < size / 2; i++) {
          delete photo[i];
        }

        return photo;
      })
      .filter((photo) => photo.id !== "0");

    return result;
  }

  async report(challengeId, photoId, userId,reportUserId) {
    await this.init();
    const info = await this.Ccontract.methods
      .findingChallenger(challengeId, reportUserId)
      .call({
        from: this.account,
      })
      .catch(console.error);

    const challengerId = info[0];
    
    if (this.account !== undefined && this.account !== "") {
      const txHash = await window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Vaddress,
              data: this.Vcontract.methods
                .report(challengeId, photoId, userId, challengerId)
                .encodeABI(),
            },
          ],
        })
        .catch((error) => console.error);
      const receipt = await this.web3.eth.getTransactionReceipt(txHash);
      const event = this.web3.eth.abi.decodeLog(
        this.Vabi[0].inputs,
        receipt.logs[0].data,
        receipt.logs[0].topics
      );
      return event["voteId"];
    }
  }
  async voting(challengeId, userId, voteId, pass) {
    await this.init();

    if (this.account !== undefined && this.account !== "") {
      window.ethereum
        .request({
          method: "eth_sendTransaction",
          params: [
            {
              from: this.account,
              to: this.Vaddress,
              data: this.Vcontract.methods
                .voting(challengeId, userId, voteId, pass)
                .encodeABI(),
            },
          ],
        })
        .then((txHash) => console.log(txHash))
        .catch((error) => console.error);
    }
  }
  async endVote(voteId) {
    await this.init();

    return this.Vcontract.methods
      .endVote(voteId)
      .call({
        from: this.account,
      })
      .catch(console.error);
  }
  async getChallengeVote(challengeId) {
    await this.init();

    const votes = await this.Vcontract.methods
      .getChallengeVote(challengeId)
      .call({
        from: this.account,
      })
      .catch(console.error);
    const result = votes.map((el) => {
      const vote = Object.assign({}, el);
      const size = Object.keys(vote).length;
      for (let i = 0; i < size / 2; i++) {
        delete vote[i];
      }
      return vote;
    });

    return result;
  }

  async getPasscoin() {
    await this.init();
    if (this.account !== undefined) {
      return this.Ccontract.methods
        .balanceOf(this.account)
        .call({
          from: this.account,
        })
        .catch(console.error);
    }
  }
}

export default ContractAPI;

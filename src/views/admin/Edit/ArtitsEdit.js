import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import config from "../../../config";
import Web3 from "web3";
import Swal from "sweetalert2";
import Loader from "../../../components/Loader/Loader";
import Loader2 from "../../../components/Loader/Loader2";

import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import DeleteIcon from "@material-ui/icons/Delete";
import SendIcon from "@material-ui/icons/Send";

const chimeraContract = require("../../../contracts/Chimera.json");
const SMAV2Contract = require("../../../contracts/ChimeraMarketAuctionV2.json");
const SRRContract = require("../../../contracts/ChimeraRoyaltyRegistry.json");
const STCRContract = require("../../../contracts/ChimeraTokenCreatorRegistry.json");
// components
let chimera, web3, accounts, SMAV2, SRR, STCR;
const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ArtistEdit() {
  const classes = useStyles();

  const { id } = useParams();
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  const [nftData, setNftData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [royalty, setRoyaltyFee] = useState(0);
  const [validRoyalty, setValidRoyalty] = useState(false);
  const [tokenDescription, setTokenDescription] = useState("");
  const [isTokenCreator, setIsTokenCreator] = useState("");
  const [loading2, setLoading2] = useState(false);
  async function callData() {
    setLoading(true);
    let NFTData,
      OwnerData = [];
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    accounts = await web3.eth.getAccounts();
    chimera = await new web3.eth.Contract(chimeraContract.abi, config.Chimera);
    SMAV2 = await new web3.eth.Contract(SMAV2Contract.abi, config.SMAV2);
    SRR = await new web3.eth.Contract(SRRContract.abi, config.SRR);
    STCR = await new web3.eth.Contract(STCRContract.abi, config.STCR);

    try {
      let res = await chimera.methods.tokenURI(id).call();
      setTokenDescription(res);
      let tokenCreator = await STCR.methods
        .tokenCreator(config.Chimera, id)
        .call();
      console.log(tokenCreator);
      if (tokenCreator === "0x0000000000000000000000000000000000000000") {
        setIsTokenCreator(false);
      } else {
        setIsTokenCreator(true);
      }
      res = await axios.get(`http://localhost:5000/file/${id}`);
      NFTData = res.data[0];
      res = await axios.get(
        `http://localhost:5000/api/users/${NFTData.Artist}`
      );
      OwnerData = res.data;

      setNftData(NFTData);
      setOwnerData(OwnerData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
      console.log(error);
    }
  }
  function OnChangeFee(e) {
    // if (e.target.value > 0 && e.target.value) {
    // }
    setValidRoyalty(false);
    let value = e.target.value;
    if (/[^0-9]+/.test(value)) {
      value = value.replace(/[^0-9]*/g, "");
    }
    if (value > 80 || value < 0) {
      setValidRoyalty(true);
      setRoyaltyFee(0);
    } else {
      setRoyaltyFee(value);
    }
  }

  async function deleteToken() {
    console.log(chimera);

    try {
      setLoading(true);
      let res = await chimera.methods
        .deleteToken(id)
        .send({ from: accounts[0] });

      let del = await axios.delete(`http://localhost:5000/delete/${id}`);
      history.push("/admin/nftApprovals");
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }
  }
  async function approveToken() {
    setLoading(true);
    try {
      let res = await SMAV2.methods
        .confirmTokenByAdmin(id, config.Chimera)
        .send({ from: accounts[0] });
      await Swal.fire({
        icon: "success",
        text: "NFT has been approved succesfully!",
      });
      history.push("/admin/nftapprovals");
    } catch (error) {
      console.log(error);
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
      });
    }
  }
  async function SetRoyaltyFee() {
    setLoading2(true);
    if (royalty > 80 || royalty < 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Royalty Fee must be less than 80 and greater than 0",
      });
      setLoading2(false);
    } else {
      try {
        let res = await SRR.methods
          .setPercentageForSetERC721TokenRoyalty(config.Chimera, id, royalty)
          .send({ from: accounts[0] });
        setLoading2(false);
        Swal.fire({
          icon: "success",

          text: "Royalty Fees has been set successfully!",
        });
      } catch (error) {
        setLoading2(false);
        setLoading(false);
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong",
        });
      }
    }
  }

  async function SetTokenCreator(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let res = await STCR.methods
        .setTokenCreator(config.Chimera, id, ownerData.address)
        .send({ from: accounts[0] });
      console.log(res);
      window.location.reload();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
      });
    }
  }

  useEffect(() => {
    if (!id) {
      history.push("/admin");
    }
  }, []);
  useEffect(() => {
    callData();
  }, []);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full lg:w-12/12 px-4">
          {/* <CardSettings /> */}
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  NFT Detail
                </h6>
                {/* <button
                  className="bg-lightBlue-500 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Settings
                </button> */}
              </div>
            </div>
            {!loading ? (
              <>
                <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <form>
                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      Artist Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Name
                          </label>
                          <input
                            type="text"
                            disabled
                            className="border-0 uppercase px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={ownerData.name}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Email address
                          </label>
                          <input
                            type="email"
                            disabled
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={ownerData.email}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Wallet Address
                          </label>
                          <input
                            type="text"
                            disabled
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={ownerData.address}
                          />
                        </div>
                      </div>
                      {/* <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue="Jesse"
                          />
                        </div>
                      </div> */}
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      NFT Information
                    </h6>
                    <div className="flex flex-wrap">
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            ID
                          </label>
                          <input
                            type="text"
                            disabled
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={id}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-6/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Name
                          </label>
                          <input
                            type="email"
                            disabled
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={nftData.name}
                          />
                        </div>
                      </div>
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-3">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          >
                            Description
                          </label>
                          <textarea
                            type="text"
                            disabled
                            className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            defaultValue={tokenDescription}
                            rows="4"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    <hr className="mt-6 border-b-1 border-blueGray-300" />

                    <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                      NFT Image
                    </h6>
                    <div className="flex flex-wrap ">
                      <div className="w-full lg:w-12/12 px-4">
                        <div className="relative w-full mb-12">
                          <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-password"
                          ></label>
                          {/* <textarea
                        type="text"
                        className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                        defaultValue="A beautiful UI Kit and Admin for React & Tailwind CSS. It is Free and Open Source."
                        rows="4"
                      ></textarea> */}
                          <img
                            style={{ width: "500px" }}
                            src={nftData.image}
                            className="shadow-2xl rounded-2xl"
                          />
                        </div>
                      </div>
                    </div>

                    {isTokenCreator ? (
                      <>
                        <div className="w-full lg:w-6/12 px-4">
                          <div className="relative w-full mb-12">
                            <label
                              className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                              htmlFor="grid-password"
                            >
                              Set Royalty fee
                            </label>
                            <input
                              max={80}
                              onChange={OnChangeFee}
                              type="number"
                              value={royalty}
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                            />
                            {validRoyalty ? (
                              <>
                                <span style={{ color: "red" }}>
                                  * Royalty Fee should be in between 0 to 80
                                </span>
                              </>
                            ) : null}

                            <button
                              style={{ backgroundColor: "black" }}
                              className=" mr-4 mt-2 text-white active:bg-lightBlue-600 font-bold uppercase text-xs px-12 py-3 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                              type="button"
                              onClick={SetRoyaltyFee}
                            >
                              Set
                            </button>
                            {loading2 ? (
                              <>
                                <Loader2 />
                              </>
                            ) : null}
                          </div>
                        </div>
                        <div className="text-right ">
                          <Button
                            size="xl"
                            style={{
                              padding: 10,
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<DeleteIcon />}
                            onClick={deleteToken}
                          >
                            Delete
                          </Button>
                          <Button
                            style={{
                              padding: 10,
                              paddingLeft: 10,
                              paddingRight: 10,
                            }}
                            size="xl"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            endIcon={<SendIcon />}
                            onClick={approveToken}
                          >
                            Approve
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="mb-4">
                        <div className="py-4 mb-12">
                          <h3 style={{ color: "red" }}>
                            * Set Token Creator is required to be called.
                          </h3>
                        </div>
                        <Button
                          style={{
                            padding: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                            color: "white",
                            backgroundColor: "blue",
                            fontWeight: "bold",
                          }}
                          size="xl"
                          variant="contained"
                          className={classes.button}
                          endIcon={<SendIcon />}
                          onClick={SetTokenCreator}
                        >
                          Set Token Creator
                        </Button>
                      </div>
                    )}
                  </form>
                </div>
              </>
            ) : (
              <>
                <Loader />
              </>
            )}
          </div>
        </div>
        {/* <div className="w-full lg:w-4/12 px-4">
          <CardProfile />
        </div> */}
      </div>
    </>
  );
}

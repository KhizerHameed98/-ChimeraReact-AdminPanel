import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import config from "../../config";
import TableDropdown from "components/Dropdowns/TableDropdownCollector";
import Loader from "../../components/Loader/Loader";
import Swal from "sweetalert2";
import Web3 from "web3";
import axios from "axios";

const chimeraContract = require("../../contracts/Chimera.json");
const SMAV2Contract = require("../../contracts/ChimeraMarketAuctionV2.json");

let web3, accounts, SMAV2;
let AllData = [];
// components

// components

//DATA

export default function Collectors() {
  const [edit, setEdit] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [whiteLister, setWhiteLister] = useState([]);
  const [noOfNFTs, setNoOfNFTs] = useState([]);
  const [noData, setNoData] = useState(false);

  function editArtist() {
    setEdit(edit + 1);
  }
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function callData() {
    if (!window.ethereum) {
      alert("Please Install MetaMask!!");
    } else {
      setLoading(true);
      web3 = new Web3(window.ethereum);

      SMAV2 = await new web3.eth.Contract(SMAV2Contract.abi, config.SMAV2);
      let promiseArr = [];
      let whiteListedOrNot = [];
      axios
        .get(`${config.host}/api/auth`)
        .then(async (res) => {
          let resData = res.data;
          if (res.data.length === 0) {
            setNoData(true);
          }
          for (let i = 0; i < res.data.length; i++) {
            if (resData[i].role === "collector") {
              promiseArr.push(resData[i]);
              try {
                let grantRole = await SMAV2.methods
                  .hasRole(config.role, resData[i].address)
                  .call();

                whiteListedOrNot.push(grantRole);
              } catch (error) {
                console.log("errrr=>>>>>", error);
              }
            }
          }
          Promise.all([promiseArr, whiteListedOrNot]).then((response) => {
            if (response[0].length === 0) {
              setNoData(true);
            }
            AllData.userData = response[0];
            AllData.whiteListedOrNot = response[1];

            setData(response[0]);
            setWhiteLister(response[1]);
            setLoading(false);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  function setLoadingFunction() {
    setLoading(true);
  }
  useEffect(() => {
    callData();
  }, []);
  return (
    <>
      <div className="flex  flex-wrap mt-12">
        <div className="w-full xl:w-12/12 px-4">
          {/* <CardSocialTraffic /> */}
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap py-2 items-center">
                <form className="md:flex flex-row mb-3  flex-wrap items-center lg:ml-auto">
                  <div className="relative flex w-full flex-wrap items-stretch">
                    <span className="z-10 h-full leading-snug font-normal absolute text-center text-blueGray-300 absolute  rounded text-base  justify-center w-8 pl-3 py-2">
                      <i className="fas text-white fa-search"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Search here..."
                      className="border-0 px-3 py-2 placeholder-white text-white relative  bg-lightBlue-800 rounded text-sm shadow outline-none focus:outline-none focus:ring-red w-full pl-10"
                    />
                  </div>
                </form>
                <div className="relative w-full px-4 max-w-full flex-grow flex-1 text-right">
                  <button
                    className="bg-lightBlue-600  text-white active:bg-lightBlue-800  text-sm font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-3 ease-linear transition-all duration-150"
                    type="button"
                  >
                    Add Artist
                    <i className="text-lg fas fa-plus-circle ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
            <div className="block w-full  overflow-x-auto">
              {/* Projects table */}
              {loading ? (
                <>
                  <Loader />
                </>
              ) : (
                <>
                  <table className="items-center  w-full bg-transparent border-collapse">
                    <thead>
                      <tr>
                        <th
                          className={
                            "px-6 align-middle text-center  border border-solid py-3 text-sm  border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Sr.No
                        </th>
                        <th
                          className={
                            "px-6 align-middle text-center  border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Artist Username
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Wallet Address
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Email
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          GrantRole{" "}
                        </th>

                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        ></th>
                      </tr>
                    </thead>

                    <tbody>
                      {!noData ? (
                        <>
                          {" "}
                          {data.map((d, key) => {
                            return (
                              <>
                                <tr>
                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {key + 1}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {d.name}
                                  </td>
                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                                    {d.address}{" "}
                                  </td>
                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm font-bold whitespace-nowrap p-4">
                                    <span>{d.email}</span>
                                  </td>
                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm font-bold whitespace-nowrap p-4">
                                    <span>
                                      {JSON.stringify(whiteLister[key])}
                                    </span>
                                  </td>

                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm font-bold whitespace-nowrap p-4">
                                    <div>
                                      <Dialog
                                        fullScreen={fullScreen}
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="responsive-dialog-title"
                                      >
                                        <DialogTitle id="responsive-dialog-title">
                                          {"Artist Details"}
                                        </DialogTitle>
                                        <DialogContent>
                                          <DialogContentText>
                                            <div>
                                              <ul className="d-flex flex-col">
                                                <li>Name : {d.name}</li>
                                                <li>Email: {d.email}</li>
                                                <li>
                                                  Wallet Address : {d.address}
                                                </li>
                                              </ul>
                                            </div>
                                          </DialogContentText>
                                        </DialogContent>
                                        <DialogActions>
                                          <Button
                                            autoFocus
                                            onClick={handleClose}
                                            color="primary"
                                          >
                                            Ok
                                          </Button>
                                        </DialogActions>
                                      </Dialog>
                                    </div>
                                  </td>
                                  <td>
                                    <TableDropdown
                                      id={key}
                                      editClick={editArtist}
                                      clickOpen={handleClickOpen}
                                      address={d.address}
                                      whiteListedOrNot={whiteLister[key]}
                                      setLoading={setLoadingFunction}
                                    />
                                  </td>
                                </tr>
                              </>
                            );
                          })}
                        </>
                      ) : (
                        <>
                          <h1 className="text-center mt-20 mb-5 text-4xl font-bold ml-20 sm:text-xl">
                            No Data
                          </h1>
                        </>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

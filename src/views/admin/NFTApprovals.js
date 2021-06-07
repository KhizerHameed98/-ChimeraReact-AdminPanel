import React, { useEffect, useState } from "react";
import config from "../../config";
import TableDropdown from "components/Dropdowns/TableDropdownNFTApprovals";
import Loader from "../../components/Loader/Loader";
import Swal from "sweetalert2";
import Web3 from "web3";
import axios from "axios";

const chimeraContract = require("../../contracts/Chimera.json");
const SMAV2Contract = require("../../contracts/ChimeraMarketAuctionV2.json");

let chimera, web3, accounts, SMAV2;
// components

// components

//DATA

export default function NFTApprovals() {
  const [edit, setEdit] = useState(0);
  const [loading, setLoading] = useState(false);

  const [noData, setNoData] = useState(false);
  const [tokenId, setTokenId] = useState([]);
  const [imageData, setImageData] = useState([]);
  const [ownerData, setOwnerData] = useState([]);
  const [imageName, setImageName] = useState([]);
  const [ownerName, setOwnerName] = useState([]);

  async function callData() {
    if (!window.ethereum) {
      alert("Please Install MetaMask!!");
    } else {
      setLoading(true);
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      chimera = await new web3.eth.Contract(
        chimeraContract.abi,
        config.Chimera
      );
      SMAV2 = await new web3.eth.Contract(SMAV2Contract.abi, config.SMAV2);

      try {
        let ImageData = [];
        let ImageName = [];
        let tokenId = [];
        let Owner = [];
        let OwnerName = [];

        let totalSupply = await chimera.methods.totalSupply().call();
        for (let i = 0; i < totalSupply; i++) {
          let token = await chimera.methods.tokenByIndex(i).call();
          let approvedOrNot = await SMAV2.methods
            .isTokenConfirmedByAdmin(token)
            .call();

          if (approvedOrNot === false) {
            let owner = await chimera.methods
              .ownerOf(token)
              .call()
              .then((res) => {
                Owner.push(res);
              });
            tokenId.push(token);
            let res = await axios.get(`${config.host}/file/${token}`);
            ImageName.push(res.data[0].name);
            ImageData.push(res.data[0]);
            let OwnerRes = await axios.get(
              `${config.host}/api/users/${res.data[0].Artist}`
            );
            OwnerName.push(OwnerRes.data.name);
          }
        }
        Promise.all([tokenId, ImageData, Owner, ImageName, OwnerName]).then(
          (res) => {
            if (res[0].length === 0) {
              setNoData(true);
            }

            // console.log("res0=====>", res[0]);
            // console.log("res1===>", res[1]);
            // console.log("res2=====>", res[2]);
            // console.log("res3=====>", res[3]);
            setTokenId(res[0]);
            setImageData(res[1]);

            setOwnerData(res[2]);
            setImageName(res[3]);
            setOwnerName(res[4]);
            setLoading(false);
          }
        );
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
                          NFT ID
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          NFT Name
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Artist
                        </th>
                        <th
                          className={
                            "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                          }
                        >
                          Artist Name
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
                          {tokenId.map((d, key) => {
                            return (
                              <>
                                <tr>
                                  <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {key + 1}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {d}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {imageData[key].name}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {ownerData[key]}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    {ownerName[key]}
                                  </td>
                                  <td className="border-t-0 uppercase text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                                    <TableDropdown id={key} tokenId={d} />
                                  </td>
                                  {/*

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
                                  </td> */}
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

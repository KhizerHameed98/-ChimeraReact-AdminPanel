import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Web3 from "web3";
import config from "../../config";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

let web3, accounts;
export default function Login() {
  const history = useHistory();

  async function connectWallet() {
    if (!window.ethereum) {
      alert("metamask not installed");
    } else {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      web3.eth.net.getId().then(async (netId) => {
        if (netId != config.networkId) {
          localStorage.clear();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "You are not in the correct network",
          });
        } else {
          let acc = await web3.eth.getAccounts();
          console.log("accounts=>>>>>", acc);
          console.log("accounts=>>>>>", config.adminAccount);

          if (acc[0] === config.adminAccount) {
            localStorage.setItem("walletAddress", acc);
            history.push("/admin");
          } else {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Please login with the admin address",
            });
          }
        }
      });
    }
  }
  return (
    <>
      <div className="container mx-auto px-4 py-20 h-full">
        <div className="flex content-center items-center justify-center h-full">
          <div className="w-full lg:w-4/12 px-4">
            <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
              <div className="rounded-t mb-0 px-6 py-6">
                {/*block */}
                <div
                  className="box-content  text-center  h-42 w-42 p-2 py-3"
                  style={{ backgroundColor: "lightgray" }}
                >
                  <p
                    className="text-5xl  mt-2 mb-5 ml-2"
                    style={{ color: "black" }}
                  >
                    Let's begin with your wallet
                  </p>
                  <div
                    className="max-w-xs py-5 mx-auto sm:max-w-none sm:flex sm:justify-center"
                    data-aos="zoom-y-out"
                    data-aos-delay="300"
                  >
                    <button
                      className="bg-black text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-5 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                      type="button"
                      onClick={connectWallet}
                    >
                      Select Wallet
                    </button>
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import config from "../config.js";
// components

// views

import Login from "views/auth/Login.js";
import Register from "views/auth/Register.js";
let web3;
let accounts;

export default function Auth() {
  const history = useHistory();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", async function (accounts) {
        // document.location.reload();
        let acc = await web3.eth.getAccounts();
        console.log(acc);
        if (
          localStorage.getItem("walletAddress") &&
          localStorage.getItem("walletAddress") !== acc
        ) {
          localStorage.clear();
          history.push("/auth");
        } else {
          window.location.reload();
        }
      });
      window.ethereum.on("networkChanged", function (networkId) {
        if (networkId != config.networkId) {
          console.log(networkId);
          localStorage.clear();
          alert("please Select the correct network");
          window.location.reload();
        } else {
          window.location.reload();
        }
      });
    }
  }, [window.ethereum]);
  async function metamaskConnect() {
    if (!window.ethereum) {
      await alert("metamask not installed!!!!");
      history.push("/");
    } else {
      web3 = new Web3(window.ethereum);
      web3.eth.net.getId().then(async (netId) => {
        if (netId != config.networkId) {
          localStorage.clear();
          await alert("Please Select  the correct network");

          history.push("/auth/login");
        }
      });
      web3.eth.getAccounts(function (err, accounts) {
        if (err !== null) console.error("An error occurred: " + err);
        else if (
          accounts.length === 0 &&
          localStorage.getItem("walletAddress")
        ) {
          console.log("User is not logged in to MetaMask");
          localStorage.clear();
          history.push("/auth");
        } else console.log("User is logged in to MetaMask");
      });

      if (
        localStorage.getItem("walletAddress") &&
        localStorage.getItem("walletAddress") !== accounts
      ) {
        localStorage.clear();
        history.push("/auth");
      }
    }
  }
  useEffect(() => {
    metamaskConnect();
  }, []);
  return (
    <>
      {/* <Navbar transparent /> */}
      <main>
        <section className="relative w-full h-full py-40 min-h-screen">
          <div
            className="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full"
            style={{
              backgroundImage:
                "url(" + require("assets/img/register_bg_2.png").default + ")",
            }}
          ></div>
          <Switch>
            <Route path="/auth/login" exact component={Login} />
            <Route path="/auth/register" exact component={Register} />
            <Redirect from="/auth" to="/auth/login" />
          </Switch>
        </section>
      </main>
    </>
  );
}

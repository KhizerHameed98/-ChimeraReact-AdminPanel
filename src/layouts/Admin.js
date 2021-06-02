import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Web3 from "web3";

// components

import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Artists from "views/admin/Artists";
import Collectors from "views/admin/Collectors";
import NFTApprovals from "views/admin/NFTApprovals";
import Promoters from "views/admin/Promoters";
import ArtistApprovals from "views/admin/ArtistApprovals";
import ArtistEdit from "views/admin/Edit/ArtitsEdit";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";
import { backgroundColor } from "tailwindcss/defaultTheme";
let web3, accounts;
export default function Admin() {
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
    }
  }, [window.ethereum]);
  const metamaskConnect = async () => {
    if (!window.ethereum) {
      await alert("metamask not installed!!!!");
      window.location.reload();
    } else {
      web3 = new Web3(window.ethereum);
      accounts = await web3.eth.getAccounts();
      web3.eth.getAccounts(function (err, accounts) {
        if (err !== null) console.error("An error occurred: " + err);
        else if (
          accounts.length === 0 &&
          localStorage.getItem("walletAddress")
        ) {
          console.log("User is not logged in to MetaMask");
          // localStorage.clear();
          // history.push("/auth");
        } else console.log("User is logged in to MetaMask");
      });

      if (
        localStorage.getItem("walletAddress") &&
        localStorage.getItem("walletAddress") != accounts
      ) {
        localStorage.clear();
        history.push("/");
      }
    }
  };
  useEffect(() => {
    metamaskConnect();
  }, []);
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/artists" exact component={Artists} />
            <Route path="/admin/collectors" exact component={Collectors} />

            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/nftapprovals" exact component={NFTApprovals} />
            <Route path="/admin/promoters" exact component={Promoters} />
            <Route
              path="/admin/artistapprovals"
              exact
              component={ArtistApprovals}
            />
            <Route path="/admin/artist-edit/:id" component={ArtistEdit} />

            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Redirect from="/admin" to="/admin/artists" />
          </Switch>
          {/* <FooterAdmin /> */}
        </div>
      </div>
    </>
  );
}

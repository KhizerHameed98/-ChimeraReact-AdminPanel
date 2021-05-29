import React from "react";
import { createPopper } from "@popperjs/core";
import Web3 from "web3";
import config from "../../config";
import Swal from "sweetalert2";
const chimeraContract = require("../../contracts/Chimera.json");
const SMAV2Contract = require("../../contracts/SuperRareMarketAuctionV2.json");

let SMAV2, web3, accounts;
const NotificationDropdown = (props) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };
  const setEdit = () => {
    props.editClick();
  };
  const handleClickOpen = () => {
    props.clickOpen();
  };
  const whiteListUser = async () => {
    if (!window.ethereum) {
      alert("Please Install MeatMask for this functionality!!");
    } else {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      accounts = await web3.eth.getAccounts();

      SMAV2 = await new web3.eth.Contract(SMAV2Contract.abi, config.SMAV2);

      try {
        props.setLoading();
        let res = await SMAV2.methods
          .grantRole(config.role, props.address)
          .send({ from: accounts[0] });
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Role Granted Successfully!",
          showConfirmButton: true,
          timer: 2500,
        });
        window.location.reload();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    }
  };

  return (
    <>
      <a
        className="text-blueGray-500 py-1 px-3 -ml-20 "
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <i className="fas fa-ellipsis-v"></i>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          href="#"
          className={
            "text-sm py-2 px-4 font-normal hover:bg-black block w-full whitespace-nowrap bg-transparent hover:bg-black text-blueGray-700"
          }
          onClick={handleClickOpen}
        >
          View
        </a>
        <a
          href="artist-edit"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={setEdit}
        >
          Edit
        </a>
        {!props.whiteListedOrNot ? (
          <>
            <a
              href="#"
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              }
              onClick={whiteListUser}
            >
              Grant Role
            </a>
          </>
        ) : null}
      </div>
    </>
  );
};

export default NotificationDropdown;

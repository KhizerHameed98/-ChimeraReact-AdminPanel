import React from "react";
import { createPopper } from "@popperjs/core";
import Web3 from "web3";
import config from "../../config";
import Swal from "sweetalert2";
const chimeraContract = require("../../contracts/Chimera.json");
let chimera, web3, accounts;
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
          href={`/admin/artist-edit/${props.tokenId}`}
          className={
            "text-sm py-2 px-4 font-normal hover:bg-black block w-full whitespace-nowrap bg-transparent hover:bg-black text-blueGray-700"
          }
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
      </div>
    </>
  );
};

export default NotificationDropdown;

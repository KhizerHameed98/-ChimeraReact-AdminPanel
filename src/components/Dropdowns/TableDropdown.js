import React from "react";
import { createPopper } from "@popperjs/core";


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
  const whiteListUser = () => {
    console.log(props.address);
    console.log("====>", props.whiteListedOrNot);
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
          href="#pablo"
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
              href="#pablo"
              className={
                "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
              }
              onClick={whiteListUser}
            >
              WhiteList
            </a>
          </>
        ) : null}
      </div>
    </>
  );
};

export default NotificationDropdown;

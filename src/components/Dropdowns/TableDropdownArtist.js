import React from "react";
import { createPopper } from "@popperjs/core";
import Web3 from "web3";
import config from "../../config";
import Swal from "sweetalert2";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
const chimeraContract = require("../../contracts/Chimera.json");
let chimera, web3, accounts;
const NotificationDropdown = (props) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "left-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const whiteListUser = async () => {
    if (!window.ethereum) {
      alert("Please Install MeatMask for this functionality!!");
    } else {
      web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      accounts = await web3.eth.getAccounts();
      chimera = await new web3.eth.Contract(
        chimeraContract.abi,
        config.Chimera
      );
      try {
        props.setLoading();
        let res = await chimera.methods
          .addToWhitelist(props.address)
          .send({ from: accounts[0] });
        await Swal.fire({
          position: "top-end",
          icon: "success",
          title: "WhiteListed Successfully!",
          showConfirmButton: true,
          timer: 3500,
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
                    <li>Name : {props.Name}</li>
                    <li>Email: {props.Email}</li>
                    <li>Wallet Address : {props.address}</li>
                  </ul>
                </div>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={handleClose} color="primary">
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        {/* <a
          href="artist-edit"
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          onClick={setEdit}
        >
          Edit
        </a> */}
        {!props.whiteListedOrNot ? (
          <>
            <a
              href="#"
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

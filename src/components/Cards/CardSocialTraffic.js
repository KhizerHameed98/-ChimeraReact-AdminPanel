import React, { useState } from "react";

// components
import TableDropdown from "components/Dropdowns/TableDropdown.js";
//DATA
import data from "../../Data/ArtistTable/data";

function CardSocialTraffic() {
  const [edit, setEdit] = useState(0);
  function editArtist() {
    setEdit(edit + 1);
  }
  function viewArtist() {}

  return (
    <>
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
                  No of NFT's
                </th>

                <th
                  className={
                    "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                  }
                ></th>
                <th
                  className={
                    "px-6 align-middle border text-center border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                  }
                ></th>
                <th
                  className={
                    "px-6 align-middle text-center border border-solid py-3 text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-lightBlue-800 text-white border-lightBlue-700 "
                  }
                ></th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, key) => {
                return (
                  <>
                    <tr>
                      <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                        {key + 1}
                      </td>
                      <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm  whitespace-nowrap p-4">
                        {d.ArtistName}
                      </td>
                      <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm whitespace-nowrap p-4">
                        {d.WalletAddress}{" "}
                      </td>
                      <td className="border-t-0 text-center  px-6 align-middle border-l-0 border-r-0 text-sm font-bold whitespace-nowrap p-4">
                        <span>{d.NoOfTokens}</span>
                      </td>
                      <td>
                        <TableDropdown id={key} editClick={editArtist} />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
export default CardSocialTraffic;

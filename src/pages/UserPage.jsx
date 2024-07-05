import React, { useState, useRef, useEffect } from "react";
import { getCurrentUser, getChannel, logoutUser } from "../API/userAPI";
import { getSongByOwner } from "../API/songAPI";
import NotFound from "../assets/images/NotFound.png";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import SearchBar from "../components/Searchbar";
import { useNavigate } from "react-router-dom";

export default function UserPage() {
  const [getUser, setGetUser] = useState("");
  const [error, setError] = useState(null);
  const [getChannelDetails, setGetChannelDetails] = useState(null);
  const [getSongList, setGetSongList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const [showEditTooltip, setShowEditTooltip] = useState(null);
  const navigate = useNavigate();
  const logoutRef = useRef(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setGetUser(data.data);
      })
      .catch((error) => {
        setError(error.message || "Login failed");
      });
  }, []);

  useEffect(() => {
    if (getUser && getUser.username) {
      getChannel(getUser.username)
        .then((data) => {
          setGetChannelDetails(data.data);
        })
        .catch((error) => {
          setError(error.message || "Login failed");
        });
    }
  }, [getUser]);

  useEffect(() => {
    if (getUser && getUser.username) {
      getSongByOwner(getUser.username)
        .then((data) => {
          setGetSongList(data.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [getUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogoutTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        setError(error.message || "Logout failed");
      });
    setShowLogoutTooltip(false);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleIconClick = () => {
    setShowLogoutTooltip(!showLogoutTooltip);
  };

  const handleEditClick = (id) => {
    console.log("Edit button clicked with id: " + id);
    alert("Edit button clicked with id: " + id);
    setShowEditTooltip(null);
  };

  const handleEditIconClick = (songId) => {
    setShowEditTooltip(showEditTooltip === songId ? null : songId);
  };

  const filteredSongs = getSongList.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-white">
      {error && error !== "No Songs are availabe" && (
        <h1 className="text-red-500">{error}</h1>
      )}
      <div className="flex pt-20 pl-32">
        <div className="w-32 h-32">
          <img
            src={
              getUser.avatar
                ? getUser.avatar
                : "https://avatars.githubusercontent.com/u/149575885?v=4"
            }
            alt=""
            className="rounded-full object-cover w-32 h-32"
          />
        </div>
        <div className="ml-10">
          <h1 className="text-5xl p-2 font-bold">{getUser.fullName}</h1>
          <span className="flex items-center justify-between">
            <h4 className="pl-2">@{getUser.username}</h4>
            <div className="relative" ref={logoutRef}>
              <HiOutlineDotsHorizontal
                onClick={handleIconClick}
                className="cursor-pointer ml-2"
                size={22}
              />
              {showLogoutTooltip && (
                <div className="absolute bg-musify-dark text-white hover:bg-neutral-950 border p-2 rounded shadow-lg z-10 right-0 top-full mt-2">
                  <button
                    className="w-full text-left p-1"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </span>
          <span className="flex pt-1 text-xl">
            <h4 className="pl-2 pt-1 px-6">
              Followers:{" "}
              {getChannelDetails
                ? getChannelDetails.followerCount
                : "loading..."}
            </h4>
            <h4 className="pl-2 pt-1">
              Following:{" "}
              {getChannelDetails
                ? getChannelDetails.followingCount
                : "loading..."}
            </h4>
          </span>
        </div>
      </div>
      <div className="pt-10 pl-32 flex">
        <button className="btn bg-musify-dark hover:bg-neutral-950 p-3 mx-4 rounded border border-gray-500 shadow-sm shadow-gray-700">
          Edit Profile
        </button>
        <button className="btn bg-musify-dark hover:bg-neutral-950 p-3 rounded border border-gray-500 shadow-sm shadow-gray-700">
          Upload Song
        </button>
      </div>
      <div className="pl-32 pt-16">
        <h3 className="text-2xl font-semibold">Your songs</h3>
        {error && error === "No Songs are availabe" && (
          <span className="flex justify-center flex-col items-center">
            <img src={NotFound} alt="" className="w-36 h-36" />
            <h1 className="text-xl pt-4">
              {error}. You haven't uploaded any song yet!
            </h1>
          </span>
        )}
        {getSongList.length > 0 && (
          <div className="pt-5">
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
            <div className="grid grid-cols-1 gap-4 pt-10">
              {filteredSongs.map((song) => (
                <div
                  className="bg-musify-dark p-4 flex rounded shadow-md items-center justify-between relative"
                  key={song._id}
                >
                  <div className="flex items-center">
                    <img
                      src={song.ThumbnailUrl}
                      alt=""
                      className="w-10 h-10 rounded-md mx-2"
                    />
                    <h3 className="text-lg font-semibold pl-10">
                      {song.title}
                    </h3>
                  </div>
                  <div>
                    <HiOutlineDotsHorizontal
                      onClick={() => handleEditIconClick(song._id)}
                      className="cursor-pointer"
                    />
                    {showEditTooltip === song._id && (
                      <div className="absolute top-0 right-0 mt-2 w-32 bg-musify-dark text-white p-2 rounded shadow-lg z-10">
                        <button
                          className="w-full text-left p-1 hover:bg-neutral-950"
                          onClick={() => handleEditClick(song._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left p-1 hover:bg-neutral-950"
                          onClick={() => setShowEditTooltip(null)}
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
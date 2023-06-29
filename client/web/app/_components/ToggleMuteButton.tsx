"use client";

import React from "react";
import { IconButton, Spinner } from "@chakra-ui/react";
import { BsMic, BsMicMute } from "react-icons/bs";
import axios from "axios";
import { CurrentUserContext } from "../_util/context";
import { http_server_origin, ws_server_origin } from "../_util/server";

export const ToggleMuteButton: React.FC = () => {
  const [mute_setting, setMuteSetting] = React.useState<boolean | null>(null);

  const { current_user } = React.useContext(CurrentUserContext);

  const toggle_mute = () => {
    axios.post(
      `${http_server_origin}/${mute_setting ? "unmute" : "mute"}/${
        current_user?.uuid
      }`
    );
  };

  React.useEffect(() => {
    if (current_user !== undefined) {
      const websocket = new WebSocket(
        `${ws_server_origin}/watch/setting/mute/${current_user?.uuid}`
      );

      const onMessage = (event: MessageEvent<string>) => {
        if (event.data === "muted") {
          setMuteSetting(true);
        } else if (event.data === "unmuted") {
          setMuteSetting(false);
        }
      };
      websocket.addEventListener("message", onMessage);

      return () => {
        websocket.close();
        websocket.removeEventListener("message", onMessage);
      };
    }
  }, [current_user]);

  if (mute_setting === null) {
    return <Spinner />;
  }

  return (
    <>
      {mute_setting ? (
        <IconButton
          onClick={toggle_mute}
          aria-label="Toggle mute"
          icon={<BsMicMute size={"24px"} />}
        />
      ) : (
        <IconButton
          onClick={toggle_mute}
          aria-label="Toggle mute"
          icon={<BsMic size={"24px"} />}
        />
      )}
    </>
  );
};

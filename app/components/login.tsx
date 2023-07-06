import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./login.module.scss";
import { ListItem } from "./ui-lib";

export default function Login() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <>
      {!session && (
        <ListItem title="未登录">
          <a
            href={`/api/auth/signin`}
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              signIn();
            }}
          >
            登录
          </a>
        </ListItem>
      )}
      {session?.user && (
        <>
          <ListItem
            title="已登录"
            subTitle={`${session.user.name ?? "微信用户"} `}
          >
            <a
              href={`/api/auth/signout`}
              className={styles.button}
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              退出登录
            </a>
          </ListItem>
          <ListItem title="积分">
            <strong>0</strong>
          </ListItem>
        </>
      )}
    </>
  );
}

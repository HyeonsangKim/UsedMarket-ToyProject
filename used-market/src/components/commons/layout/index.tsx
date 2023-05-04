import { useRouter } from "next/router";
import LayoutBanner from "./banner/LayoutBanner.container";
import LayoutHeader from "./header/LayoutHeader.container";
import LayoutNavigation from "./navigation/LayoutNavigation.container";
import styled from "@emotion/styled";
import LayoutFooter from "./footer";

const HIDDEN_LAYOUT = [
  '/login',
]

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface ILayoutProps {
  children: JSX.Element;
}
export default function Layout(props: ILayoutProps) {
  const router = useRouter();

  const isHiddenLayout = HIDDEN_LAYOUT.includes(router.asPath);

  return (
    <>
      {isHiddenLayout ? 
        <>
          <LayoutHeader />
          <Body>{props.children}</Body>
          <LayoutFooter />
        </>
        : 
        <>
          <LayoutHeader />
          <LayoutBanner />
          <LayoutNavigation />
          <Body>{props.children}</Body>
          <LayoutFooter />
        </>
      }
    </>
  );
}

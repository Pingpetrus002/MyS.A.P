import Login from "./Login";

const Pages = {
    "login": Login,
    "DefaultPage": Login
};

function PageComposer(args) {
    const Page = Pages[args.page] || Pages.DefaultPage;
    return <Page />;
}

export default PageComposer;

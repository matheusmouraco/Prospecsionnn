
import Preloader from "~/sections/Common/Preloader";

export default function Template({ children }) {

    return (
        <>
            <Preloader />
            {children}
        </>
    );
}

import { BrowserRouter, Route, Routes} from "react-router-dom";
import Navigasibar from "./components/navbar/navbar";
import LandingPage from "./components/Landing-page/landingPage";
import Footer from "./components/Footer/footer";
//Text editor
import TextEditorPage from "./components/Text-editor/TextEditorPage";

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<><Navigasibar/><TextEditorPage/></>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
